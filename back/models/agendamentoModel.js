const { run, get, all } = require('../db/database')

// Consulta base dos agendamentos com os nomes de tutor, pet e serviço (JOIN nas três tabelas) - [Otávio Michels]
const SELECT_AGENDAMENTO = `
    SELECT a.*,
           t.nome AS tutor_nome,
           p.nome AS pet_nome,
           p.especie AS pet_especie,
           s.nome AS servico_nome,
           s.preco AS servico_preco
    FROM agendamentos a
    JOIN tutores t ON t.id = a.tutor_id
    JOIN pets p ON p.id = a.pet_id
    JOIN servicos s ON s.id = a.servico_id
`

// Lista agendamentos, com filtro opcional por status e por dia (YYYY-MM-DD) - [Otávio Michels]
function getAgendamentos({ status, data, pet, tutor } = {}) {
    const where = []
    const params = []
    if (status) {
        where.push('a.status = ?')
        params.push(status)
    }
    if (data) {
        where.push('substr(a.data_hora, 1, 10) = ?')
        params.push(data)
    }
    // Filtros por pet e por tutor, para ver o histórico de atendimentos - [Gabriel França]
    if (pet) {
        where.push('a.pet_id = ?')
        params.push(pet)
    }
    if (tutor) {
        where.push('a.tutor_id = ?')
        params.push(tutor)
    }
    const filtro = where.length ? `WHERE ${where.join(' AND ')}` : ''
    return all(`${SELECT_AGENDAMENTO} ${filtro} ORDER BY a.data_hora`, params)
}

function findAgendamentoById(id) {
    return get(`${SELECT_AGENDAMENTO} WHERE a.id = ?`, [id])
}

async function createAgendamento({ tutor_id, pet_id, servico_id, data_hora, status, observacoes }) {
    const { id } = await run(
        `INSERT INTO agendamentos (tutor_id, pet_id, servico_id, data_hora, status, observacoes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [tutor_id, pet_id, servico_id, data_hora, status, observacoes]
    )
    return findAgendamentoById(id)
}

async function updateAgendamento(id, { tutor_id, pet_id, servico_id, data_hora, status, observacoes }) {
    await run(
        `UPDATE agendamentos SET tutor_id = ?, pet_id = ?, servico_id = ?, data_hora = ?, status = ?, observacoes = ?
         WHERE id = ?`,
        [tutor_id, pet_id, servico_id, data_hora, status, observacoes, id]
    )
    return findAgendamentoById(id)
}

async function deleteAgendamento(id) {
    const { changes } = await run('DELETE FROM agendamentos WHERE id = ?', [id])
    return changes > 0
}

// Procura outro agendamento do mesmo pet no mesmo horário, ignorando os cancelados - [Gabriel França]
function findConflito(petId, dataHora, ignorarId = 0) {
    return get(
        `SELECT id FROM agendamentos
         WHERE pet_id = ? AND data_hora = ? AND status <> 'Cancelado' AND id <> ?`,
        [petId, dataHora, ignorarId]
    )
}

module.exports = { getAgendamentos, findAgendamentoById, createAgendamento, updateAgendamento, deleteAgendamento, findConflito }
