let modelObj=require('../model/note')
let logger=require('../logger/logger')
const cron=require('node-cron')
class Notification {

 archieveOlderNote() {
    let noteObj = {}
    modelObj.find(noteObj)
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                /**
                * @param noteUpdationDate: note updation date in database
                */
                let noteUpdationDate = data[i].updatedAt
                /**
                * @param todaysDate  : get todays date
                */
                let todaysDate = new Date();
                // console.log("reminder",todaysDate);
                let Difference_In_Time = todaysDate.getTime() - noteUpdationDate.getTime();  
                let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                (Difference_In_Days > 30) ? modelObj.update({ _id: data[i]._id }, { 'isArchieved': true }) : new error("something is going wrong")
            }
        }).catch((err) => {

        })
}
reminder() {
    let noteObj = {'isReminder':true}
    let b=[]
    modelObj.find(noteObj)
        .then((data) => {
            let a = new Array();
            for (let i = 0; i < data.length; i++) {
                // console.log("data",data)
                let remindDateObj = new Date(data[i].reminder)
                let todaysDate = new Date();
                let Difference_In_Time =remindDateObj.getTime()-todaysDate.getTime();
                if(Difference_In_Time<0){
                    let query = { '_id': data[i]._id }
                    let updateQuery = { $set: { 'reminder': null,'isReminder':false } }
                    /**
                     * @description: pushing a label into note
                     */
                   modelObj.update(query, updateQuery)
                        .then((data)=>{
                        }).catch((err)=>{
                            logger.info(err)
                        })
                   }
                else{
                    let obj = {
                    note: data[i]._id,
                    time: Difference_In_Time
                }
                a.push(obj)
              }
            } 
            let b=[]
            for (let i = 0; i < a.length-1; i++)  
            {  
                let searchIndex=i;
                for (let j = i + 1; j < a.length; j++){  
                    if (a[searchIndex].time>a[j].time){  
                         searchIndex=j;
                    } 
                 }  
                 let searchArray=a[searchIndex];
                 a[searchIndex]=a[i];
                 a[i]=searchArray;    
          }  
          console.log("Upcoming Reminders Are : ")
         for(let i=0;i<a.length;i++)
         {
            console.log("notes:",a[i]);
         }

        }).catch((err)=>{
            logger.info("err",err);
        })

    }
}
/**
 * @description: scheduling a task 
 */
var obj=new Notification()
{
    cron.schedule("* * * * *", () => {
        obj.archieveOlderNote()
        obj.reminder()
    })
}
module.exports=new Notification() 