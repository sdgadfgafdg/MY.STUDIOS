import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-center',
  transition: 'flip',
  toastClassName: 'custom-toast',
  bodyClassName: 'custom-toast-body',
  hideProgressBar: true,
  toastStyle: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
    padding: '16px 24px',
    fontSize: '15px',
    fontWeight: '500',
    letterSpacing: '0.5px',
  },
  closeButton: false,
  icon: false,
})

app.mount('#app')
