<template>
  <div class="user-card">
    <!-- Верхний блок (цветной) -->
    <div class="card-top" :class="user.teamId ? 'in-team' : 'no-team'">
      <div class="top-content">
        <!-- Аватар и основная информация -->
        <div class="user-main-info">
          <div class="user-avatar">
            <img
                v-if="user.avatarUrl"
                :src="user.avatarUrl"
                :alt="user.firstName"
            />
            <div v-else class="avatar-placeholder">
              {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
            </div>
          </div>

          <div class="user-name">
            <h3>{{ user.firstName }} {{ user.lastName }}</h3>
            <div class="username">@{{ user.username || user.telegramId }}</div>
          </div>
        </div>

        <!-- Статус команды -->
        <div class="team-status">
          <div v-if="user.teamName" class="team-badge">
            <team-outlined />
            <span>{{ user.teamName }}</span>
            <span class="team-size">{{ user.teamMembers || 0 }}/{{ user.teamSize || 4 }}</span>
          </div>
          <div v-else class="no-team-badge">
            <team-outlined />
            <span>Без команды</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Средний блок (белый) -->
    <div class="card-middle">
      <!-- Роли -->
      <div class="roles-section">
        <div class="section-label">РОЛИ</div>
        <div class="roles-tags">
          <span class="role-tag main-role">{{ formatRole(user.role) }}</span>
          <span v-if="user.experience" class="role-tag experience">
            {{ formatExperience(user.experience) }}
          </span>
        </div>
      </div>

      <!-- Навыки -->
      <div class="skills-section">
        <div class="section-label">НАВЫКИ</div>
        <div class="skills-tags">
          <span
              v-for="skill in user.skills.slice(0, 4)"
              :key="skill"
              class="skill-tag"
          >
            {{ skill }}
          </span>
          <span v-if="user.skills.length > 4" class="more-skills">
            +{{ user.skills.length - 4 }}
          </span>
        </div>
      </div>
    </div>

    <!-- Нижний блок (серый) -->
    <div class="card-bottom">
      <!-- Действия -->
      <div class="card-actions">
        <a-button
            size="small"
            type="link"
            @click.stop="$emit('view')"
            class="action-btn view-btn"
        >
          <eye-outlined />
          Профиль
        </a-button>

        <a-button
            size="small"
            type="link"
            :disabled="!!user.teamId"
            @click.stop="$emit('assign')"
            class="action-btn assign-btn"
        >
          <team-outlined />
          {{ user.teamId ? 'В команде' : 'Пригласить' }}
        </a-button>

        <a-button
            size="small"
            type="link"
            danger
            @click.stop="$emit('delete')"
            class="action-btn delete-btn"
        >
          <delete-outlined />
          Удалить
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  TeamOutlined,
  EyeOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'

const props = defineProps<{
  user: {
    id: string
    telegramId: string
    firstName: string
    lastName: string
    username?: string
    avatarUrl?: string
    role: string
    experience: string
    skills: string[]
    teamId?: string
    teamName?: string
    teamMembers?: number
    teamSize?: number
  }
}>()

defineEmits(['view', 'assign', 'delete'])

const formatRole = (role: string) => {
  const roleMap: Record<string, string> = {
    'frontend': 'Frontend',
    'backend': 'Backend',
    'fullstack': 'Fullstack',
    'designer': 'Design',
    'mobile': 'Mobile'
  }
  return roleMap[role] || role
}

const formatExperience = (exp: string) => {
  const expMap: Record<string, string> = {
    'junior': 'Junior',
    'middle': 'Middle',
    'senior': 'Senior'
  }
  return expMap[exp] || exp
}
</script>

<style scoped>
.user-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(41, 19, 96, 0.1);
}

/* Верхний блок */
.card-top {
  padding: 20px;
  color: white;
  min-height: 100px;
}

.card-top.in-team {
  background: linear-gradient(135deg, #206E73 0%, #1d6b3a 100%);
}

.card-top.no-team {
  background: linear-gradient(135deg, #206E73 0%, #291360 100%);
}

.top-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Основная информация пользователя */
.user-main-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
}

.user-name h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.username {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
}

/* Статус команды */
.team-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.team-badge,
.no-team-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.team-badge {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.no-team-badge {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.team-size {
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  margin-left: 4px;
}

/* Средний блок */
.card-middle {
  padding: 20px;
  flex: 1;
}

/* Секции */
.roles-section,
.skills-section {
  margin-bottom: 16px;
}

.section-label {
  font-size: 11px;
  color: #8C7AA4;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

/* Роли */
.roles-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.role-tag {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}

.role-tag.main-role {
  background: rgba(129, 86, 255, 0.1);
  color: #291360;
  border: 1px solid rgba(129, 86, 255, 0.2);
}

.role-tag.experience {
  background: rgba(45, 204, 152, 0.1);
  color: #2DCC98;
  border: 1px solid rgba(45, 204, 152, 0.2);
}

/* Навыки */
.skills-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.skill-tag {
  padding: 4px 10px;
  background: rgba(41, 19, 96, 0.05);
  color: #291360;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.more-skills {
  color: #8C7AA4;
  font-size: 12px;
  align-self: center;
}

/* Нижний блок */
.card-bottom {
  background: #f8f9fa;
  padding: 16px 20px;
  border-top: 1px solid #e9ecef;
}

/* Кнопки действий */
.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  padding: 0;
}

.view-btn {
  background: #ECE3F2 !important;
  border-color: #ECE3F2 !important;
  color: #291360 !important;
}

.view-btn:hover {
  background: #D6C6E3 !important;
  border-color: #D6C6E3 !important;
}

.assign-btn {
  background: rgba(129, 86, 255, 0.1) !important;
  border-color: rgba(129, 86, 255, 0.2) !important;
  color: #8156FF !important;
}

.assign-btn:hover:not(:disabled) {
  background: rgba(129, 86, 255, 0.2) !important;
  border-color: #8156FF !important;
}

.assign-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.delete-btn {
  background: rgba(255, 77, 79, 0.1) !important;
  border-color: rgba(255, 77, 79, 0.2) !important;
  color: #ff4d4f !important;
}

.delete-btn:hover {
  background: rgba(255, 77, 79, 0.2) !important;
  border-color: #ff4d4f !important;
}

/* Адаптивность */
@media (max-width: 480px) {
  .card-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>