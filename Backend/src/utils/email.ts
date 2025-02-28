import nodemailer from "nodemailer";
const CLIENT_URL = process.env.CLIENT_URL;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`;
  console.log(`Password Reset Link: ${resetLink}`);

  const mailOptions = {
    from: "Stack Nest Team <no-reply@stacknest.com>",
    to: email,
    subject: "🔒 Reset Your StackNest Password",
    text: `Hello,  

You have requested to reset your StackNest password. Click the link below to proceed:  

${resetLink}  

This link will expire in 15 minutes. If you did not request this, please ignore this email.  

Best,  
Stack Nest Team`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #7848F4; text-align: center;">🔒 StackNest Password Reset</h2>
        <p style="font-size: 16px; color: #333; text-align: center;">
          You requested to reset your password. Click the button below to proceed.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" 
            style="background: #7848F4; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 16px; color: #333; text-align: center;">
          This link will expire in <strong>15 minutes</strong>.
        </p>
        <p style="font-size: 14px; color: #555; text-align: center;">
          If you did not request this, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="text-align: center; font-size: 12px; color: #777;">
          🚀 <strong>StackNest</strong> - Secure. Reliable. Developer-friendly.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordUpdated = async (email: string) => {
  const mailOptions = {
    from: "Stack Nest Team <no-reply@stacknest.com>",
    to: email,
    subject: "✅ Password Successfully Updated",
    text: `Hello,  

Your StackNest account password has been successfully updated.  

If you did not make this change, please reset your password immediately or contact our support team.  

Best,  
Stack Nest Team`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #7848F4; text-align: center;">✅ Password Updated Successfully</h2>
        <p style="font-size: 16px; color: #333; text-align: center;">
          Your StackNest account password has been updated successfully.
        </p>
        <p style="font-size: 16px; color: #333; text-align: center;">
          If this was not you, please reset your password immediately or contact our support team.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.CLIENT_URL}/auth/reset-password" 
            style="background: #7848F4; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 16px; color: #333; text-align: center;">
          If you recognize this change, no further action is needed.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="text-align: center; font-size: 12px; color: #777;">
          🚀 <strong>StackNest</strong> - Secure. Reliable. Developer-friendly.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


export const sendWelcomeMail = async (name: string, email: string) => {
  const mailOptions = {
    from: "Stack Nest Team <no-reply@stacknest.com>",
    to: email,
    subject: "Welcome to StackNest! Your Account is Verified 🎉",
    text: `Hello ${name},  
  
  Congratulations! Your email has been successfully verified. 🎉  
  
  You are now a part of the StackNest developer community, where you can:  
  ✅ Connect with fellow developers  
  ✅ Join tech discussions and rooms  
  ✅ Participate in coding challenges  
  ✅ Share and collaborate on projects  
  
  Get started by exploring our platform: [StackNest](https://stacknest.com)  
  
  If you have any questions, feel free to reach out to our support team.  
  
  Happy coding! 🚀  
  
  Best Regards,  
  StackNest Team`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #7848F4; text-align: center;">Welcome to StackNest! 🎉</h2>
        <p style="font-size: 16px; color: #333;">Hello <strong>${name}</strong>,</p>
        <p style="font-size: 16px; color: #333;">
          Congratulations! Your email has been successfully verified. You are now part of a thriving developer community where you can:
        </p>
        <ul style="font-size: 16px; color: #555;">
          <li>✅ Connect with fellow developers</li>
          <li>✅ Join tech discussions and rooms</li>
          <li>✅ Participate in coding challenges</li>
          <li>✅ Share and collaborate on projects</li>
        </ul>
        <p style="font-size: 16px; color: #333;">
          Ready to get started? Click below to explore StackNest:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href=${CLIENT_URL} 
            style="background-color: #7848F4; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold;">
            Explore StackNest 🚀
          </a>
        </div>
        <p style="font-size: 14px; color: #555;">If you have any questions, feel free to reach out to our support team.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="text-align: center; font-size: 12px; color: #777;">
          🚀 <strong>StackNest</strong> - Connecting developers, sharing knowledge, and growing together.
        </p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

export const sendOtpMail = async (email: string, otp: string) => {
  const mailOptions = {
    from: "Stack Nest Team <no-reply@stacknest.com>",
    to: email,
    subject: "🔐 Your OTP Code for StackNest Registration",
    text: `Hello,  

Your OTP code for StackNest registration is: ${otp}  
This code will expire in 15 minutes.  

If you did not request this code, please ignore this email.  

Best Regards,  
Stack Nest Team`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #7848F4; text-align: center;">🔐 StackNest OTP Verification</h2>
        <p style="font-size: 16px; color: #333; text-align: center;">
          Use the OTP below to complete your registration.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 22px; font-weight: bold; color: #7848F4; background: #f4f4f4; padding: 12px 24px; border-radius: 6px; display: inline-block;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 16px; color: #333; text-align: center;">
          This OTP will expire in <strong>15 minutes</strong>.
        </p>
        <p style="font-size: 14px; color: #555; text-align: center;">
          If you did not request this code, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="text-align: center; font-size: 12px; color: #777;">
          🚀 <strong>StackNest</strong> - Secure. Reliable. Developer-friendly.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
