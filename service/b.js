const listen=require('./a')
var emm=listen.em
class Abcde{
    pqrst()
    {
        console.log("emm",emm);
        
    emm.on("produceEvent",(c)=>{
        console.log("hello at B...value of c is",c);
        
    })
    }
}
module.exports=new Abcde()