import { ref } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://apipharmacie.pecatte.fr/api/25/'
const IMAGE_BASE_URL = 'https://apipharmacie.pecatte.fr/images/'

const medicaments = ref([])
const loading = ref(false)
const error = ref(null)

function getFullImageUrl(imagePath) {
    if (!imagePath) return null
    return `${IMAGE_BASE_URL}${imagePath}`
}

async function loadMedicaments() {
    loading.value = true
    error.value = null

    try {
        console.log("Chargement des médicaments depuis:", API_BASE + 'medicaments')
        const response = await fetch(API_BASE + 'medicaments')
        const data = await response.json()
        medicaments.value = data
        return medicaments.value
    } catch (err) {
        console.error('Erreur de chargement des médicaments:', err)
        error.value = err.message
        throw err
    } finally {
        loading.value = false
    }
}

async function addMedicament(data) {
    loading.value = true
    error.value = null

    try {
        const response = await fetch(API_BASE + 'medicaments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        if (result.status === 1) {
            await loadMedicaments()
        }
        return result
    } catch (err) {
        console.error('Erreur d\'ajout de médicament:', err)
        error.value = err.message
        throw err
    } finally {
        loading.value = false
    }
}

async function deleteMedicament(id) {
    loading.value = true
    error.value = null

    try {
        const response = await fetch(API_BASE + 'medicaments/' + id, {
            method: 'DELETE'
        })
        const result = await response.json()
        if (result.status === 1) {
            await loadMedicaments()
        }
        return result
    } catch (err) {
        console.error('Erreur de suppression du médicament:', err)
        error.value = err.message
        throw err
    } finally {
        loading.value = false
    }
}

async function updateMedicament(data) {
    loading.value = true
    error.value = null

    try {
        const response = await fetch(`${API_BASE}medicaments`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        if (result.status === 1) {
            await loadMedicaments()
        }
        return result
    } catch (err) {
        console.error('Erreur de mise à jour du médicament:', err)
        error.value = err.message
        throw err
    } finally {
        loading.value = false
    }
}

async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
        reader.readAsDataURL(file)
    })
}

export {
    medicaments,
    loading,
    error,
    loadMedicaments,
    addMedicament,
    deleteMedicament,
    updateMedicament,
    getFullImageUrl,
    fileToBase64
}