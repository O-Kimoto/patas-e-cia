var express = require('express');
var router = express.Router();
var authenticateToken = require('../middleware/auth')
var { findPetById, createPet, getPets, deletePet, updatePet } = require('../models/petModel')


/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Lista todos os pets
 *     tags: [Pets]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pets retornada com sucesso
 */
router.get('/', authenticateToken, function (req, res, next) {
  getPets((err, pets) => {
    if (err) {
      console.error('getPets erro:', err.message)
      return res.status(500).json({ error: 'Erro ao buscar pets' })
    }

    return res.status(200).json({ pets: pets })
  })
});

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Busca um pet pelo ID
 *     tags: [Pets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pet a ser buscado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pet encontrado com sucesso
 *       404:
 *         description: Pet não encontrado
 */
router.get('/:id', function (req, res, next) {
  const id = req.params.id
  console.log("veio", id)
  findPetById(id, (err, pet) => {
    if (err) {
      console.error('findPetById erro:', err.message)
      return res.status(500).json({ error: 'Erro ao buscar pet' })
    }

    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado' })
    }

    return res.status(200).json({ pet: pet })
  })
});


/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Cria um novo pet
 *     description: Cria um pet aceitando tanto o campo **name** quanto **namePet** para compatibilidade.
 *     tags: [Pets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gender
 *               - color
 *               - breed
 *               - idTutor
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bento
 *               gender:
 *                 type: string
 *                 example: M
 *               color:
 *                 type: string
 *                 example: Marrom
 *               breed:
 *                 type: string
 *                 example: Labrador
 *               idTutor:
 *                 type: integer
 *                 example: 12
 *     responses:
 *       201:
 *         description: Pet criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário criado com sucesso
 *                 pet:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Bento
 *                     gender:
 *                       type: string
 *                       example: M
 *                     color:
 *                       type: string
 *                       example: Marrom
 *                     breed:
 *                       type: string
 *                       example: Labrador
 *                     idTutor:
 *                       type: integer
 *                       example: 12
 *       500:
 *         description: Erro interno ao salvar o pet
 */
router.post('/', authenticateToken, function (req, res, next) {
  // aceitar tanto { name } quanto { namePet } para compatibilidade
  const name = req.body.name || req.body.namePet
  const gender = req.body.gender
  const color = req.body.color
  const breed = req.body.breed
  const idTutor = req.body.idTutor

  console.log('veio', { name, gender, color, breed, idTutor })

  createPet(name, gender, color, breed, idTutor, (err, newPet) => {
    if (err) {
      console.error('createPet erro:', err.message)
      return res.status(500).json({ error: 'Erro ao salvar pet' })
    }

    return res.status(201).json({ message: 'Usuário criado com sucesso', pet: newPet })
  })
});

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Deleta um pet pelo ID
 *     tags: [Pets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pet a ser deletado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pet deletado com sucesso
 *       500:
 *         description: Erro ao deletar pet
 */
router.delete('/:id', authenticateToken, function (req, res) {
  const id = req.params.id
  deletePet(id, (err) => {
    if (err) {
      console.error('deletePet erro:', err.message)
      return res.status(500).json({ error: 'Erro ao deletar pet' })
    }

    return res.status(200).json({ message: 'Pet deletado com sucesso' })
  })
})



/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Atualiza um pet pelo ID
 *     tags: [Pets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pet a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Thor
 *               gender:
 *                 type: string
 *                 example: M
 *               color:
 *                 type: string
 *                 example: Preto
 *               breed:
 *                 type: string
 *                 example: Labrador
 *     responses:
 *       200:
 *         description: Pet atualizado com sucesso
 *       500:
 *         description: Erro ao atualizar pet
 */
router.put('/:id', authenticateToken, function (req, res) {
  const id = req.params.id
  const { name, gender, color, breed } = req.body

  updatePet(id, name, gender, color, breed, (err) => {
    if (err) {
      console.error('updatePet erro:', err.message)
      return res.status(500).json({ error: 'Erro ao atualizar pet' })
    }

    return res.status(200).json({ message: 'Pet atualizado com sucesso' })
  })
})


module.exports = router;
