import nodemailer from "nodemailer"
import {config} from "dotenv"
config()
export let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
          secure: true,
          auth: {
            user: "wadoodmemon0@gmail.com",
            pass: "wzzj iaoh nzts gfra",
          },
  });
        
     
  