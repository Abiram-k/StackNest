import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendPasswordResetEmail = async (email: string, token: string) => {

  const resetLink = `${process.env.CLIENT_URL}/user/auth/reset-password?token=${token}`;
  console.log(resetLink)

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};