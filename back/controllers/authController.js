const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { findUserByUsername, findUserById } = require('../models/userModel')
const { HttpError, exigirCampos, texto } = require('./helpers')

// Limite contra quem tenta adivinhar a senha: depois de 5 erros seguidos, aquele usuário fica
// bloqueado por 15 minutos no mesmo IP. Fica em memória, então zera quando o servidor reinicia - [Gabriel França]
const MAX_TENTATIVAS = 5
const BLOQUEIO_MS = 15 * 60 * 1000
const tentativas = new Map()

function chaveDaTentativa(req, username) {
    return `${req.ip}|${String(username).toLowerCase()}`
}

function verificarBloqueio(chave) {
    const t = tentativas.get(chave)
    if (!t) return
    if (Date.now() - t.ultima > BLOQUEIO_MS) {
        tentativas.delete(chave)
        return
    }
    if (t.erros >= MAX_TENTATIVAS) {
        const minutos = Math.ceil((t.ultima + BLOQUEIO_MS - Date.now()) / 60000)
        throw new HttpError(429, `Muitas tentativas erradas. Tente de novo em ${minutos} minuto(s).`)
    }
}

function registrarErro(chave) {
    const t = tentativas.get(chave)
    tentativas.set(chave, { erros: (t ? t.erros : 0) + 1, ultima: Date.now() })
    // Tira os registros vencidos para o Map não crescer sem parar - [Gabriel França]
    if (tentativas.size > 1000) {
        for (const [k, v] of tentativas) {
            if (Date.now() - v.ultima > BLOQUEIO_MS) tentativas.delete(k)
        }
    }
}

// Gera o token JWT com id e usuário; a validade vem do .env (padrão 1 dia) - [Otávio Michels]
function gerarToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username, nome: user.nome },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    )
}

// Login: confere a senha com bcrypt e devolve o token JWT - [Otávio Michels]
async function login(req, res) {
    exigirCampos(req.body, ['username', 'password'])
    const username = texto(req.body.username)
    const chave = chaveDaTentativa(req, username)
    verificarBloqueio(chave)

    const user = await findUserByUsername(username)
    // Mesma mensagem para usuário inexistente e senha errada, para não revelar quais usuários existem - [Otávio Michels]
    if (!user || !(await bcrypt.compare(String(req.body.password), user.password))) {
        registrarErro(chave)
        throw new HttpError(401, 'Usuário ou senha inválidos')
    }

    tentativas.delete(chave)
    const token = gerarToken(user)
    res.json({ message: 'Login bem-sucedido', token, user: { id: user.id, nome: user.nome, username: user.username } })
}

// Devolve o usuário dono do token (usado na barra superior do front) - [Otávio Michels]
async function me(req, res) {
    const user = await findUserById(req.user.id)
    if (!user) throw new HttpError(404, 'Usuário não encontrado')
    res.json({ user })
}

module.exports = { login, me }
