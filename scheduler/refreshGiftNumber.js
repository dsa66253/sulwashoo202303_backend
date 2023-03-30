import { CronJob } from "cron"
import moment from "moment"
import {getTransactionConn} from "../db/db.js"
import { getRandomIntInclusive } from "../utility/random.js"
const runDailyRoute = () =>{
    // const runTime = '0 0 0 * * *'
    console.log("daily schedule launch")
    const runTime = '0 0 0 * * *' //'0 0 0 * * *' for production
    const targetGift = "7"
    let job = new CronJob(
        runTime,
        async (fireDate) => {
            // const setRest = getRandomIntInclusive(4, 100)
            // console.log("current millisecond", moment().millisecond(), "setRest", setRest)
            console.log("daily routine starts")
            const currentTime = moment().utcOffset(8).format()
            let transactionConn
            try{
                transactionConn = await getTransactionConn()
            }catch(e){
                console.log("connection fail when do daily update the rest of gift 7")
                return
            }
            await transactionConn.beginTransaction()
            try{
                // await transactionConn.query("LOCK TABLES Gift WRITE;")
                let params = [targetGift]
                let sql = `SELECT Rest, LastRefreshTime FROM Gift WHERE Id=? FOR UPDATE`
                let result = (await transactionConn.query(sql, params))[0][0]
                console.log(result)
                console.log(currentTime, "The rest number of gift 7 is ", result.Rest)
                if(result.LastRefreshTime===null || moment(result.LastRefreshTime).isBefore(currentTime, "day")){
                    params = [3, currentTime, targetGift]
                    sql = `UPDATE Gift SET Rest=?,LastRefreshTime=? WHERE Id=?`
                    result = (await transactionConn.query(sql, params))
                    params = [targetGift]
                    sql = `SELECT Rest FROM Gift WHERE Id=?`
                    result = (await transactionConn.query(sql, params))[0][0]
                    console.log("after update", result)
                    transactionConn.commit()
                }else{
                    console.log("already update")
                }
            }catch(e){
                console.log(e)
                transactionConn.rollback()
            }finally{
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

export {runDailyRoute}