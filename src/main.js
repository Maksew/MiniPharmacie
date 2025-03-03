import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { fr } from 'vuetify/locale'
import '@mdi/font/css/materialdesignicons.css'

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
                    primary: '#01a94f',
                    'pharmacy-green': '#01a94f',
                    'pharmacy-blue': '#0085c7',
                    secondary: '#0085c7',
                    accent: '#1976D2',
                    error: '#D32F2F',
                    info: '#0288D1',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                }
            }
        }
    }
})

createApp(App).use(vuetify).mount('#app')