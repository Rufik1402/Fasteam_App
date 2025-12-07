<template>
  <div class="teams-page">
    <!-- Заголовок и поиск -->
    <div class="page-header">
      <h1>Команды</h1>

      <div class="header-actions">
        <a-input-search
            v-model:value="searchQuery"
            placeholder="Поиск команд..."
            style="width: 300px"
            @search="handleSearch"
            size="large"
        />

        <a-button
            type="primary"
            @click="showCreateModal"
            size="large"
            class="create-team-btn"
        >
          <template #icon><PlusOutlined /></template>
          Создать команду
        </a-button>
      </div>
    </div>

    <!-- Фильтры для организатора -->
    <div class="org-filters">
      <div class="filters-wrapper">
        <a-select
            v-model:value="selectedHackathon"
            placeholder="Все хакатоны"
            class="filter-select"
            allow-clear
        >
          <a-select-option value="all">Все хакатоны</a-select-option>
          <a-select-option value="hack1">ITAM Хакатон 2024</a-select-option>
          <a-select-option value="hack2">AI Challenge</a-select-option>
          <a-select-option value="hack3">Blockchain Hack</a-select-option>
        </a-select>

        <a-select
            v-model:value="teamStatus"
            placeholder="Все статусы"
            class="filter-select"
            allow-clear
        >
          <a-select-option value="all">Все статусы</a-select-option>
          <a-select-option value="full">Укомплектованные</a-select-option>
          <a-select-option value="incomplete">Ищет участников</a-select-option>
        </a-select>
      </div>
    </div>

    <!-- Сетка карточек команд -->
    <div class="teams-container">
      <div class="teams-grid">
        <TeamCard
            v-for="team in filteredTeams"
            :key="team.id"
            :team="team"
            :is-org-view="true"
            @view="viewTeamDetails(team.id)"
            @edit="editTeam(team.id)"
            @delete="confirmDeleteTeam(team.id)"
        />
      </div>

      <!-- Сообщение если нет команд -->
      <div v-if="filteredTeams.length === 0" class="empty-state">
        <TeamOutlined class="empty-icon" />
        <h3>Нет команд</h3>
        <p>Создайте первую команду</p>
        <a-button type="primary" @click="showCreateModal" class="create-team-btn">
          Создать команду
        </a-button>
      </div>
    </div>

    <!-- Модальное окно создания/редактирования команды -->
    <a-modal
        v-model:open="teamModalVisible"
        :title="editingTeam ? 'Редактирование команды' : 'Создание команды'"
        width="800px"
        @ok="handleSaveTeam"
        @cancel="closeTeamModal"
        :confirm-loading="saving"
        class="team-modal"
        wrap-class-name="team-modal-wrapper"
    >
      <div class="modal-header-line"></div>

      <a-form
          ref="teamFormRef"
          :model="teamForm"
          :rules="teamFormRules"
          layout="vertical"
          class="team-form"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
                label="Название команды"
                name="name"
                required
                class="form-item--purple"
            >
              <a-input
                  v-model:value="teamForm.name"
                  placeholder="Например: Кодократы, AI Masters"
                  size="large"
                  class="purple-input"
              />
            </a-form-item>

            <a-form-item
                label="Хакатон"
                name="hackathonId"
                required
                class="form-item--purple"
            >
              <a-select
                  v-model:value="teamForm.hackathonId"
                  placeholder="Выберите хакатон"
                  size="large"
                  class="purple-select"
                  dropdown-class-name="purple-dropdown"
              >
                <a-select-option value="hack1">ITAM Хакатон 2024</a-select-option>
                <a-select-option value="hack2">AI Challenge</a-select-option>
                <a-select-option value="hack3">Blockchain Hack</a-select-option>
                <a-divider style="margin: 8px 0" />
                <a-select-option value="add" class="add-hackathon-option">
                  <PlusOutlined style="margin-right: 8px" />
                  Добавить хакатон
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
                label="Описание команды"
                name="description"
                class="form-item--purple"
            >
              <a-textarea
                  v-model:value="teamForm.description"
                  placeholder="Опишите цели и особенности команды..."
                  :rows="4"
                  class="purple-textarea"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
                label="Капитан"
                name="captainId"
                required
                class="form-item--purple"
            >
              <a-select
                  v-model:value="teamForm.captainId"
                  placeholder="Выберите капитана"
                  size="large"
                  class="purple-select"
                  show-search
                  option-filter-prop="label"
              >
                <a-select-option
                    v-for="user in availableUsers"
                    :key="user.id"
                    :value="user.id"
                    :label="`${user.firstName} ${user.lastName}`"
                >
                  {{ user.firstName }} {{ user.lastName }}
                  <span v-if="user.role" style="color: #B298C5">({{ user.role }})</span>
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
                label="Текущие роли в команде"
                name="existingRoles"
                class="form-item--purple"
            >
              <a-select
                  v-model:value="teamForm.existingRoles"
                  mode="tags"
                  placeholder="Добавьте роли участников"
                  size="large"
                  class="purple-select purple-select--tags"
                  :options="roleOptions"
              />
            </a-form-item>

            <a-form-item
                label="Ищем участников на роли"
                name="neededRoles"
                class="form-item--purple"
            >
              <a-select
                  v-model:value="teamForm.neededRoles"
                  mode="tags"
                  placeholder="Какие роли нужны команде"
                  size="large"
                  class="purple-select purple-select--tags"
                  :options="roleOptions"
              />
            </a-form-item>

            <a-form-item
                label="Макс. размер команды"
                name="maxSize"
                required
                class="form-item--purple"
            >
              <a-select
                  v-model:value="teamForm.maxSize"
                  size="large"
                  class="purple-select"
              >
                <a-select-option :value="3">3 участника</a-select-option>
                <a-select-option :value="4">4 участника</a-select-option>
                <a-select-option :value="5">5 участников</a-select-option>
                <a-select-option :value="6">6 участников</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Участники команды -->
        <a-divider class="purple-divider" />
        <a-form-item
            label="Участники команды"
            class="form-item--purple"
        >
          <a-select
              v-model:value="teamForm.memberIds"
              mode="multiple"
              placeholder="Выберите участников команды"
              size="large"
              class="purple-select purple-select--multiple"
              :options="memberOptions"
              :disabled="!teamForm.captainId"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  PlusOutlined,
  TeamOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'
import TeamCard from '../components/TeamCard.vue'

interface TeamMember {
  id: string
  name: string
  role: string
  email?: string
}

interface Team {
  id: string
  name: string
  hackathonId: string
  hackathonName: string
  description?: string
  captainId: string
  captainName: string
  captainUsername: string
  members: TeamMember[]
  maxSize: number
  existingRoles: string[]
  neededRoles: string[]
  status: 'active' | 'full' | 'incomplete'
  createdAt: string
  skills: string[]
}

// Роутер
const router = useRouter()

// Состояние
const searchQuery = ref('')
const selectedHackathon = ref('all')
const teamStatus = ref('all')
const teamModalVisible = ref(false)
const editingTeam = ref<Team | null>(null)
const saving = ref(false)

// Данные команд (остаётся без изменений)
const teams = ref<Team[]>([
  {
    id: '1',
    name: 'кодократы',
    hackathonId: 'hack1',
    hackathonName: 'ITAM Хакатон 2024',
    description: 'Команда fullstack разработчиков',
    captainId: '1',
    captainName: 'Иван Иванов',
    captainUsername: 'иваниванов',
    members: [
      { id: '1', name: 'Иван Иванов', role: 'Капитан/Backend' },
      { id: '2', name: 'Анна Петрова', role: 'Frontend' },
      { id: '3', name: 'Дмитрий Сидоров', role: 'DevOps' },
      { id: '4', name: 'Мария Козлова', role: 'Database' }
    ],
    maxSize: 5,
    existingRoles: ['Backend', 'Frontend', 'DevOps', 'Database'],
    neededRoles: ['Designer', 'Frontend разработчик'],
    status: 'incomplete',
    createdAt: '2024-02-15',
    skills: ['python', 'node.js', 'django', 'html/css', 'postgresql']
  },
  {
    id: '2',
    name: 'ai masters',
    hackathonId: 'hack2',
    hackathonName: 'AI Challenge',
    description: 'Команда AI/ML специалистов',
    captainId: '5',
    captainName: 'Дмитрий Смирнов',
    captainUsername: 'дмитрийсмирнов',
    members: [
      { id: '5', name: 'Дмитрий Смирнов', role: 'Капитан/Data Scientist' },
      { id: '6', name: 'Ольга Новикова', role: 'ML Engineer' },
      { id: '7', name: 'Алексей Волков', role: 'Backend' }
    ],
    maxSize: 4,
    existingRoles: ['Data Scientist', 'ML Engineer', 'Backend'],
    neededRoles: ['Data Scientist'],
    status: 'incomplete',
    createdAt: '2024-02-16',
    skills: ['python', 'pandas', 'numpy', 'pytorch', 'tensorflow']
  },
  {
    id: '3',
    name: 'comclub',
    hackathonId: 'hack1',
    hackathonName: 'ITAM Хакатон 2024',
    description: 'Команда разработчиков',
    captainId: '8',
    captainName: 'Алексей Фешнлав',
    captainUsername: 'fashionlove',
    members: [
      { id: '8', name: 'Алексей Фешнлав', role: 'Капитан' },
      { id: '9', name: 'Мария Козлова', role: 'Designer' },
      { id: '10', name: 'Сергей Павлов', role: 'Backend' }
    ],
    maxSize: 6,
    existingRoles: ['Backend', 'Designer'],
    neededRoles: ['Design', 'Backend'],
    status: 'incomplete',
    createdAt: '2024-02-17',
    skills: ['python', 'figma', 'postgresql', 'django']
  },
  {
    id: '4',
    name: 'tech pioneers',
    hackathonId: 'hack1',
    hackathonName: 'ITAM Хакатон 2024',
    description: 'Инновационная команда',
    captainId: '11',
    captainName: 'Екатерина Сидорова',
    captainUsername: 'екатеринасидорова',
    members: [
      { id: '11', name: 'Екатерина Сидорова', role: 'Капитан' },
      { id: '12', name: 'Павел Николаев', role: 'Frontend' }
    ],
    maxSize: 5,
    existingRoles: ['Frontend'],
    neededRoles: ['Backend разработчик', 'UI/UX Designer'],
    status: 'incomplete',
    createdAt: '2024-02-18',
    skills: ['javascript', 'react', 'figma', 'typescript']
  },
  {
    id: '5',
    name: 'data wizards',
    hackathonId: 'hack2',
    hackathonName: 'AI Challenge',
    description: 'Команда анализа данных',
    captainId: '13',
    captainName: 'Андрей Козлов',
    captainUsername: 'андрейкозлов',
    members: [
      { id: '13', name: 'Андрей Козлов', role: 'Капитан' },
      { id: '14', name: 'Наталья Иванова', role: 'Data Scientist' },
      { id: '15', name: 'Михаил Петров', role: 'ML Engineer' },
      { id: '16', name: 'Ольга Смирнова', role: 'Analyst' }
    ],
    maxSize: 6,
    existingRoles: ['Data Scientist', 'ML Engineer', 'Analyst'],
    neededRoles: ['ML Engineer'],
    status: 'incomplete',
    createdAt: '2024-02-19',
    skills: ['python', 'tensorflow', 'sql', 'docker']
  },
  {
    id: '6',
    name: 'web masters',
    hackathonId: 'hack3',
    hackathonName: 'Blockchain Hack',
    description: 'Команда веб-разработчиков',
    captainId: '17',
    captainName: 'Виктор Орлов',
    captainUsername: 'викторорлов',
    members: [
      { id: '17', name: 'Виктор Орлов', role: 'Капитан' },
      { id: '18', name: 'Татьяна Васнецова', role: 'Frontend' }
    ],
    maxSize: 4,
    existingRoles: ['Frontend'],
    neededRoles: ['Backend разработчик', 'DevOps'],
    status: 'incomplete',
    createdAt: '2024-02-20',
    skills: ['node.js', 'express', 'mongodb', 'aws']
  }
])

const availableUsers = ref([
  { id: '1', firstName: 'Иван', lastName: 'Иванов', role: 'Backend' },
  { id: '2', firstName: 'Анна', lastName: 'Петрова', role: 'Frontend' },
  { id: '3', firstName: 'Дмитрий', lastName: 'Смирнов', role: 'Data Scientist' },
  { id: '4', firstName: 'Ольга', lastName: 'Новикова', role: 'ML Engineer' },
  { id: '5', firstName: 'Алексей', lastName: 'Волков', role: 'Backend' },
  { id: '6', firstName: 'Мария', lastName: 'Козлова', role: 'Designer' },
  { id: '7', firstName: 'Сергей', lastName: 'Павлов', role: 'Backend' },
  { id: '8', firstName: 'Алексей', lastName: 'Фешнлав', role: 'Fullstack' },
  { id: '11', firstName: 'Екатерина', lastName: 'Сидорова', role: 'Frontend' },
  { id: '13', firstName: 'Андрей', lastName: 'Козлов', role: 'Data Scientist' },
  { id: '17', firstName: 'Виктор', lastName: 'Орлов', role: 'Fullstack' }
])

// Форма команды (без изменений)
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
  name: [
    { required: true, message: 'Введите название команды' },
    { min: 2, max: 50, message: 'Название должно быть от 2 до 50 символов' }
  ],
  hackathonId: [{ required: true, message: 'Выберите хакатон' }],
  captainId: [{ required: true, message: 'Выберите капитана' }],
  maxSize: [{ required: true, message: 'Выберите размер команды' }]
}

const roleOptions = [
  { label: 'Frontend разработчик', value: 'Frontend разработчик' },
  { label: 'Backend разработчик', value: 'Backend разработчик' },
  { label: 'Fullstack разработчик', value: 'Fullstack разработчик' },
  { label: 'UI/UX Designer', value: 'UI/UX Designer' },
  { label: 'Data Scientist', value: 'Data Scientist' },
  { label: 'ML Engineer', value: 'ML Engineer' },
  { label: 'DevOps Engineer', value: 'DevOps Engineer' },
  { label: 'Designer', value: 'Designer' },
  { label: 'Design', value: 'Design' },
  { label: 'Backend', value: 'Backend' }
]

const memberOptions = computed(() => {
  return availableUsers.value
      .filter(user => user.id !== teamForm.captainId)
      .map(user => ({
        label: `${user.firstName} ${user.lastName} (${user.role})`,
        value: user.id
      }))
})

// Вычисляемые свойства (без изменений)
const filteredTeams = computed(() => {
  let result = teams.value

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(team =>
        team.name.toLowerCase().includes(query) ||
        team.captainName.toLowerCase().includes(query) ||
        team.hackathonName.toLowerCase().includes(query) ||
        team.existingRoles.some(role => role.toLowerCase().includes(query)) ||
        team.neededRoles.some(role => role.toLowerCase().includes(query))
    )
  }

  if (selectedHackathon.value !== 'all') {
    result = result.filter(team => team.hackathonId === selectedHackathon.value)
  }

  if (teamStatus.value !== 'all') {
    result = result.filter(team => team.status === teamStatus.value)
  }

  return result
})

// Методы (без изменений)
const handleSearch = () => {
  // Поиск работает через computed свойство
}

const showCreateModal = () => {
  editingTeam.value = null
  Object.keys(teamForm).forEach(key => {
    if (key === 'maxSize') {
      teamForm[key as keyof typeof teamForm] = 4
    } else {
      teamForm[key as keyof typeof teamForm] = ''
    }
  })
  teamForm.memberIds = []
  teamForm.existingRoles = []
  teamForm.neededRoles = []
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
  saving.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (editingTeam.value) {
      const index = teams.value.findIndex(t => t.id === editingTeam.value!.id)
      if (index !== -1) {
        const captain = availableUsers.value.find(u => u.id === teamForm.captainId)
        teams.value[index] = {
          ...teams.value[index],
          ...teamForm,
          captainName: captain ? `${captain.firstName} ${captain.lastName}` : 'Неизвестный',
          captainUsername: captain ? `${captain.firstName}${captain.lastName}`.toLowerCase() : 'unknown',
          members: [
            {
              id: teamForm.captainId,
              name: captain ? `${captain.firstName} ${captain.lastName}` : 'Капитан',
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
          status: teamForm.memberIds.length + 1 >= teamForm.maxSize ? 'full' : 'incomplete'
        }
      }
      message.success('Команда обновлена')
    } else {
      const captain = availableUsers.value.find(u => u.id === teamForm.captainId)
      const hackathon = teamForm.hackathonId === 'hack1' ? 'ITAM Хакатон 2024' :
          teamForm.hackathonId === 'hack2' ? 'AI Challenge' : 'Blockchain Hack'

      const newTeam: Team = {
        id: Date.now().toString(),
        name: teamForm.name,
        hackathonId: teamForm.hackathonId,
        hackathonName: hackathon,
        description: teamForm.description,
        captainId: teamForm.captainId,
        captainName: captain ? `${captain.firstName} ${captain.lastName}` : 'Неизвестный',
        captainUsername: captain ? `${captain.firstName}${captain.lastName}`.toLowerCase() : 'unknown',
        members: [
          {
            id: teamForm.captainId,
            name: captain ? `${captain.firstName} ${captain.lastName}` : 'Капитан',
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
        status: teamForm.memberIds.length + 1 >= teamForm.maxSize ? 'full' : 'incomplete',
        createdAt: new Date().toISOString().split('T')[0],
        skills: ['python', 'javascript', 'figma']
      }

      teams.value.unshift(newTeam)
      message.success('Команда создана')
    }

    teamModalVisible.value = false
  } catch (error) {
    console.error('Ошибка сохранения команды:', error)
    message.error('Ошибка при сохранении команды')
  } finally {
    saving.value = false
  }
}

const viewTeamDetails = (id: string) => {
  router.push(`/teams/${id}`)
}

const confirmDeleteTeam = (id: string) => {
  const team = teams.value.find(t => t.id === id)
  if (!team) return

  Modal.confirm({
    title: 'Удалить команду?',
    content: `Вы уверены, что хотите удалить команду "${team.name}"? Это действие нельзя отменить.`,
    okText: 'Удалить',
    okType: 'danger',
    cancelText: 'Отмена',
    onOk: () => deleteTeam(id)
  })
}

const deleteTeam = (id: string) => {
  teams.value = teams.value.filter(team => team.id !== id)
  message.success('Команда удалена')
}

onMounted(() => {
  console.log('Teams page loaded for organizers')
})
</script>

<style scoped>
.teams-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Заголовок */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-header h1 {
  margin: 0;
  font-size: 36px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.5px;
}

/* Кнопка "Создать команду" */
.create-team-btn {
  background: linear-gradient(135deg, #68507E, #8A6FB0) !important;
  border: none !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  letter-spacing: 0.05em;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(104, 80, 126, 0.3) !important;
}

.create-team-btn:hover {
  background: linear-gradient(135deg, #8A6FB0, #B298C5) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 24px rgba(104, 80, 126, 0.4) !important;
}

.create-team-btn:active {
  transform: translateY(0) !important;
}

.create-team-btn :deep(.anticon) {
  font-size: 18px;
}

/* Фильтры */
.org-filters {
  margin-bottom: 32px;
}

.filters-wrapper {
  display: flex;
  gap: 16px;
  align-items: center;
}

.filter-select {
  width: 250px;
}

.filter-select :deep(.ant-select-selector) {
  border: 2px solid #E5E7EB !important;
  border-radius: 10px !important;
  transition: all 0.3s ease !important;
}

.filter-select :deep(.ant-select-selector:hover) {
  border-color: #B298C5 !important;
}

.filter-select :deep(.ant-select-selector:focus) {
  border-color: #68507E !important;
  box-shadow: 0 0 0 2px rgba(104, 80, 126, 0.1) !important;
}

/* Поиск */
.page-header :deep(.ant-input-search) input {
  border: 2px solid #E5E7EB !important;
  border-radius: 10px !important;
  transition: all 0.3s ease !important;
}

.page-header :deep(.ant-input-search) input:hover {
  border-color: #B298C5 !important;
}

.page-header :deep(.ant-input-search) input:focus {
  border-color: #68507E !important;
  box-shadow: 0 0 0 2px rgba(104, 80, 126, 0.1) !important;
}

.page-header :deep(.ant-input-search) .ant-btn {
  background: #68507E !important;
  border-color: #68507E !important;
  border-radius: 0 10px 10px 0 !important;
}

.page-header :deep(.ant-input-search) .ant-btn:hover {
  background: #8A6FB0 !important;
  border-color: #8A6FB0 !important;
}

/* Сетка карточек */
.teams-container {
  min-height: 60vh;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

/* Сообщение если нет команд */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
  background: #F9F5FF;
  border-radius: 16px;
  border: 2px dashed #E5E7EB;
  margin-top: 40px;
}

.empty-icon {
  font-size: 72px;
  color: #D1C4E9;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 28px;
  font-weight: 700;
  color: #68507E;
  margin-bottom: 8px;
}

.empty-state p {
  color: #8A6FB0;
  font-size: 16px;
  margin-bottom: 24px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .header-actions :deep(.ant-input-search) {
    width: 100% !important;
  }

  .header-actions :deep(.ant-btn) {
    width: 100%;
  }

  .teams-grid {
    grid-template-columns: 1fr;
  }

  .filters-wrapper {
    flex-direction: column;
    width: 100%;
  }

  .filter-select {
    width: 100% !important;
  }
}
</style>

<style>
/* Стили для модального окна */
.team-modal-wrapper .ant-modal {
  border-radius: 20px;
  overflow: hidden;
}

.team-modal .ant-modal-content {
  border-radius: 20px;
  border: 2px solid #68507E;
  overflow: hidden;
}

.team-modal .ant-modal-header {
  border-radius: 18px 18px 0 0;
  padding: 24px;
  margin-bottom: 0;
}

.team-modal .ant-modal-title {
  color: #291360;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
}

.team-modal .ant-modal-close {
  color: white;
}

.team-modal .ant-modal-close:hover {
  color: #B298C5;
}

.team-modal .ant-modal-body {
  padding: 0 32px 32px 32px;
}

/* Линия под заголовком */
.modal-header-line {
  height: 4px;

  margin-bottom: 32px;
  border-radius: 2px;
}

/* Форма */
.team-form {
  padding-top: 16px;
}

.form-item--purple .ant-form-item-label > label {
  color: #68507E !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-item--purple .ant-form-item-label > label::after {
  content: '' !important;
}

.form-item--purple .ant-form-item-label > label.ant-form-item-required::before {
  display: none !important;
}

.form-item--purple .ant-form-item-label > label.ant-form-item-required::after {
  content: '*' !important;
  color: #FF4757;
  margin-left: 4px;
}

/* Инпуты */
.purple-input,
.purple-textarea,
.purple-select {
  border: 2px solid #E5E7EB !important;
  border-radius: 10px !important;
  transition: all 0.3s ease !important;
}

.purple-input:hover,
.purple-textarea:hover,
.purple-select:hover :deep(.ant-select-selector) {
  border-color: #B298C5 !important;
}

.purple-input:focus,
.purple-textarea:focus,
.purple-select-focused :deep(.ant-select-selector) {
  border-color: #68507E !important;
  box-shadow: 0 0 0 2px rgba(104, 80, 126, 0.1) !important;
}

/* Селекты */
.purple-select--tags :deep(.ant-select-selection-overflow) {
  gap: 6px;
}

.purple-select--tags :deep(.ant-select-selection-item) {
  background: #F9F5FF !important;
  border: 1px solid #D1C4E9 !important;
  color: #68507E !important;
  border-radius: 6px !important;
  font-weight: 500;
}

.purple-select--multiple :deep(.ant-select-selection-item) {
  background: #E5E7FF !important;
  border: 1px solid #818CF8 !important;
  color: #3730A3 !important;
  border-radius: 6px !important;
  font-weight: 500;
}

/* Дропдаун с фиолетовым стилем */
.purple-dropdown {
  border: 2px solid #68507E !important;
  border-radius: 10px !important;
  box-shadow: 0 8px 24px rgba(104, 80, 126, 0.15) !important;
}

.purple-dropdown .ant-select-item {
  padding: 12px 16px !important;
  transition: all 0.2s ease !important;
}

.purple-dropdown .ant-select-item-option-active {
  background: #F9F5FF !important;
}

.purple-dropdown .ant-select-item-option-selected {
  background: #68507E !important;
  color: white !important;
  font-weight: 600;
}

/* Опция "Добавить хакатон" */
.add-hackathon-option {
  color: #68507E !important;
  font-weight: 600 !important;
  padding: 12px 16px !important;
  background: #F9F5FF !important;
  border-top: 1px solid #E5E7EB !important;
  margin-top: 8px;
}

.add-hackathon-option:hover {
  background: #E5D9F2 !important;
  color: #8A6FB0 !important;
}

/* Разделитель */
.purple-divider {
  margin: 24px 0 32px 0 !important;
  border-color: #E5E7EB !important;
  border-width: 2px !important;
}

/* Кнопки в модалке */
.team-modal .ant-modal-footer {
  padding: 20px 32px;
  border-top: 1px solid #E5E7EB;
}

.team-modal .ant-btn-default {
  border: 2px solid #E5E7EB !important;
  color: #6B7280 !important;
  border-radius: 10px !important;
  font-weight: 600;
  padding: 8px 24px;
  height: 44px;
}

.team-modal .ant-btn-primary {
  background: linear-gradient(135deg, #68507E, #8A6FB0) !important;
  border: none !important;
  border-radius: 10px !important;
  font-weight: 600;
  padding: 8px 24px;
  height: 44px;
  transition: all 0.3s ease !important;
}

.team-modal .ant-btn-primary:hover {
  background: linear-gradient(135deg, #8A6FB0, #B298C5) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(104, 80, 126, 0.3);
}

.team-modal .ant-btn-primary:active {
  transform: translateY(0);
}
</style>