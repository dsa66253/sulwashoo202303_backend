import cors from "cors"
import express from "express";
import * as dotenv from 'dotenv'
// import devRouter from "./routers/dev.route.js"
import drawRouter from "./routes/draw.js"
import { runDailyRoute } from "./scheduler/refreshGiftNumber.js";
import { getTransactionConn } from "./db/db.js"
import {playDraw} from "./utility/draw.js"
dotenv.config()
const app = express();
app.use(express.json())
let whiteList = ["*", "http://localhost:3000"]
app.use(cors({
    origin: "*",
    methods:["GET", "POST"]
}));


app.use("/draw", drawRouter)
// app.use("/dev", devRouter)
// const test = async ()=>{
//     for(let i=0; i<2; i++){
//         const awardNum = await playDraw("09876543")
//         console.log(i, awardNum)
//     }
// }
// test()
//? roll back need to begin transaction again?
const test = async (i)=>{
    const transactionConn = await getTransactionConn()
    transactionConn.beginTransaction()
    transactionConn.commit()
    let res = (await transactionConn.query("SELECT * FROM Gift"))
    // res = (await transactionConn.query("SELECT tx.trx_id FROM information_schema.innodb_trx tx WHERE tx.trx_mysql_thread_id = connection_id()"))[0]
    console.log(i, res)
    // for (;;){
    //     console.log("loop start", i)
    //     if (i<2){
    //         let res = (await transactionConn.query("SELECT * FROM Gift"))[0]
    //         console.log(res[0])
    //         transactionConn.commit()
    //         let res2 = (await transactionConn.query("SELECT * FROM Gift"))[0]
    //         console.log(res2[0])
    //         break
    //     }else{
    //         console.log("rollback")
    //         transactionConn.rollback()
    //     }
    //     i = i-1
    //     console.log("i--")
    // }
    transactionConn.release()
}

// for (let i=0;i<2;i++){
//     test(i)
// }
const testPlay=async(i)=>{
    let sum = {}
    const playTime = 1
    for(let i=0; i<playTime; i++){
        let award = await playDraw()
        if (sum[award]===undefined){
            sum[award] = 1
        }else{
            sum[award]++
        }
    }
    console.log("sum", i, sum)
}
// testPlay()

// runDailyRoute()

let PORT = parseInt(process.env.PORT)
// userControoller.postUser()
app.use("/", (req, res)=>{res.send("helo")})
const server = app.listen(PORT, ()=>{
    // testConnection()
    console.log("server is luanched at ", server.address().port)
})