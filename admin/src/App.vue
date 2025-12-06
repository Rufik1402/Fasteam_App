<template>

  <div v-if="route.path === '/login'">
    <router-view />
  </div>


  <div v-else style="min-height: 100vh; display: flex">
    <div style="width: 250px; background: #001529; color: white; padding: 20px">
      <h2 style="color: white">ITAM Hacks Admin</h2>
      <nav style="margin-top: 30px">
        <router-link
            to="/hackathons"
            style="display: block; color: white; padding: 10px; text-decoration: none"
            :style="{ background: route.path === '/hackathons' ? '#1890ff' : 'transparent' }"
        >
          🗓️ Хакатоны
        </router-link>

        <router-link
            to="/users"
            style="display: block; color: white; padding: 10px; text-decoration: none"
            :style="{ background: route.path === '/users' ? '#1890ff' : 'transparent' }"
        >
          👥 Участники
        </router-link>

        <router-link
            to="/teams"
            style="display: block; color: white; padding: 10px; text-decoration: none"
            :style="{ background: route.path.includes('/teams') ? '#1890ff' : 'transparent' }"
        >
          👥 Команды
        </router-link>

        <router-link
            to="/admins"
            style="display: block; color: white; padding: 10px; text-decoration: none"
            :style="{
      background: route.path === '/admins' ? '#1890ff' : 'transparent'
    }"
        >
          🛡️ Администраторы
        </router-link>



        <a-button
            @click="logout"
            style="margin-top: 20px; width: 100%; padding: 10px; background: transparent; color: white; border: 1px solid white"
        >
          Выйти
        </a-button>
      </nav>
    </div>

>
    <div style="flex: 1; padding: 20px">
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

<style>

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

a {
  color: #1890ff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>