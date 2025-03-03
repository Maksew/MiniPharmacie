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
  { value: 3, title: '3' },
  { value: 5, title: '5' },
  { value: 10, title: '10' },
  { value: 25, title: '25' },
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
  const updated = { id: med.id, qte: med.qte + 1 }
  const res = await updateMedicament(updated)

  if (res && res.status === 1) {
    med.qte = med.qte + 1
  }
}

async function handleDecrement(med) {
  const updated = { id: med.id, qte: med.qte - 1 }
  const res = await updateMedicament(updated)

  if (res && res.status === 1) {
    med.qte = med.qte - 1
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
    <v-card class="mx-auto my-4 pharmacy-card">
      <v-card-title class="bg-pharmacy-blue text-white">
        <v-icon icon="mdi-pill" class="mr-2"></v-icon>
        Inventaire des médicaments
      </v-card-title>

      <v-card-text class="pa-4">
        <v-text-field
            v-model="searchTerm"
            prepend-icon="mdi-magnify"
            label="Rechercher un médicament"
            single-line
            variant="outlined"
            hide-details
            density="compact"
            class="mb-4 search-field"
        ></v-text-field>
      </v-card-text>

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
          class="pharmacy-table"
      >
        <template v-slot:item.photo="{ item }">
          <v-avatar size="50" rounded class="med-image">
            <v-img
                v-if="getImageUrl(item)"
                :src="getImageUrl(item)"
                :alt="item.denomination"
                cover
                :aspect-ratio="1"
                class="bg-grey-lighten-2"
                @error="handleImageError(item)"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </v-row>
              </template>
              <template v-slot:error>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-icon icon="mdi-pill" color="grey-darken-2"></v-icon>
                </v-row>
              </template>
            </v-img>
            <v-icon v-else icon="mdi-pill" color="grey-darken-2"></v-icon>
          </v-avatar>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-center gap-1">
            <!-- Modifier -->
            <v-btn
                size="small"
                color="pharmacy-blue"
                icon
                class="action-btn"
                @click="openEditDialog(item)"
            >
              <v-icon>mdi-pencil-outline</v-icon>
              <v-tooltip activator="parent" location="top">Modifier</v-tooltip>
            </v-btn>

            <!-- Ajouter 1 unité -->
            <v-btn
                size="small"
                color="pharmacy-green"
                icon
                class="action-btn"
                @click="handleIncrement(item)"
            >
              <v-icon>mdi-plus-circle-outline</v-icon>
              <v-tooltip activator="parent" location="top">Ajouter 1 unité</v-tooltip>
            </v-btn>

            <!-- Retirer 1 unité -->
            <v-btn
                size="small"
                color="amber-darken-2"
                icon
                class="action-btn"
                @click="handleDecrement(item)"
                :disabled="item.qte <= 0"
            >
              <v-icon>mdi-minus-circle-outline</v-icon>
              <v-tooltip activator="parent" location="top">Retirer 1 unité</v-tooltip>
            </v-btn>

            <!-- Supprimer -->
            <v-btn
                size="small"
                color="red-darken-2"
                icon
                class="action-btn"
                @click="openDeleteDialog(item)"
            >
              <v-icon>mdi-delete-outline</v-icon>
              <v-tooltip activator="parent" location="top">Supprimer</v-tooltip>
            </v-btn>
          </div>
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
          <v-card-title class="text-h5 bg-red-darken-1 text-white">
            <v-icon icon="mdi-alert" class="mr-2"></v-icon>
            Confirmer la suppression
          </v-card-title>
          <v-card-text class="pa-4 pt-4">
            <p>Êtes-vous sûr de vouloir supprimer ce médicament ?</p>
            <p class="text-caption text-grey">Cette action est irréversible.</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="deleteDialog = false">
              Annuler
            </v-btn>
            <v-btn color="red-darken-1" variant="text" @click="confirmDelete">
              Supprimer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="pharmacy-green" prepend-icon="mdi-plus-circle" @click="$refs.addForm.openDialog()"
               class="add-med-btn">
          Ajouter un médicament
        </v-btn>
      </v-card-actions>
    </v-card>

    <AddMedicamentForm ref="addForm" @med-added="handleMedAdded" />
  </v-container>
</template>

<style scoped>
.pharmacy-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.bg-pharmacy-blue {
  background-color: var(--pharmacy-blue) !important;
}

.pharmacy-table {
  box-shadow: none !important;
}

.search-field {
  max-width: 400px;
}

.action-btn {
  margin: 0 2px;
  transition: transform 0.2s;
}

.action-btn:hover {
  transform: scale(1.15);
}

.med-image {
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.add-med-btn {
  color: white !important;
  font-weight: 600;
  background-color: var(--pharmacy-green);
  border: 1px solid var(--pharmacy-green);
}

.add-med-btn:hover {
  background-color: #018a3f ;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

:deep(.v-data-table-header th) {
  font-weight: 600 !important;
  background-color: #f0f5fa !important;
}
</style>