
import { EmailVerification } from "../components/EmailTemplate";
import nodemailer from "nodemailer"

export let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "wadoodmemon0@gmail.com",
    pass: "wzzj iaoh nzts gfra",
  },
});
console.log(process.env.GMAIL_USER);
console.log(EmailVerification("wadood"  , "wadoodmemon0@gmail.com" , "21355"));


// await transporter.sendMail({
//   from: "wadoodmemon0@gmail.com",
//   to: "wadoodmemon0@gmail.com",
//   subject: "Connectify Verification Email",
//   html : ,
// });