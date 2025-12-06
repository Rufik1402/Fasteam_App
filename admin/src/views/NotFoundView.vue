<template>
  <div style="text-align: center; padding: 100px 20px">
    <h1 style="font-size: 48px; margin-bottom: 20px">404</h1>
    <h2 style="margin-bottom: 30px">Страница не найдена</h2>
    <a-button type="primary" @click="$router.push('/')">
      На главную
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>