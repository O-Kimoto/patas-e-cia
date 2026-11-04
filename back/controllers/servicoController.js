const model = require('../models/servicoModel')
const { HttpError, exigirCampos, idDaRota, numeroNaoNegativo, traduzirEmUso, texto } = require('./helpers')

// Preço em reais com no máximo 2 casas (centavos): 19.999 é recusado em vez de ser arredondado escondido - [Otávio Michels]
function precoEmReais(valor) {
    const preco = numeroNaoNegativo(valor, 'Preço')
    const centavos = Math.round(preco * 100)
    if (Math.abs(preco * 100 - centavos) > 1e-6) {
        throw new HttpError(400, 'Preço deve ter no máximo 2 casas decimais (centavos)')
    }
    return centavos / 100
}

// Valida nome e preço do serviço - [Otávio Michels]
function dadosDoServico(body) {
    exigirCampos(body, ['nome', 'preco'])
    return { nome: texto(body.nome), descricao: texto(body.descricao), preco: precoEmReais(body.preco) }
}

// Dois serviços com o mesmo nome confundem quem agenda ("Banho" de R$ 50 ou de R$ 60?);
// compara sem diferenciar maiúsculas, inclusive em letras acentuadas - [Gabriel França]
async function verificarNomeRepetido(nome, id = 0) {
    const chave = (n) => n.trim().toLocaleLowerCase('pt-BR')
    const igual = (await model.getServicos()).find((s) => s.id !== id && chave(s.nome) === chave(nome))
    if (igual) throw new HttpError(409, `Já existe um serviço chamado "${igual.nome}"`)
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
    const dados = dadosDoServico(req.body)
    await verificarNomeRepetido(dados.nome)
    const servico = await model.createServico(dados)
    res.status(201).json({ message: 'Serviço criado com sucesso', servico })
}

async function atualizar(req, res) {
    const id = idDaRota(req)
    if (!(await model.findServicoById(id))) throw new HttpError(404, 'Serviço não encontrado')
    const dados = dadosDoServico(req.body)
    await verificarNomeRepetido(dados.nome, id)
    const servico = await model.updateServico(id, dados)
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
