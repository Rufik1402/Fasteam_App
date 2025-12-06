
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('admin_token'))
    const user = ref<any>(null)
    const isAuthenticated = ref(!!token.value)

    //МОК-функция вместо реального API
    const login = async (email: string, password: string) => {


        // Простая проверка для демо
        if (email === 'admin@itam.com' && password === 'admin123') {
            token.value = 'mock-admin-token-123'
            user.value = {
                id: '1',
                email: 'admin@itam.com',
                name: 'Администратор',
                role: 'admin'
            }
            isAuthenticated.value = true
            localStorage.setItem('admin_token', token.value)
            return true
        }

        throw new Error('Неверные учетные данные')
    }

    const logout = () => {
        token.value = null
        user.value = null
        isAuthenticated.value = false
        localStorage.removeItem('admin_token')
        console.log('Logged out successfully')
    }

    // МОК-проверка авторизации
    const checkAuth = async () => {
        await new Promise(resolve => setTimeout(resolve, 200))

        // Проверка токена в localStorage
        const storedToken = localStorage.getItem('admin_token')

        if (!storedToken) {
            // Если нет токена - сбрасываем состояние
            token.value = null
            user.value = null
            isAuthenticated.value = false
            return false
        }

        // Если токен есть, но не совпадает с store - обновляем
        if (storedToken !== token.value) {
            token.value = storedToken
            isAuthenticated.value = true

            // Загружаем данные пользователя
            user.value = {
                id: '1',
                email: 'admin@itam.com',
                name: 'Администратор',
                role: 'admin'
            }
        }


        return isAuthenticated.value
    }

    return {
        token,
        user,
        isAuthenticated,
        login,
        logout,
        checkAuth
    }
})