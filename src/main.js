import { createApp } from 'vue'
import App from '@/App.vue'
import {router} from '@/router/index.js'
import '@/style.css'
import { initRemoteControl } from '@/utils/remoteControl.js'

initRemoteControl()

const app = createApp(App)
app.use(router)
app.mount('#app')
