const express = require('express')
const router = express.Router()
const db = require('./conexion')

//ruta para obtener los producto de la tabla productos
router.get('/productos', (req, res) =>{

    const query = 'SELECT * FROM productos'

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send('Error en la consulta')
        }

        res.json(result)
    })
})

//ruta para obtener el producto usando el codigo mismo
router.get('/producto', (req, res) => {
    const { codigo } = req.query

    const query = 'SELECT codigo, nom_producto, pre_publico FROM productos WHERE codigo = ?'
    db.query(query, [codigo], (err, result) =>{
        if (err) {
            return res.status(500).send('Error al obtener el producto')
        }

        res.json(result)
    })
})

//ruta para agregar un nuevo producto
router.post('/productos', (req, res) => {
    const { codigo, nom_producto, desc_producto, pre_publico, pre_proveedor, existencias } = req.body

    if(!codigo || !nom_producto || !desc_producto || !pre_publico || !pre_proveedor || !existencias) {
        return res.status(400).send('Todos los campos son obligatorios')    
    }

    const query = `INSERT INTO productos(codigo, nom_producto, desc_producto, pre_publico, pre_proveedor, existencias)
    VALUES(?,?,?,?,?,?)`

    db.query(query, [codigo, nom_producto, desc_producto, pre_publico, pre_proveedor, existencias], (err, result) =>{
        if(err) {
            console.error('Error al agregar el producto: ', err)
            return res.status(500).send('Error al agregar el producto')
        }

        res.sendStatus(201).send({
            codigo, nom_producto, desc_producto, pre_publico, pre_proveedor, existencias
        })
    }) 
})

//ruta para editar in producto 
router.put('/productos/:codigo', (req, res) =>{
    const {codigo } = req.params
    const { nom_producto, desc_producto, pre_publico, pre_proveedor, existencias } = req.body

    const query = 'UDPATE productos SET nom_producto=?, desc_producto=?, pre_publico=?, pre_proveedor=?, existencias=? WHERE codigo=?'
    db.query(query, [nom_producto, desc_producto, pre_publico, pre_proveedor, existencias, codigo], (err, result) =>{
        if(err){
            return res.status(500).send('Error al actualizar el producto')
        }

        res.send('Producto actualizado')
    })
})

// ruta para eliminar un producto
router.delete('/productos/:producto', (req, res) => {
    const { producto } = req.params

    const query = `DELETE FROM productos WHERE codigo = ?`

    db.query(query, [producto], (err, result) => {
        if(err){
            return res.status(500).send('Error al eliminar el producto')
        }
        
        res.send('Producto eliminado')
    })
})

module.exports = router