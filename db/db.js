import mysql2 from "mysql2/promise"
import * as dotenv from 'dotenv'

dotenv.config()

const pool = mysql2.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})
const testConnection = async () =>{
    try{
        const tmp =  await pool.getConnection()
        console.log("connect to db successfully")
    }catch(e){
        console.log("fail to connect to db")
    }
}
const query = async (sql, params)=>{
    const conn = null
    try{
        const conn = await pool.getConnection()
        const res = await conn.query(sql, params)
        return res[0]
    }catch(e){
        throw e
    }finally{
        if (conn!==null){
            conn.release()
        }

    }
}
const getTransactionConn = async ()=>{
    // use this function for transaction usage.
    // You need to handle query(), rollback(), commit(), and release() by yourself.
    return pool.getConnection()
}
export {testConnection, query, getTransactionConn}