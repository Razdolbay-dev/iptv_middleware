// src/api/axios.js
import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://192.168.1.97:8081/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// (опционально) — можно добавить interceptors для логов или токенов
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.message)
        return Promise.reject(error)
    }
)

export default api
