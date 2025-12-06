
<template>
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5">
    <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 400px">
      <h1 style="text-align: center; margin-bottom: 30px">Вход в админ-панель</h1>

      <a-form :model="form" @finish="handleLogin">
        <a-form-item label="Email" required>
          <a-input v-model:value="form.email" placeholder="admin@itam.com" size="large" />
        </a-form-item>

        <a-form-item label="Пароль" required>
          <a-input-password v-model:value="form.password" placeholder="admin123" size="large" />
        </a-form-item>

        <a-form-item>
          <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="loading"
              style="width: 100%"
          >
            Войти
          </a-button>
        </a-form-item>

        <div style="text-align: center; color: #999; margin-top: 20px">
          <p>Для демо используйте:</p>
          <p>Email: <strong>admin@itam.com</strong></p>
          <p>Пароль: <strong>admin123</strong></p>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '../stores/auth.ts'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const form = ref({
  email: 'admin@itam.com',
  password: 'admin123'
})

const handleLogin = async () => {
  loading.value = true
  try {
    await authStore.login(form.value.email, form.value.password)
    message.success('Успешный вход!')
    router.push('/')
  } catch (error: any) {
    message.error(error.message || 'Ошибка входа')
  } finally {
    loading.value = false
  }
}
</script>