import {awardRatio } from "./draw.config.js"
import { getTransactionConn } from "../db/db.js"

const getAwardBucket = ()=>{
    console.log("calculate bucket")
    //info find min probility of award
    let min = 1
    for(let k in awardRatio){
        if (awardRatio[k]<min){
            min = awardRatio[k]
            
        }
    }
    
    //info normalized award ratio
    const minString = min.toString()
    const decimalPart = minString.split(".")[1]
    let multiplier = 1
    for (let char in decimalPart){
        multiplier = multiplier * 10
    }
    let awardNorRatio = {}
    for(let k in awardRatio){
        awardNorRatio[k] = parseInt(awardRatio[k]*multiplier)
    }
    // console.log(awardNorRatio)
    //info create bucket
    let awardBucket = {}
    let minBucketNum = 1
    let maxBucketNum = 1
    let currentBase = minBucketNum
    for(let k in awardNorRatio){
        awardBucket[k] = {
            min:currentBase,
            max:currentBase+awardNorRatio[k]-1,
            interval: awardNorRatio[k]
        }
        currentBase = currentBase + awardNorRatio[k]
        maxBucketNum = awardBucket[k].max
    }
    
    return {awardBucket, minBucketNum, maxBucketNum}
}
let {awardBucket, minBucketNum, maxBucketNum} = getAwardBucket()
const playDraw = async (transactionConn)=>{
    // return string type of gift number
    // play draw by transaction connection
    // step1. ramdomly pick gift id
    // step2. check if the gift is limited and if it's enough
    // step3. modify the rest of gift in database

    let giftId = 0
    // info create connection
    // let connection 
    // try{
    //     connection = await getTransactionConn()
    // }catch(e){
    //     console.log("wrong with connection")
    //     throw e
    // }
    // await connection.beginTransaction();
    // console.log("transaction start")
    // info play draw
    for (;;){
        let drawBucketNum = getRandomIntInclusive(minBucketNum, maxBucketNum)
        for(let k in awardBucket){
            if(awardBucket[k].min<=drawBucketNum && drawBucketNum<=awardBucket[k].max){
                giftId = k
                break
            }
        }
        let gift
        try{
            // gift = (await transactionConn.query('SELECT Limited, Rest FROM Gift WHERE Id=? FOR UPDATE', [giftId]))[0][0]
            gift = {Limited:0}
        }catch(e){
            console.log(e)
            console.log("transaciton time out, redraw...")
            continue
        }
        
        // console.log(gift)
        if (gift.Limited===0){
            // the gift is number 1~9
            break
        }else if(gift.Rest>0){
            // the gift is number 10
            const newRest = gift.Rest - 1
            try{
                // await transactionConn.query("UPDATE Gift SET Rest=? WHERE Id=?", [newRest, giftId])
                break
            }catch(e){
                console.log()
                throw e
            }
        }
    }
    return parseInt(giftId)
}

const getRandomIntInclusive = (min=1, max=100)=>{
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}



export {playDraw, getAwardBucket}