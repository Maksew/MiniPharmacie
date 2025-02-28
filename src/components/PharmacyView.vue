<script setup>
import { onMounted, ref, computed } from 'vue'
import {
  medicaments,
  loading,
  loadMedicaments,
  deleteMedicament,
  updateMedicament
} from '../composables/usePharmacy.js'

import AddMedicamentForm from './AddMedicamentForm.vue'

const searchTerm = ref('')

onMounted(async () => {
  await loadMedicaments()
})

function handleMedAdded(result) {
  if (result.status === 1) {
  } else {
  }
}

function handleDelete(med) {
  deleteMedicament(med.id)
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
  <v-container>
    <v-card class="mx-auto my-4">
      <v-card-title>
        <v-text-field
            v-model="searchTerm"
            prepend-icon="mdi-magnify"
            label="Rechercher un médicament"
            single-line
            variant="outlined"
            hide-details
            density="compact"
        ></v-text-field>
      </v-card-title>

      <v-data-table
          :headers="[
        { title: 'Dénomination', key: 'denomination' },
        { title: 'Forme', key: 'formePharmaceutique' },
        { title: 'Quantité', key: 'qte' },
        { title: 'Actions', key: 'actions', sortable: false }
      ]"
          :items="filteredMedicaments"
          :loading="loading"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn size="small" color="primary" icon class="mr-2" @click="handleIncrement(item)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn size="small" color="warning" icon class="mr-2" @click="handleDecrement(item)">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <v-btn size="small" color="error" icon @click="handleDelete(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" prepend-icon="mdi-plus">
          Ajouter un médicament
        </v-btn>
      </v-card-actions>
    </v-card>

    <AddMedicamentForm @med-added="handleMedAdded" />
  </v-container>
</template>

<style scoped>
.v-btn {
  margin: 0 4px;
}
</style>