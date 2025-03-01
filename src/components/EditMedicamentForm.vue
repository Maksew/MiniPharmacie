<script setup>
import { ref, watch, computed } from 'vue'
import { updateMedicament } from '../composables/usePharmacy.js'

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
const loading = ref(false)

function initialize() {
  if (props.medicament) {
    denomination.value = props.medicament.denomination
    forme.value = props.medicament.formePharmaceutique
    qte.value = props.medicament.qte
  }
}

watch(() => props.medicament, initialize, { immediate: true })

async function handleUpdate() {
  loading.value = true

  try {
    const updatedMed = {
      id: props.medicament.id,
      denomination: denomination.value,
      formepharmaceutique: forme.value,
      qte: qte.value
    }

    const result = await updateMedicament(updatedMed)
    if (result) {
      emit('med-updated', result)
      emit('close')
    }
  } catch (error) {
    console.error('Erreur de mise à jour des médicaments : ', error)
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
              ></v-text-field>
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