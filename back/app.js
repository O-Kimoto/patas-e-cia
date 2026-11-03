var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });

var express = require('express');
var logger = require('morgan');
var cors = require('cors');
var { swaggerUi, swaggerSpec } = require('./swagger.js');

// Sem JWT_SECRET no .env o servidor ainda sobe, com uma chave aleatória (os logins caem a cada reinício) - [Otávio Michels]
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
  console.warn('JWT_SECRET não definido no .env: usando uma chave temporária.');
}

var app = express();

// CORS: libera as origens do CORS_ORIGIN (separadas por vírgula) ou qualquer origem se não for definido - [Otávio Michels]
var origens = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()) : true;
app.use(cors({
  origin: origens,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rota do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: 'API Petshop' }));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// IMPORTANDO ROTAS: login e agendamentos (tutores, pets e serviços alimentam o formulário de agendamento) - [Otávio Michels]
var authRouter = require('./routes/auth');
var tutoresRouter = require('./routes/tutores');
var petsRouter = require('./routes/pets');
var servicosRouter = require('./routes/servicos');
var agendamentosRouter = require('./routes/agendamentos');

// USANDO ROTAS (todas debaixo de /api para não misturar com as páginas do front) - [Otávio Michels]
app.get('/api', (req, res) => res.json({ status: 'ok', api: 'Petshop', docs: '/api-docs' }));
app.use('/api/auth', authRouter);
app.use('/api/tutores', tutoresRouter);
app.use('/api/pets', petsRouter);
app.use('/api/servicos', servicosRouter);
app.use('/api/agendamentos', agendamentosRouter);

// Rota /api inexistente responde JSON, não a página do front - [Otávio Michels]
app.use('/api', (req, res) => res.status(404).json({ message: 'Rota não encontrada' }));

// Depois do "npm run build" do front, o próprio Express serve as telas: front e API no mesmo endereço - [Otávio Michels]
var frontDist = path.join(__dirname, '..', 'front', 'dist', 'petshop');
if (fs.existsSync(path.join(frontDist, 'index.html'))) {
  app.use(express.static(frontDist));
  app.get('*', (req, res) => res.sendFile(path.join(frontDist, 'index.html')));
} else {
  app.get('/', (req, res) => res.json({ message: 'API Petshop no ar. Documentação em /api-docs' }));
}

// Tratador central de erros: devolve sempre JSON com uma mensagem legível - [Otávio Michels]
app.use(function (err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON inválido no corpo da requisição' });
  }
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(409).json({ message: 'Operação viola uma regra do banco de dados' });
  }
  console.error(err);
  res.status(500).json({ message: 'Erro interno no servidor' });
});

module.exports = app;
