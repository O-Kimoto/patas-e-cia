const model = require('../models/userModel')
const { HttpError, exigirCampos, idDaRota, texto } = require('./helpers')

const SENHA_MINIMA = 6
// Login de 3 a 30 caracteres: letras sem acento, números, ponto, hífen ou sublinhado (sem espaço) - [Gabriel França]
const FORMATO_LOGIN = /^[A-Za-z0-9._-]{3,30}$/

// Valida nome, login e senha; a senha só é obrigatória no cadastro - [Gabriel França]
function dadosDoUsuario(body, senhaObrigatoria) {
    exigirCampos(body, senhaObrigatoria ? ['nome', 'username', 'password'] : ['nome', 'username'])
    const username = texto(body.username)
    if (!FORMATO_LOGIN.test(username)) {
        throw new HttpError(400, 'Login deve ter de 3 a 30 caracteres: letras sem acento, números, ponto, hífen ou sublinhado')
    }
    const vazia = body.password === undefined || body.password === null || body.password === ''
    const password = vazia ? null : String(body.password)
    if (password !== null && password.length < SENHA_MINIMA) {
        throw new HttpError(400, `Senha deve ter pelo menos ${SENHA_MINIMA} caracteres`)
    }
    return { nome: texto(body.nome), username, password }
}

// Dois usuários com o mesmo login (mesmo mudando maiúsculas) confundiriam quem entra - [Gabriel França]
async function verificarLoginRepetido(username, id = 0) {
    const igual = (await model.getUsers()).find((u) => u.id !== id && u.username.toLowerCase() === username.toLowerCase())
    if (igual) throw new HttpError(409, `O login "${igual.username}" já está em uso`)
}

// Lista quem pode entrar no sistema; a senha (hash) nunca vem junto, ver CAMPOS_PUBLICOS no model - [Otávio Michels]
async function listar(req, res) {
    res.json({ usuarios: await model.getUsers() })
}

async function buscar(req, res) {
    const usuario = await model.findUserById(idDaRota(req))
    if (!usuario) throw new HttpError(404, 'Usuário não encontrado')
    res.json({ usuario })
}

// Cadastra quem vai entrar no sistema; o model guarda só o hash bcrypt da senha - [Gabriel França]
async function criar(req, res) {
    const dados = dadosDoUsuario(req.body, true)
    await verificarLoginRepetido(dados.username)
    const usuario = await model.createUser(dados)
    res.status(201).json({ message: 'Usuário criado com sucesso', usuario })
}

module.exports = { listar, buscar, criar }
