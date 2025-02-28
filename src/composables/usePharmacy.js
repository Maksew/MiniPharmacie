import { ref } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const medicaments = ref([])

async function loadMedicaments() {
    const response = await fetch(API_BASE + 'medicaments')
    medicaments.value = await response.json()
}

async function addMedicament(data) {
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
}

async function deleteMedicament(id) {
    const response = await fetch(API_BASE + 'medicaments/' + id, {
        method: 'DELETE'
    })
    const result = await response.json()
    if (result.status === 1) {
        await loadMedicaments()
    }
    return result
}

async function updateMedicament(data) {
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
}

export {
    medicaments,
    loadMedicaments,
    addMedicament,
    deleteMedicament,
    updateMedicament
}
