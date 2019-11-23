const amqp = require('amqplib/callback_api');
const event1=require('events')
const emmiter1=new event1.EventEmitter()
let userEmmiter = require('./user');
let newEmmiter = userEmmiter.em
// console.log("newEmmiter", newEmmiter);
newEmmiter.on('produceEvent', (emailObj) => {
  // console.log(emailObj);
  
  sendMailObj(emailObj);
})
// class Producer {
 function sendMailObj(emailobj) {
    // newEmmiter.on('produceEvent', (emailObj) => {
      amqp.connect('amqp://localhost', (error, connection) => {
        if (error) {
          console.log("error in producer: ", error);
          throw error;
        }
        else {
          connection.createChannel((error1, channel) => {
            if (error1) {
              console.log("error in producer: ", error1);
              throw error1;
            }
            let queue = 'node_queue';
            channel.assertQueue(queue, {
              durable: true
            });
            console.log("user email id", emailobj.email)
            channel.sendToQueue(queue, new Buffer.from(JSON.stringify(emailobj)), {
              persistent: true
            });
            console.log("email object has sent to the rabbitmq-server")
          })
          setTimeout(() => {
            connection.close();
            process.exit(0)
          }, 100000);
        }
      });
    // })
  }
// }  
module.exports.em1=emmiter1
// module.exports = new Producer;