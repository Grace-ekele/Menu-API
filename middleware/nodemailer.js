const nodemailer = require('nodemailer');



// create a nodemailer transporter using gmail service
// const transporter = nodemailer.createTransport({
//   service: process.env.SERVICE,
//   auth: {
//     user: process.env.SENDER_EMAIL,
//     pass: process.env.GMAIL_PASSWORD,
//     secure: false
//   }
// });

// create a nodemailer transporter using mail trap service
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAIL_TRAP_USERNAME,
    pass: process.env.MAIL_TRAP_PASSWORD
  }
});


module.exports = transporter