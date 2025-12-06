
<template>
  <a-card hoverable class="team-card" @click="$emit('click')">

    <div class="members-badge">
      {{ team.members.length }}/{{ team.maxSize }}
    </div>


    <div class="team-header">
      <h3 style="margin: 0">{{ team.name }}</h3>
      <div style="color: #999; font-size: 12px">{{ team.hackathonName }}</div>
    </div>


    <div class="team-captain">
      <a-avatar :src="getCaptainAvatar()" size="small" />
      <span style="margin-left: 8px">{{ team.captainName }}</span>
    </div>


    <div class="team-members">
      <a-avatar-group :max-count="4" :size="32">
        <a-avatar
            v-for="member in team.members"
            :key="member.id"
            :src="member.avatar"
            :alt="member.name"
        />
      </a-avatar-group>
    </div>


    <div class="team-roles">
      <div class="roles-section">
        <div style="font-size: 12px; color: #666; margin-bottom: 4px">Есть:</div>
        <div style="display: flex; flex-wrap: wrap; gap: 4px">
          <a-tag
              v-for="role in team.existingRoles.slice(0, 3)"
              :key="role"
              color="green"
              size="small"
          >
            {{ role }}
          </a-tag>
        </div>
      </div>

      <div class="roles-section" v-if="team.neededRoles.length > 0">
        <div style="font-size: 12px; color: #666; margin-bottom: 4px">Ищут:</div>
        <div style="display: flex; flex-wrap: wrap; gap: 4px">
          <a-tag
              v-for="role in team.neededRoles.slice(0, 2)"
              :key="role"
              color="orange"
              size="small"
          >
            {{ role }}
          </a-tag>
        </div>
      </div>
    </div>

    <!-- Действия -->
    <template #actions>
      <a-tooltip title="Чат">
        <message-outlined @click.stop="$emit('chat')" />
      </a-tooltip>
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
import { MessageOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  team: {
    id: string
    name: string
    hackathonName: string
    captainName: string
    members: Array<{ id: string; name: string; avatar?: string }>
    maxSize: number
    existingRoles: string[]
    neededRoles: string[]
  }
}>()

defineEmits(['click', 'chat', 'edit', 'delete'])

const getCaptainAvatar = () => {
  const captain = props.team.members.find(m => m.name === props.team.captainName)
  return captain?.avatar || 'https://via.placeholder.com/32'
}
</script>

<style scoped>
.team-card {
  height: 100%;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.team-card:hover {
  transform: translateY(-4px);
}

.members-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #1890ff;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.team-header {
  margin-bottom: 12px;
}

.team-captain {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: #666;
  font-size: 14px;
}

.team-members {
  margin-bottom: 16px;
}

.team-roles {
  margin-bottom: 12px;
}

.roles-section {
  margin-bottom: 12px;
}

:deep(.ant-card-actions) {
  border-top: 1px solid #f0f0f0;
}

:deep(.ant-card-actions > li) {
  margin: 8px 0;
}
</style>