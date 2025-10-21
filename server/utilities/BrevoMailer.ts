// @ts-ignore
import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendEmail(toEmail: string, subject: string, htmlContent: string): Promise<void> {
  const sender = {
    email: 'rohin113.rk@gmail.com', // must b  e a verified Brevo sender
    name: 'Mrehab Team',
  };

  const receivers = [{ email: toEmail }];

  const email = {
    sender,
    to: receivers,
    subject,
    htmlContent,
  };

  try {
    const result = await tranEmailApi.sendTransacEmail(email);
    console.log('✅ Email sent successfully:', result);
  } catch (error: any) {
    console.error('❌ Error sending email:', error.response?.text || error);
  }
}

export default sendEmail;
