<template>
  <div class="users-page">
    <!-- Заголовок и поиск -->
    <div class="page-header">
      <div class="header-left">
        <h1>Участники</h1>
        <div class="subtitle">Управление всеми участниками платформы</div>
      </div>

      <div class="header-right">
        <a-input-search
            placeholder="Поиск по ФИО, ID или username..."
            style="width: 300px"
            @search="handleSearch"
            v-model:value="searchQuery"
            allow-clear
            class="custom-search"
            size="large"
        />

        <div class="header-buttons">
          <a-button @click="exportCSV" class="export-btn">
            <template #icon><ExportOutlined /></template>
            Экспорт CSV
          </a-button>

          <a-button
              type="primary"
              @click="showAssignModal"
              class="assign-btn"
              :disabled="selectedUsers.length === 0"
          >
            <template #icon><UserAddOutlined /></template>
            Распределить выбранных
          </a-button>
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="filters-section">
      <div class="filter-buttons-container">
        <div class="filter-group">
          <span class="filter-label">Роль:</span>
          <div class="filter-options">
            <button
                v-for="roleOption in roleOptions"
                :key="roleOption.value"
                @click="toggleRoleFilter(roleOption.value)"
                class="filter-button"
                :class="{ active: filters.role === roleOption.value }"
            >
              {{ roleOption.label }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <span class="filter-label">Статус команды:</span>
          <div class="filter-options">
            <button
                v-for="teamOption in teamOptions"
                :key="teamOption.value"
                @click="toggleTeamFilter(teamOption.value)"
                class="filter-button"
                :class="{ active: filters.hasTeam === teamOption.value }"
            >
              {{ teamOption.label }}
            </button>
          </div>
        </div>

        <button @click="resetFilters" class="reset-btn">
          <reload-outlined />
          Сбросить
        </button>
      </div>
    </div>

    <!-- Чекбоксы выбора -->
    <div v-if="filteredUsers.length > 0" class="selection-bar">
      <div class="selection-info">
        <a-checkbox
            :indeterminate="isIndeterminate"
            :checked="isAllSelected"
            @change="toggleSelectAll"
        >
          Выбрано: {{ selectedUsers.length }} участников
        </a-checkbox>
      </div>

      <div class="selection-actions" v-if="selectedUsers.length > 0">
        <span class="selected-count">{{ selectedUsers.length }} выбрано</span>
        <a-button size="small" @click="clearSelection">
          Очистить
        </a-button>
      </div>
    </div>

    <!-- Карточки участников -->
    <div v-if="filteredUsers.length > 0" class="users-grid">
      <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="user-item"
          :class="{ selected: selectedUserIds.includes(user.id) }"
          @click="toggleUserSelection(user.id)"
      >
        <div class="selection-checkbox">
          <a-checkbox
              :checked="selectedUserIds.includes(user.id)"
              @click.stop
              @change="toggleUserSelection(user.id)"
          />
        </div>

        <UserCard
            :user="user"
            @view="viewProfile(user)"
            @assign="assignToTeam(user)"
            @delete="deleteUser(user)"
        />
      </div>
    </div>

    <!-- Пустое состояние -->
    <div v-else class="empty-state">
      <div class="empty-content">
        <UserOutlined style="font-size: 64px; color: #d9d9d9" />
        <h3>Участники не найдены</h3>
        <p>Попробуйте изменить параметры поиска</p>
      </div>
    </div>

    <!-- Модалка распределения -->
    <a-modal
        v-model:open="assignModalVisible"
        title="Распределение участников по командам"
        @ok="handleAssign"
        @cancel="assignModalVisible = false"
        :ok-button-props="{ disabled: !assignTeamId }"
        class="assign-modal"
    >
      <div class="assign-modal-content">
        <div class="assign-info">
          <div class="selected-count-badge">
            Выбрано участников: {{ selectedUsers.length }}
          </div>

          <div v-if="selectedUsersWithTeam.length > 0" class="warning-alert">
            <exclamation-circle-outlined />
            <span>{{ selectedUsersWithTeam.length }} участников уже состоят в командах</span>
          </div>
        </div>

        <a-form layout="vertical">
          <a-form-item label="Выберите команду" required>
            <a-select
                v-model:value="assignTeamId"
                placeholder="Выберите команду"
                style="width: 100%"
                size="large"
            >
              <a-select-option v-for="team in availableTeams" :key="team.id" :value="team.id">
                {{ team.name }} ({{ team.members.length }}/{{ team.maxSize }})
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import {
  ExportOutlined,
  UserAddOutlined,
  ReloadOutlined,
  UserOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import UserCard from '../components/UserCard.vue'

// Типы
interface User {
  id: string
  telegramId: string
  firstName: string
  lastName: string
  username?: string
  avatarUrl?: string
  role: string
  experience: string
  skills: string[]
  hackathonId: string
  teamId?: string
  teamName?: string
  teamMembers?: number
  teamSize?: number
}

interface FilterParams {
  hackathonId?: string
  role?: string
  hasTeam?: string
}

// Состояние
const loading = ref(false)
const searchQuery = ref('')
const users = ref<User[]>([])
const selectedUserIds = ref<string[]>([])
const assignModalVisible = ref(false)
const assignTeamId = ref<string>()

// Фильтры
const filters = reactive<FilterParams>({})

// Опции фильтров
const roleOptions = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'fullstack', label: 'Fullstack' },
  { value: 'designer', label: 'Designer' },
  { value: 'mobile', label: 'Mobile' }
]

const teamOptions = [
  { value: 'has_team', label: 'В команде' },
  { value: 'no_team', label: 'Без команды' }
]

// Вычисляемые свойства
const filteredUsers = computed(() => {
  let result = [...users.value]

  // Поиск
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        (user.username && user.username.toLowerCase().includes(query)) ||
        user.telegramId.toLowerCase().includes(query)
    )
  }

  // Фильтр по роли
  if (filters.role) {
    result = result.filter(user => user.role === filters.role)
  }

  // Фильтр по команде
  if (filters.hasTeam === 'has_team') {
    result = result.filter(user => user.teamId)
  } else if (filters.hasTeam === 'no_team') {
    result = result.filter(user => !user.teamId)
  }

  return result
})

const selectedUsers = computed(() => {
  return users.value.filter(user => selectedUserIds.value.includes(user.id))
})

const selectedUsersWithTeam = computed(() => {
  return selectedUsers.value.filter(user => user.teamId)
})

const availableTeams = computed(() => {
  // Заглушка
  return [
    { id: 'team1', name: 'Хакеры', members: [1, 2], maxSize: 4 },
    { id: 'team2', name: 'Кодеры', members: [1], maxSize: 5 }
  ]
})

const isAllSelected = computed(() => {
  return filteredUsers.value.length > 0 &&
      selectedUserIds.value.length === filteredUsers.value.length
})

const isIndeterminate = computed(() => {
  return selectedUserIds.value.length > 0 &&
      selectedUserIds.value.length < filteredUsers.value.length
})

// Методы
const loadUsers = async () => {
  loading.value = true
  try {
    // Тестовые данные
    users.value = [
      {
        id: '1',
        telegramId: '123456',
        firstName: 'Иван',
        lastName: 'Петров',
        username: 'ivan_petrov',
        role: 'frontend',
        experience: 'middle',
        skills: ['React', 'TypeScript', 'UI/UX', 'Figma'],
        hackathonId: 'hack1',
        teamId: 'team1',
        teamName: 'Хакеры',
        teamMembers: 3,
        teamSize: 4
      },
      {
        id: '2',
        telegramId: '789012',
        firstName: 'Анна',
        lastName: 'Сидорова',
        username: 'anna_sidorova',
        role: 'backend',
        experience: 'junior',
        skills: ['Node.js', 'Python', 'PostgreSQL', 'Docker'],
        hackathonId: 'hack1',
        teamId: undefined
      },
      {
        id: '3',
        telegramId: '345678',
        firstName: 'Дмитрий',
        lastName: 'Смирнов',
        username: 'dmitry_smirnov',
        role: 'designer',
        experience: 'senior',
        skills: ['Figma', 'UI/UX', 'Adobe Creative Suite', 'Prototyping'],
        hackathonId: 'hack1',
        teamId: 'team2',
        teamName: 'Кодеры',
        teamMembers: 2,
        teamSize: 5
      },
      {
        id: '4',
        telegramId: '901234',
        firstName: 'Александр',
        lastName: 'Парадеевич',
        username: 'alex_paradeevich',
        role: 'fullstack',
        experience: 'middle',
        skills: ['Python', 'Django', 'Vue.js', 'PostgreSQL'],
        hackathonId: 'hack1',
        teamId: undefined
      }
    ]
  } catch (error) {
    message.error('Ошибка при загрузке участников')
  } finally {
    loading.value = false
  }
}

const toggleRoleFilter = (role: string) => {
  filters.role = filters.role === role ? undefined : role
}

const toggleTeamFilter = (hasTeam: string) => {
  filters.hasTeam = filters.hasTeam === hasTeam ? undefined : hasTeam
}

const resetFilters = () => {
  filters.role = undefined
  filters.hasTeam = undefined
  searchQuery.value = ''
  selectedUserIds.value = []
}

const handleSearch = () => {
  selectedUserIds.value = []
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedUserIds.value = []
  } else {
    selectedUserIds.value = filteredUsers.value.map(user => user.id)
  }
}

const toggleUserSelection = (userId: string) => {
  const index = selectedUserIds.value.indexOf(userId)
  if (index > -1) {
    selectedUserIds.value.splice(index, 1)
  } else {
    selectedUserIds.value.push(userId)
  }
}

const clearSelection = () => {
  selectedUserIds.value = []
}

const viewProfile = (user: User) => {
  message.info(`Просмотр профиля: ${user.firstName}`)
}

const assignToTeam = (user: User) => {
  if (user.teamId) {
    message.warning(`${user.firstName} уже состоит в команде`)
    return
  }
  selectedUserIds.value = [user.id]
  showAssignModal()
}

const showAssignModal = () => {
  if (selectedUserIds.value.length === 0) {
    message.warning('Выберите хотя бы одного участника')
    return
  }
  assignModalVisible.value = true
}

const handleAssign = async () => {
  if (!assignTeamId.value) {
    message.warning('Выберите команду')
    return
  }

  try {
    message.success(`Участники распределены в команду`)
    assignModalVisible.value = false
    assignTeamId.value = undefined
    selectedUserIds.value = []
    loadUsers()
  } catch (error) {
    message.error('Ошибка при распределении')
  }
}

const deleteUser = (user: User) => {
  Modal.confirm({
    title: 'Удалить участника?',
    content: `Вы уверены, что хотите удалить ${user.firstName} ${user.lastName}?`,
    okText: 'Удалить',
    okType: 'danger',
    cancelText: 'Отмена',
    onOk: async () => {
      try {
        users.value = users.value.filter(u => u.id !== user.id)
        message.success('Участник удален')
      } catch (error) {
        message.error('Ошибка при удалении')
      }
    }
  })
}

const exportCSV = () => {
  message.success('Экспорт CSV начат')
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
/* Основные стили */
.users-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Хедер */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-left h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-buttons {
  display: flex;
  gap: 12px;
}

.export-btn {
  border-radius: 12px;
  border: 2px solid #ECE3F2 !important;
  background: #ECE3F2 !important;
  color: #291360 !important;
  font-weight: 500;
}

.export-btn:hover {
  background: #D6C6E3 !important;
  border-color: #D6C6E3 !important;
}

.assign-btn {
  border-radius: 12px;
  background: #68507E !important;
  border-color: #68507E !important;
  color: white !important;
  font-weight: 500;
}

.assign-btn:hover:not(:disabled) {
  background: #8156FF !important;
  border-color: #8156FF !important;
}

.assign-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Фильтры */
.filters-section {
  margin-bottom: 24px;
}

.filter-buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
  background: #f8f9fa;
  border-radius: 16px;
  padding: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  font-weight: 600;
  color: #291360;
  font-size: 14px;
  white-space: nowrap;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-button {
  padding: 8px 16px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  color: #666;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-button:hover {
  border-color: #8156FF;
  color: #291360;
}

.filter-button.active {
  background: #291360;
  border-color: #291360;
  color: white;
}

.reset-btn {
  padding: 8px 16px;
  background: transparent;
  border: 2px solid #ffccc7;
  border-radius: 8px;
  color: #ff4d4f;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.reset-btn:hover {
  background: #fff2f0;
}

/* Панель выбора */
.selection-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #f0f2f5;
  border-radius: 12px;
  margin-bottom: 24px;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selection-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-count {
  color: #291360;
  font-weight: 500;
  font-size: 14px;
}

/* Сетка пользователей */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.user-item {
  position: relative;
  transition: all 0.3s ease;
}

.user-item:hover {
  transform: translateY(-2px);
}

.user-item.selected {
  transform: translateY(-4px);
}

.user-item.selected .user-card {
  border-color: #8156FF;
  box-shadow: 0 8px 24px rgba(129, 86, 255, 0.15);
  position: relative;
}

.user-item.selected .user-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid #8156FF;
  border-radius: 18px;
  pointer-events: none;
}

.selection-checkbox {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  background: white;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.user-item:hover .selection-checkbox,
.user-item.selected .selection-checkbox {
  opacity: 1;
}

/* Пустое состояние */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: #f8f9fa;
  border-radius: 16px;
  border: 2px dashed #e9ecef;
}

.empty-content {
  text-align: center;
  padding: 48px;
}

.empty-content h3 {
  margin: 16px 0 8px 0;
  color: #1a1a1a;
}

.empty-content p {
  color: #666;
}

/* Модалка распределения */
.assign-modal :deep(.ant-modal-content) {
  border-radius: 16px;
}

.assign-modal-content {
  padding: 8px 0;
}

.assign-info {
  margin-bottom: 20px;
}

.selected-count-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #ECE3F2;
  color: #291360;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}

.warning-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  color: #ff4d4f;
  font-size: 14px;
}

/* Стили для поиска */
.custom-search :deep(.ant-input-affix-wrapper) {
  border-radius: 12px;
  border: 2px solid #D6C6E3 !important;
}

.custom-search :deep(.ant-input-affix-wrapper:hover),
.custom-search :deep(.ant-input-affix-wrapper:focus) {
  border-color: #8156FF !important;
  box-shadow: 0 0 0 2px rgba(129, 86, 255, 0.1) !important;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .users-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-right {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .header-buttons {
    width: 100%;
  }

  .filter-buttons-container {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-options {
    width: 100%;
  }

  .filter-button {
    flex: 1;
    text-align: center;
  }

  .reset-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>