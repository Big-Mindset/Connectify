import nodemailer from "nodemailer";
console.log("running");
console.log("the password is ");
console.log(process.env.NODEMAILER_PASS);
import { config } from "dotenv";
config()
export let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "wadoodmemon0@gmail.com",
    pass: process.env.NODEMAILER_PASS,
  },
});
