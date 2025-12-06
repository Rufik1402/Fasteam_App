<template>
  <a-card
      hoverable
      class="hackathon-card"
      @click="$emit('click')"
  >

    <div class="status-badge" :class="statusClass">
      {{ statusText }}
    </div>

    <template #cover>
      <img
          :alt="hackathon.name"
          :src="hackathon.image || 'https://via.placeholder.com/300x150/001529/ffffff?text=Hackathon'"
          style="height: 150px; object-fit: cover"
      />
    </template>

    <!-- Контент карточки -->
    <a-card-meta :title="hackathon.name">
      <template #description>
        <p class="description">{{ hackathon.description }}</p>


        <div class="dates">
          <calendar-outlined />
          <span>{{ formatDate(hackathon.startDate) }} – {{ formatDate(hackathon.endDate) }}</span>
        </div>

        <div class="location" v-if="hackathon.location">
          <EnvironmentOutlined />
          <span v-if="hackathon.location === 'online'">Онлайн</span>
          <span v-else-if="hackathon.location === 'offline' && hackathon.address">
    {{ hackathon.address }}
  </span>
          <span v-else-if="hackathon.location === 'hybrid' && hackathon.address">
    Гибрид · {{ hackathon.address }}
  </span>
          <span v-else>{{ hackathon.location }}</span>
        </div>



        <div class="tracks">
          <a-tag
              v-for="track in hackathon.tracks.slice(0, 2)"
              :key="track"
              color="blue"
              size="small"
          >
            {{ track }}
          </a-tag>
          <a-tag v-if="hackathon.tracks.length > 2" size="small">
            +{{ hackathon.tracks.length - 2 }}
          </a-tag>
        </div>



      </template>
    </a-card-meta>

    <!-- Кнопки действий -->
    <template #actions>
      <a-tooltip title="Редактировать">
        <edit-outlined @click.stop="$emit('edit')" />
      </a-tooltip>
      <a-tooltip title="Удалить">
        <delete-outlined
            @click.stop="$emit('delete')"
            style="color: #ff4d4f"
        />
      </a-tooltip>
    </template>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import {
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined
} from '@ant-design/icons-vue'

const props = defineProps<{
  hackathon: {
    id: string
    name: string
    description: string
    image?: string
    status: 'upcoming' | 'active' | 'finished'
    startDate: string
    endDate: string
    participants: number
    teams: number
    tracks: string[]
  }
}>()

defineEmits(['click', 'view', 'edit', 'delete'])


const statusText = computed(() => {
  const map = {
    upcoming: 'Предстоящий',
    active: 'Идет сейчас',
    finished: 'Завершен'
  }
  return map[props.hackathon.status]
})

// Класс для стилей статуса
const statusClass = computed(() => `status-${props.hackathon.status}`)

// Форматирование даты
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short'
  })
}
</script>

<style scoped>
.hackathon-card {
  position: relative;
  height: 100%;
  cursor: pointer;
  transition: transform 0.2s;
}

.hackathon-card:hover {
  transform: translateY(-4px);
}

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  z-index: 1;
}

.status-upcoming {
  background: #1890ff;
  color: white;
}

.status-active {
  background: #52c41a;
  color: white;
}

.status-finished {
  background: #fa8c16;
  color: white;
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
  color: #666;
  font-size: 14px;
}

.dates {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #999;
  font-size: 13px;
  margin-bottom: 12px;
}

.location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 13px;
  margin-bottom: 8px;
}

.tracks {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 12px;
}

.stats {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 13px;
}

:deep(.ant-card-actions) {
  border-top: 1px solid #f0f0f0;
}

:deep(.ant-card-actions > li) {
  margin: 8px 0;
}
</style>