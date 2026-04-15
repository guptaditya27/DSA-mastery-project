import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: process.env.EMAIL_PORT || 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER || 'ethereal.user', 
    pass: process.env.EMAIL_PASS || 'ethereal.pass',
  },
});

export const sendOtpEmail = async (to, otp, type = 'login') => {
  const subject = type === 'reset' ? 'Password Reset OTP' : 'Your Login OTP';
  const textMsg = `Your one-time password (OTP) is: ${otp}\n\nIt will expire in 10 minutes. Do not share this code with anyone.`;
  
  // Developer mock output so testing works without valid SMTP
  console.log(`\n================================`);
  console.log(`[MOCK EMAIL DISPATCH]`);
  console.log(`To:       ${to}`);
  console.log(`Subject:  ${subject}`);
  console.log(`OTP Code: ${otp}`);
  console.log(`================================\n`);

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: `"DSA Mastery System" <${process.env.EMAIL_USER}>`,
          to,
          subject,
          text: textMsg,
        });
        console.log(`Email sent successfully to ${to}`);
      } catch (err) {
        console.error('Email send failed:', err);
      }
  } else {
      console.log('Skipping actual NodeMailer dispatch (EMAIL_USER or EMAIL_PASS not set in .env). Use the printed mock OTP above to test.');
  }
};
