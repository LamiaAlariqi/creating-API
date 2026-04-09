import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_MAIL,  //admin email
      to: options.email,  //user email 
      subject: options.subject, //subject of the email
      text: options.message,
    };

    await transporter.sendMail(mailOptions); //send the email

  } catch (error) {
    console.error("Error sending email:", error);
  }
};
