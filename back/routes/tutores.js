const express = require('express')
const authenticateToken = require('../middleware/auth')
const { asyncHandler } = require('../controllers/helpers')
const controller = require('../controllers/tutorController')
const router = express.Router()

// Todas as rotas de tutores exigem token JWT - [Otávio Michels]
router.use(authenticateToken)

/**
 * @swagger
 * /tutores:
 *   get:
 *     summary: Lista os tutores com a quantidade de pets de cada um
 *     tags: [Tutores]
 *     responses:
 *       200:
 *         description: Lista de tutores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tutores:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tutor'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *   post:
 *     summary: Cadastra um tutor
 *     tags: [Tutores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TutorInput'
 *     responses:
 *       201:
 *         description: Tutor criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tutor:
 *                   $ref: '#/components/schemas/Tutor'
 *       400:
 *         $ref: '#/components/responses/Invalido'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 */
router.get('/', asyncHandler(controller.listar))
router.post('/', asyncHandler(controller.criar))

/**
 * @swagger
 * /tutores/{id}:
 *   get:
 *     summary: Busca um tutor pelo ID
 *     tags: [Tutores]
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Tutor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tutor:
 *                   $ref: '#/components/schemas/Tutor'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *       404:
 *         $ref: '#/components/responses/NaoEncontrado'
 *   put:
 *     summary: Atualiza um tutor
 *     tags: [Tutores]
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TutorInput'
 *     responses:
 *       200:
 *         description: Tutor atualizado
 *       400:
 *         $ref: '#/components/responses/Invalido'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *       404:
 *         $ref: '#/components/responses/NaoEncontrado'
 *   delete:
 *     summary: Exclui um tutor (só se ele não tiver pets nem agendamentos)
 *     tags: [Tutores]
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Tutor excluído
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
