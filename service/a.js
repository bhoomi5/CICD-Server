const event=require('events')
const emmiter=new event.EventEmitter()
class Abc{
    pqr()
    {
        var c=5;
        emmiter.emit("produceEvent",c)
        console.log("hello at a")
    }
}
module.exports=new Abc()

module.exports.em=emmiter

