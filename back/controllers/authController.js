const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { findUserByUsername, findUserById } = require('../models/userModel')
const { HttpError, exigirCampos, texto } = require('./helpers')

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
    const user = await findUserByUsername(texto(req.body.username))
    // Mesma mensagem para usuário inexistente e senha errada, para não revelar quais usuários existem - [Otávio Michels]
    if (!user || !(await bcrypt.compare(String(req.body.password), user.password))) {
        throw new HttpError(401, 'Usuário ou senha inválidos')
    }

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
