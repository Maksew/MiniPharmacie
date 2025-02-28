<script setup>
import PharmacyView from './components/PharmacyView.vue'
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-title>
        <v-icon icon="mdi-pharmacy" class="mr-2"></v-icon>
        Gestion Pharmacie
      </v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <PharmacyView />
    </v-main>

    <v-footer app class="bg-primary text-center d-flex justify-center">
      <div class="text-white">
        Mini-projet Pharmacie - {{ new Date().getFullYear() }}
      </div>
    </v-footer>
  </v-app>
</template>