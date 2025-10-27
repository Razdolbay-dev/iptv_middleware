import { createRouter, createWebHistory } from 'vue-router'

import Menu from '@/components/Menu.vue'
import TV from '@/views/TV.vue'
import Video from '@/components/Video.vue'
import Cameras from '@/components/Cameras.vue'

const routes = [
    { path: '/', name: 'menu', component: Menu },
    { path: '/tv', name: 'tv', component: TV },
    { path: '/video', name: 'video', component: Video },
    { path: '/cameras', name: 'cameras', component: Cameras },
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})
