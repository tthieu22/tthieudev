const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
require("dotenv").config({ path: "../.env" });

const sendEmail = asyncHandler(async (data, req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,  
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MP,
        },
    });
 
    async function main() { 
        const info = await transporter.sendMail({
            from: `"${process.env.MAIL_NAME}" <${process.env.MAIL_ID}>`, 
            to: data.to, 
            subject: data.subject, 
            text: data.text,  
            html: data.htm,  
        }); 
    }

    main().catch(console.error);
})
module.exports = {
    sendEmail
}