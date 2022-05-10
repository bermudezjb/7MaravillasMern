const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. create Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2. define the mail option
  const emailOptions = {
    from: "Joel Bermudez <jbermudez@7mavarillastours.com>",
    to: options.email,
    subject: options.subject,
    message: options.message,
    //html:
  };
  // 3.send the mail
  await Transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
