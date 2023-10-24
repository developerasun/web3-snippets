import { PoolOptions, createConnection, createPool } from 'mysql2'

const targetTable = 'jake'

const configs: PoolOptions = {
    host: '127.0.0.1', // tcp/ip
    user: 'jake', 
    password: 'jake',
    database: 'docker_db', 
    connectionLimit: 10,
    port: 3307,
}

const pool = createPool(configs)

export function initDatabase() {
    const connection = createConnection(configs)
    connection.connect((err) => {
        if (err) {console.error(err.message)}
        else console.log("connected")
    })
    
    pool.getConnection((err, conn) => {
        if (err) console.error(err)
    
        conn.query(`create table jake (
            id int auto_increment primary key,
            name varchar(255),
            post text
        )`)
    
        console.log("table created")
        conn.commit() // end transaction
    })
}

export function insertMockData() {
    pool.getConnection((err, conn) => {
        if (err) console.error(err)
        conn.execute(`insert into ${targetTable} (name, post) values("jake", "hello there")`)
        console.log("mock data inserted")

        pool.releaseConnection(conn)
    })
}

export function selectMockData() {
    pool.getConnection((err, conn) => {
        if (err) console.error(err)
        const rows = conn.query(`select * from ${targetTable}`, null, (err, result) => {
            console.log({result})
        })

        console.log("fetched all rows")
        conn.commit()
        pool.releaseConnection(conn)
    })
}

export function updateMockData() {
    pool.getConnection((err, conn) => {
        conn.execute(`update ${targetTable} set name = ? where id = ?`, ["not jake", 1], (err, result) => {
            console.log("update result: ", result)
        })

        conn.execute("select * from jake", null, (err, result) => {
            console.log("select result: ", result)
        })

        console.log("update target columns")

        pool.releaseConnection(conn)
    })
}