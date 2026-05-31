import nodeMailer from "nodemailer"
import { MailOptions } from "nodemailer/lib/json-transport"
import { EMAIL_USER, PASSWORD_USER } from "../../config"

export const sendEmail = async({to , subject , html}:MailOptions)=>{

   const transporter =  nodeMailer.createTransport({
    service : "gmail",
    host : "smtp.gmail.com",
    port : 587,
    secure : false,
    auth : {
        user: EMAIL_USER , 
        pass : PASSWORD_USER
    },

      tls: {
    rejectUnauthorized: false
  }
   })


  await transporter.sendMail({
    from : "'social app' <nagyhani337@gmail.com>",
    to,
    html,
    subject
   })
}