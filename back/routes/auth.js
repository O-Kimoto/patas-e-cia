const express = require('express')
const authenticateToken = require('../middleware/auth')
const { asyncHandler } = require('../controllers/helpers')
const { login, me } = require('../controllers/authController')
const router = express.Router()

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Faz login e devolve o token JWT (rota pública)
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Credenciais'
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login bem-sucedido
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Usuário ou senha inválidos
 */
router.post('/login', asyncHandler(login))

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Dados do usuário dono do token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Usuário logado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 */
router.get('/me', authenticateToken, asyncHandler(me))

module.exports = router
