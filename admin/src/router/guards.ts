
import type { Router } from 'vue-router'
import { useAuthStore } from '../stores/auth.ts'

export function setupRouterGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        const authStore = useAuthStore()

        // Если маршрут требует авторизации
        if (to.meta.requiresAuth) {
            // Проверяем авторизацию
            const isAuthenticated = await authStore.checkAuth()

            if (!isAuthenticated) {
                // Если не авторизован - редирект на логин
                next('/login')
                return
            }
        }

        // Если уже авторизован и пытается зайти на логин
        if (to.path === '/login' && authStore.isAuthenticated) {
            next('/') // Редирект на главную
            return
        }

        next()
    })
}