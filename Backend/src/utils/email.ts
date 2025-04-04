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
  
  Happy coding! 💻 
  
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
            Explore StackNest ⌛
          </a>
        </div>
        <p style="font-size: 14px; color: #555;">If you have any questions, feel free to reach out to our support team.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="text-align: center; font-size: 12px; color: #777;">
          😎 <strong>StackNest</strong> - Connecting developers, sharing knowledge, and growing together.
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

export const sendFeedPublishedMail = async (
  userName: string,
  feedId:string,
  email: string,
  title: string
) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const mailOptions = {
    from: "StackNest Team <no-reply@stacknest.com>",
    to: email,
    subject: `🚀 Your "${title}" is Live! Explore Insights Now`,
    text: `Hi ${userName},
  
  🌟 Great news! Your scheduled post "${title}" is now live on StackNest.
  
  📅 Publication Date: ${formattedDate} (UTC)
  🔗 Post URL: ${`${CLIENT_URL}/user/highlights/${feedId}`} 
  
  We're excited to see your content reach our developer community! Here's what's next:
  👉 Track engagement metrics in your dashboard
  👉 Respond to comments and questions
  👉 Share your post across networks
  
  Need to make edits? You can still update your post anytime from your dashboard.
  
  Thank you for contributing to the StackNest ecosystem! 🚀
  
  Best regards,
  The StackNest Team
  
  P.S. Loved creating this post? Schedule your next one directly from your dashboard!
  
  ---------------------------------
  💻 StackNest - Code. Share. Grow.
  📧 Contact: support@stacknest.com
  `,

    html: `
    <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 640px; margin: auto; padding: 0; background: #f8fafc;">
      <div style="background: linear-gradient(135deg, #7848F4 0%, #5C3AA9 100%); padding: 2rem; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 1.75rem; font-weight: 600;">
          🚀 Published Successfully!
        </h1>
      </div>
  
      <div style="padding: 2rem; color: #1e293b;">
        <p style="font-size: 1.125rem; margin-bottom: 1.5rem;">
          Hi ${userName}, your post is now live in the StackNest community!
        </p>
  
        <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="font-size: 1.25rem; color: #7848F4; margin: 0 0 1rem 0;">${title}</h2>
          
          <div style="display: grid; gap: 0.75rem; margin-bottom: 1.5rem;">
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <svg style="width: 1.25rem; height: 1.25rem; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>Published: ${formattedDate} UTC</span>
            </div>
            
            <!-- Add dynamic link placeholder -->
            <a href="${`${CLIENT_URL}/user/highlights/${feedId}`} }" style="display: inline-flex; align-items: center; gap: 0.5rem; color: #7848F4; text-decoration: none;">
              <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
              View Post
            </a>
          </div>
  
          <div style="background: #f1f5f9; padding: 1rem; border-radius: 0.375rem; margin: 1.5rem 0;">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem; color: #64748b;">Next Steps:</h3>
            <ul style="margin: 0; padding-left: 1.25rem;">
              <li>Monitor engagement in your dashboard</li>
              <li>Respond to community comments</li>
              <li>Share across your networks</li>
            </ul>
          </div>
  
          <a href="${`${CLIENT_URL}/`} }" style="display: inline-block; background: #7848F4; color: white; padding: 0.75rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-weight: 500; margin-top: 1rem;">
            Go to Dashboard →
          </a>
        </div>
  
        <footer style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b;">
          <p style="margin: 0.5rem 0; font-size: 0.875rem;">
            💻 StackNest - Empowering Developers Worldwide<br>
            <a href="${"#"}" style="color: #7848F4; text-decoration: none;">Unsubscribe</a> | 
            <a href="${"#"}" style="color: #7848F4; text-decoration: none;">Contact Support</a>
          </p>
          <p style="margin: 0; font-size: 0.75rem;">
            123 Code Lane, Tech City • © 2024 StackNest
          </p>
        </footer>
      </div>
    </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendStreakMissedMail = async (email: string, username: string) => {
  const currentDate = new Date();
  const missedDate = currentDate.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const mailOptions = {
    from: "Stack Nest Team <no-reply@stacknest.com>",
    to: email,
    subject: "🚨 You've Missed Your Streak! Let's Get Back on Track",
    text: `Hello ${username},  

It looks like you missed a day in your streak on ${missedDate}.  

We understand that things get busy, but don't worry—there's still time to get back on track and continue your journey with StackNest.  

Stay motivated, and let's pick up where you left off!

Best Regards,  
Stack Nest Team`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #7848F4; text-align: center;">🚨 You've Missed Your Streak!</h2>
        <p style="font-size: 16px; color: #333; text-align: center;">
          Hi <strong>${username}</strong>, <br><br>
          It looks like you missed a day on your streak! Your last streak day was <strong>${missedDate}</strong>.
        </p>
        <p style="font-size: 16px; color: #333; text-align: center;">
          Don't worry—it's never too late to get back on track and continue your progress!
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://www.stacknest.com" style="text-decoration: none; padding: 12px 24px; background-color: #7848F4; color: #fff; border-radius: 6px; font-size: 16px;">
            Get Back on Track
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="text-align: center; font-size: 12px; color: #777;">
          🚀 <strong>StackNest</strong> - Secure. Reliable. Developer-friendly.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};



export const sendFeedDeletedMail = async (
  userName: string,
  email: string,
  title: string,
  reason: string
) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const mailOptions = {
    from: "StackNest Team <no-reply@stacknest.com>",
    to: email,
    subject: `⚠️ Your Feed "${title}" Has Been Removed`,
    text: `Hi ${userName},

We wanted to inform you that your feed titled "${title}" has been removed from StackNest as of ${formattedDate} (UTC).

🛠️ Reason for Removal:
${reason}

We take our community guidelines seriously to ensure a respectful and secure environment for all developers. If you believe this action was taken in error or have questions, feel free to reach out to our support team.

Thank you for understanding.

Best regards,  
The StackNest Team  

---------------------------------  
💻 StackNest - Code. Share. Grow.  
📧 Contact: support@stacknest.com
`,

    html: `
    <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 640px; margin: auto; padding: 0; background: #f8fafc;">
      <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); padding: 2rem; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 1.75rem; font-weight: 600;">
          ⚠️ Feed Removed from StackNest
        </h1>
      </div>

      <div style="padding: 2rem; color: #1e293b;">
        <p style="font-size: 1.125rem; margin-bottom: 1.5rem;">
          Hi ${userName}, we regret to inform you that your post titled "<strong>${title}</strong>" has been removed.
        </p>

        <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h3 style="color: #DC2626; margin: 0 0 1rem 0;">Reason for Removal</h3>
          <p style="margin: 0 0 1rem 0; font-size: 1rem; color: #334155;">
            ${reason}
          </p>

          <p style="font-size: 0.95rem; color: #475569;">
            📅 Action Taken On: ${formattedDate} UTC
          </p>

          <div style="margin-top: 1.5rem; padding: 1rem; background: #FEF2F2; border-left: 4px solid #DC2626; border-radius: 0.375rem;">
            <p style="margin: 0; font-size: 0.9rem; color: #991B1B;">
              If you believe this was a mistake or have any questions, please contact our support team.
            </p>
          </div>
        </div>

        <footer style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b;">
          <p style="margin: 0.5rem 0; font-size: 0.875rem;">
            💻 StackNest - Empowering Developers Worldwide<br>
            <a href="${"#"}" style="color: #DC2626; text-decoration: none;">Contact Support</a>
          </p>
          <p style="margin: 0; font-size: 0.75rem;">
            123 Code Lane, Tech City • © 2024 StackNest
          </p>
        </footer>
      </div>
    </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
