const express = require('express')
const authenticateToken = require('../middleware/auth')
const { asyncHandler } = require('../controllers/helpers')
const controller = require('../controllers/agendamentoController')
const router = express.Router()

// Todas as rotas de agendamentos exigem token JWT - [Otávio Michels]
router.use(authenticateToken)

/**
 * @swagger
 * /agendamentos:
 *   get:
 *     summary: Lista os agendamentos com nomes de tutor, pet e serviço
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Agendado, Confirmado, Concluído, Cancelado]
 *       - in: query
 *         name: data
 *         required: false
 *         description: Dia no formato AAAA-MM-DD
 *         schema:
 *           type: string
 *           example: '2026-11-05'
 *       - in: query
 *         name: pet
 *         required: false
 *         description: ID do pet, para ver o histórico de atendimentos dele
 *         schema:
 *           type: integer
 *       - in: query
 *         name: tutor
 *         required: false
 *         description: ID do tutor, para ver os agendamentos de todos os pets dele
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 agendamentos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Agendamento'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *   post:
 *     summary: Cria um agendamento (o pet precisa ser do tutor informado)
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgendamentoInput'
 *     responses:
 *       201:
 *         description: Agendamento criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 agendamento:
 *                   $ref: '#/components/schemas/Agendamento'
 *       400:
 *         $ref: '#/components/responses/Invalido'
 *       409:
 *         description: Esse pet já tem um agendamento nesse horário
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 */
router.get('/', asyncHandler(controller.listar))
router.post('/', asyncHandler(controller.criar))

/**
 * @swagger
 * /agendamentos/{id}:
 *   get:
 *     summary: Busca um agendamento pelo ID
 *     tags: [Agendamentos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 agendamento:
 *                   $ref: '#/components/schemas/Agendamento'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *       404:
 *         $ref: '#/components/responses/NaoEncontrado'
 *   put:
 *     summary: Atualiza um agendamento (inclusive o status)
 *     tags: [Agendamentos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgendamentoInput'
 *     responses:
 *       200:
 *         description: Agendamento atualizado
 *       400:
 *         $ref: '#/components/responses/Invalido'
 *       409:
 *         description: Esse pet já tem um agendamento nesse horário
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *       404:
 *         $ref: '#/components/responses/NaoEncontrado'
 *   delete:
 *     summary: Exclui um agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Agendamento excluído
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *       404:
 *         $ref: '#/components/responses/NaoEncontrado'
 */
router.get('/:id', asyncHandler(controller.buscar))
router.put('/:id', asyncHandler(controller.atualizar))
router.delete('/:id', asyncHandler(controller.remover))

module.exports = router
