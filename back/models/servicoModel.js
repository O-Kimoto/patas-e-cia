const { run, get, all } = require('../db/database')

// CRUD dos serviços do petshop (banho, tosa, consulta, vacinação...) - [Otávio Michels]
function getServicos() {
    return all('SELECT * FROM servicos ORDER BY nome')
}

function findServicoById(id) {
    return get('SELECT * FROM servicos WHERE id = ?', [id])
}

async function createServico({ nome, descricao, preco }) {
    const { id } = await run('INSERT INTO servicos (nome, descricao, preco) VALUES (?, ?, ?)', [nome, descricao, preco])
    return findServicoById(id)
}

async function updateServico(id, { nome, descricao, preco }) {
    await run('UPDATE servicos SET nome = ?, descricao = ?, preco = ? WHERE id = ?', [nome, descricao, preco, id])
    return findServicoById(id)
}

async function deleteServico(id) {
    const { changes } = await run('DELETE FROM servicos WHERE id = ?', [id])
    return changes > 0
}

module.exports = { getServicos, findServicoById, createServico, updateServico, deleteServico }
