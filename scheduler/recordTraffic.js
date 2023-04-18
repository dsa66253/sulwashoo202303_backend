import { CronJob } from "cron"
import moment from "moment"
import {getTransactionConn} from "../db/db.js"
let todayTraffic = 0
let cumulatedTraffic = 0
const runDailyRoute = () =>{
    // const runTime = '0 0 0 * * *'
    console.log("daily schedule launch")
    const runTime = '59 59 * * * *' //'0 0 0 * * *' for production
    // const targetGift = "7"
    let job = new CronJob(
        runTime,
        async (fireDate) => {
            console.log("daily routine starts")
            const currentTime = moment().utcOffset(8).format()
            let transactionConn
            try{
                transactionConn = await getTransactionConn()
            }catch(e){
                console.log("connection fail")
                return
            }
            await transactionConn.beginTransaction()
            try{
                let params
                let sql = `SELECT Time, CumulatedTraffic, TodayTraffic FROM Traffic ORDER BY Id DESC LIMIT 1;`
                let result = (await transactionConn.query(sql))[0]
                
                console.log(result,result.length)
                if (result.length===0){
                    console.log("==0")
                    params = [currentTime, cumulatedTraffic, todayTraffic]
                    // console.log(params)
                    sql = `INSERT INTO Traffic(Time, CumulatedTraffic, TodayTraffic) VALUE(?, ?, ?);`
                    await transactionConn.query(sql, params)
                    todayTraffic=0
                }else{
                    const latestRow = result[0]
                    params = [currentTime, latestRow["CumulatedTraffic"]+todayTraffic, todayTraffic]
                    sql = `INSERT INTO Traffic(Time, CumulatedTraffic, TodayTraffic) VALUE(?, ?, ?);`
                    await transactionConn.query(sql, params)
                    todayTraffic=0
                }
            }catch(e){
                console.log(e)
                transactionConn.rollback()
            }finally{
                transactionConn.commit()
                // await transactionConn.query("UNLOCK TABLES;")
                transactionConn.release()
            }
            // console.log(moment().utcOffset(8).format(), "finish update gift 7");
        },
        null,
        true,
        'Asia/Taipei'
    );
}
const addTodayTraffic = () => {
    todayTraffic = todayTraffic + 1
}

export {runDailyRoute, addTodayTraffic}