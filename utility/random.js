const getRandomIntInclusive = (min=1, max=100)=>{
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
export {getRandomIntInclusive}