<script setup>
import { onMounted, ref, computed } from 'vue'
import {
  medicaments,
  loadMedicaments,
  deleteMedicament,
  updateMedicament
} from '../composables/usePharmacy.js'

import AddMedicamentForm from './AddMedicamentForm.vue'

const searchTerm = ref('')

onMounted(() => {
  loadMedicaments()
})

function handleMedAdded(result) {
  if (result.status === 1) {
    // Tout va bien, la liste a déjà été rechargée par loadMedicaments()
  } else {
    // Gérer l’erreur (doublon, etc.)
  }
}


function handleDelete(med) {
  deleteMedicament(med.id)
  const i = medicaments.value.findIndex(x => x.id === med.id)
  if (i !== -1) medicaments.value.splice(i, 1)
}

async function handleIncrement(med) {
  const updated = { ...med, qte: med.qte + 1, id: med.id }
  const res = await updateMedicament(updated)
  med.qte = res.qte
}

async function handleDecrement(med) {
  if (med.qte > 0) {
    const updated = { ...med, qte: med.qte - 1, id: med.id }
    const res = await updateMedicament(updated)
    med.qte = res.qte
  }
}

const filteredMedicaments = computed(() => {
  const t = searchTerm.value.toLowerCase()
  return medicaments.value.filter(m =>
      m.denomination.toLowerCase().includes(t) ||
      m.formePharmaceutique.toLowerCase().includes(t)
  )
})
</script>

<template>
  <input v-model="searchTerm" placeholder="Recherche" />
  <ul>
    <li v-for="med in filteredMedicaments" :key="med.id">
      {{ med.denomination }} ({{ med.formePharmaceutique }}) - Qte: {{ med.qte }}
      <button @click="handleIncrement(med)">+1</button>
      <button @click="handleDecrement(med)">-1</button>
      <button @click="handleDelete(med)">Supprimer</button>
    </li>
  </ul>
  <AddMedicamentForm @med-added="handleMedAdded" />
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 8px 0;
}
button {
  margin-left: 8px;
}
</style>
