const express = require('express')
const authenticateToken = require('../middleware/auth')
const { asyncHandler } = require('../controllers/helpers')
const controller = require('../controllers/usuarioController')
const router = express.Router()

// Todas as rotas de usuários exigem token JWT - [Otávio Michels]
router.use(authenticateToken)

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista os usuários que entram no sistema (sem a senha)
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *   post:
 *     summary: Cadastra um usuário (a senha é guardada só como hash)
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       201:
 *         description: Usuário criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         $ref: '#/components/responses/Invalido'
 *       409:
 *         description: Esse login já está em uso
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 */
router.get('/', asyncHandler(controller.listar))
router.post('/', asyncHandler(controller.criar))

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID (sem a senha)
 *     tags: [Usuários]
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *       404:
 *         $ref: '#/components/responses/NaoEncontrado'
 */
router.get('/:id', asyncHandler(controller.buscar))

module.exports = router
