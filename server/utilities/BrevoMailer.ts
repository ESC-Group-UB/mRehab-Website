// @ts-ignore
import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
dotenv.config();

// --- Logging start ---
console.log("🔍 Environment check:");
console.log(" - BREVO_API_KEY exists:", !!process.env.BREVO_API_KEY);
// --- Logging end ---

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];

apiKey.apiKey = process.env.BREVO_API_KEY;
if (!apiKey.apiKey) {
  console.error("❌ No Brevo API key found in environment variables!");
}

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendEmail(toEmail: string, subject: string, htmlContent: string): Promise<void> {
  const sender = {
    email: 'rohin113.rk@gmail.com', // must be a verified Brevo sender
    name: 'mRehab Team',
  };

  const receivers = [{ email: toEmail }];

  const email = {
    sender,
    to: receivers,
    subject,
    htmlContent,
  };

  console.log("📧 Attempting to send email...");
  console.log(" - To:", toEmail);
  console.log(" - Subject:", subject);
  console.log(" - Using API key prefix:", apiKey.apiKey?.slice(0, 10) + "..." || "none");

  try {
    const result = await tranEmailApi.sendTransacEmail(email);
    console.log('✅ Email sent successfully:', JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('❌ Error sending email:');
    console.error(' - Message:', error.message);
    console.error(' - Code:', error.code);
    console.error(' - Response:', error.response?.text || error);
  }
}

export default sendEmail;
