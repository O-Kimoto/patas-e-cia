const db = require('../db/database')

// Pegar pet pelo ID
function findPetById(id, callback){
    db.get('SELECT * FROM pets WHERE id = ?', [id], (err, row)=>{
        callback(err,row)
    })
}

// Pegar todos os pets
function getPets(callback){
    db.all('SELECT * FROM pets', [], (err, rows)=>{
        callback(err, rows)
    })
}

// Criar um novo pet
function createPet(name, gender, color, breed, idTutor, callback){
    console.log('salvando no banco', name)
    db.run(
        'INSERT INTO pets (name, gender, color, breed, id_tutor) VALUES (?, ?, ?, ?, ?)',[name, gender , color , breed, idTutor], (err)=>{
            if(err){
                console.error('Erro ao inserir pet:', err.message)
                return callback(err)
            }

            const newPet = { name }
            callback(null, newPet)
        }
    )
}

function deletePet(id, callback){
    db.run(
        'DELETE FROM pets WHERE id = ?',[id], (err)=>{
            if(err){
                console.error('Erro ao deletar pet:', err.message)
                return callback(err)
            }

            callback(null)
        }
    )
}

function updatePet(id, name, gender, color, breed, callback){
    db.run(
        'UPDATE pets SET name = ?, gender = ?, color = ?, breed = ? WHERE id = ?',
        [name, gender, color, breed, id],
        (err)=>{
            if(err){
                console.error('Erro ao atualizar pet:', err.message)
                return callback(err)
            }

            callback(null)
        }
    )
}

module.exports = {findPetById, createPet, getPets, deletePet, updatePet}