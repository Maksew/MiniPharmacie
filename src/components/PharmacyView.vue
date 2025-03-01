<script setup>
import { onMounted, ref, computed } from 'vue'
import {
  medicaments,
  loading,
  loadMedicaments,
  deleteMedicament,
  updateMedicament,
  getFullImageUrl
} from '../composables/usePharmacy.js'

import AddMedicamentForm from './AddMedicamentForm.vue'
import EditMedicamentForm from './EditMedicamentForm.vue'

const searchTerm = ref('')
const deleteDialog = ref(false)
const medicamentToDelete = ref(null)

const editDialog = ref(false)
const currentMedicament = ref(null)

const itemsPerPage = ref(10)
const itemsPerPageOptions = [
  { value: 10, title: '10' },
  { value: 25, title: '25' },
  { value: 50, title: '50' },
  { value: 100, title: '100' },
  { value: -1, title: 'Tous' },
]

onMounted(async () => {
  console.log("Composant monté, chargement des médicaments...")
  await loadMedicaments()
  console.log("Médicaments chargés:", medicaments.value)
})

function openEditDialog(med) {
  console.log("Ouverture du formulaire d'édition avec:", med)
  currentMedicament.value = {...med}
  editDialog.value = true
}

function handleMedUpdated(result) {
  console.log("Médicament mis à jour:", result)
  loadMedicaments()
}

function handleMedAdded(result) {
  console.log("Médicament ajouté:", result)
  if (result.status === 1) {
    loadMedicaments()
  }
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
      (m.formepharmaceutique && m.formepharmaceutique.toLowerCase().includes(t))
  )
})

function getImageUrl(med) {
  if (!med.photo) return null
  return getFullImageUrl(med.photo)
}

function handleImageError(item) {
  console.log(`Erreur de chargement d'image pour ${item.denomination}, utilisation du fallback`)
}
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
            { title: 'Image', key: 'photo', sortable: false, align: 'center', width: '80px' },
            { title: 'Dénomination', key: 'denomination' },
            { title: 'Forme', key: 'formepharmaceutique' },
            { title: 'Quantité', key: 'qte' },
            { title: 'Actions', key: 'actions', sortable: false, align: 'center' }
          ]"
          :items="filteredMedicaments"
          :loading="loading"
          :items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions"
      >
        <template v-slot:item.photo="{ item }">
          <v-avatar size="50" rounded color="grey-lighten-2">
            <v-img
                :src="getImageUrl(item)"
                :alt="item.denomination"
                cover
                :aspect-ratio="1"
                class="bg-grey-lighten-2"
                @error="handleImageError(item)"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey-darken-2"></v-progress-circular>
                </v-row>
              </template>
              <template v-slot:error>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-icon icon="mdi-image-off" color="grey-darken-2"></v-icon>
                </v-row>
              </template>
            </v-img>
          </v-avatar>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-tooltip location="top" text="Modifier">
            <template v-slot:activator="{ props }">
              <v-btn
                  size="small"
                  color="info"
                  icon
                  class="mr-2"
                  v-bind="props"
                  @click="openEditDialog(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Ajouter 1 unité">
            <template v-slot:activator="{ props }">
              <v-btn
                  size="small"
                  color="primary"
                  icon
                  class="mr-2"
                  v-bind="props"
                  @click="handleIncrement(item)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Retirer 1 unité">
            <template v-slot:activator="{ props }">
              <v-btn
                  size="small"
                  color="warning"
                  icon
                  class="mr-2"
                  v-bind="props"
                  @click="handleDecrement(item)"
                  :disabled="item.qte <= 0"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Supprimer">
            <template v-slot:activator="{ props }">
              <v-btn
                  size="small"
                  color="error"
                  icon
                  v-bind="props"
                  @click="openDeleteDialog(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>

        <template v-slot:footer.page-text="{ pageStart, pageStop, itemsLength }">
          {{ pageStart }}-{{ pageStop }} sur {{ itemsLength }}
        </template>

        <template v-slot:footer.items-per-page-text>
          Éléments par page
        </template>
      </v-data-table>

      <EditMedicamentForm
          v-if="currentMedicament"
          :medicament="currentMedicament"
          v-model:isOpen="editDialog"
          @med-updated="handleMedUpdated"
          @close="editDialog = false"
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