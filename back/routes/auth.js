const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {findUserByUsername, createUser} = require('../models/userModel')
const router = express.Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post('/register',(req, res)=>{
    const {username, password} = req.body

    findUserByUsername(username, async (err, user)=>{
        if(err){
            return res.status(500).json({error: 'Erro no banco de dados'})
        }
        if(user){
            return res.status(400).json({message: 'Usuário já existe'})
        }
    })

    createUser(username, password, (err, newUser)=>{
        if(err){
            return res.status(500).json({error: 'Erro ao criar usuário'})
        }
        res.status(201).json({message: 'Usuário criado com sucesso', user: newUser})
    })
})



/** * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  findUserByUsername(username, async (err, user) => {
    if (err) return res.status(500).json({ error: 'Erro no banco de dados' });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Senha incorreta' });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ message: 'Login bem-sucedido', token });
  });
});



module.exports = router;