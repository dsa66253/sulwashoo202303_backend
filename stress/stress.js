import autucannon from "autocannon"

const getpoForm = ({url, path, method})=>{
    return autucannon({
        title:"AUTOCANNON TEST",
        url:url,
        connections: 50,
        duration: 30,
        pipelining: 100,
        amount:100,
        workers:2,
        requests:[
            {
                method:method,
                path:path,
            }
        ]
    })
}
const test = async ()=>{
    autucannon.track(getForm(), {progressBarString:"running [:bar] :percent"})
}
const postDraw = ({url, path, method})=>{
    // let body = createCusSampleData()
    // console.log("body", body)
    // const numberOfRequest = 10
    // const requestBody = Array.from({length:numberOfRequest}, ()=>{
    //     return{
    //         method:method,
    //         path:path,
    //         body:JSON.stringify(createCusSampleData()),
    //     }
        
    // })
    return autucannon({
        title:"AUTOCANNON TEST",
        url:url,
        connections: 10,
        // duration: 30,
        // pipelining: 100,
        amount:100,
        // workers:4,
        headers:{
            "content-type":"application/json"
        },
        requests:[
            {
                method:method,
                path:path,
                body:JSON.stringify({who:"aoli-ad"}),
                onResponse:(status, body, context)=>{
                    console.log(status, JSON.parse(body).giftNumber)
                    // console.log(status, body, context)
                }
                // setupRequest:(request, context)=>{
                //     // console.log("request", request)
                //     // console.log("context", context)
                //     request.body = JSON.stringify(createCusSampleData())
                //     return request
                // }
            }
        ],
        // verifyBody:(response)=>console.log(response)
        
    })
}

export {postDraw}