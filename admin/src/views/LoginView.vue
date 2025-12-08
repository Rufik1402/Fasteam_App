
<template>
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5">
    <div class="login-logo">fasteam</div>  <!-- ← добавлено -->
    <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 400px">
      <h1 style="text-align: center; margin-bottom: 30px">Вход в админ-панель</h1>

      <a-form :model="form" @finish="handleLogin">
        <a-form-item label="Имя пользователя" required>
          <a-input v-model:value="form.username" placeholder="admin" size="large" />
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
          <p>Введите учетные данные администратора</p>
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
  username: 'admin@itam.com',
  password: 'admin123'
})

const handleLogin = async () => {
  loading.value = true
  try {
    await authStore.login(form.value.username, form.value.password)
    message.success('Успешный вход!')
    router.push('/')
  } catch (error: any) {
    message.error(error.message || 'Ошибка входа')
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&display=swap');

/* Контейнер страницы */
.page-wrapper,
div[style*="height: 100vh"] {
  background: #ffffff !important;
  padding-top: 120px !important; /* дало место под логотип */
  position: relative;
}

/* --- ЛОГОТИП СВЕРХУ --- */
.login-logo {
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;                /* квадрат */
  height: 54px;               /* квадрат */
  background: #68507E;
  border-radius: 0px 0px 10px 10px;         /* скругления как на картинке */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-family: "Unbounded", sans-serif;
  color: white;
  font-weight: 600;
  text-transform: lowercase;
  letter-spacing: 0.5px;
}


/* Основная карточка */
div[style*="background: white"] {
  background: #ECE3F2 !important;
  border-radius: 16px !important;
  padding: 65px 60px !important; /* увеличил отступы */
  box-shadow: none !important;
  width: 500px !important; /* больше ширина */
  min-height: 550px !important;
}

/* Заголовок */
h1 {
  font-size: 24px !important;
  margin-bottom: 35px !important;
  color: #333 !important;
}

/* Подписи полей */
.ant-form-item-label > label {
  font-size: 15px !important;
  color: #4a4061 !important;
}

/* Поля ввода */
.ant-input,
.ant-input-password .ant-input {
  background: #f7f0fb !important;
  border: 1px solid #c8b7d9 !important;
  border-radius: 14px !important;
  height: 50px !important;
  font-size: 15px !important;
  padding-left: 14px !important;
}

/* Кнопка */
.ant-btn-primary {
  background: #68507E !important;
  border: none !important;
  height: 50px !important;
  border-radius: 20px !important;
  font-size: 16px !important;
  width: 300px !important;
}

.ant-btn-primary:hover {
  background: #5d4286 !important;
}

/* Информация "для демо" */
div[style*="text-align: center"] {
  margin-top: 25px !important;
  color: #6b5a7f !important;
  font-size: 14px !important;
}

div[style*="text-align: center"] strong {
  color: #4a2d82 !important;
}

/* Центрирование кнопки */
.ant-form-item {
  text-align: center !important;
}

.ant-btn-primary {
  display: inline-block !important;
  margin: 0 auto !important;
}


</style>

