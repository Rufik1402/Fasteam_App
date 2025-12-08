
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '../api'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('admin_token'))
    const user = ref<{ username: string } | null>(null)
    const isAuthenticated = ref(!!token.value)

    const login = async (username: string, password: string) => {
        const data = await authApi.login({ username, password })
        token.value = data.token
        isAuthenticated.value = true
        user.value = { username }
        localStorage.setItem('admin_token', data.token)
        return true
    }

    const logout = () => {
        token.value = null
        user.value = null
        isAuthenticated.value = false
        localStorage.removeItem('admin_token')
    }

    const checkAuth = async () => {
        const storedToken = localStorage.getItem('admin_token')
        if (!storedToken) {
            token.value = null
            user.value = null
            isAuthenticated.value = false
            return false
        }

        token.value = storedToken
        isAuthenticated.value = true
        return true
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