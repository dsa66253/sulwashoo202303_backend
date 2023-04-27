import { getTransactionConn} from "../db/db.js"
import { playDraw } from "../utility/draw.js"
import { giftFileNames, giftSerials, giftUrl} from "../utility/draw.config.js"
import moment from "moment"
import { addTodayTraffic } from "../scheduler/recordTraffic.js"

const postDraw = async (req, res) =>{
    addTodayTraffic()
    if (!checkInput(req.body)){
        console.log(req.body)
        res.status(400).send(req.body)
        return
    }
    let response = {
        giftNumber:"",
        giftSerialNumber:"",
        giftImage:"",
        giftLink:""
    }
    let transactionConn
    try{
        //info play draw
        response.giftNumber = await playDraw(transactionConn)
        response.giftSerialNumber = giftSerials[response.giftNumber]
        response.giftImage = giftFileNames[response.giftNumber]
        response.giftLink = giftUrl[response.giftNumber]
        console.log(moment().utcOffset(8).format(), response)
        res.status(201).send(response)
    }catch(e){
        console.log("fail to play draw")
        console.log(e)
        // transactionConn.rollback()
        res.status(500).send("fail to play draw")
    }
}
const checkInput = (body) =>{
    const mustHave = ["who"]
    let isValid = true
    // console.log("body", body)
    mustHave.forEach((e, index)=>{
        if (body[e]===undefined){
            isValid = false
            return
        }
        if (body[e]!=="aoli-ad"){
            isValid = false
            return
        }
    })
    return isValid
}
export {postDraw}