<template>
  <div
      class="hackathon-card-modern"
      @click="$emit('click')"
  >
    <!-- Верхний блок (темно-синий) -->
    <div class="card-top" :class="statusClass">
      <!-- Кнопки действий -->
      <div class="action-buttons">
        <a-button
            type="text"
            size="small"
            @click.stop="$emit('edit')"
            class="edit-btn"
        >
          <template #icon><EditOutlined /></template>
        </a-button>
        <a-button
            type="text"
            danger
            size="small"
            @click.stop="$emit('delete')"
            class="delete-btn"
        >
          <template #icon><DeleteOutlined /></template>
        </a-button>
      </div>

      <!-- Статус -->
      <div class="status-indicator">
        {{ statusText }}
      </div>

      <!-- Название и даты -->
      <div class="top-content">
        <h3 class="hackathon-title">{{ hackathon.name }}</h3>
        <div class="date-range">
          <CalendarOutlined />
          <span>{{ formatDate(hackathon.startDate) }} – {{ formatDate(hackathon.endDate) }}</span>
        </div>
      </div>
    </div>

    <!-- Средний блок (белый) -->
    <div class="card-middle">
      <!-- Описание -->
      <p class="description">{{ hackathon.description }}</p>

      <!-- Технологии -->
      <div class="tech-stack">
        <a-tag
            v-for="track in hackathon.tracks.slice(0, 3)"
            :key="track"
            class="tech-tag"
            :color="getTagColor(track)"
        >
          {{ track }}
        </a-tag>
        <span v-if="hackathon.tracks.length > 3" class="more-tags">
          +{{ hackathon.tracks.length - 3 }}
        </span>
      </div>
    </div>

    <!-- Нижний блок (серый) -->
    <div class="card-bottom">
      <!-- Статистика -->
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ formatPrize(hackathon.prize || 0) }}</div>
          <div class="stat-label">призовой фонд</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ hackathon.teams || 0 }}</div>
          <div class="stat-label">команд</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ hackathon.duration || '48ч' }}</div>
          <div class="stat-label">длительность</div>
        </div>
      </div>

      <!-- Статус регистрации -->
      <div class="registration-status" v-if="isRegistrationOpen">
        <CheckCircleOutlined />
        <span class="status-text">регистрация открыта</span>
      </div>
      <div class="registration-status closed" v-else>
        <CloseCircleOutlined />
        <span class="status-text">регистрация закрыта</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue'

const props = defineProps<{
  hackathon: {
    id: string
    name: string
    description: string
    status: 'upcoming' | 'active' | 'finished'
    startDate: string
    endDate: string
    location?: string
    tracks: string[]
    prize?: number
    teams?: number
    duration?: string
    registrationDeadline?: string
    registrationOpen?: boolean
  }
}>()

defineEmits(['click', 'edit', 'delete'])

// Текст статуса
const statusText = computed(() => {
  const map = {
    upcoming: 'ПРЕДСТОЯЩИЙ',
    active: 'ИДЕТ СЕЙЧАС',
    finished: 'ЗАВЕРШЕН'
  }
  return map[props.hackathon.status] || 'ПРЕДСТОЯЩИЙ'
})

// Форматирование даты
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long'
  })
}

// Цвета для тегов
const getTagColor = (track: string) => {
  const colors = ['blue', 'green', 'orange', 'purple', 'cyan']
  const index = track.length % colors.length
  return colors[index]
}

// Форматирование призового фонда
const formatPrize = (prize: number) => {
  if (prize >= 1000000) {
    return (prize / 1000000).toFixed(1).replace('.0', '') + ' млн ₽'
  }
  if (prize >= 1000) {
    return (prize / 1000).toFixed(0) + ' тыс ₽'
  }
  return prize.toLocaleString('ru-RU') + ' ₽'
}

// Регистрация открыта
const isRegistrationOpen = computed(() => {
  return props.hackathon.registrationOpen ||
      (props.hackathon.status === 'upcoming' || props.hackathon.status === 'active')
})
</script>

<style scoped>
.hackathon-card-modern {
  background: white;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.hackathon-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(41, 19, 96, 0.1);
}

/* Верхний блок - темно-синий */
.card-top {
  background: #243861;
  color: white;
  padding: 20px;
  position: relative;
  min-height: 120px;
}

/* Цвета для разных статусов */
.card-top.status-upcoming {
  background: linear-gradient(135deg, #291360 0%, #4A1E8B 100%);
}

.card-top.status-active {
  background: linear-gradient(135deg, #1d6b3a 0%, #2dcc98 100%);
}

.card-top.status-finished {
  background: linear-gradient(135deg, #7a4b16 0%, #fa8c16 100%);
}

/* Кнопки действий */
.action-buttons {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
  z-index: 10;
}

.edit-btn, .delete-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.edit-btn:hover {
  background: rgba(24, 144, 255, 0.3);
  border-color: rgba(24, 144, 255, 0.5);
}

.delete-btn:hover {
  background: rgba(255, 77, 79, 0.3);
  border-color: rgba(255, 77, 79, 0.5);
}

/* Статус */
.status-indicator {
  position: absolute;
  top: 16px;
  left: 20px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Контент верхнего блока */
.top-content {
  margin-top: 40px;
}

.hackathon-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
  color: white;
  line-height: 1.3;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

/* Средний блок - белый */
.card-middle {
  padding: 20px;
  flex: 1;
}

.description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Технологии */
.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.tech-tag {
  border-radius: 6px;
  border: none;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
}

.more-tags {
  color: #999;
  font-size: 12px;
  align-self: center;
}

/* Нижний блок - серый */
.card-bottom {
  background: #f8f9fa;
  padding: 20px;
  border-top: 1px solid #e9ecef;
}

/* Статистика */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #353232;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  text-transform: lowercase;
}

/* Статус регистрации */
.registration-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #52c41a;
  font-size: 14px;
  font-weight: 500;
}

.registration-status.closed {
  color: #ff4d4f;
}

.status-text {
  font-weight: 500;
}

/* Адаптивность */
@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .card-top,
  .card-middle,
  .card-bottom {
    padding: 16px;
  }
}
</style>