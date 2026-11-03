const model = require('../models/agendamentoModel')
const { findTutorById } = require('../models/tutorModel')
const { findPetById } = require('../models/petModel')
const { findServicoById } = require('../models/servicoModel')
const { HttpError, exigirCampos, idDaRota, texto } = require('./helpers')

const STATUS = ['Agendado', 'Confirmado', 'Concluído', 'Cancelado']

// Valida o agendamento: tutor, pet e serviço precisam existir e o pet tem que ser do tutor - [Otávio Michels]
async function dadosDoAgendamento(body) {
    exigirCampos(body, ['tutor_id', 'pet_id', 'servico_id', 'data_hora'])
    const tutorId = Number(body.tutor_id)
    const petId = Number(body.pet_id)
    const servicoId = Number(body.servico_id)

    if (!(await findTutorById(tutorId))) throw new HttpError(400, 'Tutor informado não existe')
    const pet = await findPetById(petId)
    if (!pet) throw new HttpError(400, 'Pet informado não existe')
    if (pet.tutor_id !== tutorId) throw new HttpError(400, 'Esse pet não pertence ao tutor escolhido')
    if (!(await findServicoById(servicoId))) throw new HttpError(400, 'Serviço informado não existe')

    // Data e hora no formato local AAAA-MM-DDTHH:MM (o mesmo do input datetime-local) - [Otávio Michels]
    const dataHora = String(body.data_hora).slice(0, 16)
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dataHora) || isNaN(new Date(dataHora).getTime())) {
        throw new HttpError(400, 'Data/hora inválida. Use o formato AAAA-MM-DDTHH:MM')
    }

    const status = texto(body.status) || 'Agendado'
    if (!STATUS.includes(status)) {
        throw new HttpError(400, `Status deve ser um destes: ${STATUS.join(', ')}`)
    }

    return { tutor_id: tutorId, pet_id: petId, servico_id: servicoId, data_hora: dataHora, status, observacoes: texto(body.observacoes) }
}

// Converte o filtro (?pet= ou ?tutor=) em número; vazio vira "sem filtro" - [Gabriel França]
function idDoFiltro(valor, nome) {
    if (valor === undefined || valor === '') return null
    const id = Number(valor)
    if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, `O filtro ${nome} precisa ser um ID válido`)
    return id
}

// Aceita ?status= e ?data=AAAA-MM-DD para filtrar - [Otávio Michels]
// e também ?pet= e ?tutor=, para ver o histórico de um pet ou de um tutor - [Gabriel França]
async function listar(req, res) {
    const pet = idDoFiltro(req.query.pet, 'pet')
    const tutor = idDoFiltro(req.query.tutor, 'tutor')
    const agendamentos = await model.getAgendamentos({ status: texto(req.query.status), data: texto(req.query.data), pet, tutor })
    res.json({ agendamentos })
}

async function buscar(req, res) {
    const agendamento = await model.findAgendamentoById(idDaRota(req))
    if (!agendamento) throw new HttpError(404, 'Agendamento não encontrado')
    res.json({ agendamento })
}

// Não deixa marcar o mesmo pet duas vezes no mesmo horário - [Gabriel França]
async function verificarConflito(dados, id = 0) {
    if (dados.status === 'Cancelado') return
    if (await model.findConflito(dados.pet_id, dados.data_hora, id)) {
        throw new HttpError(409, 'Esse pet já tem um agendamento nesse horário')
    }
}

async function criar(req, res) {
    const dados = await dadosDoAgendamento(req.body)
    await verificarConflito(dados)
    const agendamento = await model.createAgendamento(dados)
    res.status(201).json({ message: 'Agendamento criado com sucesso', agendamento })
}

async function atualizar(req, res) {
    const id = idDaRota(req)
    if (!(await model.findAgendamentoById(id))) throw new HttpError(404, 'Agendamento não encontrado')
    const dados = await dadosDoAgendamento(req.body)
    await verificarConflito(dados, id)
    const agendamento = await model.updateAgendamento(id, dados)
    res.json({ message: 'Agendamento atualizado com sucesso', agendamento })
}

async function remover(req, res) {
    if (!(await model.deleteAgendamento(idDaRota(req)))) throw new HttpError(404, 'Agendamento não encontrado')
    res.json({ message: 'Agendamento excluído com sucesso' })
}

module.exports = { listar, buscar, criar, atualizar, remover, STATUS }
