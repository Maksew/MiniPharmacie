import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { fr } from 'vuetify/locale'

const vuetify = createVuetify({
    components,
    directives,
    locale: {
        locale: 'fr',
        messages: { fr }
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#2196F3',
                    secondary: '#03A9F4',
                    accent: '#9C27B0',
                    error: '#fc1313',
                    info: '#b8f3ff',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                }
            }
        }
    }
})

createApp(App).use(vuetify).mount('#app')