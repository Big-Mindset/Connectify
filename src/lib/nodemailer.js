import nodemailer from "nodemailer";

export let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "wadoodmemon0@gmail.com",
    pass: process.env.NODEMAILER_PASS,
  },
});
