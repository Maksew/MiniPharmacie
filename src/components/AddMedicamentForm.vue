<script setup>
import { ref } from 'vue'
import { addMedicament } from '../composables/usePharmacy.js'

const emit = defineEmits(['med-added'])
const dialog = ref(false)
const loading = ref(false)

const newDenomination = ref('')
const newForme = ref('')
const newQte = ref(1)

function openDialog() {
  dialog.value = true
}

function resetForm() {
  newDenomination.value = ''
  newForme.value = ''
  newQte.value = 1
}

async function handleAdd() {
  loading.value = true

  try {
    const body = {
      denomination: newDenomination.value,
      formepharmaceutique: newForme.value,
      qte: newQte.value
    }

    const newMed = await addMedicament(body)
    emit('med-added', newMed)

    if (newMed.status === 1) {
      resetForm()
      dialog.value = false
    }
  } catch (error) {
    console.error('Erreur d\'ajout de médicaments : ', error)
  } finally {
    loading.value = false
  }
}
defineExpose({ openDialog })
</script>

<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5 bg-primary text-white">
          <v-icon class="mr-2">mdi-pill</v-icon>
          Ajouter un médicament
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="newDenomination"
                    label="Dénomination"
                    required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                    v-model="newForme"
                    label="Forme pharmaceutique"
                    required
                    hint="Ex: comprimé, sirop, gélules, etc."
                    persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                    v-model.number="newQte"
                    label="Quantité"
                    type="number"
                    required
                    min="1"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
            Annuler
          </v-btn>
          <v-btn
              color="blue-darken-1"
              variant="text"
              @click="handleAdd"
              :loading="loading"
          >
            Ajouter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>