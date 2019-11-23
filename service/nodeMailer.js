const nodemailer=require('nodemailer');
// require('dotenv').config()
// const config = require('../config/local');



exports.nodemailSender=(userForgetPasswordDataObject,template,callback)=>{
  //console.log("userForgetPasswordDataObject",userForgetPasswordDataObject);
  
 let transporter=nodemailer.createTransport({
    service: 'gmail',
    auth: {
    //  user:config.USERMAIL,
    //  pass:config.USERPASSWORD
    }
});
let mailoption={
  // from:config.USERMAIL,
  to:userForgetPasswordDataObject.email,
  subject:'sending email to reset password',
  text:"hello ",
  html:template
}
transporter.sendMail(mailoption,(err,data)=>{
  if(err)
  {
      console.log('email not send',err);
      return callback(err);
  }else{
      return callback(null,'email send :'+data.response);
  }
})
}