<script setup>
import { ref } from 'vue'
import { addMedicament } from '../composables/usePharmacy.js'

const emit = defineEmits(['med-added'])
const newDenomination = ref('')
const newForme = ref('')
const newQte = ref(0)

async function handleAdd() {
  const body = {
    denomination: newDenomination.value,
    formepharmaceutique: newForme.value,
    qte: newQte.value
  }

  console.log('add :', body)

  const newMed = await addMedicament(body)
  emit('med-added', newMed)
  newDenomination.value = ''
  newForme.value = ''
  newQte.value = 0
}
</script>

<template>
  <div>
    <h3>Ajouter un médicament</h3>
    <input v-model="newDenomination" placeholder="Dénomination" />
    <input v-model="newForme" placeholder="Forme pharmaceutique" />
    <input type="number" v-model.number="newQte" placeholder="Quantité" />
    <button @click="handleAdd">Ajouter</button>
  </div>
</template>

<style scoped>
h3 {
  margin-top: 16px;
}
</style>
