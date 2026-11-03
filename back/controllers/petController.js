const model = require('../models/petModel')
const { findTutorById } = require('../models/tutorModel')
const { HttpError, exigirCampos, idDaRota, traduzirEmUso, texto } = require('./helpers')

// Valida os campos do pet e confere se o tutor informado existe - [Otávio Michels]
async function dadosDoPet(body) {
    exigirCampos(body, ['nome', 'especie', 'sexo', 'tutor_id'])
    const sexo = String(body.sexo).toUpperCase()
    if (!['M', 'F'].includes(sexo)) {
        throw new HttpError(400, 'Sexo deve ser M (macho) ou F (fêmea)')
    }
    const tutorId = Number(body.tutor_id)
    if (!(await findTutorById(tutorId))) {
        throw new HttpError(400, 'Tutor informado não existe')
    }
    return { nome: texto(body.nome), especie: texto(body.especie), raca: texto(body.raca), sexo, tutor_id: tutorId }
}

// Aceita ?tutor_id= para listar só os pets de um tutor (usado no agendamento) - [Otávio Michels]
async function listar(req, res) {
    res.json({ pets: await model.getPets(req.query.tutor_id ? Number(req.query.tutor_id) : null) })
}

async function buscar(req, res) {
    const pet = await model.findPetById(idDaRota(req))
    if (!pet) throw new HttpError(404, 'Pet não encontrado')
    res.json({ pet })
}

async function criar(req, res) {
    const pet = await model.createPet(await dadosDoPet(req.body))
    res.status(201).json({ message: 'Pet criado com sucesso', pet })
}

async function atualizar(req, res) {
    const id = idDaRota(req)
    if (!(await model.findPetById(id))) throw new HttpError(404, 'Pet não encontrado')
    const pet = await model.updatePet(id, await dadosDoPet(req.body))
    res.json({ message: 'Pet atualizado com sucesso', pet })
}

async function remover(req, res) {
    const id = idDaRota(req)
    const apagou = await model.deletePet(id).catch((err) =>
        traduzirEmUso(err, 'Este pet tem agendamentos. Exclua os agendamentos antes de excluir o pet.')
    )
    if (!apagou) throw new HttpError(404, 'Pet não encontrado')
    res.json({ message: 'Pet excluído com sucesso' })
}

module.exports = { listar, buscar, criar, atualizar, remover }
