const path = require('path')
const sqlite3 = require('sqlite3').verbose()

// Caminho fixo do banco, para funcionar de qualquer pasta onde o servidor for iniciado - [Otávio Michels]
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'petshop.db')

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco', err.message)
    } else {
        console.log('Banco conectado em', DB_PATH)
    }
})

// Versões com Promise do run/get/all do sqlite3, usadas pelos models com async/await - [Otávio Michels]
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) return reject(err)
            resolve({ id: this.lastID, changes: this.changes })
        })
    })
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)))
    })
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
    })
}

// Criação das tabelas do petshop; as chaves estrangeiras impedem apagar um tutor que ainda tem pets - [Otávio Michels]
const SCHEMA = [
    'PRAGMA foreign_keys = ON',
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS tutores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT,
        telefone TEXT NOT NULL,
        cep TEXT,
        logradouro TEXT,
        numero TEXT,
        complemento TEXT,
        bairro TEXT,
        cidade TEXT,
        uf TEXT,
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        especie TEXT NOT NULL,
        raca TEXT,
        sexo TEXT NOT NULL CHECK (sexo IN ('M', 'F')),
        tutor_id INTEGER NOT NULL REFERENCES tutores(id) ON DELETE RESTRICT,
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS servicos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco REAL NOT NULL CHECK (preco >= 0),
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tutor_id INTEGER NOT NULL REFERENCES tutores(id) ON DELETE RESTRICT,
        pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE RESTRICT,
        servico_id INTEGER NOT NULL REFERENCES servicos(id) ON DELETE RESTRICT,
        data_hora TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Agendado'
            CHECK (status IN ('Agendado', 'Confirmado', 'Concluído', 'Cancelado')),
        observacoes TEXT,
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP
    )`
]

// Roda o schema em ordem antes de qualquer consulta; o servidor espera essa Promise para subir - [Otávio Michels]
const ready = (async () => {
    for (const sql of SCHEMA) {
        await run(sql)
    }
    console.log('Tabelas users, tutores, pets, servicos e agendamentos prontas')
})()

module.exports = { db, run, get, all, ready }
