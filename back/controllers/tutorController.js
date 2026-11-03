const model = require('../models/tutorModel')
const { HttpError, exigirCampos, idDaRota, traduzirEmUso, texto } = require('./helpers')

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

// Valida nome, telefone, e-mail e UF e normaliza o CEP para 00000-000 - [Otávio Michels]
function dadosDoTutor(body) {
    exigirCampos(body, ['nome', 'telefone'])
    // Telefone precisa ter DDD e número: 10 dígitos (fixo) ou 11 (celular) - [Gabriel França]
    const digitosTelefone = String(body.telefone).replace(/\D/g, '')
    if (digitosTelefone.length < 10 || digitosTelefone.length > 11) {
        throw new HttpError(400, 'Telefone deve ter DDD e número (10 ou 11 dígitos)')
    }
    const email = texto(body.email)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new HttpError(400, 'E-mail inválido')
    }
    const uf = texto(body.uf) ? texto(body.uf).toUpperCase() : null
    if (uf && !UFS.includes(uf)) {
        throw new HttpError(400, 'UF inválida')
    }
    let cep = texto(body.cep)
    if (cep) {
        const digitos = cep.replace(/\D/g, '')
        if (digitos.length !== 8) throw new HttpError(400, 'CEP deve ter 8 dígitos')
        cep = `${digitos.slice(0, 5)}-${digitos.slice(5)}`
    }
    return {
        nome: texto(body.nome),
        email,
        telefone: texto(body.telefone),
        cep,
        logradouro: texto(body.logradouro),
        numero: texto(body.numero),
        complemento: texto(body.complemento),
        bairro: texto(body.bairro),
        cidade: texto(body.cidade),
        uf
    }
}

async function listar(req, res) {
    res.json({ tutores: await model.getTutores() })
}

async function buscar(req, res) {
    const tutor = await model.findTutorById(idDaRota(req))
    if (!tutor) throw new HttpError(404, 'Tutor não encontrado')
    res.json({ tutor })
}

async function criar(req, res) {
    const tutor = await model.createTutor(dadosDoTutor(req.body))
    res.status(201).json({ message: 'Tutor criado com sucesso', tutor })
}

async function atualizar(req, res) {
    const id = idDaRota(req)
    if (!(await model.findTutorById(id))) throw new HttpError(404, 'Tutor não encontrado')
    const tutor = await model.updateTutor(id, dadosDoTutor(req.body))
    res.json({ message: 'Tutor atualizado com sucesso', tutor })
}

// Tutor com pets ou agendamentos não pode ser apagado (chave estrangeira) - [Otávio Michels]
async function remover(req, res) {
    const id = idDaRota(req)
    const apagou = await model.deleteTutor(id).catch((err) =>
        traduzirEmUso(err, 'Este tutor tem pets ou agendamentos cadastrados. Exclua-os antes de excluir o tutor.')
    )
    if (!apagou) throw new HttpError(404, 'Tutor não encontrado')
    res.json({ message: 'Tutor excluído com sucesso' })
}

module.exports = { listar, buscar, criar, atualizar, remover }
