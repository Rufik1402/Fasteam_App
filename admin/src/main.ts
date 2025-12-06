// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css' // или 'ant-design-vue/dist/antd.css'
import App from './App.vue'
import router from './router'
import { setupRouterGuard } from './router/guards'


const app = createApp(App)
const pinia = createPinia()



setupRouterGuard(router)

app.use(pinia).use(router).use(Antd).mount('#app')