<template>
  <div class="hackathons-page">
    <!-- Заголовок и поиск -->
    <div class="page-header">
      <div class="header-left">
        <h1>Хакатоны</h1>
        <div class="subtitle">Управление всеми хакатонами платформы</div>
      </div>

      <div class="header-right">
        <div class="search-wrapper" style="--primary-color: #8156FF; --primary-hover: #8156FF;">
          <a-input-search
              placeholder="Поиск хакатонов..."
              style="width: 300px"
              @search="handleSearch"
              size="large"
              class="custom-search"
          />
        </div>

        <a-button
            @click="$router.push('/hackathons/new')"
            size="large"
            class="add-button"
        >
          <template #icon><PlusOutlined /></template>
          Добавить хакатон
        </a-button>

      </div>
    </div>

    <!-- Фильтры -->
    <div class="filters-section">
      <div class="filter-buttons-container">
        <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            class="filter-button"
            :class="{ active: activeFilter === filter.value }"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Остальной код без изменений -->
    <div class="hackathons-grid" v-if="filteredHackathons.length > 0">
      <div
          v-for="hackathon in filteredHackathons"
          :key="hackathon.id"
          class="hackathon-item"
      >
        <HackathonCard
            :hackathon="hackathon"
            @click="viewHackathon(hackathon.id)"
            @edit="handleEditHackathon(hackathon.id)"
            @delete="deleteHackathon(hackathon.id)"
        />
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-content">
        <CalendarOutlined style="font-size: 64px; color: #d9d9d9" />
        <h3>Пока нет хакатонов</h3>
        <p>Создайте первый хакатон, чтобы начать работу</p>
        <a-button
            @click="$router.push('/hackathons/new')"
            size="large"
            class="add-button empty-button"
        >
          Создать хакатон
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import HackathonCard from '../components/HackathonCard.vue'
import { useHackathonsStore } from '../stores/hackathons'

const router = useRouter()
const hackathonsStore = useHackathonsStore()

const searchQuery = ref('')
const activeFilter = ref('all')

// Определяем фильтры
const filters = [
  { value: 'all', label: 'Все' },
  { value: 'upcoming', label: 'Предстоящие' },
  { value: 'active', label: 'Идут сейчас' },
  { value: 'finished', label: 'Завершенные' }
]

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

// Остальные функции без изменений
const viewHackathon = (id: string) => {
  router.push(`/hackathons/${id}`)
}

const handleEditHackathon = (id: string) => {
  router.push(`/hackathons/${id}/edit`)
}

const deleteHackathon = (id: string) => {
  hackathonsStore.deleteHackathon(id)
  message.success('Хакатон удален')
}

const handleSearch = (value: string) => {
  searchQuery.value = value
}
</script>

<style scoped>
/* Стили для фильтров */
.filters-section {
  margin-bottom: 32px;
}

.filter-buttons-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-button {
  padding: 10px 24px;
  background: #ECE3F2;
  color: #291360;
  border: 2px solid #ECE3F2;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  outline: none;
}

.filter-button:hover {
  background: #D6C6E3;
  border-color: #D6C6E3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(41, 19, 96, 0.15);
}

.filter-button.active {
  background: #291360;
  color: white;
  border-color: #291360;
  box-shadow: 0 4px 12px rgba(41, 19, 96, 0.2);
}

.filter-button.active:hover {
  background: #1A0D40;
  border-color: #1A0D40;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(41, 19, 96, 0.25);
}

/* Анимация при нажатии */
.filter-button:active {
  transform: translateY(0);
  transition: transform 0.1s ease;
}

/* Адаптивность */
@media (max-width: 768px) {
  .filter-buttons-container {
    gap: 8px;
  }

  .filter-button {
    padding: 8px 16px;
    font-size: 13px;
    flex: 1;
    min-width: calc(50% - 4px);
  }
}

@media (max-width: 480px) {
  .filter-button {
    min-width: 100%;
  }
}

/* Остальные стили без изменений */
.hackathons-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-left h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.custom-search {
  border-color: #68507E;
  border-bottom-color: #68507E;
}

.add-button {
  border-radius: 8px;
  background: #68507E;
}

.hackathons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

.hackathon-item {
  height: 100%;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: #f8f9fa;
  border-radius: 16px;
  border: 2px dashed #e9ecef;
}

.empty-content {
  text-align: center;
  padding: 48px;
}

.empty-content h3 {
  margin: 16px 0 8px 0;
  color: #1a1a1a;
}

.empty-content p {
  color: #666;
  margin-bottom: 24px;
}

@media (max-width: 1200px) {
  .hackathons-grid {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-right {
    width: 100%;
  }

  .hackathons-grid {
    grid-template-columns: 1fr;
  }
}
/* Добавьте эти стили в секцию <style scoped> */

/* Стили для поиска */
.custom-search :deep(.ant-input-affix-wrapper) {
  border-radius: 12px;
  border: 2px solid #D6C6E3;
  background: white;
  transition: all 0.3s ease;
}

.custom-search :deep(.ant-input-affix-wrapper:hover),
.custom-search :deep(.ant-input-affix-wrapper:focus),
.custom-search :deep(.ant-input-affix-wrapper-focused) {
  border-color: #8156FF !important;
  box-shadow: 0 0 0 2px rgba(129, 86, 255, 0.1) !important;
}

.custom-search :deep(.ant-input) {
  color: #291360;
}

.custom-search :deep(.ant-input::placeholder) {
  color: #8C7AA4;
}

.custom-search :deep(.ant-input-prefix) {
  color: #8156FF;
  margin-right: 8px;
}

/* Стили для кнопки добавления */
.add-button {
  border-radius: 12px !important;
  background: #68507E !important;
  border-color: #68507E !important;
  color: white !important;
  font-weight: 600;
  transition: all 0.3s ease;
  height: 40px;
  padding: 0 20px;
}

.add-button:hover {
  background: #8156FF !important;
  border-color: #8156FF !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(129, 86, 255, 0.2);
}

.add-button:active {
  transform: translateY(0);
}

.add-button :deep(.anticon) {
  color: white;
}

/* Также для кнопки в пустом состоянии */
.empty-content .ant-btn[type="primary"] {
  background: #68507E !important;
  border-color: #68507E !important;
}

.empty-content .ant-btn[type="primary"]:hover {
  background: #8156FF !important;
  border-color: #8156FF !important;
}
.search-wrapper {
  --ant-primary-color: #8156FF;
  --ant-primary-color-hover: #8156FF;
  --ant-primary-color-active: #68507E;
  --ant-primary-color-outline: rgba(129, 86, 255, 0.1);
}

.search-wrapper :deep(.ant-input-affix-wrapper) {
  border-color: #D6C6E3;
}

.search-wrapper :deep(.ant-input-affix-wrapper:hover),
.search-wrapper :deep(.ant-input-affix-wrapper:focus),
.search-wrapper :deep(.ant-input-affix-wrapper-focused) {
  border-color: var(--ant-primary-color) !important;
  box-shadow: 0 0 0 2px var(--ant-primary-color-outline) !important;
}
/* Пустое состояние */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: #f8f9fa;
  border-radius: 16px;
  border: 2px dashed #e9ecef;
  text-align: center;
}

.empty-content {
  padding: 48px;
  max-width: 400px;
}

.empty-content h3 {
  margin: 16px 0 8px 0;
  color: #1a1a1a;
  font-size: 20px;
}

.empty-content p {
  color: #666;
  margin-bottom: 24px;
  font-size: 14px;
}

/* Кнопка в пустом состоянии */
.empty-button {
  min-width: 200px;
  margin-top: 8px;
}

/* Общие стили для обеих кнопок */
.add-button {
  border-radius: 12px !important;
  background: #68507E !important;
  border-color: #68507E !important;
  color: white !important;
  font-weight: 600;
  transition: all 0.3s ease;
  height: 40px;
  padding: 0 20px;
}

.add-button:hover {
  background: #8156FF !important;
  border-color: #8156FF !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(129, 86, 255, 0.2);
}

.add-button:active {
  transform: translateY(0);
}

.add-button :deep(.anticon) {
  color: white;
}

</style>