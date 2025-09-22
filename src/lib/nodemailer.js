import nodemailer from "nodemailer";
console.log(process.env.NODEMAILER_PASS)
export let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wadoodmemon0@gmail.com",
    pass: process.env.NODEMAILER_PASS
  },
});

