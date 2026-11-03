const model = require('../models/servicoModel')
const { HttpError, exigirCampos, idDaRota, numeroNaoNegativo, traduzirEmUso, texto } = require('./helpers')

// Valida nome e preço do serviço - [Otávio Michels]
function dadosDoServico(body) {
    exigirCampos(body, ['nome', 'preco'])
    return { nome: texto(body.nome), descricao: texto(body.descricao), preco: numeroNaoNegativo(body.preco, 'Preço') }
}

async function listar(req, res) {
    res.json({ servicos: await model.getServicos() })
}

async function buscar(req, res) {
    const servico = await model.findServicoById(idDaRota(req))
    if (!servico) throw new HttpError(404, 'Serviço não encontrado')
    res.json({ servico })
}

async function criar(req, res) {
    const servico = await model.createServico(dadosDoServico(req.body))
    res.status(201).json({ message: 'Serviço criado com sucesso', servico })
}

async function atualizar(req, res) {
    const id = idDaRota(req)
    if (!(await model.findServicoById(id))) throw new HttpError(404, 'Serviço não encontrado')
    const servico = await model.updateServico(id, dadosDoServico(req.body))
    res.json({ message: 'Serviço atualizado com sucesso', servico })
}

async function remover(req, res) {
    const id = idDaRota(req)
    const apagou = await model.deleteServico(id).catch((err) =>
        traduzirEmUso(err, 'Este serviço é usado em agendamentos e não pode ser excluído.')
    )
    if (!apagou) throw new HttpError(404, 'Serviço não encontrado')
    res.json({ message: 'Serviço excluído com sucesso' })
}

module.exports = { listar, buscar, criar, atualizar, remover }
