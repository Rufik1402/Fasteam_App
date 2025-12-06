<template>
  <div class="edit-hackathon-page">
    <a-page-header
        :title="`Редактирование: ${form.name || 'Хакатон'}`"
        sub-title="Измените информацию о хакатоне"
        @back="$router.push('/')"
    >
      <template #extra>
        <a-space>
          <a-button @click="cancel">Отмена</a-button>
          <a-button
              type="dashed"
              danger
              @click="showDeleteConfirm"
              style="background-color: blueviolet"
          >
            Удалить
          </a-button>
          <a-button
              type="primary"
              @click="handleSubmit"
              :loading="submitting"
          >
            Сохранить изменения
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-card style="margin-top: 24px">
      <a-form
          ref="formRef"
          :model="form"
          :rules="rules"
          layout="vertical"
      >
        <a-row :gutter="24">
          <a-col :span="16">
            <a-form-item label="Название хакатона" name="name" required>
              <a-input
                  v-model:value="form.name"
                  placeholder="Например: ITAM AI Hack 2024"
                  size="large"
              />
            </a-form-item>

            <a-form-item label="Описание" name="description" required>
              <a-textarea
                  v-model:value="form.description"
                  placeholder="Опишите цели, тематику и особенности хакатона..."
                  :rows="4"
                  show-count
                  :maxlength="500"
              />
            </a-form-item>

            <a-form-item label="Даты проведения" name="dates" required>
              <a-range-picker
                  v-model:value="form.dates"
                  :show-time="{ format: 'HH:mm' }"
                  format="DD.MM.YYYY HH:mm"
                  style="width: 100%"
                  :disabled-date="disabledDate"
              />
            </a-form-item>


            <a-form-item label="Место проведения" name="location">
              <a-select
                  v-model:value="form.location"
                  placeholder="Выберите тип"
                  style="width: 100%"
              >
                <a-select-option value="online">Онлайн</a-select-option>
                <a-select-option value="offline">Оффлайн</a-select-option>
                <a-select-option value="hybrid">Гибрид</a-select-option>
              </a-select>
            </a-form-item>


            <a-form-item
                v-if="form.location === 'offline' || form.location === 'hybrid'"
                label="Адрес"
                name="address"
            >
              <a-input
                  v-model:value="form.address"
                  placeholder="Укажите адрес проведения"
              />
            </a-form-item>


            <a-form-item label="Призовой фонд" name="prize">
              <a-input
                  v-model:value="form.prize"
                  placeholder="Например: 500 000 ₽ или MacBook Pro"
                  :maxlength="100"
              />
            </a-form-item>

            <a-form-item label="Треки (направления)" name="tracks" :required="true">
              <a-select
                  v-model:value="form.tracks"
                  mode="tags"
                  placeholder="Добавьте треки, например: AI/ML, Web3, Mobile"
                  style="width: 100%"
                  :options="trackOptions"
              />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-card title="Настройки" size="small">
              <a-form-item label="Макс. размер команды" name="maxTeamSize">
                <a-input-number
                    v-model:value="form.maxTeamSize"
                    :min="2"
                    :max="10"
                    style="width: 100%"
                />
              </a-form-item>

              <a-form-item label="Логотип (URL)" name="image">
                <a-input
                    v-model:value="form.image"
                    placeholder="Ссылка на изображение"
                />
                <div style="margin-top: 8px">
                  <img
                      v-if="form.image"
                      :src="form.image"
                      alt="Preview"
                      style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px"
                  />
                </div>
              </a-form-item>

              <a-form-item label="Статус" name="status">
                <a-select v-model:value="form.status" style="width: 100%">
                  <a-select-option value="draft">Черновик</a-select-option>
                  <a-select-option value="upcoming">Предстоящий</a-select-option>
                  <a-select-option value="active">Идет сейчас</a-select-option>
                  <a-select-option value="finished">Завершен</a-select-option>
                </a-select>
              </a-form-item>


              <a-divider />
              <div style="color: #666; font-size: 12px">
                <p><strong>ID:</strong> {{ hackathonId }}</p>
                <p><strong>Создан:</strong> {{ formatDate(createdAt) }}</p>
                <p><strong>Участников:</strong> {{ form.participants || 0 }}</p>
                <p><strong>Команд:</strong> {{ form.teams || 0 }}</p>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { useHackathonsStore } from '../stores/hackathons'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const hackathonsStore = useHackathonsStore()
const formRef = ref()
const submitting = ref(false)


const hackathonId = route.params.id as string


const form = reactive({
  name: '',
  description: '',
  dates: [] as Dayjs[],
  tracks: [] as string[],
  maxTeamSize: 5,
  image: '',
  status: 'upcoming' as 'upcoming' | 'active' | 'finished' | 'draft',
  participants: 0,
  teams: 0,
  location: 'online' as 'online' | 'offline' | 'hybrid',
  address: '',
  prize: ''
})


onMounted(() => {
  loadHackathonData()
})

const loadHackathonData = () => {
  const hackathon = hackathonsStore.getHackathon(hackathonId)

  if (!hackathon) {
    message.error('Хакатон не найден')
    router.push('/')
    return
  }


  form.name = hackathon.name
  form.description = hackathon.description
  form.image = hackathon.image || ''
  form.status = hackathon.status
  form.maxTeamSize = hackathon.maxTeamSize || 5
  form.tracks = [...hackathon.tracks]
  form.participants = hackathon.participants
  form.teams = hackathon.teams
  form.location = hackathon.location || 'online'
  form.address = hackathon.address || ''
  form.prize = hackathon.prize || ''


  if (hackathon.startDate && hackathon.endDate) {
    form.dates = [
      dayjs(hackathon.startDate),
      dayjs(hackathon.endDate)
    ]
  }
}


const rules = {
  name: [
    { required: true, message: 'Введите название хакатона' },
    { min: 3, message: 'Минимум 3 символа' }
  ],
  description: [
    { required: true, message: 'Введите описание хакатона' },
    { min: 50, message: 'Минимум 50 символов' }
  ],
  dates: [
    { required: true, message: 'Выберите даты проведения' }
  ],
  tracks: [
    { required: true, message: 'Добавьте хотя бы один трек' }
  ]
}

const trackOptions = [
  { label: 'AI/ML', value: 'AI/ML' },
  { label: 'Web3/Blockchain', value: 'Web3/Blockchain' },
  { label: 'Mobile', value: 'Mobile' },
  { label: 'Web', value: 'Web' },
  { label: 'DevOps', value: 'DevOps' },
  { label: 'UI/UX Design', value: 'UI/UX Design' }
]

const disabledDate = (current: Dayjs) => {
  return current && current < dayjs().startOf('day')
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ru-RU')
}


const handleSubmit = async () => {
  try {
    await formRef.value.validate()

    submitting.value = true


    hackathonsStore.updateHackathon(hackathonId, {
      name: form.name,
      description: form.description,
      image: form.image,
      status: form.status,
      startDate: form.dates[0].toISOString(),
      endDate: form.dates[1].toISOString(),
      tracks: form.tracks,
      maxTeamSize: form.maxTeamSize,
      participants: form.participants,
      teams: form.teams,
      location: form.location,
      address: form.address,
      prize: form.prize
    })

    message.success('Хакатон успешно обновлен!')
    router.push('/')

  } catch (error) {
    console.error('Ошибка:', error)
    message.error('Ошибка при обновлении хакатона')
  } finally {
    submitting.value = false
  }
}


const showDeleteConfirm = () => {
  Modal.confirm({
    title: 'Удалить хакатон?',
    content: `Вы уверены, что хотите удалить "${form.name}"? Это действие нельзя отменить.`,
    okText: 'Удалить',
    okType: 'danger',
    cancelText: 'Отмена',
    onOk: deleteHackathon
  })
}

const deleteHackathon = async () => {
  try {
    hackathonsStore.deleteHackathon(hackathonId)
    message.success('Хакатон удален')
    router.push('/')
  } catch (error) {
    message.error('Ошибка при удалении')
  }
}

const cancel = () => {
  router.push('/')
}
</script>

<style scoped>
.edit-hackathon-page {
  padding: 24px;
}
</style>