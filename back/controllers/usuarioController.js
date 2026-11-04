const model = require('../models/userModel')
const { HttpError, idDaRota } = require('./helpers')

// Lista quem pode entrar no sistema; a senha (hash) nunca vem junto, ver CAMPOS_PUBLICOS no model - [Otávio Michels]
async function listar(req, res) {
    res.json({ usuarios: await model.getUsers() })
}

async function buscar(req, res) {
    const usuario = await model.findUserById(idDaRota(req))
    if (!usuario) throw new HttpError(404, 'Usuário não encontrado')
    res.json({ usuario })
}

module.exports = { listar, buscar }
