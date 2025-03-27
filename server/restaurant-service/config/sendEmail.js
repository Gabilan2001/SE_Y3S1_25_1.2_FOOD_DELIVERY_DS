import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()
if(!process.env.RESEND_API){
    console.log("provide resend_api in side the .env file")
}
const resend = new Resend(process.env.RESEND_API);

const sendEmail = async({sendTo,subject,html})=>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'DSproject <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
          });

          if(error){
            return console.error({error});
          }
    } catch (error) {
        console.log({ data });
    }
}


  export default sendEmail
