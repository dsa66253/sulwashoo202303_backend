import { postDraw } from "./stress.js";
import moment from "moment"
import autocannon from "autocannon"
const start = ()=>{
    const interval = 1000
    const times = 1
    for (let i=0;i<times;i++){
        setTimeout(async()=>{
            console.log("start at ",moment().format())
            // autucannon.track(getForm({url:"http://localhost:4006", method:"GET", path:"/questionnaire"}))
            const productionURL = "https://laneige-backend.aoli-ad.tw"
            const localUrl = "http://localhost:4006"
            const cannonInstance = await postDraw({url:productionURL, method:"POST", path:"/draw"})
            console.log("cannonInstance", cannonInstance)
            // console.log(autocannon.printResult(cannonInstance, {renderLatencyTable:true}))
            // autocannon.track(cannonInstance, {renderLatencyTable:true})
            
            if(i===times-1){
                console.log("finish")
            }
            console.log("end at ",moment().format())
        }, interval)
    }
}
start()