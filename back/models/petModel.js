const { run, get, all } = require('../db/database')

// Consulta base dos pets já trazendo o nome do tutor (relação pets.tutor_id -> tutores.id) - [Otávio Michels]
const SELECT_PET = `
    SELECT p.*, t.nome AS tutor_nome
    FROM pets p
    JOIN tutores t ON t.id = p.tutor_id
`

// Lista todos os pets ou só os de um tutor, quando tutorId é informado - [Otávio Michels]
function getPets(tutorId) {
    if (tutorId) {
        return all(`${SELECT_PET} WHERE p.tutor_id = ? ORDER BY p.nome`, [tutorId])
    }
    return all(`${SELECT_PET} ORDER BY p.nome`)
}

function findPetById(id) {
    return get(`${SELECT_PET} WHERE p.id = ?`, [id])
}

async function createPet({ nome, especie, raca, sexo, tutor_id }) {
    const { id } = await run(
        'INSERT INTO pets (nome, especie, raca, sexo, tutor_id) VALUES (?, ?, ?, ?, ?)',
        [nome, especie, raca, sexo, tutor_id]
    )
    return findPetById(id)
}

async function updatePet(id, { nome, especie, raca, sexo, tutor_id }) {
    await run(
        'UPDATE pets SET nome = ?, especie = ?, raca = ?, sexo = ?, tutor_id = ? WHERE id = ?',
        [nome, especie, raca, sexo, tutor_id, id]
    )
    return findPetById(id)
}

async function deletePet(id) {
    const { changes } = await run('DELETE FROM pets WHERE id = ?', [id])
    return changes > 0
}

module.exports = { getPets, findPetById, createPet, updatePet, deletePet }
