
<template>
  <div class="teams-page">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px">
      <h1 style="margin: 0">Команды</h1>

      <a-space>
        <a-input-search
            placeholder="Поиск команд..."
            style="width: 300px"
            @search="handleSearch"
        />


        <a-button
            type="primary"
            @click="showCreateModal"
            size="large"
        >
          <template #icon><PlusOutlined /></template>
          Создать команду
        </a-button>
      </a-space>
    </div>


    <a-row :gutter="[16, 24]" v-if="viewMode === 'grid'">
      <a-col
          v-for="team in filteredTeams"
          :key="team.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
      >
        <TeamCard
            :team="team"
            @click="viewTeam(team.id)"
            @edit="editTeam(team.id)"
            @delete="deleteTeam(team.id)"
            @chat="openChat(team.id)"
        />
      </a-col>
    </a-row>


    <a-card v-else>
      <a-table
          :columns="columns"
          :data-source="filteredTeams"
          :loading="loading"
          row-key="id"
      >

        <template #participants="{ record }">
          <div class="team-participants">
            <a-avatar-group :max-count="3" :size="32">

            </a-avatar-group>
            <span style="margin-left: 8px">{{ record.members.length }}/{{ record.maxSize }} участников</span>
          </div>
        </template>


        <template #roles="{ record }">
          <div class="team-roles">
            <div class="existing-roles">
              <a-tag
                  v-for="role in record.existingRoles"
                  :key="role"
                  color="green"
                  style="margin-bottom: 4px"
              >
                {{ role }}
              </a-tag>
            </div>
            <div class="needed-roles" v-if="record.neededRoles.length > 0">
              <div style="font-size: 12px; color: #999; margin-bottom: 4px">Ищут:</div>
              <a-tag
                  v-for="role in record.neededRoles"
                  :key="role"
                  color="orange"
                  style="margin-bottom: 4px"
              >
                {{ role }}
              </a-tag>
            </div>
          </div>
        </template>


        <template #action="{ record }">
          <a-space direction="vertical" size="small">
            <a-button
                type="link"
                @click="viewTeam(record.id)"
                style="padding: 0"
            >
              <EyeOutlined /> Подробнее
            </a-button>
            <a-button
                type="link"
                @click="editTeam(record.id)"
                style="padding: 0"
            >
              <EditOutlined /> Редактировать
            </a-button>
            <a-button
                type="link"
                danger
                @click="deleteTeam(record.id)"
                style="padding: 0"
            >
              <DeleteOutlined /> Удалить
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>


    <div style="position: absolute; top: 37px; left: 170px">
      <a-radio-group v-model:value="viewMode" button-style="solid" size="small">
        <a-radio-button value="table">
          <template #icon><UnorderedListOutlined /></template>
          Таблица
        </a-radio-button>
        <a-radio-button value="grid">
          <template #icon><AppstoreOutlined /></template>
          Сетка
        </a-radio-button>
      </a-radio-group>
    </div>


    <a-empty
        v-if="filteredTeams.length === 0"
        style="margin-top: 48px"
        description="Пока нет команд"
    >
      <template #image>
        <TeamOutlined style="font-size: 48px; color: #999" />
      </template>
      <a-button type="primary" @click="showCreateModal">
        Создать <новую></новую> команду
      </a-button>
    </a-empty>


    <a-modal
        v-model:open="teamModalVisible"
        :title="editingTeam ? 'Редактирование команды' : 'Создание команды'"
        width="800px"
        @ok="handleSaveTeam"
        @cancel="closeTeamModal"
    >
      <a-form
          ref="teamFormRef"
          :model="teamForm"
          :rules="teamFormRules"
          layout="vertical"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="Название команды" name="name" required>
              <a-input
                  v-model:value="teamForm.name"
                  placeholder="Например: Кодократы, AI Masters"
              />
            </a-form-item>

            <a-form-item label="Хакатон" name="hackathonId" required>
              <a-select
                  v-model:value="teamForm.hackathonId"
                  placeholder="Выберите хакатон"
                  style="width: 100%"
              >
                <a-select-option
                    v-for="hackathon in hackathons"
                    :key="hackathon.id"
                    :value="hackathon.id"
                >
                  {{ hackathon.name }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="Описание команды" name="description">
              <a-textarea
                  v-model:value="teamForm.description"
                  placeholder="Опишите цели и особенности команды..."
                  :rows="3"
              />
            </a-form-item>

            <a-form-item label="Капитан" name="captainId" required>
              <a-select
                  v-model:value="teamForm.captainId"
                  placeholder="Выберите капитана"
                  style="width: 100%"
                  show-search
                  :filter-option="filterUserOption"
              >
                <a-select-option
                    v-for="user in availableUsers"
                    :key="user.id"
                    :value="user.id"
                >
                  {{ user.firstName }} {{ user.lastName }}
                  <span v-if="user.role" style="color: #999">({{ user.role }})</span>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Текущие роли в команде" name="existingRoles">
              <a-select
                  v-model:value="teamForm.existingRoles"
                  mode="tags"
                  placeholder="Добавьте роли участников"
                  style="width: 100%"
                  :options="roleOptions"
              />
            </a-form-item>

            <a-form-item label="Ищем участников на роли" name="neededRoles">
              <a-select
                  v-model:value="teamForm.neededRoles"
                  mode="tags"
                  placeholder="Какие роли нужны команде"
                  style="width: 100%"
                  :options="roleOptions"
              />
            </a-form-item>

            <a-form-item label="Макс. размер команды" name="maxSize">
              <a-input-number
                  v-model:value="teamForm.maxSize"
                  :min="2"
                  :max="10"
                  style="width: 100%"
              />
            </a-form-item>

            <a-form-item label="Участники команды" name="memberIds">
              <a-select
                  v-model:value="teamForm.memberIds"
                  mode="multiple"
                  placeholder="Выберите участников команды"
                  style="width: 100%"
                  :options="memberOptions"
                  :disabled="teamForm.captainId ? false : true"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import type { TableProps } from 'ant-design-vue'
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  AppstoreOutlined
} from '@ant-design/icons-vue'
import TeamCard from '../components/TeamCard.vue'

// Типы
interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
}

interface Team {
  id: string
  name: string
  hackathonId: string
  hackathonName: string
  description?: string
  captainId: string
  captainName: string
  members: TeamMember[]
  maxSize: number
  existingRoles: string[]
  neededRoles: string[]
  createdAt: string
}

// Состояние
const router = useRouter()
const loading = ref(false)
const searchQuery = ref('')
const viewMode = ref<'table' | 'grid'>('table')
const teamModalVisible = ref(false)
const editingTeam = ref<Team | null>(null)
const teamFormRef = ref()

// Данные
const teams = ref<Team[]>([
  {
    id: '1',
    name: 'Кодократы',
    hackathonId: '1',
    hackathonName: 'ITAM Хакатон 2024',
    description: 'Команда fullstack разработчиков',
    captainId: '1',
    captainName: 'Иван Иванов',
    members: [
      { id: '1', name: 'Иван Иванов', role: 'Backend', avatar: 'https://via.placeholder.com/40' },
      { id: '2', name: 'Анна Петрова', role: 'Frontend', avatar: 'https://via.placeholder.com/40' },
      { id: '3', name: 'Дмитрий Сидоров', role: 'DevOps', avatar: 'https://via.placeholder.com/40' },
      { id: '4', name: 'Мария Козлова', role: 'Database', avatar: 'https://via.placeholder.com/40' }
    ],
    maxSize: 5,
    existingRoles: ['Backend', 'Frontend', 'DevOps', 'Database'],
    neededRoles: ['Designer', 'Frontend разработчик'],
    createdAt: '2024-02-15T10:00:00'
  },
  {
    id: '2',
    name: 'AI Masters',
    hackathonId: '2',
    hackathonName: 'AI Challenge',
    description: 'Команда AI/ML специалистов',
    captainId: '5',
    captainName: 'Дмитрий Смирнов',
    members: [
      { id: '5', name: 'Дмитрий Смирнов', role: 'Data Scientist', avatar: 'https://via.placeholder.com/40' },
      { id: '6', name: 'Ольга Новикова', role: 'ML Engineer', avatar: 'https://via.placeholder.com/40' },
      { id: '7', name: 'Алексей Волков', role: 'Backend', avatar: 'https://via.placeholder.com/40' }
    ],
    maxSize: 4,
    existingRoles: ['Data Scientist', 'ML Engineer', 'Backend'],
    neededRoles: ['Data Scientist', 'Backend разработчик'],
    createdAt: '2024-02-16T14:30:00'
  }
])

const hackathons = ref([
  { id: '1', name: 'ITAM Хакатон 2024' },
  { id: '2', name: 'AI Challenge' },
  { id: '3', name: 'Blockchain Hack' }
])

const availableUsers = ref([
  { id: '1', firstName: 'Иван', lastName: 'Иванов', role: 'Backend' },
  { id: '2', firstName: 'Анна', lastName: 'Петрова', role: 'Frontend' },
  { id: '3', firstName: 'Дмитрий', lastName: 'Смирнов', role: 'Data Scientist' },
  { id: '4', firstName: 'Ольга', lastName: 'Новикова', role: 'ML Engineer' }
])

// Форма команды
const teamForm = reactive({
  name: '',
  hackathonId: '',
  description: '',
  captainId: '',
  memberIds: [] as string[],
  existingRoles: [] as string[],
  neededRoles: [] as string[],
  maxSize: 4
})

const teamFormRules = {
  name: [{ required: true, message: 'Введите название команды' }],
  hackathonId: [{ required: true, message: 'Выберите хакатон' }],
  captainId: [{ required: true, message: 'Выберите капитана' }],
  maxSize: [
    { required: true, message: 'Укажите размер команды' },
    { type: 'number', min: 2, max: 10, message: 'От 2 до 10 участников' }
  ]
}

// Опции для select
const roleOptions = [
  { label: 'Frontend разработчик', value: 'Frontend разработчик' },
  { label: 'Backend разработчик', value: 'Backend разработчик' },
  { label: 'Fullstack разработчик', value: 'Fullstack разработчик' },
  { label: 'Mobile разработчик', value: 'Mobile разработчик' },
  { label: 'UI/UX Designer', value: 'UI/UX Designer' },
  { label: 'Data Scientist', value: 'Data Scientist' },
  { label: 'ML Engineer', value: 'ML Engineer' },
  { label: 'DevOps Engineer', value: 'DevOps Engineer' },
  { label: 'Product Manager', value: 'Product Manager' },
  { label: 'QA Engineer', value: 'QA Engineer' }
]

const memberOptions = computed(() => {
  return availableUsers.value
      .filter(user => user.id !== teamForm.captainId)
      .map(user => ({
        label: `${user.firstName} ${user.lastName} (${user.role})`,
        value: user.id
      }))
})

// Колонки таблицы
const columns: TableProps['columns'] = [
  {
    title: 'Название команды',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    render: (text: string, record: Team) => (
        `<div>
          <strong>${text}</strong><br/>
          <span style="color: #999; font-size: 12px">ID: ${record.id}</span>
        </div>`
    )
  },
  {
    title: 'Хакатон',
    dataIndex: 'hackathonName',
    key: 'hackathon',
    width: 150
  },
  {
    title: 'Участники',
    key: 'participants',
    slots: { customRender: 'participants' },
    width: 200
  },
  {
    title: 'Капитан',
    dataIndex: 'captainName',
    key: 'captain',
    width: 150
  },
  {
    title: 'Роли команды',
    key: 'roles',
    slots: { customRender: 'roles' },
    width: 250
  },
  {
    title: 'Действия',
    key: 'action',
    slots: { customRender: 'action' },
    width: 150,
    fixed: 'right' as const
  }
]

// computed свойства
const filteredTeams = computed(() => {
  if (!searchQuery.value) return teams.value

  const query = searchQuery.value.toLowerCase()
  return teams.value.filter(team =>
      team.name.toLowerCase().includes(query) ||
      team.hackathonName.toLowerCase().includes(query) ||
      team.captainName.toLowerCase().includes(query) ||
      team.existingRoles.some(role => role.toLowerCase().includes(query)) ||
      team.neededRoles.some(role => role.toLowerCase().includes(query))
  )
})

// Методы
const handleSearch = (value: string) => {
  searchQuery.value = value
}

const filterUserOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

const showCreateModal = () => {
  editingTeam.value = null
  Object.keys(teamForm).forEach(key => {
    teamForm[key as keyof typeof teamForm] = key === 'maxSize' ? 4 : ''
  })
  teamModalVisible.value = true
}

const editTeam = (id: string) => {
  const team = teams.value.find(t => t.id === id)
  if (team) {
    editingTeam.value = team
    teamForm.name = team.name
    teamForm.hackathonId = team.hackathonId
    teamForm.description = team.description || ''
    teamForm.captainId = team.captainId
    teamForm.memberIds = team.members.filter(m => m.id !== team.captainId).map(m => m.id)
    teamForm.existingRoles = [...team.existingRoles]
    teamForm.neededRoles = [...team.neededRoles]
    teamForm.maxSize = team.maxSize
    teamModalVisible.value = true
  }
}

const closeTeamModal = () => {
  teamModalVisible.value = false
  editingTeam.value = null
}

const handleSaveTeam = async () => {
  try {
    await teamFormRef.value.validate()

    if (editingTeam.value) {
      // Обновление существующей команды
      const index = teams.value.findIndex(t => t.id === editingTeam.value!.id)
      if (index !== -1) {
        teams.value[index] = {
          ...teams.value[index],
          ...teamForm,
          members: [
            {
              id: teamForm.captainId,
              name: availableUsers.value.find(u => u.id === teamForm.captainId)?.firstName + ' ' +
                  availableUsers.value.find(u => u.id === teamForm.captainId)?.lastName || 'Капитан',
              role: 'Капитан'
            },
            ...teamForm.memberIds.map(id => {
              const user = availableUsers.value.find(u => u.id === id)
              return {
                id,
                name: user ? `${user.firstName} ${user.lastName}` : 'Участник',
                role: user?.role || 'Участник'
              }
            })
          ]
        }
      }
      message.success('Команда обновлена')
    } else {
      // Создание новой команды
      const newTeam: Team = {
        id: Date.now().toString(),
        name: teamForm.name,
        hackathonId: teamForm.hackathonId,
        hackathonName: hackathons.value.find(h => h.id === teamForm.hackathonId)?.name || 'Хакатон',
        description: teamForm.description,
        captainId: teamForm.captainId,
        captainName: availableUsers.value.find(u => u.id === teamForm.captainId)?.firstName + ' ' +
            availableUsers.value.find(u => u.id === teamForm.captainId)?.lastName || 'Капитан',
        members: [
          {
            id: teamForm.captainId,
            name: availableUsers.value.find(u => u.id === teamForm.captainId)?.firstName + ' ' +
                availableUsers.value.find(u => u.id === teamForm.captainId)?.lastName || 'Капитан',
            role: 'Капитан'
          },
          ...teamForm.memberIds.map(id => {
            const user = availableUsers.value.find(u => u.id === id)
            return {
              id,
              name: user ? `${user.firstName} ${user.lastName}` : 'Участник',
              role: user?.role || 'Участник'
            }
          })
        ],
        maxSize: teamForm.maxSize,
        existingRoles: teamForm.existingRoles,
        neededRoles: teamForm.neededRoles,
        createdAt: new Date().toISOString()
      }

      teams.value.unshift(newTeam)
      message.success('Команда создана')
    }

    teamModalVisible.value = false
  } catch (error) {
    console.error('Ошибка сохранения команды:', error)
  }
}

const viewTeam = (id: string) => {
  router.push(`/teams/${id}`)
}

const deleteTeam = (id: string) => {
  Modal.confirm({
    title: 'Удалить команду?',
    content: 'Все участники команды будут освобождены. Это действие нельзя отменить.',
    okText: 'Удалить',
    okType: 'danger',
    cancelText: 'Отмена',
    onOk: () => {
      teams.value = teams.value.filter(team => team.id !== id)
      message.success('Команда удалена')
    }
  })
}

const openChat = (id: string) => {
  message.info(`Чат команды ${id} (в разработке)`)
}

onMounted(() => {
  // Загрузка данных из API
  loading.value = false
})
</script>

<style scoped>
.teams-page {
  padding: 24px;
  position: relative;
}

.team-participants {
  display: flex;
  align-items: center;
}

.team-roles {
  min-height: 60px;
}

.existing-roles, .needed-roles {
  margin-bottom: 8px;
}

:deep(.ant-tag) {
  margin-right: 4px;
  margin-bottom: 4px;
}
</style>