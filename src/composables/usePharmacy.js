import { ref } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const medicaments = ref([])
const loading = ref(false)
const error = ref(null)

async function loadMedicaments() {
    loading.value = true
    error.value = null

    try {
        const response = await fetch(API_BASE + 'medicaments')
        medicaments.value = await response.json()
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
        console.error('Erreur d\'ajout de médicaments : ', err)
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
        console.error('Erreur dans la suppression des médicaments : ', err)
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
        const response = await fetch(API_BASE + 'medicaments', {
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
        console.error('Erreur de mise à jour des médicaments : ', err)
        error.value = err.message
        throw err
    } finally {
        loading.value = false
    }
}

export {
    medicaments,
    loading,
    error,
    loadMedicaments,
    addMedicament,
    deleteMedicament,
    updateMedicament
}