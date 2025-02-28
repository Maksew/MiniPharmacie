<script setup>
import { reactive, onMounted } from 'vue'

const medicaments = reactive([])

async function getMedicaments() {
  const response = await fetch('https://apipharmacie.pecatte.fr/api/25/medicaments')
  const data = await response.json()
  data.forEach(item => {
    medicaments.push({
      id: item.id,
      denomination: item.denomination,
      formePharmaceutique: item.formePharmaceutique,
      qteStock: item.qteStock
    })
  })
}

async function handlerAdd(medicament) {
  const response = await fetch('https://apipharmacie.pecatte.fr/api/25/medicaments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medicament)
  })
  const newMed = await response.json()
  medicaments.push(newMed)
}

async function handlerDelete(med) {
  await fetch(`https://apipharmacie.pecatte.fr/api/25/medicaments/${med.id}`, {
    method: 'DELETE'
  })
  const index = medicaments.findIndex(item => item.id === med.id)
  if (index !== -1) {
    medicaments.splice(index, 1)
  }
}

onMounted(() => {
  getMedicaments()
})
</script>

<template>
  <div>
    <h2>Liste des médicaments</h2>
    <ul>
      <li v-for="med in medicaments" :key="med.id">
        {{ med.denomination }} ({{ med.formePharmaceutique }}) - Qte: {{ med.qteStock }}
        <button @click="handlerDelete(med)">Supprimer</button>
      </li>
    </ul>

  </div>
</template>

<style scoped>
/* Ton style ici */
</style>
