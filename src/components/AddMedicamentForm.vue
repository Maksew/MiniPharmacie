<script setup>
import { ref } from 'vue'
import { addMedicament, fileToBase64 } from '../composables/usePharmacy.js'

const emit = defineEmits(['med-added'])
const dialog = ref(false)
const loading = ref(false)

const newDenomination = ref('')
const newForme = ref('')
const newQte = ref(1)
const newPhoto = ref('')
const photoPreview = ref(null)

function openDialog() {
  dialog.value = true
}

function resetForm() {
  newDenomination.value = ''
  newForme.value = ''
  newQte.value = 1
  newPhoto.value = ''
  photoPreview.value = null
}

async function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    photoPreview.value = URL.createObjectURL(file)
    newPhoto.value = await fileToBase64(file)
  } catch (error) {
    console.error("Erreur lors de la conversion du fichier en base64:", error)
  }
}

async function handleAdd() {
  if (!newDenomination.value || !newForme.value) {
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }

  loading.value = true

  try {
    const body = {
      denomination: newDenomination.value,
      formepharmaceutique: newForme.value,
      qte: newQte.value,
      photo: newPhoto.value
    }

    console.log("Tentative d'ajout avec:", {
      ...body,
      photo: body.photo ? 'BASE64_IMAGE' : null
    })

    const newMed = await addMedicament(body)
    emit('med-added', newMed)

    if (newMed.status === 1) {
      resetForm()
      dialog.value = false
    }
  } catch (error) {
    console.error('Erreur d\'ajout de médicament:', error)
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
              <v-col cols="12" class="d-flex justify-center">
                <v-avatar size="100" rounded color="primary">
                  <v-img v-if="photoPreview"
                         :src="photoPreview"
                         alt="Prévisualisation"
                         cover
                         :aspect-ratio="1"
                         class="bg-grey-lighten-2"
                  >
                    <template v-slot:error>
                      <v-icon icon="mdi-pill" size="large" color="white"></v-icon>
                    </template>
                  </v-img>
                  <v-icon v-else icon="mdi-pill" size="large" color="white"></v-icon>
                </v-avatar>
              </v-col>

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
                    min="0"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-file-input
                    label="Téléverser une image"
                    prepend-icon="mdi-camera"
                    accept="image/*"
                    @change="handleFileUpload"
                    hint="L'image sera convertie en base64 et envoyée à l'API"
                    persistent-hint
                ></v-file-input>
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