const express = require('express')
const router = express.Router()
const db = require('./conexion')

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

    const query = `SELECT * FROM ventas WHERE fecha_venta BETWEEN ? AND ?`

    db.query(query, [fechaInicioStr, fechaFinStr], (err, result) => {
        if(err){
            console.error(err)
            return res.status(500).send('Error al obtener las ventas')
        }

        res.status(200).send(result)
    })
})

//Ruta para agregar registros de ventas
//codigo - producto - pre_publico - cantidad - total_totalventa_usuario
router.post('/ventas', (req, res) =>{
    const { venta } = req.body

    if(!venta) {
        return res.status(400).send('Nose recibio la venta')
    }

    const fecha = new Date()
    //formatear fecha en yyy-mm-dd
    const anio = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate() + 1).padStart(2, '0')

    const id_ventas = Date.now().toString()

    //crear el str8ing em el formato deseado
    const fecha_venta = '${anio}-${mes}-${dia}'

    //sepaarar los productos y el total de la venta (asumiendo que vente viene como un string 'PRODUCTOS_TOTALES' )
    const productosString = venta.split('_')
    const productos = productosString[0]

    const total_venta = parseFloat(productosString[1])

    const vendedor = productosString[2]

    // validar el total de la venta
    if(isNaN(total_venta)){
        return res.status(400).send('El total  de la venta no es valido')
    }

    //insertar la venta en la base de datos
    const query = `INSERT INTO ventas(id_venta, productos, total_venta, fecha_venta, vendedor
    VALUES(?,?,?,?,?)`

    db.query(query, [id_ventas, productos, total_venta, fecha_venta, vendedor], (err, result) =>{
        if(err){
            console.error(err)
            return res.status(500).send('Error al registrar la venta')
        }
        
        res.status(201).send({
            mensaje: 'Venta resgistrada con exito',
            id_venta
        })
    })
})

module.exports = router