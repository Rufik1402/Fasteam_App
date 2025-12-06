<template>
  <div class="hackathons-page">

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px">
      <h1 style="margin: 0">Хакатоны</h1>

      <a-space>

        <a-input-search
            placeholder="Поиск хакатонов..."
            style="width: 300px"
            @search="handleSearch"
        />


        <a-button
            type="primary"
            @click="$router.push('/hackathons/new')"
            size="large"
        >
          <template #icon><PlusOutlined /></template>
          Добавить хакатон
        </a-button>
      </a-space>
    </div>


    <a-radio-group
        v-model:value="activeFilter"
        style="margin-bottom: 24px"
        button-style="solid"
    >
      <a-radio-button value="all">Все</a-radio-button>
      <a-radio-button value="upcoming">Предстоящие</a-radio-button>
      <a-radio-button value="active">Идущие сейчас</a-radio-button>
      <a-radio-button value="finished">Завершенные</a-radio-button>
    </a-radio-group>


    <a-row :gutter="[16, 24]">
      <a-col
          v-for="hackathon in filteredHackathons"
          :key="hackathon.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
      >
        <HackathonCard
            :hackathon="hackathon"
            @click="viewHackathon(hackathon.id)"
            @edit="handleEditHackathon(hackathon.id)"
            @delete="deleteHackathon(hackathon.id)"
        />
      </a-col>
    </a-row>


    <a-empty
        v-if="filteredHackathons.length === 0"
        style="margin-top: 48px"
        description="Пока нет хакатонов"
    >
      <template #image>
        <CalendarOutlined style="font-size: 48px; color: #999" />
      </template>
      <a-button type="primary" @click="$router.push('/hackathons/new')">
        Создать хакатон
      </a-button>
    </a-empty>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import HackathonCard from '../components/HackathonCard.vue'
import { useHackathonsStore } from '../stores/hackathons' // <-- ИМПОРТИРУЕМ


const router = useRouter()
const hackathonsStore = useHackathonsStore() // <-- ИСПОЛЬЗУЕМ STORE

const searchQuery = ref('')
const activeFilter = ref('all')


const hackathons = computed(() => hackathonsStore.hackathons)


const filteredHackathons = computed(() => {
  let result = [...hackathons.value]

  if (activeFilter.value !== 'all') {
    result = result.filter(h => h.status === activeFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(h =>
        h.name.toLowerCase().includes(query) ||
        h.description.toLowerCase().includes(query) ||
        h.tracks.some(track => track.toLowerCase().includes(query))
    )
  }

  return result
})


const viewHackathon = (id: string) => {
  router.push(`/hackathons/${id}`)
}

const handleEditHackathon = (id: string) => {
  router.push(`/hackathons/${id}/edit`)
}

const deleteHackathon = (id: string) => {
  hackathonsStore.deleteHackathon(id) // <-- УДАЛЯЕМ ИЗ STORE
  message.success('Хакатон удален')
}

const handleSearch = (value) => {
  searchQuery.value = value;
}

const editHackathon = (id: string) => {
  router.push(`/hackathons/${id}/edit`) // Переход на страницу редактирования
}



</script>

<style scoped>
.hackathons-page {
  padding: 24px;
}

:deep(.ant-radio-group) {
  display: flex;
  gap: 8px;
}
</style>