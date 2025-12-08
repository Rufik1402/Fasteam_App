
import axios from 'axios'

// Shared HTTP client for the admin panel.
// Base URL is configurable via VITE_API_URL, defaults to local backend port.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080'
})

// Attach JWT from admin storage when present.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token')
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api