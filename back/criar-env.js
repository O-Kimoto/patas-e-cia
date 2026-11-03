// Cria o back/.env a partir do .env.example com uma JWT_SECRET aleatória, se ele ainda não existir - [Otávio Michels]
// Usado no "npm run setup" (Codespaces, Replit ou máquina nova), para ninguém precisar inventar a chave à mão.
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const destino = path.join(__dirname, '.env')
if (fs.existsSync(destino)) {
    console.log('back/.env já existe, nada a fazer')
} else {
    const exemplo = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8')
    const segredo = crypto.randomBytes(32).toString('hex')
    fs.writeFileSync(destino, exemplo.replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${segredo}`))
    console.log('back/.env criado com uma JWT_SECRET nova')
}
