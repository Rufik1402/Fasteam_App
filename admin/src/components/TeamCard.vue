<template>
  <div class="team-card team-card--org">
    <!-- Блок 1: Верхний (тёмно-изумрудный) -->
    <div class="team-card__top-section">
      <h2 class="team-card__name">{{ formattedName }}</h2>
      <div class="team-card__hackathon">
        {{ team.hackathonName }}
      </div>
    </div>

    <!-- Блок 2: Средний (белый) -->
    <div class="team-card__middle-section">
      <!-- Капитан -->
      <div class="team-card__info-row">
        <span class="team-card__label">КАПИТАН:</span>
        <span class="team-card__value">@{{ team.captainUsername }}</span>
      </div>

      <!-- Участники -->
      <div class="team-card__info-row">
        <span class="team-card__label">УЧАСТНИКИ</span>
        <div class="team-card__members-info">
          <span class="team-card__members-count">
            {{ team.members.length }}/{{ team.maxSize }}
          </span>
          <span class="team-card__status-badge" :class="statusClass">
            {{ statusText }}
          </span>
        </div>
      </div>

      <div class="team-card__divider"></div>

      <!-- Текущие роли -->
      <div class="team-card__section">
        <h3 class="team-card__section-title">ТЕКУЩИЕ РОЛИ:</h3>
        <div class="team-card__roles">
          <span
              v-for="role in team.existingRoles.slice(0, 4)"
              :key="`existing-${role}`"
              class="team-card__role team-card__role--existing"
          >
            {{ role }}
          </span>
          <span
              v-if="team.existingRoles.length === 0"
              class="team-card__role team-card__role--empty"
          >
            Нет указанных ролей
          </span>
        </div>
      </div>

      <!-- Ищем роли -->
      <div v-if="team.neededRoles.length > 0" class="team-card__section">
        <h3 class="team-card__section-title">ИЩЕМ РОЛИ:</h3>
        <div class="team-card__roles">
          <span
              v-for="role in team.neededRoles.slice(0, 3)"
              :key="`needed-${role}`"
              class="team-card__role team-card__role--needed"
          >
            {{ role }}
          </span>
        </div>
      </div>

      <!-- Навыки -->
      <div class="team-card__section">
        <h3 class="team-card__section-title">НАВЫКИ:</h3>
        <div class="team-card__skills">
          <span
              v-for="skill in team.skills.slice(0, 5)"
              :key="skill"
              class="team-card__skill"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Дата создания -->
      <div class="team-card__meta">
        <span class="team-card__date">Создана: {{ formattedDate }}</span>
      </div>
    </div>

    <!-- Блок 3: Нижний (серый) -->
    <div class="team-card__bottom-section">
      <!-- Кнопки действий организатора -->
      <div class="team-card__actions">
        <button
            class="team-card__action-btn team-card__action-btn--view"
            @click.stop="$emit('view')"
            title="Подробнее"
        >
          <EyeOutlined />
          <span>Подробнее</span>
        </button>

        <button
            class="team-card__action-btn team-card__action-btn--edit"
            @click.stop="$emit('edit')"
            title="Редактировать"
        >
          <EditOutlined />
          <span>Изменить</span>
        </button>

        <button
            class="team-card__action-btn team-card__action-btn--delete"
            @click.stop="$emit('delete')"
            title="Удалить"
        >
          <DeleteOutlined />
          <span>Удалить</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'

interface Props {
  team: {
    id: string
    name: string
    hackathonName: string
    captainName: string
    captainUsername: string
    members: Array<{ id: string; name: string; role: string }>
    maxSize: number
    existingRoles: string[]
    neededRoles: string[]
    skills: string[]
    status: 'active' | 'full' | 'incomplete'
    createdAt: string
  }
  isOrgView?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOrgView: true
})

const emit = defineEmits(['view', 'edit', 'delete'])

// Вычисляемые свойства
const formattedName = computed(() => {
  return props.team.name.toLowerCase()
})

const statusText = computed(() => {
  switch (props.team.status) {
    case 'full': return 'Укомплектована'
    case 'incomplete': return 'Ищет участников'
    default: return 'Активна'
  }
})

const statusClass = computed(() => {
  switch (props.team.status) {
    case 'full': return 'team-card__status-badge--full'
    case 'incomplete': return 'team-card__status-badge--incomplete'
    default: return 'team-card__status-badge--active'
  }
})

const formattedDate = computed(() => {
  const date = new Date(props.team.createdAt)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})
</script>

<style scoped>
.team-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  height: 100%;
  min-height: 450px;
  display: flex;
  flex-direction: column;
  cursor: default;
  transition: all 0.3s ease;
}

.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: #6366F1;
}


.team-card__top-section {
  background: linear-gradient(135deg, #154A4D, #115e59);
  color: white;
  padding: 24px 24px 20px 24px;
  border-radius: 16px 16px 0 0;
}

.team-card__name {
  font-size: 32px;
  font-weight: 800;
  color: white;
  margin: 0 0 12px 0;
  text-transform: lowercase;
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.team-card__hackathon {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: inline-block;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.team-card__middle-section {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.team-card__info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.team-card__members-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.team-card__label {
  font-size: 12px;
  font-weight: 700;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.team-card__value {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.team-card__members-count {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  font-family: monospace;
}

.team-card__status-badge {
  font-size: 11px;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.team-card__status-badge--full {
  background: #D1FAE5;
  color: #065F46;
  border: 2px solid #10B981;
}

.team-card__status-badge--incomplete {
  background: #FEF3C7;
  color: #92400E;
  border: 2px solid #F59E0B;
}

.team-card__status-badge--active {
  background: #DBEAFE;
  color: #1E40AF;
  border: 2px solid #60A5FA;
}

.team-card__divider {
  height: 2px;
  background: #F3F4F6;
  margin: 16px 0 24px 0;
  width: 100%;
}


.team-card__section {
  margin-bottom: 24px;
}

.team-card__section:last-child {
  margin-bottom: 0;
}

.team-card__section-title {
  font-size: 12px;
  font-weight: 800;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 14px 0;
}


.team-card__roles {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.team-card__role {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.team-card__role--existing {
  background: #DBEAFE;
  color: #1E40AF;
  border: 2px solid #60A5FA;
}

.team-card__role--needed {
  background: #FEF3C7;
  color: #92400E;
  border: 2px solid #F59E0B;
}

.team-card__role--empty {
  background: #F3F4F6;
  color: #6B7280;
  border: 2px dashed #D1D5DB;
  font-style: italic;
  text-transform: none;
  font-weight: 500;
}


.team-card__skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.team-card__skill {
  display: inline-block;
  padding: 8px 16px;
  background: #E0E7FF;
  border: 2px solid #818CF8;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  color: #3730A3;
  text-transform: lowercase;
}


.team-card__meta {
  margin-top: auto;
  padding-top: 20px;
  border-top: 2px solid #F3F4F6;
}

.team-card__date {
  font-size: 14px;
  color: #6B7280;
  font-weight: 500;
}


.team-card__bottom-section {
  background: #F8FAFC;
  padding: 20px 24px;
  border-top: 2px solid #E5E7EB;
  border-radius: 0 0 16px 16px;
}

/* Кнопки действий */
.team-card__actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.team-card__action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 10px;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-height: 70px;
  background: white;
  border: 2px solid transparent;
}

.team-card__action-btn span {
  font-size: 12px;
  text-align: center;
}

.team-card__action-btn--view {
  color: #1E40AF;
  border-color: #DBEAFE;
}

.team-card__action-btn--edit {
  color: #92400E;
  border-color: #FEF3C7;
}

.team-card__action-btn--delete {
  color: #991B1B;
  border-color: #FEE2E2;
}

.team-card__action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.team-card__action-btn--view:hover {
  background: #1E40AF;
  color: white;
  border-color: #1E40AF;
}

.team-card__action-btn--edit:hover {
  background: #92400E;
  color: white;
  border-color: #92400E;
}

.team-card__action-btn--delete:hover {
  background: #991B1B;
  color: white;
  border-color: #991B1B;
}

.team-card__action-btn :deep(svg) {
  font-size: 20px;
  margin-bottom: 4px;
}


@media (max-width: 480px) {
  .team-card__actions {
    grid-template-columns: 1fr;
  }

  .team-card__action-btn {
    min-height: 60px;
    padding: 12px;
  }

  .team-card__top-section,
  .team-card__middle-section {
    padding: 20px;
  }

  .team-card__bottom-section {
    padding: 16px 20px;
  }
}
</style>