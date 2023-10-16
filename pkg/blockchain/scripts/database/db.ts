import mysql from 'mysql2'

const config = {
    environment: {
        dev: 'development',
        alpha: 'alpha'
    },
    connectOptions: {
        uri: 'http://localhost:8080',
        host: 'localhost', 
        user: 'root',
        database: 'testdb',
        connectionLimit: 10, 
        waitForConnections: true, 
        maxIdle: 10,
        idleTimeout: 60000
    },
    uri: 'http://localhost:8080'
}

const connection = mysql.createConnection(config.connectOptions)

const pool = mysql.createPool(config.connectOptions)

// plain sql
connection.query("select * from testtable", (err, result, fields) => {
    if (err) console.error(err)
    console.log(result)
    console.log(fields)
})

// with placeholder
const q = connection.query("select * from testtable where name = ?", ['jake'], (err, result, fields) => {
    if (err) console.error(err)
    console.log(result)
    console.log(fields)
})

connection.execute("select * from testtable where name = ?", ['jake'], (err, result, fields) => {
    if (err) console.error(err)
    console.log(result)
    console.log(fields)
})