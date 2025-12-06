
<template>
  <div class="users-page">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px">
      <h1 style="margin: 0">Участники</h1>

      <a-space>
        <a-input-search
            placeholder="Поиск по ФИО, ID или username..."
            style="width: 300px"
            @search="handleSearch"
            v-model:value="searchQuery"
            allow-clear
        />

        <a-button @click="exportCSV">
          <template #icon><ExportOutlined /></template>
          Экспорт CSV
        </a-button>

        <a-button type="primary" @click="showAssignModal">
          <template #icon><UserAddOutlined /></template>
          Распределить выбранных
        </a-button>
      </a-space>
    </div>


    <a-card style="margin-top: 16px; margin-bottom: 16px">
      <a-form layout="inline" :model="filters">

        <a-form-item label="Роль">
          <a-select
              v-model:value="filters.role"
              placeholder="Все роли"
              style="width: 150px"
              allow-clear
              @change="loadUsers"
          >
            <a-select-option value="frontend">Frontend</a-select-option>
            <a-select-option value="backend">Backend</a-select-option>
            <a-select-option value="fullstack">Fullstack</a-select-option>
            <a-select-option value="designer">Designer</a-select-option>
            <a-select-option value="mobile">Mobile</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Статус команды">
          <a-select
              v-model:value="filters.hasTeam"
              placeholder="Все"
              style="width: 150px"
              allow-clear
              @change="loadUsers"
          >
            <a-select-option value="has_team">В команде</a-select-option>
            <a-select-option value="no_team">Без команды</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button @click="resetFilters">
            <template #icon><ReloadOutlined /></template>
            Сбросить
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>


    <a-card>
      <a-table
          :columns="columns"
          :data-source="filteredUsers"
          :row-selection="rowSelection"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
          row-key="id"
      >

        <template #skills="{ record }">
          <a-tag
              v-for="skill in record.skills.slice(0, 3)"
              :key="skill"
              color="blue"
              style="margin-bottom: 4px"
          >
            {{ skill }}
          </a-tag>
          <a-tag v-if="record.skills.length > 3" color="default">
            +{{ record.skills.length - 3 }}
          </a-tag>
        </template>


        <template #team="{ record }">
          <span v-if="record.teamName">
            <a-tag color="green">{{ record.teamName }}</a-tag>
            <div style="font-size: 12px; color: #999">
              {{ record.teamMembers }}/{{ record.teamSize }} чел.
            </div>
          </span>
          <a-tag v-else color="red">Без команды</a-tag>
        </template>


        <template #action="{ record }">
          <a-space direction="vertical" size="small">
            <a-button
                size="small"
                type="link"
                @click="viewProfile(record)"
                style="padding: 0"
            >
              <EyeOutlined /> Профиль
            </a-button>

            <a-button
                size="small"
                type="link"
                :disabled="!!record.teamId"
                @click="assignToTeam(record)"
                style="padding: 0"
            >
              <TeamOutlined />
              {{ record.teamId ? 'В команде' : 'Распределить' }}
            </a-button>

            <a-button
                size="small"
                type="link"
                danger
                @click="deleteUser(record)"
                style="padding: 0"
            >
              <DeleteOutlined /> Удалить
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>


    <a-empty
        v-if="filteredUsers.length === 0"
        style="margin-top: 48px"
        description="Участники не найдены"
    >
      <template #image>
        <UserOutlined style="font-size: 48px; color: #999" />
      </template>
    </a-empty>


    <a-modal
        v-model:open="assignModalVisible"
        title="Распределение участников по командам"
        @ok="handleAssign"
        @cancel="assignModalVisible = false"
    >
      <p>Выбрано участников: {{ selectedRowKeys.length }}</p>

      <a-form layout="vertical">
        <a-form-item label="Выберите команду">
          <a-select
              v-model:value="assignTeamId"
              placeholder="Выберите команду"
              style="width: 100%"
          >
            <a-select-option v-for="team in availableTeams" :key="team.id" :value="team.id">
              {{ team.name }} ({{ team.members.length }}/{{ team.maxSize }})
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-alert
            v-if="selectedUsersWithTeam.length > 0"
            type="warning"
            message="Некоторые выбранные участники уже в командах"
            :description="`${selectedUsersWithTeam.length} участников уже состоят в командах`"
            style="margin-bottom: 16px"
        />
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import {
  ExportOutlined,
  UserAddOutlined,
  ReloadOutlined,
  EyeOutlined,
  TeamOutlined,
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import type { TableProps } from 'ant-design-vue'

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
const searchQuery = ref('') // <-- ДОБАВЛЕНО ПОИСК
const users = ref<User[]>([])
const hackathons = ref<any[]>([])
const selectedRowKeys = ref<string[]>([])
const assignModalVisible = ref(false)
const assignTeamId = ref<string>()

// Фильтры
const filters = reactive<FilterParams>({
  hackathonId: undefined,
  role: undefined,
  hasTeam: undefined
})

// Пагинация
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100']
})

// Колонки таблицы
const columns: TableProps['columns'] = [
  {
    title: 'ID',
    dataIndex: 'telegramId',
    width: 100,
    ellipsis: true
  },
  {
    title: 'Имя',
    dataIndex: 'firstName',
    width: 150,
    render: (text: string, record: User) =>
        `${record.firstName} ${record.lastName}`
  },
  {
    title: 'Username',
    dataIndex: 'username',
    width: 120,
    ellipsis: true
  },
  {
    title: 'Роль',
    dataIndex: 'role',
    width: 120,
    filters: [
      { text: 'Frontend', value: 'frontend' },
      { text: 'Backend', value: 'backend' },
      { text: 'Fullstack', value: 'fullstack' },
      { text: 'Designer', value: 'designer' }
    ],
    onFilter: (value: string, record: User) => record.role === value
  },
  {
    title: 'Опыт',
    dataIndex: 'experience',
    width: 100,
    filters: [
      { text: 'Junior', value: 'junior' },
      { text: 'Middle', value: 'middle' },
      { text: 'Senior', value: 'senior' }
    ],
    onFilter: (value: string, record: User) => record.experience === value
  },
  {
    title: 'Навыки',
    key: 'skills',
    slots: { customRender: 'skills' },
    width: 200
  },
  {
    title: 'Команда',
    key: 'team',
    slots: { customRender: 'team' },
    width: 150
  },
  {
    title: 'Действия',
    key: 'action',
    slots: { customRender: 'action' },
    width: 150,
    fixed: 'right' as const
  }
]

// Отфильтрованные пользователи с учетом поиска
const filteredUsers = computed(() => {
  let result = [...users.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        (user.username && user.username.toLowerCase().includes(query)) ||
        user.telegramId.toLowerCase().includes(query)
    )
  }


  if (filters.hackathonId) {
    result = result.filter(user => user.hackathonId === filters.hackathonId)
  }

  if (filters.role) {
    result = result.filter(user => user.role === filters.role)
  }

  if (filters.hasTeam === 'has_team') {
    result = result.filter(user => user.teamId)
  } else if (filters.hasTeam === 'no_team') {
    result = result.filter(user => !user.teamId)
  }

  return result
})

// Выбор строк в таблице
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys
  }
}))

// Участники, которые уже в командах (из выбранных)
const selectedUsersWithTeam = computed(() => {
  return users.value.filter(user =>
      selectedRowKeys.value.includes(user.id) && user.teamId
  )
})

// Доступные команды для распределения
const availableTeams = computed(() => {
  // Здесь должна быть логика получения команд
  // Пока заглушка
  return [
    { id: 'team1', name: 'Хакеры', members: [1, 2], maxSize: 4 },
    { id: 'team2', name: 'Кодеры', members: [1], maxSize: 5 }
  ]
})

// Методы
const loadUsers = async () => {
  loading.value = true
  try {
    // Здесь будет реальный запрос к API
    // Заглушка с тестовыми данными
    users.value = [
      {
        id: '1',
        telegramId: '123456',
        firstName: 'Иван',
        lastName: 'Петров',
        username: 'ivan_petrov',
        role: 'frontend',
        experience: 'middle',
        skills: ['React', 'TypeScript', 'UI/UX'],
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
        skills: ['Node.js', 'Python', 'PostgreSQL'],
        hackathonId: 'hack1',
        teamId: undefined,
        teamName: undefined
      },
      {
        id: '3',
        telegramId: '345678',
        firstName: 'Дмитрий',
        lastName: 'Смирнов',
        username: 'dmitry_smirnov',
        role: 'designer',
        experience: 'senior',
        skills: ['Figma', 'UI/UX', 'Adobe Creative Suite'],
        hackathonId: 'hack1',
        teamId: 'team2',
        teamName: 'Кодеры',
        teamMembers: 2,
        teamSize: 5
      }
    ]
    pagination.total = users.value.length
  } catch (error) {
    message.error('Ошибка при загрузке участников')
  } finally {
    loading.value = false
  }
}

const loadHackathons = async () => {
  try {
    // Заглушка
    hackathons.value = [
      { id: 'hack1', name: 'ITAM AI Hack 2024' },
      { id: 'hack2', name: 'Blockchain Challenge' }
    ]
  } catch (error) {
    message.error('Ошибка при загрузке хакатонов')
  }
}

// Обработка поиска
const handleSearch = () => {
  // Поиск уже реактивный через computed filteredUsers
  // Просто сбрасываем пагинацию на первую страницу
  pagination.current = 1
}

const resetFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key as keyof FilterParams] = undefined
  })
  searchQuery.value = ''
  loadUsers()
}

const handleTableChange: TableProps['onChange'] = (pag) => {
  pagination.current = pag.current!
  pagination.pageSize = pag.pageSize!
  loadUsers()
}

const viewProfile = (user: User) => {
  message.info(`Просмотр профиля: ${user.firstName}`)
}

const assignToTeam = (user: User) => {
  selectedRowKeys.value = [user.id]
  showAssignModal()
}

const showAssignModal = () => {
  if (selectedRowKeys.value.length === 0) {
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
    // Здесь запрос к API для распределения
    message.success(`Участники распределены в команду`)
    assignModalVisible.value = false
    loadUsers() // Перезагружаем данные
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
        // Здесь запрос к API для удаления
        users.value = users.value.filter(u => u.id !== user.id)
        message.success('Участник удален')
      } catch (error) {
        message.error('Ошибка при удалении')
      }
    }
  })
}

const exportCSV = () => {
  // Логика экспорта в CSV
  message.success('Экспорт начат')
}

// Хуки
onMounted(() => {
  loadHackathons()
  loadUsers()
})
</script>

<style scoped>
.users-page {
  padding: 24px;
}

:deep(.ant-table-cell) {
  vertical-align: top;
}

:deep(.ant-tag) {
  margin-right: 4px;
  margin-bottom: 4px;
}
</style>