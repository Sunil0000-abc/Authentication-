const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendEmail = async(toEmail,otp)=>{
    try{
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        });

        const mailOptions = {
            from:process.env.EMAIL,
            to:toEmail,
            subject:'OTP Verification',
            text:`Your OTP for verification is ${otp}. It is valid for 5 minutes.`
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to",toEmail);
    }catch(error){
        console.log("Error sending email:",error);
    }
}

module.exports = sendEmail;