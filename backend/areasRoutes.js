const express = require('express')
const router = express.Router()
const db = require('./conexion')

//ruta para obtener todas las areas
router.get('./areas', (req, res) =>{
    db.query('SELECT * FROM areas', (err, results) => {
        if(err){
            return res.status(500).send('Error en la consulta')
        }

        res.json(results)
    })
})

module.exports = router