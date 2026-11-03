const express = require('express')
const authenticateToken = require('../middleware/auth')
const { asyncHandler } = require('../controllers/helpers')
const controller = require('../controllers/servicoController')
const router = express.Router()

// Todas as rotas de serviços exigem token JWT - [Otávio Michels]
router.use(authenticateToken)

/**
 * @swagger
 * /servicos:
 *   get:
 *     summary: Lista os serviços (banho, tosa, consulta, vacinação...)
 *     tags: [Serviços]
 *     responses:
 *       200:
 *         description: Lista de serviços
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 servicos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Servico'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *   post:
 *     summary: Cadastra um serviço
 *     tags: [Serviços]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServicoInput'
 *     responses:
 *       201:
 *         description: Serviço criado
 *       400:
 *         $ref: '#/components/responses/Invalido'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 */
router.get('/', asyncHandler(controller.listar))
router.post('/', asyncHandler(controller.criar))

/**
 * @swagger
 * /servicos/{id}:
 *   get:
 *     summary: Busca um serviço pelo ID
 *     tags: [Serviços]
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Serviço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 servico:
 *                   $ref: '#/components/schemas/Servico'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *       404:
 *         $ref: '#/components/responses/NaoEncontrado'
 *   put:
 *     summary: Atualiza um serviço
 *     tags: [Serviços]
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServicoInput'
 *     responses:
 *       200:
 *         description: Serviço atualizado
 *       400:
 *         $ref: '#/components/responses/Invalido'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *       404:
 *         $ref: '#/components/responses/NaoEncontrado'
 *   delete:
 *     summary: Exclui um serviço (só se não estiver em agendamentos)
 *     tags: [Serviços]
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Serviço excluído
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *       404:
 *         $ref: '#/components/responses/NaoEncontrado'
 *       409:
 *         $ref: '#/components/responses/EmUso'
 */
router.get('/:id', asyncHandler(controller.buscar))
router.put('/:id', asyncHandler(controller.atualizar))
router.delete('/:id', asyncHandler(controller.remover))

module.exports = router
