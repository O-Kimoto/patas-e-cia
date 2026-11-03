const { run, get, all } = require('../db/database')

// Lista os tutores com a quantidade de pets de cada um - [Otávio Michels]
function getTutores() {
    return all(`
        SELECT t.*, COUNT(p.id) AS total_pets
        FROM tutores t
        LEFT JOIN pets p ON p.tutor_id = t.id
        GROUP BY t.id
        ORDER BY t.nome
    `)
}

function findTutorById(id) {
    return get('SELECT * FROM tutores WHERE id = ?', [id])
}

// Insere um tutor com o endereço já separado em campos (preenchido pelo ViaCEP no front) - [Otávio Michels]
async function createTutor(t) {
    const { id } = await run(
        `INSERT INTO tutores (nome, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, uf)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [t.nome, t.email, t.telefone, t.cep, t.logradouro, t.numero, t.complemento, t.bairro, t.cidade, t.uf]
    )
    return findTutorById(id)
}

async function updateTutor(id, t) {
    await run(
        `UPDATE tutores SET nome = ?, email = ?, telefone = ?, cep = ?, logradouro = ?, numero = ?,
         complemento = ?, bairro = ?, cidade = ?, uf = ? WHERE id = ?`,
        [t.nome, t.email, t.telefone, t.cep, t.logradouro, t.numero, t.complemento, t.bairro, t.cidade, t.uf, id]
    )
    return findTutorById(id)
}

async function deleteTutor(id) {
    const { changes } = await run('DELETE FROM tutores WHERE id = ?', [id])
    return changes > 0
}

module.exports = { getTutores, findTutorById, createTutor, updateTutor, deleteTutor }
