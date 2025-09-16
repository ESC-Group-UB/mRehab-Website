  import nodemailer from "nodemailer";

  const transporter = nodemailer.createTransport({
    host: "email-smtp.us-east-2.amazonaws.com", // change if your SES region differs
    port: 587,                                  // 587 (TLS) or 465 (SSL)
    secure: false,                              // true for port 465, false for 587
    auth: {
      user: process.env.SMTP_USER_NAME,         // from .env
      pass: process.env.SMTP_PASSWORD,          // from .env
    },
  });

  export default async function sendEmail(
    from: string,
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<void> {
    const info = await transporter.sendMail({
      from,   // must match a verified SES email/domain
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
  }
