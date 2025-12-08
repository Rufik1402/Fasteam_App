<template>
  <div v-if="route.path === '/login'">
    <router-view />
  </div>

  <div v-else style="min-height: 100vh; display: flex">
    <!-- Боковая панель -->
    <div style="width: 280px; background: rgba(104, 80, 126, 1); color: white; padding: 25px; display: flex; flex-direction: column;">
      <!-- Заголовок -->
      <div class="title" style="margin-bottom: 40px;">
        <h2 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 700;">fasteam</h2>
        <div style="color: #B298C5; font-size: 14px; margin-top: 5px;">Административная панель</div>
      </div>

      <!-- Навигация -->
      <nav style="flex: 1; display: flex; flex-direction: column; gap: 12px;">
        <router-link
            to="/hackathons"
            class="nav-card"
            :class="{ active: route.path === '/hackathons' }"
        >
          <div class="nav-icon" style="background: rgba(129, 86, 255, 0.2);">
            <span style="color: #8156FF;">🗓️</span>
          </div>
          <div class="nav-text">
            <div class="nav-title">Хакатоны</div>
          </div>
        </router-link>

        <router-link
            to="/users"
            class="nav-card"
            :class="{ active: route.path === '/users' }"
        >
          <div class="nav-icon" style="background: rgba(45, 204, 152, 0.2);">
            <span style="color: #2DCC98;">👥</span>
          </div>
          <div class="nav-text">
            <div class="nav-title">Участники</div>
          </div>
        </router-link>

        <router-link
            to="/teams"
            class="nav-card"
            :class="{ active: route.path.includes('/teams') }"
        >
          <div class="nav-icon" style="background: rgba(255, 107, 107, 0.2);">
            <span style="color: #FF6B6B;">👥</span>
          </div>
          <div class="nav-text">
            <div class="nav-title">Команды</div>
          </div>
        </router-link>

        <router-link
            to="/admins"
            class="nav-card"
            :class="{ active: route.path === '/admins' }"
        >
          <div class="nav-icon" style="background: rgba(255, 193, 7, 0.2);">
            <span style="color: #FFC107;">🛡️</span>
          </div>
          <div class="nav-text">
            <div class="nav-title">Администраторы</div>
          </div>
        </router-link>
      </nav>

      <!-- Кнопка выхода -->
      <div style="margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
        <button
            @click="logout"
            class="logout-btn"
        >
          <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
            <span>🚪</span>
            <span>Выйти</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Основной контент -->
    <div style="flex: 1; background: #F8F9FA; padding: 30px; overflow-y: auto;">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  localStorage.removeItem('admin_token')
  router.push('/login')
  setTimeout(() => {
    window.location.reload()
  }, 50)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&display=swap');

.title {
  font-family: "Unbounded", sans-serif;

}
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

/* Стили для карточек навигации */
.nav-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 16px 20px;
  background: #B298C5;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
  font-family: 'Involve', sans-serif;
}

.nav-card:hover {
  background: #ECE3F2;
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-card.active {
  background: #ECE3F2;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-icon {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.nav-text {
  flex: 1;
  color: #291360;
}

.nav-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 3px;
}

.nav-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
}


.logout-btn {
  width: 100%;
  padding: 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #291360;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Involve', sans-serif;
}

.logout-btn:hover {
  background: rgba(255, 107, 107, 0.2);
  border-color: rgba(255, 107, 107, 0.3);
  color: #FF6B6B;
}


.router-view-container {
  background: #B298C5;
  min-height: calc(100vh - 60px);
}
</style>