const bcrypt = require('bcryptjs')
const { run, get, all } = require('../db/database')

// Campos devolvidos para o front: a senha (hash) nunca sai do banco - [Otávio Michels]
const CAMPOS_PUBLICOS = 'id, nome, username, criado_em'

// Usado no login: aqui precisa da senha para comparar o hash - [Otávio Michels]
function findUserByUsername(username) {
    return get('SELECT * FROM users WHERE username = ?', [username])
}

function findUserById(id) {
    return get(`SELECT ${CAMPOS_PUBLICOS} FROM users WHERE id = ?`, [id])
}

function getUsers() {
    return all(`SELECT ${CAMPOS_PUBLICOS} FROM users ORDER BY nome, username`)
}

// Cria usuário guardando só o hash bcrypt da senha - [Otávio Michels]
async function createUser({ nome, username, password }) {
    const hash = await bcrypt.hash(password, 10)
    const { id } = await run('INSERT INTO users (nome, username, password) VALUES (?, ?, ?)', [nome, username, hash])
    return findUserById(id)
}

// Atualiza nome/usuário; a senha só muda quando uma nova é enviada - [Otávio Michels]
async function updateUser(id, { nome, username, password }) {
    if (password) {
        const hash = await bcrypt.hash(password, 10)
        await run('UPDATE users SET nome = ?, username = ?, password = ? WHERE id = ?', [nome, username, hash, id])
    } else {
        await run('UPDATE users SET nome = ?, username = ? WHERE id = ?', [nome, username, id])
    }
    return findUserById(id)
}

async function deleteUser(id) {
    const { changes } = await run('DELETE FROM users WHERE id = ?', [id])
    return changes > 0
}

module.exports = { findUserByUsername, findUserById, getUsers, createUser, updateUser, deleteUser }
