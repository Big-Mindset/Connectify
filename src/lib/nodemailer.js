import nodemailer from "nodemailer";
import { config } from "dotenv";  
config()

export let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wadoodmemon0@gmail.com",
    pass: process.env.NODEMAILER_PASS
  },
});

