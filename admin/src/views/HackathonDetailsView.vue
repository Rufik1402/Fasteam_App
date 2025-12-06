<template>
  <div class="hackathon-details">

    <a-page-header
        :title="hackathon.name"
        :sub-title="formatDates(hackathon.startDate, hackathon.endDate)"
        @back="$router.push('/')"
    >
      <template #extra>
        <a-space>

          <a-button
              v-if="isAdmin"
              type="primary"
              @click="goToEdit"
          >
            <template #icon><EditOutlined /></template>
            Редактировать
          </a-button>


          <a-button
              v-else
              type="primary"
              @click="participate"
              :disabled="hackathon.status !== 'upcoming'"
          >
            <template #icon><TeamOutlined /></template>
            Участвовать
          </a-button>

          <a-button @click="shareHackathon">
            <template #icon><ShareAltOutlined /></template>
            Поделиться
          </a-button>
        </a-space>
      </template>
    </a-page-header>


    <a-row :gutter="24" style="margin-top: 24px">

      <a-col :span="16">

        <a-card v-if="hackathon.image" style="margin-bottom: 24px">
          <img
              :src="hackathon.image"
              :alt="hackathon.name"
              style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px"
          />
        </a-card>


        <a-card title="Описание" style="margin-bottom: 24px">
          <div style="white-space: pre-line; line-height: 1.6">
            {{ hackathon.description }}
          </div>


        </a-card>

        <a-card v-if="hackathon.location || hackathon.prize" title="Место проведения" style="margin-bottom: 24px">
          <a-descriptions :column="1" size="small">
            <a-descriptions-item v-if="hackathon.location" label="">
              <div style="display: flex; align-items: center; gap: 8px">
                <environment-outlined />
                <span v-if="hackathon.location === 'online'">Онлайн</span>
                <span v-else-if="hackathon.location === 'offline' && hackathon.address">
          {{ hackathon.address }}
        </span>
                <span v-else-if="hackathon.location === 'hybrid' && hackathon.address">
          Гибрид · {{ hackathon.address }}
        </span>
              </div>
            </a-descriptions-item>

          </a-descriptions>
        </a-card>


        <a-card title="Направления (треки)" style="margin-bottom: 24px">
          <a-space wrap>
            <a-tag
                v-for="track in hackathon.tracks"
                :key="track"
                color="blue"
                size="large"
            >
              {{ track }}
            </a-tag>
          </a-space>
        </a-card>

        <a-card v-if="hackathon.prize" title="Призовой фонд" style="margin-bottom: 24px">
          <div style="text-align: center; padding: 20px">
            <div style="font-size: 32px; color: #fa8c16; font-weight: bold; margin-bottom: 8px">
              🏆
            </div>
            <div style="font-size: 20px; font-weight: 500; color: #333">
              {{ hackathon.prize }}
            </div>
            <div v-if="hackathon.prizeDetails" style="color: #666; margin-top: 8px">
              {{ hackathon.prizeDetails }}
            </div>
          </div>
        </a-card>


        <a-card title="Правила участия">
          <a-list item-layout="horizontal">
            <a-list-item>
              <template #actions>
                <a-tag color="green">{{ hackathon.maxTeamSize }} чел.</a-tag>
              </template>
              <a-list-item-meta title="Размер команды" />
            </a-list-item>

            <a-list-item>
              <template #actions>
                <a-tag :color="getStatusColor(hackathon.status)">
                  {{ getStatusText(hackathon.status) }}
                </a-tag>
              </template>
              <a-list-item-meta title="Статус" />
            </a-list-item>

            <a-list-item>
              <template #actions>
                <a-tag color="purple">
                  {{ hackathon.participants || 0 }} участников
                </a-tag>
              </template>
              <a-list-item-meta title="Уже зарегистрировалось" />
            </a-list-item>

            <a-list-item v-if="isAdmin">
              <template #actions>
                <a-tag color="orange">
                  {{ hackathon.teams || 0 }} команд
                </a-tag>
              </template>
              <a-list-item-meta title="Сформировано команд" />
            </a-list-item>
          </a-list>
        </a-card>
      </a-col>


      <a-col :span="8">
        <a-card title="Даты проведения" style="margin-bottom: 24px">
          <a-timeline>
            <a-timeline-item color="green">
              <strong>Начало:</strong>
              <div>{{ formatDateTime(hackathon.startDate) }}</div>
            </a-timeline-item>

            <a-timeline-item color="red">
              <strong>Окончание:</strong>
              <div>{{ formatDateTime(hackathon.endDate) }}</div>
            </a-timeline-item>

            <a-timeline-item v-if="timeLeft" color="blue">
              <strong>До начала:</strong>
              <div>{{ timeLeft }}</div>
            </a-timeline-item>
          </a-timeline>
        </a-card>

        <a-card v-if="isAdmin" title="Управление" style="margin-bottom: 24px">
          <a-space direction="vertical" style="width: 100%">
            <a-button block @click="goToParticipants">
              <template #icon><TeamOutlined /></template>
              Участники ({{ hackathon.participants || 0 }})
            </a-button>

            <a-button block @click="goToTeams">
              <template #icon><GroupOutlined /></template>
              Команды ({{ hackathon.teams || 0 }})
            </a-button>

            <a-button block @click="exportData">
              <template #icon><ExportOutlined /></template>
              Экспорт данных
            </a-button>

            <a-button block danger @click="deleteHackathon" v-if="isAdmin">
              <template #icon><DeleteOutlined /></template>
              Удалить хакатон
            </a-button>
          </a-space>
        </a-card>


        <a-card v-else title="Участие">
          <div style="text-align: center; padding: 16px 0">
            <a-statistic
                :value="hackathon.participants || 0"
                title="Уже участвуют"
                style="margin-bottom: 16px"
            />

            <a-button
                type="primary"
                size="large"
                block
                @click="participate"
                :disabled="hackathon.status !== 'upcoming'"
            >
              Присоединиться
            </a-button>

            <div style="margin-top: 12px; color: #999; font-size: 12px">
              <info-circle-outlined />
              Регистрация закроется за день до начала
            </div>
          </div>
        </a-card>


        <a-card title="Организаторы">
          <a-list :data-source="organizers" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :title="item.name" :description="item.role">
                  <template #avatar>
                    <a-avatar :src="item.avatar" />
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>


    <a-modal
        v-model:open="deleteModalVisible"
        title="Удалить хакатон?"
        @ok="confirmDelete"
        ok-text="Удалить"
        ok-type="danger"
        cancel-text="Отмена"
    >
      <p>Вы уверены, что хотите удалить хакатон "{{ hackathon.name }}"?</p>
      <p style="color: #ff4d4f">Это действие нельзя отменить!</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  EditOutlined,
  TeamOutlined,
  ShareAltOutlined,
  GroupOutlined,
  ExportOutlined,
  DeleteOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue'
import { useHackathonsStore } from '../stores/hackathons'
import { useAuthStore } from '../stores/auth'
import type { HackathonAdmin } from '..shared/types'

const route = useRoute()
const router = useRouter()
const hackathonsStore = useHackathonsStore()
const authStore = useAuthStore()

const hackathon = ref<HackathonAdmin>({
  id: '',
  name: '',
  description: '',
  status: 'upcoming',
  startDate: '',
  endDate: '',
  tracks: [],
  maxTeamSize: 5,
  participants: 0,
  teams: 0,
  createdAt: '',
  updatedAt: '',
  createdBy: '',
  registrationOpen: true
})

const deleteModalVisible = ref(false)
const organizers = ref([
  { id: '1', name: 'ITAM Community', role: 'Организатор', avatar: 'https://via.placeholder.com/40' },
  { id: '2', name: 'Алексей Петров', role: 'Координатор', avatar: 'https://via.placeholder.com/40' }
])


const isAdmin = computed(() => {
  return authStore.isAuthenticated && authStore.user?.role === 'admin'
})


const timeLeft = computed(() => {
  const start = new Date(hackathon.value.startDate)
  const now = new Date()

  if (start <= now) return null

  const diff = start.getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days} дней ${hours} часов`
  return `${hours} часов`
})

onMounted(() => {
  loadHackathon()
})

const loadHackathon = async () => {
  const hackathonId = route.params.id as string

  try {
    const data = hackathonsStore.getHackathon(hackathonId)
    if (data) {
      hackathon.value = data
    } else {
      message.error('Хакатон не найден')
      router.push('/')
    }
  } catch (error) {
    message.error('Ошибка при загрузке хакатона')
    console.error(error)
  }
}


const formatDates = (start: string, end: string) => {
  const startDate = new Date(start).toLocaleDateString('ru-RU')
  const endDate = new Date(end).toLocaleDateString('ru-RU')
  return `${startDate} — ${endDate}`
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    upcoming: 'green',
    active: 'blue',
    finished: 'red',
    draft: 'gray'
  }
  return colors[status] || 'default'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    upcoming: 'Предстоящий',
    active: 'Идет сейчас',
    finished: 'Завершен',
    draft: 'Черновик'
  }
  return texts[status] || status
}


const goToEdit = () => {
  router.push(`/hackathons/${hackathon.value.id}/edit`)
}

const goToParticipants = () => {
  router.push(`/users?hackathon=${hackathon.value.id}`)
}

const goToTeams = () => {

  message.info('Страница команд в разработке')
}

const participate = () => {
  if (isAdmin.value) {
    message.warning('Вы организатор, не можете участвовать')
    return
  }

  if (hackathon.value.status !== 'upcoming') {
    message.error('Регистрация закрыта')
    return
  }


  message.info('Регистрация будет в клиентской части')
}

const shareHackathon = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url)
      .then(() => message.success('Ссылка скопирована в буфер обмена'))
      .catch(() => message.error('Не удалось скопировать ссылку'))
}

const exportData = () => {
  message.success('Экспорт начат...')
}

const deleteHackathon = () => {
  deleteModalVisible.value = true
}

const confirmDelete = async () => {
  try {
    hackathonsStore.deleteHackathon(hackathon.value.id)
    message.success('Хакатон удален')
    deleteModalVisible.value = false
    router.push('/')
  } catch (error) {
    message.error('Ошибка при удалении')
  }
}
</script>

<style scoped>
.hackathon-details {
  padding: 24px;
}

:deep(.ant-page-header) {
  padding: 0 0 24px 0;
}

:deep(.ant-card) {
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

:deep(.ant-tag) {
  margin-bottom: 4px;
}
</style>