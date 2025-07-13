const nodemailer = require("nodemailer");


async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount();
  console.log("Test Account:", testAccount);
}

createTestAccount();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jasen.bednar19@ethereal.email',
        pass: 'd3XM8tAfqjyu8E8YuU'
    }
});


export async function sendEmail(
  from: string,
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> {
  const info = await transporter.sendMail({
    from: `${from} <jasen.bednar19@ethereal.email>`,
    to: to,
    subject: subject,
    text: text, // plain‑text body
    html: html, // HTML body
  });

  console.log('📬 Preview your email at:', nodemailer.getTestMessageUrl(info));
}

