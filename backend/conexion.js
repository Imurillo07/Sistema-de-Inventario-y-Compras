const mysql = require('mysql')

//configuracion para la conexion a la base de datos 
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Imurillo0770',
    database: 'db_inv_ti'
}

const db = mysql.createConnection(dbConfig)

//connectar a la base de datos
db.connect((err) => {
    if(err) {
        console.error('Error  al connectar a la base de datos: ', err)
    }

    console.log('Conectado a la base de datos MySQL')
})

module.exports = db