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
import EditMedicamentForm from './EditMedicamentForm.vue'

const searchTerm = ref('')
const deleteDialog = ref(false)
const medicamentToDelete = ref(null)

const editDialog = ref(false)
const currentMedicament = ref(null)

onMounted(async () => {
  await loadMedicaments()
})

function openEditDialog(med) {
  currentMedicament.value = med
  editDialog.value = true
}

function handleMedUpdated(result) {
}

function handleMedAdded(result) {
  if (result.status === 1) {
  } else {
  }
}

function handleDelete(med) {
  deleteMedicament(med.id)
}

function openDeleteDialog(med) {
  medicamentToDelete.value = med
  deleteDialog.value = true
}

async function confirmDelete() {
  if (medicamentToDelete.value) {
    await deleteMedicament(medicamentToDelete.value.id)
    deleteDialog.value = false
    medicamentToDelete.value = null
  }
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
          <v-btn size="small" color="info" icon class="mr-2" @click="openEditDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn size="small" color="primary" icon class="mr-2" @click="handleIncrement(item)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn size="small" color="warning" icon class="mr-2" @click="handleDecrement(item)">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <v-btn size="small" color="error" icon @click="openDeleteDialog(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <EditMedicamentForm
          :medicament="currentMedicament"
          v-model:isOpen="editDialog"
          @med-updated="handleMedUpdated"
      />

      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title class="text-h5">Confirmer la suppression</v-card-title>
          <v-card-text>
            Êtes-vous sûr de vouloir supprimer ce médicament ? Cette action est irréversible.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="deleteDialog = false">
              Annuler
            </v-btn>
            <v-btn color="red-darken-1" variant="text" @click="confirmDelete">
              Supprimer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="$refs.addForm.openDialog()">
          Ajouter un médicament
        </v-btn>
      </v-card-actions>
    </v-card>

    <AddMedicamentForm ref="addForm" @med-added="handleMedAdded" />
  </v-container>
</template>

<style scoped>
.v-btn {
  margin: 0 4px;
}
</style>