const amqp = require('amqplib/callback_api');
const nodeMailer=require('../service/nodeMailer')
class Consumer{
    sendEmail(){
            amqp.connect('amqp://localhost',(error0, connection) =>{
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel)=> {
    if (error1) {
      throw error1;
    }
    var queue = 'node_queue';
    channel.assertQueue(queue, {
      durable: true
    });
    channel.prefetch(1);
   
    console.log("Waiting for messages in %s", queue);
    channel.consume(queue,(msg)=> {
        let message=JSON.parse(msg.content.toString('utf8'))
        console.log("message",message); 
              nodeMailer.nodemailSender(message,message.html, (err, data) => {
                    if (err) {
                         console.log(err);
                    } else {
                        console.log("data",data);
                          console.log("email has sent successfully");
                    }
                    setTimeout(()=>{
                        channel.ack(msg);
                    },100);
                    })
        })
        })
    });
    }
}
module.exports=new Consumer;