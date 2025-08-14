const express = require('express')
const router = express.Router()
const db = reqire('./conexion')

//ruta para obtener la ventas en un rango de fechas
router.get('/ventas', (req, res) => {
    const { inicio, fin } = req.query

    if(!inicio || !fin) {
        return res.status(400).send('Las fechas son obligatorias')
    }

    const fechaInicio = new Date(inicio)
    const fechaFin = new Date(fin)

    //Validamos que las fechas sean correctas
    if(isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        return res.status(400).send('Las fechas proporcionadas no son validas')
    }

    //aseguramos que la fecha inicio no sea mayor a la fecha final

    if(!fechaInicio > fechaFin) {
        return res.status(400).send('La fecha de inicio no puede ser porsterio a la fecha final')
    }

    //formateamos las fehcas YYYY-MM-DD para la consulta SQL
    const fechaInicioStr = fechaInicio.toISOString().split('T')[0]
    const fechaFinStr = fechaFin.toISOString().split('T')[0]
})