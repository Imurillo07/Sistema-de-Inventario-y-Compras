const express = require('express')
const router = express.Router()
const db = require('./conexion')

//ruta para el login
router.post('/login', (req, res) =>{
    const { usuario, contrasena } = req.body

    if(!usuario || !contrasena) {
        return res.status(400).send('Usuario y contrasena son obligatorios')
    }

    //buscar el usuario en la base de datos
    db.query('SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?', [usuario, contrasena], (err, result) =>{
        if(err) {
            return res.status(500).send('Error en la consulta')
        }

        if(ressults.length === 0) {
            return res.status(401).send('Usuario no encontrado')
        }

        const usuarioEncontrado = result[0]

        res.status(200).send({
            mensaje: '',
            usuario: {
                usuario: usuarioEncontrado.usuario,
                nombre: usuarioEncontrado.nombre,
                area: usuarioEncontrado.area,
                estado: usuarioEncontrado.estado
            }
        })
    })
})

//ruta para obtener todos los usuarios
router.get('/usuario', (req, res) => {
    db.query('SELECT usuario, nombre, area, correo, estado FROM usuarios', (err, result) => {
        if(err) {
            return res.status(500).send('Error en la consulta')
        }

        res.json(result)
    })
})

// ruta para agregar un nuevo usuario
router.post('/usuarios', (req, res) => {
    const { usuario, contrasena, nombre, area, correo, estado } = req.body

    if(!usuario || !contrasena || !nombre || !area || !correo || !estado) {
        return res.status(400).send('Todos los campos son obligatorios')
    }

    const query = `INSERT INTO usuarios(usuario, contrasena, nombre, area, correo, estado) 
    VALUES (?,?,?,?,?,'activo')`

    db.query(query, [usuario, contrasena, nombre, area, correo, estado], (err, result) =>{
        if(err) {
            console.error('Error al agregar el uauario', err)
            return res.status(500).send('Error al agregar el usuario')
        }

        res.status(200).send({
            usuario, contrasena, nombre, area, correo, estado
        })
    })
})

//ruta para editar un usuario
router.put('/usuarios/:usuario', (req, res) => {
    const { usuario } = req.params
    const { nombre, contrasena, area, correo, esatdo } = req.body

    const query = 'UPDATE usuarios SET nombre=?, contrasena=?, area=?, correo=?, estado=? WHERE usuario=?'

    db.query(query, [nombre, contrasena, area, correo, estado, usuario], (err, result) =>{
        if(err) {
            return res.status(500).send('Errror al actualizar el usuario')
        }

        res.send('Usuario actualizado')
    })
})

//ruta para eliminar un usuario
router.delete('/usuarios/:usuario', (req, res) => {
    const { usuario } = req.params

    const query = 'DELETE FROM usuarios WHERE usuarios=?'

    db.query(query, [usuario], (err, result) => {
        if(err) {
            return res.status(500).send('Error al eliminar el usuario')
        }

        res.send('Usuario eliminado')
    })
})

module.exports = router