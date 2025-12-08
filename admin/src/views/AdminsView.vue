<template>
  <div class="admins-page">
    <!-- Заголовок и поиск -->
    <div class="page-header">
      <h1>Администраторы</h1>

      <div class="header-actions">
        <a-input-search
            placeholder="Поиск по имени или email..."
            style="width: 300px"
            @search="handleSearch"
            v-model:value="searchQuery"
            allow-clear
            class="admin-search"
        />

        <a-button
            type="primary"
            @click="showAddModal"
            size="large"
            class="add-admin-btn"
        >
          <template #icon><PlusOutlined /></template>
          Добавить администратора
        </a-button>
      </div>
    </div>

    <!-- Таблица администраторов -->
    <div class="admins-table-wrapper">
      <a-card class="admins-card">
        <a-table
            :columns="columns"
            :data-source="filteredAdmins"
            :loading="loading"
            :pagination="pagination"
            row-key="id"
            class="admins-table"
        >
          <!-- Слот для статуса -->
          <template #status="{ record }">
            <span class="status-badge" :class="`status-${record.status}`">
              {{ getStatusText(record.status) }}
            </span>
          </template>

          <!-- Слот для действий (три точки) -->
          <template #action="{ record }">
            <a-dropdown :trigger="['click']" class="actions-dropdown">
              <button class="actions-btn">
                <EllipsisOutlined />
              </button>
              <template #overlay>
                <div class="actions-menu">
                  <button class="action-item" @click="editAdmin(record)">
                    <EditOutlined />
                    <span>Редактировать</span>
                  </button>
                  <button
                      class="action-item"
                      @click="toggleStatus(record)"
                      :disabled="record.role === 'superadmin' && currentUser.role !== 'superadmin'"
                  >
                    <SwapOutlined />
                    <span>{{ record.status === 'active' ? 'Деактивировать' : 'Активировать' }}</span>
                  </button>
                  <button class="action-item" @click="resetPassword(record)">
                    <KeyOutlined />
                    <span>Сбросить пароль</span>
                  </button>
                  <div class="actions-divider"></div>
                  <button
                      class="action-item action-item--danger"
                      @click="deleteAdmin(record)"
                      :disabled="record.role === 'superadmin'"
                  >
                    <DeleteOutlined />
                    <span>Удалить</span>
                  </button>
                </div>
              </template>
            </a-dropdown>
          </template>
        </a-table>
      </a-card>
    </div>

    <!-- Сообщение если нет администраторов -->
    <a-empty
        v-if="filteredAdmins.length === 0"
        class="empty-state"
        description="Администраторы не найдены"
    >
      <template #image>
        <UserOutlined class="empty-icon" />
      </template>
      <a-button type="primary" @click="showAddModal" class="add-admin-btn">
        Добавить нового администратора
      </a-button>
    </a-empty>

    <!-- Модальное окно добавления/редактирования администратора -->
    <a-modal
        v-model:open="adminModalVisible"
        :title="editingAdmin ? 'Редактирование администратора' : 'Добавление администратора'"
        width="600px"
        @ok="handleSaveAdmin"
        @cancel="closeAdminModal"
        class="admin-modal"
        wrap-class-name="admin-modal-wrapper"
    >
      <div class="modal-header-line"></div>

      <a-form
          ref="adminFormRef"
          :model="adminForm"
          :rules="adminFormRules"
          layout="vertical"
          class="admin-form"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="ФИО" name="name" required class="form-item--purple">
              <a-input
                  v-model:value="adminForm.name"
                  placeholder="Алексей Петров"
                  class="purple-input"
              />
            </a-form-item>

            <a-form-item label="Email" name="email" required class="form-item--purple">
              <a-input
                  v-model:value="adminForm.email"
                  placeholder="alexey@itam-hackathon.ru"
                  type="email"
                  class="purple-input"
              />
            </a-form-item>

            <a-form-item label="Роль" name="role" required class="form-item--purple">
              <a-select
                  v-model:value="adminForm.role"
                  placeholder="Выберите роль"
                  class="purple-select"
                  :options="roleOptions"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
                :label="editingAdmin ? 'Пароль' : 'Пароль*'"
                :name="editingAdmin ? 'password_optional' : 'password'"
                :required="!editingAdmin"
                class="form-item--purple"
            >
              <a-input-password
                  v-model:value="adminForm.password"
                  placeholder="Введите пароль"
                  :disabled="editingAdmin"
                  class="purple-input"
              />
              <div v-if="editingAdmin" class="password-hint">
                Оставьте пустым, чтобы не менять пароль
              </div>
            </a-form-item>

            <a-form-item label="Телефон" name="phone" class="form-item--purple">
              <a-input
                  v-model:value="adminForm.phone"
                  placeholder="+7 (999) 123-45-67"
                  class="purple-input"
              />
            </a-form-item>

            <a-form-item label="Статус" name="status" class="form-item--purple">
              <a-select v-model:value="adminForm.status" class="purple-select">
                <a-select-option value="active">Активен</a-select-option>
                <a-select-option value="inactive">Неактивен</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Примечания" name="notes" class="form-item--purple">
          <a-textarea
              v-model:value="adminForm.notes"
              placeholder="Дополнительная информация..."
              :rows="2"
              class="purple-textarea"
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

// Все остальное остается БЕЗ ИЗМЕНЕНИЙ!
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
  adminForm.password = ''
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

        if (adminForm.password) {
          // логика обновления пароля
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
})
</script>

<style scoped>
.admins-page {
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Кнопка "Добавить администратора" */
.add-admin-btn {
  background: #68507E;
  border: none !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  letter-spacing: 0.05em;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(104, 80, 126, 0.3) !important;
}

.add-admin-btn:hover {
  background: linear-gradient(135deg, #8A6FB0, #B298C5) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 24px rgba(104, 80, 126, 0.4) !important;
}

.add-admin-btn:active {
  transform: translateY(0) !important;
}

/* Поиск */
.admin-search :deep(.ant-input) {
  border: 2px solid #E5E7EB !important;
  border-radius: 10px !important;
  transition: all 0.3s ease !important;
}

.admin-search :deep(.ant-input:hover) {
  border-color: #B298C5 !important;
}

.admin-search :deep(.ant-input:focus) {
  border-color: #68507E !important;
  box-shadow: 0 0 0 2px rgba(104, 80, 126, 0.1) !important;
}

.admin-search :deep(.ant-input-search-button) {
  background: #68507E !important;
  border-color: #68507E !important;
  border-radius: 0 10px 10px 0 !important;
}

.admin-search :deep(.ant-input-search-button:hover) {
  background: #8A6FB0 !important;
  border-color: #8A6FB0 !important;
}

/* Карточка с таблицей */
.admins-card {
  border: 2px solid #E5E7EB !important;
  border-radius: 16px !important;
  overflow: hidden;
}

.admins-table-wrapper {
  margin-bottom: 32px;
}

/* Бейджи статусов */
.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-active {
  background: #D1FAE5;

}

.status-inactive {
  background: #FEE2E2;

}

/* Кнопка с тремя точками */
.actions-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F9F5FF;
  border: 2px solid #D1C4E9;
  border-radius: 10px;
  color: #68507E;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 18px;
}

.actions-btn:hover {
  background: #68507E;
  color: white;
  border-color: #68507E;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(104, 80, 126, 0.2);
}

/* Меню действий */
.actions-menu {
  background: white;
  border-radius: 12px;
  border: 2px solid #68507E;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 8px;
  min-width: 220px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: #111827;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.action-item:hover {
  background: #F9F5FF;
  color: #68507E;
  transform: translateX(4px);
}

.action-item--danger {
  color: #EF4444;
}

.action-item--danger:hover {
  background: #FEE2E2;
  color: #DC2626;
}

.action-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.action-item:disabled:hover {
  background: transparent;
  color: #111827;
}

.actions-divider {
  height: 1px;
  background: #E5E7EB;
  margin: 8px 0;
}

.action-item :deep(.anticon) {
  font-size: 16px;
  width: 20px;
}

/* Сообщение если нет администраторов */
.empty-state {
  margin-top: 48px;
  padding: 60px 24px;
  background: #F9F5FF;
  border-radius: 16px;
  border: 2px dashed #D1C4E9;
}

.empty-icon {
  font-size: 64px;
  color: #B298C5;
  margin-bottom: 20px;
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

  .admins-table {
    overflow-x: auto;
  }
}
</style>

<style>
/* Стили для таблицы */
.admins-table .ant-table {
  border-radius: 12px;
}

.admins-table .ant-table-thead > tr > th {
  background: #68507E !important;
  color: white !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 13px;
  border-bottom: none !important;
  padding: 16px !important;
}

.admins-table .ant-table-thead > tr > th:first-child {
  border-radius: 12px 0 0 0 !important;
}

.admins-table .ant-table-thead > tr > th:last-child {
  border-radius: 0 12px 0 0 !important;
}

.admins-table .ant-table-tbody > tr > td {
  padding: 16px !important;
  border-bottom: 1px solid #F3F4F6 !important;
  color: #374151;
  font-weight: 500;
}

.admins-table .ant-table-tbody > tr:hover > td {
  background: #F9F5FF !important;
}

.admins-table .ant-table-tbody > tr:nth-child(even) {
  background: #F8FAFC;
}

.admins-table .ant-table-tbody > tr:nth-child(even):hover > td {
  background: #F9F5FF !important;
}

/* Фильтры таблицы */
.admins-table .ant-table-filter-trigger {
  color: rgba(255, 255, 255, 0.8) !important;
}

.admins-table .ant-table-filter-trigger:hover {
  color: white !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

/* Пагинация */
.admins-table .ant-pagination-item {
  border: 2px solid #E5E7EB !important;
  border-radius: 8px !important;
  font-weight: 600;
}

.admins-table .ant-pagination-item:hover {
  border-color: #B298C5 !important;
  color: #68507E;
}

.admins-table .ant-pagination-item-active {
  background: #68507E !important;
  border-color: #68507E !important;
  color: white !important;
}

.admins-table .ant-pagination-item-active:hover {
  background: #8A6FB0 !important;
  border-color: #8A6FB0 !important;
}

.admins-table .ant-pagination-prev .ant-pagination-item-link,
.admins-table .ant-pagination-next .ant-pagination-item-link {
  border: 2px solid #E5E7EB !important;
  border-radius: 8px !important;
}

.admins-table .ant-pagination-prev .ant-pagination-item-link:hover,
.admins-table .ant-pagination-next .ant-pagination-item-link:hover {
  border-color: #B298C5 !important;
  color: #68507E;
}

/* Модальное окно */
.admin-modal-wrapper .ant-modal {
  border-radius: 20px;
  overflow: hidden;
}

.admin-modal .ant-modal-content {
  border-radius: 20px;
  border: 2px solid #68507E;
  overflow: hidden;
}

.admin-modal .ant-modal-header {
  background: #68507E;
  border-radius: 18px 18px 0 0;
  padding: 24px;
  margin-bottom: 0;
}

.admin-modal .ant-modal-title {
  color: white;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
}

.admin-modal .ant-modal-close {
  color: white;
}

.admin-modal .ant-modal-close:hover {
  color: #B298C5;
}

.admin-modal .ant-modal-body {
  padding: 0 32px 32px 32px;
}

/* Линия под заголовком */
.modal-header-line {
  height: 4px;
  background: linear-gradient(90deg, #68507E, #B298C5);
  margin-bottom: 32px;
  border-radius: 2px;
}

/* Форма */
.admin-form {
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

.purple-select :deep(.ant-select-selector) {
  border-radius: 10px !important;
}

/* Подсказка для пароля */
.password-hint {
  color: #6B7280;
  font-size: 12px;
  margin-top: 6px;
  font-style: italic;
}

/* Кнопки в модалке */
.admin-modal .ant-modal-footer {
  padding: 20px 32px;
  border-top: 1px solid #E5E7EB;
}

.admin-modal .ant-btn-default {
  border: 2px solid #E5E7EB !important;
  color: #6B7280 !important;
  border-radius: 10px !important;
  font-weight: 600;
  padding: 8px 24px;
  height: 44px;
}

.admin-modal .ant-btn-primary {
  background: linear-gradient(135deg, #68507E, #8A6FB0) !important;
  border: none !important;
  border-radius: 10px !important;
  font-weight: 600;
  padding: 8px 24px;
  height: 44px;
  transition: all 0.3s ease !important;
}

.admin-modal .ant-btn-primary:hover {
  background: linear-gradient(135deg, #8A6FB0, #B298C5) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(104, 80, 126, 0.3);
}

.admin-modal .ant-btn-primary:active {
  transform: translateY(0);
}
</style>