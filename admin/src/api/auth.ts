import api from './api'
import type { JwtResponse, LoginRequest } from './types'

export const authApi = {
    login(payload: LoginRequest) {
        return api.post<JwtResponse>('/auth/login', payload).then((res) => res.data)
    },
    register(payload: any) {
        // Stub for future registration endpoint usage if needed
        return api.post('/auth/register', payload).then((res) => res.data)
    }
}

