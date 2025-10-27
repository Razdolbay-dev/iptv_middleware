// src/api/tvApi.js
import api from './axios'

export async function getChannels() {
    const { data } = await api.get('/tv/channels')
    return data
}
