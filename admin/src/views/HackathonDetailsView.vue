<template>
  <div class="hackathon-details">
    <!-- Убрали большой хедер, оставили только кнопки наверху -->
    <div class="page-header">
      <a-button
          type="text"
          @click="$router.push('/')"
          class="back-button"
      >
        <arrow-left-outlined />
        Назад
      </a-button>

      <div class="header-actions">
        <a-button @click="shareHackathon" class="share-btn">
          <share-alt-outlined />
          Поделиться
        </a-button>
        <a-button
            type="primary"
            @click="goToEdit"
            class="edit-btn"
        >
          <edit-outlined />
          Редактировать
        </a-button>
      </div>
    </div>

    <!-- Основной контент -->
    <div class="content-wrapper">
      <div class="main-content">
        <!-- Заголовок и статус -->
        <div class="hackathon-header">
          <div class="status-badge" :class="hackathon.status">
            {{ getStatusText(hackathon.status) }}
          </div>
          <h1>{{ hackathon.name }}</h1>
          <div class="dates">
            <calendar-outlined />
            <span>{{ formatDates(hackathon.startDate, hackathon.endDate) }}</span>
          </div>
        </div>

        <!-- Логотип (если есть) -->
        <div v-if="hackathon.image" class="logo-section">
          <img
              :src="hackathon.image"
              :alt="hackathon.name"
              class="hackathon-logo"
          />
        </div>

        <!-- Описание -->
        <div class="section-card">
          <h2 class="section-title">Описание</h2>
          <div class="description-text">
            {{ hackathon.description }}
          </div>
        </div>

        <!-- Детали хакатона -->
        <div class="details-grid">
          <!-- Место проведения -->
          <div class="detail-card" v-if="hackathon.location">
            <div class="detail-icon">
              <environment-outlined />
            </div>
            <div class="detail-content">
              <h3>Место проведения</h3>
              <div class="detail-value">
                <span v-if="hackathon.location === 'online'">Онлайн</span>
                <span v-else-if="hackathon.location === 'offline' && hackathon.address">
                  {{ hackathon.address }}
                </span>
                <span v-else-if="hackathon.location === 'hybrid' && hackathon.address">
                  Гибрид · {{ hackathon.address }}
                </span>
              </div>
            </div>
          </div>

          <!-- Даты проведения -->
          <div class="detail-card">
            <div class="detail-icon">
              <clock-circle-outlined />
            </div>
            <div class="detail-content">
              <h3>Даты проведения</h3>
              <div class="detail-value">
                <div><strong>Начало:</strong> {{ formatDateTime(hackathon.startDate) }}</div>
                <div><strong>Окончание:</strong> {{ formatDateTime(hackathon.endDate) }}</div>
              </div>
            </div>
          </div>

          <!-- Призовой фонд -->
          <div class="detail-card" v-if="hackathon.prize">
            <div class="detail-icon">
              <trophy-outlined />
            </div>
            <div class="detail-content">
              <h3>Призовой фонд</h3>
              <div class="detail-value prize">{{ hackathon.prize }}</div>
            </div>
          </div>

          <!-- Статистика -->
          <div class="detail-card">
            <div class="detail-icon">
              <team-outlined />
            </div>
            <div class="detail-content">
              <h3>Участие</h3>
              <div class="detail-value">
                <div>{{ hackathon.participants || 0 }} участников</div>
                <div>{{ hackathon.teams || 0 }} команд</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Направления -->
        <div class="section-card">
          <h2 class="section-title">Направления (треки)</h2>
          <div class="tracks-container">
            <div
                v-for="track in hackathon.tracks"
                :key="track"
                class="track-tag"
            >
              {{ track }}
            </div>
          </div>
        </div>
      </div>

      <!-- Боковая панель -->
      <div class="sidebar">
        <!-- Управление -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">Управление</h3>
          <div class="management-buttons">
            <a-button block @click="goToParticipants" class="management-btn">
              <team-outlined />
              Участники ({{ hackathon.participants || 0 }})
            </a-button>
            <a-button block @click="goToTeams" class="management-btn">
              <group-outlined />
              Команды ({{ hackathon.teams || 0 }})
            </a-button>
            <a-button block @click="exportData" class="management-btn">
              <export-outlined />
              Экспорт данных
            </a-button>
          </div>
        </div>

        <!-- Правила участия -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">Правила участия</h3>
          <div class="rules-list">
            <div class="rule-item">
              <div class="rule-label">Размер команды</div>
              <div class="rule-value">{{ hackathon.maxTeamSize }} чел.</div>
            </div>
            <div class="rule-item">
              <div class="rule-label">Статус</div>
              <div class="rule-value status-value" :class="hackathon.status">
                {{ getStatusText(hackathon.status) }}
              </div>
            </div>
            <div class="rule-item">
              <div class="rule-label">Зарегистрировано</div>
              <div class="rule-value">{{ hackathon.participants || 0 }} участников</div>
            </div>
          </div>
        </div>

        <!-- Организаторы -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">Организаторы</h3>
          <div class="organizers-list">
            <div v-for="organizer in organizers" :key="organizer.id" class="organizer-item">
              <div class="organizer-avatar">
                <img :src="organizer.avatar" :alt="organizer.name" v-if="organizer.avatar">
                <div v-else class="avatar-placeholder">
                  {{ organizer.name.charAt(0) }}
                </div>
              </div>
              <div class="organizer-info">
                <div class="organizer-name">{{ organizer.name }}</div>
                <div class="organizer-role">{{ organizer.role }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Кнопка удаления (осталась внизу) -->
        <div class="sidebar-card actions-card">
          <a-button
              block
              danger
              @click="deleteHackathon"
              class="delete-btn"
          >
            <delete-outlined />
            Удалить хакатон
          </a-button>
        </div>
      </div>
    </div>

    <!-- Модалка удаления -->
    <a-modal
        v-model:open="deleteModalVisible"
        title="Удалить хакатон?"
        @ok="confirmDelete"
        ok-text="Удалить"
        cancel-text="Отмена"
        :ok-button-props="{ danger: true }"
        class="delete-modal"
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
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons-vue'
import { useHackathonsStore } from '../stores/hackathons'
import { useAuthStore } from '../stores/auth'
import type { Hackathon } from '../stores/hackathons'

const route = useRoute()
const router = useRouter()
const hackathonsStore = useHackathonsStore()
const authStore = useAuthStore()

const hackathon = ref<Hackathon>({
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
  { id: '1', name: 'ITAM Community', role: 'Организатор', avatar: 'https://via.placeholder.com/40/291360/ffffff?text=IT' },
  { id: '2', name: 'Алексей Петров', role: 'Координатор', avatar: 'https://via.placeholder.com/40/8156FF/ffffff?text=AP' }
])

onMounted(() => {
  loadHackathon()
})

const loadHackathon = async () => {
  const hackathonId = route.params.id as string

  try {
    const data = await hackathonsStore.fetchHackathon(hackathonId)
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
    await hackathonsStore.deleteHackathon(hackathon.value.id)
    message.success('Хакатон удален')
    deleteModalVisible.value = false
    router.push('/')
  } catch (error) {
    message.error('Ошибка при удалении')
  }
}
</script>

<style scoped>
/* Основные стили */
.hackathon-details {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 24px;
}

/* Простой хедер с кнопками */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.back-button {
  color: #291360 !important;
  padding: 8px 0;
}

.back-button:hover {
  color: #8156FF !important;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.share-btn {
  background: #ECE3F2 !important;
  border-color: #ECE3F2 !important;
  color: #291360 !important;
}

.share-btn:hover {
  background: #D6C6E3 !important;
  border-color: #D6C6E3 !important;
}

.edit-btn {
  background: #68507E !important;
  border-color: #68507E !important;
  color: white !important;
}

.edit-btn:hover {
  background: #8156FF !important;
  border-color: #8156FF !important;
}

/* Заголовок хакатона */
.hackathon-header {
  margin-bottom: 32px;
  text-align: center;
}

.status-badge {
  display: inline-block;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

.status-badge.upcoming {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
  border: 1px solid rgba(82, 196, 26, 0.2);
}

.status-badge.active {
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
  border: 1px solid rgba(24, 144, 255, 0.2);
}

.status-badge.finished {
  background: rgba(250, 140, 22, 0.1);
  color: #fa8c16;
  border: 1px solid rgba(250, 140, 22, 0.2);
}

.hackathon-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #1a1a1a;
}

.dates {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;
  font-size: 18px;
}

/* Основной контент */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
}

/* Логотип */
.logo-section {
  margin-bottom: 32px;
}

.hackathon-logo {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(41, 19, 96, 0.1);
}

/* Карточки секций */
.section-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 24px;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(41, 19, 96, 0.05);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #291360;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f2f5;
}

.description-text {
  color: #333;
  line-height: 1.7;
  font-size: 16px;
  white-space: pre-line;
}

/* Детали в сетке */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.detail-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e9ecef;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  transition: all 0.3s ease;
}

.detail-card:hover {
  border-color: #8156FF;
  box-shadow: 0 8px 24px rgba(129, 86, 255, 0.1);
}

.detail-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(129, 86, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #8156FF;
  flex-shrink: 0;
}

.detail-content {
  flex: 1;
}

.detail-content h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.detail-value {
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

.detail-value.prize {
  color: #fa8c16;
  font-size: 22px;
}

/* Треки */
.tracks-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.track-tag {
  background: rgba(129, 86, 255, 0.1);
  color: #291360;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 15px;
  border: 1px solid rgba(129, 86, 255, 0.2);
}

/* Боковая панель */
.sidebar-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e9ecef;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(41, 19, 96, 0.05);
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: #291360;
  margin: 0 0 20px 0;
}

/* Кнопки управления */
.management-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.management-btn {
  height: 48px;
  border-radius: 12px;
  border: 2px solid #ECE3F2 !important;
  background: #ECE3F2 !important;
  color: #291360 !important;
  font-weight: 500;
  text-align: left;
  padding: 0 20px;
}

.management-btn:hover {
  background: #D6C6E3 !important;
  border-color: #D6C6E3 !important;
  transform: translateY(-2px);
}

/* Правила */
.rules-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.rule-label {
  color: #666;
  font-size: 14px;
}

.rule-value {
  font-weight: 600;
  color: #291360;
}

.rule-value.status-value {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  text-transform: uppercase;
}

.rule-value.status-value.upcoming {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.rule-value.status-value.active {
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.rule-value.status-value.finished {
  background: rgba(250, 140, 22, 0.1);
  color: #fa8c16;
}

/* Организаторы */
.organizers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.organizer-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.organizer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.organizer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #291360;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
}

.organizer-info {
  flex: 1;
}

.organizer-name {
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.organizer-role {
  font-size: 12px;
  color: #666;
}

/* Кнопка удаления */
.actions-card {
  border: 2px dashed #ffccc7;
  background: #fff2f0;
}

.delete-btn {
  height: 48px;
  border-radius: 12px;
  border: 2px solid #ffccc7 !important;
  color: #ff4d4f !important;
  font-weight: 600;
}

.delete-btn:hover {
  background: #ff4d4f !important;
  color: white !important;
  border-color: #ff4d4f !important;
}

/* Модалка */
.delete-modal :deep(.ant-modal-content) {
  border-radius: 16px;
}

.delete-modal :deep(.ant-modal-header) {
  border-radius: 16px 16px 0 0;
  background: #fff2f0;
}

.delete-modal :deep(.ant-modal-title) {
  color: #ff4d4f;
  font-weight: 600;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hackathon-details {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .hackathon-header h1 {
    font-size: 24px;
  }

  .section-card,
  .detail-card,
  .sidebar-card {
    padding: 20px;
  }
}
</style>