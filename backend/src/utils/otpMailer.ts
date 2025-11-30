import nodemailer from 'nodemailer';

const user = process.env.EMAIL_USER!;
const pass = process.env.EMAIL_PASS!;

if (!user || !pass) {
  console.warn('EMAIL_USER or EMAIL_PASS not set. OTP emails will fail.');
}

// Use Gmail service (requires App Password typically)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user,
    pass
  }
});

export const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
  const minutes = process.env.OTP_EXPIRY_MINUTES || '10';
  const mailOptions = {
    from: user,
    to: email,
    subject: 'Your registration OTP',
    text: `Your OTP is ${otp}. It expires in ${minutes} minutes.`
  };
  await transporter.sendMail(mailOptions);
};
