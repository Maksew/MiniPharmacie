<script setup>
import { ref, watch, computed } from 'vue'
import { updateMedicament, fileToBase64, getFullImageUrl } from '../composables/usePharmacy.js'

const props = defineProps({
  medicament: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'med-updated', 'update:isOpen'])

const localIsOpen = computed({
  get: () => props.isOpen,
  set: (value) => emit('update:isOpen', value)
})

const denomination = ref('')
const forme = ref('')
const qte = ref(0)
const photo = ref('')
const photoPreview = ref(null)
const loading = ref(false)

function initialize() {
  if (props.medicament) {
    console.log("Initialisation du formulaire avec:", props.medicament)
    denomination.value = props.medicament.denomination || ''
    forme.value = props.medicament.formepharmaceutique || ''
    qte.value = props.medicament.qte || 0
    photo.value = props.medicament.photo || ''

    if (photo.value) {
      photoPreview.value = getFullImageUrl(photo.value)
    } else {
      photoPreview.value = null
    }
  }
}

watch(() => props.medicament, initialize, { immediate: true })

async function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    photoPreview.value = URL.createObjectURL(file)
    photo.value = await fileToBase64(file)
  } catch (error) {
    console.error("Erreur lors de la conversion du fichier en base64:", error)
  }
}

async function handleUpdate() {
  if (!denomination.value || !forme.value) {
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }

  loading.value = true

  try {
    const updatedMed = {
      id: props.medicament.id,
      denomination: denomination.value,
      formepharmaceutique: forme.value,
      qte: qte.value,
      photo: photo.value
    }

    console.log("Tentative de mise à jour avec:", {
      ...updatedMed,
      photo: updatedMed.photo ? (updatedMed.photo.startsWith('data:') ? 'BASE64_IMAGE' : updatedMed.photo) : null
    })

    const result = await updateMedicament(updatedMed)
    console.log("Résultat de la mise à jour:", result)

    if (result && result.status === 1) {
      emit('med-updated', result)
      emit('close')
    }
  } catch (error) {
    console.error('Erreur de mise à jour du médicament:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-dialog v-model="localIsOpen" max-width="500px">
    <v-card>
      <v-card-title class="text-h5 bg-primary text-white">
        <v-icon class="mr-2">mdi-pencil</v-icon>
        Modifier le médicament
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" class="d-flex justify-center">
              <v-avatar size="100" rounded color="grey-lighten-2">
                <v-img v-if="photoPreview"
                       :src="photoPreview"
                       alt="Image médicament"
                       cover
                       :aspect-ratio="1"
                       class="bg-grey-lighten-2"
                >
                  <template v-slot:error>
                    <v-icon icon="mdi-image-off" size="large" color="grey-darken-2"></v-icon>
                  </template>
                </v-img>
                <v-icon v-else icon="mdi-image-off" size="large" color="grey-darken-2"></v-icon>
              </v-avatar>
            </v-col>

            <v-col cols="12">
              <v-text-field
                  v-model="denomination"
                  label="Dénomination"
                  required
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                  v-model="forme"
                  label="Forme pharmaceutique"
                  required
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                  v-model.number="qte"
                  label="Quantité"
                  type="number"
                  required
                  min="0"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-file-input
                  label="Téléverser une nouvelle image"
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
        <v-btn color="blue-darken-1" variant="text" @click="$emit('close')">
          Annuler
        </v-btn>
        <v-btn
            color="blue-darken-1"
            variant="text"
            @click="handleUpdate"
            :loading="loading"
        >
          Mettre à jour
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>