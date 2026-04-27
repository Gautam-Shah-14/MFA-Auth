const nodemailer = require('nodemailer');
const { EmailClient } = require('@azure/communication-email');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
  service: env.EMAIL.SERVICE,
  auth: {
    user: env.EMAIL.USERNAME,
    pass: env.EMAIL.PASSWORD
  }
});

let azureClient;
if (env.AZURE.CONNECTION_STRING && !env.AZURE.CONNECTION_STRING.startsWith('your_')) {
  azureClient = new EmailClient(env.AZURE.CONNECTION_STRING);
}

const sendOTP = async (email, otp) => {
  const subject = 'Your Login OTP';
  const text = `Your OTP for login is ${otp}. It expires in 5 minutes.`;
  const html = `<strong>Your OTP for login is ${otp}.</strong><br/>It expires in 5 minutes.`;

  try {
    if (env.EMAIL.USERNAME && !env.EMAIL.USERNAME.startsWith('your_')) {
      await transporter.sendMail({
        from: env.EMAIL.USERNAME,
        to: email,
        subject,
        text,
        html
      });
      console.log(`Email sent via Nodemailer to ${email}`);
    } else {
      console.log(`[DEV MODE] SMTP not fully configured. OTP for ${email} is: ${otp}`);
    }
  } catch (error) {
    console.error('Nodemailer error:', error);
    throw error;
  }
};

const sendAzureEmail = async (email, subject, text, html) => {
  const message = {
    senderAddress: env.AZURE.SENDER,
    content: {
      subject: subject,
      plainText: text,
      html: html,
    },
    recipients: {
      to: [{ address: email }],
    },
  };

  try {
    if (azureClient) {
      const poller = await azureClient.beginSend(message);
      await poller.pollUntilDone();
      console.log(`Email sent via Azure to ${email}`);
    } else {
      console.log(`[DEV MODE] Azure not fully configured.`);
    }
  } catch (error) {
    console.error('Azure Email error:', error);
    throw error;
  }
};

module.exports = {
  sendOTP,
  sendAzureEmail
};
