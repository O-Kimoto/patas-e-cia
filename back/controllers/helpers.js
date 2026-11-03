// Erro com status HTTP, lançado pelos controllers e tratado no app.js - [Otávio Michels]
class HttpError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
    }
}

// Express 4 não captura erro de função async: este wrapper manda o erro para o tratador central - [Otávio Michels]
function asyncHandler(fn) {
    return (req, res, next) => fn(req, res, next).catch(next)
}

// Garante que os campos obrigatórios vieram preenchidos no corpo da requisição - [Otávio Michels]
function exigirCampos(body, campos) {
    const faltando = campos.filter((c) => body[c] === undefined || body[c] === null || String(body[c]).trim() === '')
    if (faltando.length) {
        throw new HttpError(400, `Campos obrigatórios não preenchidos: ${faltando.join(', ')}`)
    }
}

// Lê o :id da rota e recusa valores que não são número inteiro positivo - [Otávio Michels]
function idDaRota(req) {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
        throw new HttpError(400, 'ID inválido')
    }
    return id
}

// Converte preço/estoque vindos do front e valida que não são negativos - [Otávio Michels]
function numeroNaoNegativo(valor, campo, inteiro = false) {
    const n = Number(valor)
    if (!Number.isFinite(n) || n < 0 || (inteiro && !Number.isInteger(n))) {
        throw new HttpError(400, `${campo} deve ser um número ${inteiro ? 'inteiro ' : ''}maior ou igual a zero`)
    }
    return n
}

// Troca o erro de chave estrangeira do SQLite por uma mensagem que o usuário entende - [Otávio Michels]
function traduzirEmUso(err, mensagem) {
    if (err && err.code === 'SQLITE_CONSTRAINT' && /FOREIGN KEY/.test(err.message)) {
        throw new HttpError(409, mensagem)
    }
    throw err
}

// Remove espaços das pontas dos textos e troca string vazia por null - [Otávio Michels]
function texto(valor) {
    if (valor === undefined || valor === null) return null
    const t = String(valor).trim()
    return t === '' ? null : t
}

module.exports = { HttpError, asyncHandler, exigirCampos, idDaRota, numeroNaoNegativo, traduzirEmUso, texto }
