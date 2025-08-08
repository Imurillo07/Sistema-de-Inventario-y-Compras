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
                db.commit((err) => {
                    if(err) {
                        return db.rollback(() => {
                            console.error('Error al confirmar la transaccion', err)
                            return res.status(500).send('Error al confirmar la transaccion')
                        })
                    }

                    res.status(200).send('Estado actualizado a manteninimiento y reporte registrado exitosamente')
                })
            })
        })
    })
})

//Ruta para obntener los mantenimientos ordernados por fechas de reporte y falta de solucion
router.get('/equipos/mantenimientos', (req, res) => {
    const query = 'SELECT * FROM historial_mantenimiento WHERE fehca_soluciones IS NULL ORDER BY fecha_reporte ASC'

    db.query(query, (err, results) => {
        if(err) {
            return res.status(500).send('Error en la consulta')
        }

        res.json(results)
    })
})

//ruta para actualizar la solucion en el historial y cambiar el estado del equipo
router.post('/equipos/mantenimientos/update', (req, res) => {
    const { num_serie, id_historial, tecnico, solucion} = req.body

    if(!num_serie || !id_historial || !tecnico || !solucion) {
        return res.status(400).send('El id, numero de serie, tecnico y solucion son requeridos')
    }

    //obtener la fecha con el formato deseado
    const fecha = new Date()

    const anio = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')

    const fecha_solucion = `${anio}-${mes}-${dia}`

    //iniciar transaccion
    db.beginTransaction((err) => {
        if(err){
            return res.status(500).send('Error al iniciar la transaccion')
        }

        //actualizamos el estado del equipo a activo
        const updateEstadoQuery = 'UPDATE equipos SET estado="activo" WHERE num_serie=?'

        db.query(updateEstadoQuery, [num_serie], (err, result) =>{
            if(err) {
                return db.rollback(() => {
                    console.error('Error al analizar el estado', err)
                    return res.status(500).send('Error al actualizae el esatdo del equipo')
                })
            }

            //actualizamos el registro de la tabla historial_mantenimientos
            const updateHistorialQuery = `
                UPDATE
                    historial_mantenimientos
                SET
                    fecha_solucion = ?,
                    usuario_tecnico = ?,
                    solucion = ?
                WHERE
                id_historial = ?
            `

            db.query(updateHistorialQuery, [fecha_solucion, tecnico, solucion, id_historial], (err, result) => {
                if(err) {
                    return db.rollback(() => {
                        console.error('Error al actualizar el historial', err)
                        return res.status(500).send('Error al actualizar el historial')
                    })
                }

                //confirmar la transaccion
                db.commit((err) => {
                    if(err) {
                        return db.rollback(() =>{
                            console.error('Error al conformar la transaccion', err)
                            return res.status(500).send('Error al confirmar la transaccion')
                        })
                    }

                    res.status(200).send('Estado del equipo actualizado a activo y mantenimiento actualizado')
                })
            })
        })
    })
})


//ruta para obtener los mantenimientos  por id_historial, num_serie o tecnico
router.post ('/equipos/mantenimientos/find', (req, res) => {
    const { filter } = req.body

    if(!filter) {
        return res.status(400).json({
            error: 'Se debe proporcionar al menos uno de los parametros'
        })
    }

    const query = `SELECT * FROM historial_mantenimientos WHERE id_historial = '${filter}'
    OR num_serie = '${filter}'
    OR usuario_tecnico '${filter}'
    AND solucion IS NOT NULL
    `

    
})