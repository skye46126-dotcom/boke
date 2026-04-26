import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import './style.css'
import App from './App.vue'
import router from './router'
import { loadPublicSiteContent } from '@/services/siteContentService'

const app = createApp(App)
const head = createHead()

await loadPublicSiteContent()

app.use(router)
app.use(head)
app.mount('#app')
