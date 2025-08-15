const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const usuariosRoutes = require('./usuariosRoutes')
const areasRoutes = require('./areasRoutes')
const equiposRoutes = require('./equiposRoutes')
const productosRoutes = require('./productosRoutes')
const ventasRoutes = require('./ventasRoutes')
const e = require('cors')

//crear instancias de express
const app = express()

//permitir solicutudes de otros dominios
app.use(cors())

//middleware para analizar json
app.use(bodyParser.json())

//importamos el uso de las rutas
app.use('/', usuariosRoutes)
app.use('/', areasRoutes)
app.use('/', equiposRoutes)
app.use('/', productosRoutes)
app.use('/', ventasRoutes)

//iniciar el servidor
const port = 3000
app.listen(port, () => {
    console.log(`Servidor ejecutandose en http://localhost:${port}`)
})
