<script setup>
import PharmacyView from './components/PharmacyView.vue'
</script>

<template>
  <v-app>
    <v-app-bar color="pharmacy-green" density="compact">
      <div class="pharmacy-led-cross me-3"></div>
      <v-app-bar-title class="text-white">
        Gestion Pharmacie
      </v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main class="bg-light-grey">
      <PharmacyView />
    </v-main>

    <v-footer app class="bg-pharmacy-green text-center d-flex justify-center">
      <div class="text-white">
        Mini-projet Pharmacie - {{ new Date().getFullYear() }}
      </div>
    </v-footer>
  </v-app>
</template>

<style>

:root {
  --pharmacy-green: #01a94f;
  --pharmacy-blue: #0085c7;
  --light-grey: #f5f7fa;
  --led-green: #39ff14;
  --led-off: #004d1f;
}

.pharmacy-led-cross {
  position: relative;
  width: 32px;
  height: 32px;
  margin: 0 8px;
  background-color: var(--pharmacy-green);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.pharmacy-led-cross::before,
.pharmacy-led-cross::after {
  content: '';
  position: absolute;
  background-color: var(--led-green);
  animation: ledAnimation 2s infinite alternate;
  box-shadow: 0 0 8px var(--led-green);
}

.pharmacy-led-cross::before {
  width: 80%;
  height: 20%;
  top: 40%;
  left: 10%;
}

.pharmacy-led-cross::after {
  height: 80%;
  width: 20%;
  left: 40%;
  top: 10%;
}

@keyframes ledAnimation {
  0%, 15% {
    opacity: 0.4;
    box-shadow: 0 0 2px var(--led-green);
  }

  25%, 40% {
    opacity: 0.6;
    box-shadow: 0 0 5px var(--led-green);
  }

  50%, 65% {
    opacity: 0.8;
    box-shadow: 0 0 8px var(--led-green);
  }

  75%, 90%, 100% {
    opacity: 1;
    box-shadow: 0 0 12px var(--led-green);
  }
}

@keyframes ledCirculation {
  0% { opacity: 0.3; }
  25% { opacity: 0.6; }
  50% { opacity: 1; }
  75% { opacity: 0.6; }
  100% { opacity: 0.3; }
}
</style>