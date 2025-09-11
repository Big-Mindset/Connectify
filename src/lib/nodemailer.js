import nodemailer from "nodemailer";

export let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wadoodmemon0@gmail.com",
    pass: "ryrq eoaj wwxu clxx"
  },
});

