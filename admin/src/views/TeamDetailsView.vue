
<template>
  <div class="team-details-page">

    <a-page-header
        :title="team.name"
        :sub-title="`Хакатон: ${team.hackathonName}`"
        @back="$router.push('/teams')"
    >
      <template #extra>
        <a-space>

          <a-button type="primary" @click="editTeam">
            <template #icon><EditOutlined /></template>
            Редактировать
          </a-button>
        </a-space>
      </template>
    </a-page-header>


    <a-row :gutter="24" style="margin-top: 24px">

      <a-col :span="16">

        <a-card title="Статистика" style="margin-bottom: 24px">
          <a-row>
            <a-col :span="6">
              <a-statistic title="Участники" :value="team.members.length" />
            </a-col>
            <a-col :span="6">
              <a-statistic title="Свободных мест" :value="team.maxSize - team.members.length" />
            </a-col>
            <a-col :span="6">
              <a-statistic title="Роли" :value="team.existingRoles.length" />
            </a-col>
            <a-col :span="6">
              <a-statistic title="Ищут" :value="team.neededRoles.length" />
            </a-col>
          </a-row>
        </a-card>


        <a-card title="Участники">
          <a-list
              :data-source="team.members"
              :grid="{ gutter: 16, column: 3 }"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-card hoverable>
                  <template #actions>
                    <a-button type="link" @click="viewUser(item.id)">
                      Профиль
                    </a-button>
                    <a-button
                        type="link"
                        danger
                        v-if="item.id !== team.captainId"
                        @click="removeFromTeam(item.id)"
                    >
                      Удалить
                    </a-button>
                  </template>

                  <a-card-meta>
                    <template #avatar>
                      <a-avatar :src="item.avatar" size="large" />
                    </template>
                    <template #title>
                      {{ item.name }}
                      <a-tag v-if="item.id === team.captainId" color="gold">
                        Капитан
                      </a-tag>
                    </template>
                    <template #description>
                      <div>{{ item.role }}</div>
                      <div style="color: #999; font-size: 12px">
                        Присоединился: {{ formatDate(item.joinedAt) }}
                      </div>
                    </template>
                  </a-card-meta>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>


      <a-col :span="8">

        <a-card title="Роли в команде" style="margin-bottom: 24px">
          <div style="margin-bottom: 16px">
            <h4>Есть в команде:</h4>
            <a-tag
                v-for="role in team.existingRoles"
                :key="role"
                color="green"
                style="margin-bottom: 8px"
            >
              {{ role }}
            </a-tag>
          </div>

          <div>
            <h4>Ищем участников:</h4>
            <a-tag
                v-for="role in team.neededRoles"
                :key="role"
                color="orange"
                style="margin-bottom: 8px"
            >
              {{ role }}
            </a-tag>
          </div>
        </a-card>


        <a-card title="Управление">
          <a-space direction="vertical" style="width: 100%">
            <a-button block @click="inviteMembers">
              <template #icon><UserAddOutlined /></template>
              Пригласить участников
            </a-button>

            <a-button block @click="exportTeamData">
              <template #icon><ExportOutlined /></template>
              Экспорт данных
            </a-button>

            <a-button block @click="showParticipantsPage">
              <template #icon><TeamOutlined /></template>
              Все участники хакатона
            </a-button>

            <a-button block danger @click="deleteTeam">
              <template #icon><DeleteOutlined /></template>
              Удалить команду
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  EditOutlined,
  UserAddOutlined,
  ExportOutlined,
  TeamOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'


interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  joinedAt: string
}

interface Team {
  id: string
  name: string
  hackathonId: string
  hackathonName: string
  description?: string
  captainId: string
  members: TeamMember[]
  maxSize: number
  existingRoles: string[]
  neededRoles: string[]
}

const route = useRoute()
const router = useRouter()
const team = ref<Team>({
  id: '',
  name: '',
  hackathonId: '',
  hackathonName: '',
  captainId: '',
  members: [],
  maxSize: 0,
  existingRoles: [],
  neededRoles: []
})

onMounted(() => {
  loadTeamData()
})

const loadTeamData = async () => {
  const teamId = route.params.id as string

  // Моковые данные для теста
  team.value = {
    id: teamId,
    name: 'Кодократы',
    hackathonId: '1',
    hackathonName: 'ITAM Хакатон 2024',
    description: 'Команда fullstack разработчиков',
    captainId: '1',
    members: [
      {
        id: '1',
        name: 'Иван Иванов',
        role: 'Backend',
        avatar: 'https://via.placeholder.com/40',
        joinedAt: '2024-02-15'
      },
      {
        id: '2',
        name: 'Анна Петрова',
        role: 'Frontend',
        avatar: 'https://via.placeholder.com/40',
        joinedAt: '2024-02-16'
      },
      {
        id: '3',
        name: 'Дмитрий Сидоров',
        role: 'DevOps',
        avatar: 'https://via.placeholder.com/40',
        joinedAt: '2024-02-17'
      },
    ],
    maxSize: 5,
    existingRoles: ['Backend', 'Frontend', 'DevOps'],
    neededRoles: ['Designer', 'Frontend разработчик']
  }
}

const editTeam = () => {
  message.info('Редактирование в разработке (откроется модалка)')
}


const viewUser = (userId: string) => {
  router.push(`/users/${userId}`)
}


const removeFromTeam = (userId: string) => {
  Modal.confirm({
    title: 'Удалить участника из команды?',
    content: 'Участник будет освобожден и сможет присоединиться к другой команде.',
    onOk: () => {
      team.value.members = team.value.members.filter(member => member.id !== userId)
      message.success('Участник удален из команды')
    }
  })
}

const inviteMembers = () => {
  message.info('Приглашение участников (в разработке)')
}

const exportTeamData = () => {
  message.success('Экспорт данных команды')
}

const showParticipantsPage = () => {
  router.push({
    path: '/users',
    query: {
      hackathonId: team.value.hackathonId,
      hasTeam: 'no_team'
    }
  })
}

const deleteTeam = () => {
  Modal.confirm({
    title: 'Удалить команду?',
    content: 'Все участники будут освобождены. Это действие нельзя отменить.',
    okType: 'danger',
    onOk: () => {
      router.push('/teams')
      message.success('Команда удалена')
    }
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}
</script>

<style scoped>
.team-details-page {
  padding: 24px;
}
</style>