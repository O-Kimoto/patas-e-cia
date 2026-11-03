const express = require('express')
const authenticateToken = require('../middleware/auth')
const { asyncHandler } = require('../controllers/helpers')
const controller = require('../controllers/petController')
const router = express.Router()

// Todas as rotas de pets exigem token JWT - [Otávio Michels]
router.use(authenticateToken)

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Lista os pets com o nome do tutor
 *     tags: [Pets]
 *     parameters:
 *       - in: query
 *         name: tutor_id
 *         required: false
 *         description: Filtra os pets de um tutor
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *   post:
 *     summary: Cadastra um pet ligado a um tutor
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PetInput'
 *     responses:
 *       201:
 *         description: Pet criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 pet:
 *                   $ref: '#/components/schemas/Pet'
 *       400:
 *         $ref: '#/components/responses/Invalido'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 */
router.get('/', asyncHandler(controller.listar))
router.post('/', asyncHandler(controller.criar))

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Busca um pet pelo ID
 *     tags: [Pets]
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Pet encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pet:
 *                   $ref: '#/components/schemas/Pet'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *       404:
 *         $ref: '#/components/responses/NaoEncontrado'
 *   put:
 *     summary: Atualiza um pet
 *     tags: [Pets]
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PetInput'
 *     responses:
 *       200:
 *         description: Pet atualizado
 *       400:
 *         $ref: '#/components/responses/Invalido'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *       404:
 *         $ref: '#/components/responses/NaoEncontrado'
 *   delete:
 *     summary: Exclui um pet (só se ele não tiver agendamentos)
 *     tags: [Pets]
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Pet excluído
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
