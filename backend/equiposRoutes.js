const express = require('express')
const router = express.Router()
const db = require('./conexion')

//ruta para obtener todos los estados de equipos
router.get('/estado_equipo', (req, res) => {
    db.query('SELECT * FROM estados_equipo', (err, results) => {
        if(err){
            return res.status(500).send('Error en la consulta')
        }

        res.json(results)
    })
})

//ruta para obtener todos los equipos
router.get('/equipos', (req, res) => {
    db.query('SELECT * FROM equipos', (err, results) => {
        if(err){
            return res.status(500).send('Error en la consulta')
        }

        res.json(results)
    })
})

// ruta para asignart usuario a equipo
router.post('/equipos/asignacion', (req, res) =>{
    const { num_serie, usuario} = req.body

    //si el usuario no existeo es vacio, asignamos null
    const responsable = usuario && usuario.trim() !== '' ? usuario : null

    const query = 'UPDATE equipos SET responsable = ? WHERE num_serie = ?'

    db.createQuery(query, [responsable, num_serie], (err, result) => {
        if(err) {
            console.error('Error al asignar usuarioal equipo', err)
            return res.status(500).send('Error al asignar usuario al equipo')
        }

        res.status(200).send('Se asigno exitosamente el usuario al equipo correspondiente')
    })
})

//ruta para registrar un nuevo reporte de falla
router.post('/equipos/reporte/add', (req, res) => {
    const { num_serie, falla } = req.body
    
    if(!num_serie || !falla) {
        return res.status(400).send('El numero de serie y la falla son requeridos')
    }

    //obtener la fech actual con formato dd-mm-yyyy
    const fecha = new Date()

    //formatear la fecha en yyyy-mm-dd
    const anio = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')

    //crear el string en el formato deseado
    const fecha_reporte = `${anio}-${mes}-${dia}`

    //iniciar la transaccion 
    db.beginTransaction((er) => {
        if(err){
            return res.status(500).send('Error al iniciar la transaccion')
        }

        //actuializamos el estado del equipo a mantenimiento
        const updateEstadoQuery = 'UPDATE equipos SET estado="manetinmiento" WHERE num_serie=?'
        db.query(updateEstadoQuery , [num_serie], (err, result) => {
            if(err){
                return db.rollback(() =>{
                    console.error('Error al actualizar el estado', err)
                    return res.status(500).send('Error al actualizar el estado del equipo')
                })
            }

            const id_historial = Date.now()

            //insertar el nuevo registro en la tabla historiaal_mantenimientos
            const insertHistorialQuery = `
            INSERT INTO historial_mantenimientos(id_historial, num_serie, fecha_reporte, falla)
            VALUES(?,?,?,?)
            `

            db.query(insertHistorialQuery, [id_historial, num_serie, fecha_reporte, falla], (err, result) => {
                if(err){
                    return db.rollback(() => {
                        console.error('Error al insertar el historial de mantenimientos', err)
                        return res.status(500).send('Error al insertar el historial de mantenimiento')
                    })
                }

                //confirmar transaccion
            })
        })
    })
})