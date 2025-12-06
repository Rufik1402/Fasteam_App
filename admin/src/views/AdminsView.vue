
<template>
  <div class="admins-page">

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px">
      <h1 style="margin: 0">Администраторы</h1>

      <a-space>

        <a-input-search
            placeholder="Поиск по имени или email..."
            style="width: 300px"
            @search="handleSearch"
            v-model:value="searchQuery"
            allow-clear
        />


        <a-button
            type="primary"
            @click="showAddModal"
            size="large"
        >
          <template #icon><PlusOutlined /></template>
          Добавить администратора
        </a-button>
      </a-space>
    </div>


    <a-card>
      <a-table
          :columns="columns"
          :data-source="filteredAdmins"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
      >

        <template #status="{ record }">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>


        <template #action="{ record }">
          <a-dropdown :trigger="['click']">
            <a-button type="text" size="small">
              <EllipsisOutlined />
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="editAdmin(record)">
                  <EditOutlined /> Редактировать
                </a-menu-item>
                <a-menu-item
                    @click="toggleStatus(record)"
                    :disabled="record.role === 'superadmin' && currentUser.role !== 'superadmin'"
                >
                  <SwapOutlined />
                  {{ record.status === 'active' ? 'Деактивировать' : 'Активировать' }}
                </a-menu-item>
                <a-menu-item @click="resetPassword(record)">
                  <KeyOutlined /> Сбросить пароль
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item
                    danger
                    @click="deleteAdmin(record)"
                    :disabled="record.role === 'superadmin'"
                >
                  <DeleteOutlined /> Удалить
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-table>
    </a-card>


    <a-empty
        v-if="filteredAdmins.length === 0"
        style="margin-top: 48px"
        description="Администраторы не найдены"
    >
      <template #image>
        <UserOutlined style="font-size: 48px; color: #999" />
      </template>
      <a-button type="primary" @click="showAddModal">
        Добавить нового администратора
      </a-button>
    </a-empty>


    <a-modal
        v-model:open="adminModalVisible"
        :title="editingAdmin ? 'Редактирование администратора' : 'Добавление администратора'"
        width="600px"
        @ok="handleSaveAdmin"
        @cancel="closeAdminModal"
    >
      <a-form
          ref="adminFormRef"
          :model="adminForm"
          :rules="adminFormRules"
          layout="vertical"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="ФИО" name="name" required>
              <a-input
                  v-model:value="adminForm.name"
                  placeholder="Алексей Петров"
              />
            </a-form-item>

            <a-form-item label="Email" name="email" required>
              <a-input
                  v-model:value="adminForm.email"
                  placeholder="alexey@itam-hackathon.ru"
                  type="email"
              />
            </a-form-item>

            <a-form-item label="Роль" name="role" required>
              <a-select
                  v-model:value="adminForm.role"
                  placeholder="Выберите роль"
                  style="width: 100%"
                  :options="roleOptions"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Пароль" :name="editingAdmin ? 'password_optional' : 'password'"
                         :required="!editingAdmin">
              <a-input-password
                  v-model:value="adminForm.password"
                  placeholder="Введите пароль"
                  :disabled="editingAdmin"
              />
              <div v-if="editingAdmin" style="color: #999; font-size: 12px; margin-top: 4px">
                Оставьте пустым, чтобы не менять пароль
              </div>
            </a-form-item>

            <a-form-item label="Телефон" name="phone">
              <a-input
                  v-model:value="adminForm.phone"
                  placeholder="+7 (999) 123-45-67"
              />
            </a-form-item>

            <a-form-item label="Статус" name="status">
              <a-select v-model:value="adminForm.status" style="width: 100%">
                <a-select-option value="active">Активен</a-select-option>
                <a-select-option value="inactive">Неактивен</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Примечания" name="notes">
          <a-textarea
              v-model:value="adminForm.notes"
              placeholder="Дополнительная информация..."
              :rows="2"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { TableProps } from 'ant-design-vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SwapOutlined,
  KeyOutlined,
  EllipsisOutlined,
  UserOutlined
} from '@ant-design/icons-vue'


interface Admin {
  id: string
  name: string
  email: string
  role: 'superadmin' | 'organizer' | 'moderator' | 'analyst'
  phone?: string
  status: 'active' | 'inactive'
  lastLogin?: string
  addedAt: string
  notes?: string
}

interface CurrentUser {
  role: string
  id: string
}


const loading = ref(false)
const searchQuery = ref('')
const adminModalVisible = ref(false)
const editingAdmin = ref<Admin | null>(null)
const adminFormRef = ref()


const currentUser = ref<CurrentUser>({
  role: 'superadmin',
  id: '1'
})


const admins = ref<Admin[]>([
  {
    id: '1',
    name: 'Алексей Петров',
    email: 'alexey@itam-hackathon.ru',
    role: 'superadmin',
    phone: '+7 (999) 123-45-67',
    status: 'active',
    lastLogin: '2024-06-10 14:30',
    addedAt: '2024-01-15',
    notes: 'Супер-админ, полный доступ'
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    email: 'maria@itam-hackathon.ru',
    role: 'organizer',
    phone: '+7 (999) 234-56-78',
    status: 'active',
    lastLogin: '2024-06-09 11:15',
    addedAt: '2024-03-20',
    notes: 'Организатор хакатонов'
  },
  {
    id: '3',
    name: 'Дмитрий Иванов',
    email: 'dmitry@itam-hackathon.ru',
    role: 'moderator',
    phone: '+7 (999) 345-67-89',
    status: 'active',
    lastLogin: '2024-06-08 16:45',
    addedAt: '2024-05-10',
    notes: 'Модератор участников'
  },
  {
    id: '4',
    name: 'Анна Козлова',
    email: 'anna@itam-hackathon.ru',
    role: 'analyst',
    phone: '+7 (999) 456-78-90',
    status: 'inactive',
    lastLogin: undefined,
    addedAt: '2024-06-01',
    notes: 'Аналитика и отчеты'
  }
])


const adminForm = reactive({
  name: '',
  email: '',
  role: 'organizer' as Admin['role'],
  password: '',
  phone: '',
  status: 'active' as Admin['status'],
  notes: ''
})

const adminFormRules = {
  name: [{ required: true, message: 'Введите имя администратора' }],
  email: [
    { required: true, message: 'Введите email' },
    { type: 'email', message: 'Некорректный email' }
  ],
  role: [{ required: true, message: 'Выберите роль' }],
  password: [
    {
      required: true,
      message: 'Введите пароль',
      trigger: 'blur'
    },
    {
      min: 6,
      message: 'Минимум 6 символов',
      trigger: 'blur'
    }
  ]
}


const roleOptions = [
  { label: 'Супер-админ', value: 'superadmin' },
  { label: 'Организатор', value: 'organizer' },
  { label: 'Модератор', value: 'moderator' },
  { label: 'Аналитик', value: 'analyst' }
]

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50']
})


const columns: TableProps['columns'] = [
  {
    title: 'ФИО',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    sorter: (a: Admin, b: Admin) => a.name.localeCompare(b.name)
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 250,
    ellipsis: true
  },
  {
    title: 'Роль',
    dataIndex: 'role',
    key: 'role',
    width: 150,
    render: (role: Admin['role']) => {
      const roleNames: Record<Admin['role'], string> = {
        superadmin: 'Супер-админ',
        organizer: 'Организатор',
        moderator: 'Модератор',
        analyst: 'Аналитик'
      }
      return roleNames[role] || role
    },
    filters: [
      { text: 'Супер-админ', value: 'superadmin' },
      { text: 'Организатор', value: 'organizer' },
      { text: 'Модератор', value: 'moderator' },
      { text: 'Аналитик', value: 'analyst' }
    ],
    onFilter: (value: string, record: Admin) => record.role === value
  },
  {
    title: 'Дата добавления',
    dataIndex: 'addedAt',
    key: 'addedAt',
    width: 150,
    sorter: (a: Admin, b: Admin) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
  },
  {
    title: 'Последний вход',
    dataIndex: 'lastLogin',
    key: 'lastLogin',
    width: 150,
    render: (lastLogin: string) => lastLogin || '—'
  },
  {
    title: 'Статус',
    key: 'status',
    slots: { customRender: 'status' },
    width: 120,
    filters: [
      { text: 'Активен', value: 'active' },
      { text: 'Неактивен', value: 'inactive' }
    ],
    onFilter: (value: string, record: Admin) => record.status === value
  },
  {
    title: 'Действия',
    key: 'action',
    slots: { customRender: 'action' },
    width: 80,
    fixed: 'right' as const
  }
]


const filteredAdmins = computed(() => {
  if (!searchQuery.value) return admins.value

  const query = searchQuery.value.toLowerCase()
  return admins.value.filter(admin =>
      admin.name.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query) ||
      admin.phone?.toLowerCase().includes(query)
  )
})


const handleSearch = () => {
  pagination.current = 1
}

const getStatusColor = (status: string) => {
  return status === 'active' ? 'green' : 'red'
}

const getStatusText = (status: string) => {
  return status === 'active' ? 'Активен' : 'Неактивен'
}

const showAddModal = () => {
  editingAdmin.value = null
  resetAdminForm()
  adminModalVisible.value = true
}

const editAdmin = (admin: Admin) => {
  editingAdmin.value = admin
  adminForm.name = admin.name
  adminForm.email = admin.email
  adminForm.role = admin.role
  adminForm.phone = admin.phone || ''
  adminForm.status = admin.status
  adminForm.notes = admin.notes || ''
  adminForm.password = '' // Пароль не показываем
  adminModalVisible.value = true
}

const closeAdminModal = () => {
  adminModalVisible.value = false
  editingAdmin.value = null
}

const resetAdminForm = () => {
  adminForm.name = ''
  adminForm.email = ''
  adminForm.role = 'organizer'
  adminForm.password = ''
  adminForm.phone = ''
  adminForm.status = 'active'
  adminForm.notes = ''
}

const handleSaveAdmin = async () => {
  try {
    await adminFormRef.value.validate()

    if (editingAdmin.value) {
      // Обновление
      const index = admins.value.findIndex(a => a.id === editingAdmin.value!.id)
      if (index !== -1) {
        const updatedAdmin = {
          ...admins.value[index],
          name: adminForm.name,
          email: adminForm.email,
          role: adminForm.role,
          phone: adminForm.phone,
          status: adminForm.status,
          notes: adminForm.notes
        }

        // Если введен новый пароль
        if (adminForm.password) {
          // Здесь логика обновления пароля
        }

        admins.value[index] = updatedAdmin
      }
      message.success('Администратор обновлен')
    } else {

      const newAdmin: Admin = {
        id: Date.now().toString(),
        name: adminForm.name,
        email: adminForm.email,
        role: adminForm.role,
        phone: adminForm.phone,
        status: adminForm.status,
        addedAt: new Date().toISOString().split('T')[0],
        notes: adminForm.notes
      }

      admins.value.unshift(newAdmin)
      message.success('Администратор добавлен')
    }

    adminModalVisible.value = false
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  }
}

const toggleStatus = (admin: Admin) => {
  const newStatus = admin.status === 'active' ? 'inactive' : 'active'

  if (admin.role === 'superadmin' && currentUser.value.role !== 'superadmin') {
    message.error('Только супер-админ может изменять статус супер-админа')
    return
  }

  Modal.confirm({
    title: newStatus === 'active' ? 'Активировать администратора?' : 'Деактивировать администратора?',
    content: newStatus === 'active'
        ? 'Администратор получит доступ к системе.'
        : 'Администратор потеряет доступ к системе.',
    onOk: () => {
      admin.status = newStatus
      message.success(`Статус изменен на "${getStatusText(newStatus)}"`)
    }
  })
}

const resetPassword = (admin: Admin) => {
  Modal.confirm({
    title: 'Сбросить пароль?',
    content: `Новый пароль будет отправлен на email: ${admin.email}`,
    okText: 'Сбросить',
    onOk: () => {
      message.success('Новый пароль отправлен на email')
    }
  })
}

const deleteAdmin = (admin: Admin) => {
  if (admin.role === 'superadmin') {
    message.error('Нельзя удалить супер-админа')
    return
  }

  Modal.confirm({
    title: 'Удалить администратора?',
    content: `Вы уверены, что хотите удалить ${admin.name}?`,
    okText: 'Удалить',
    okType: 'danger',
    cancelText: 'Отмена',
    onOk: () => {
      admins.value = admins.value.filter(a => a.id !== admin.id)
      message.success('Администратор удален')
    }
  })
}

onMounted(() => {
  pagination.total = admins.value.length
  // Здесь можно загрузить текущего пользователя из auth store
})
</script>

<style scoped>
.admins-page {
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