export const EmailVerification = (name, email, code) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Connectify!</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
          <h2 style="color: #333; margin-top: 0;">Hi ${name},</h2>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
              Thank you for signing up with Connectify! To complete your registration, please verify your email address using the code below:
          </p>
          
          <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <p style="margin: 0; color: #666; font-size: 14px;">Your verification code:</p>
              <h1 style="color: #667eea; font-size: 32px; margin: 10px 0; letter-spacing: 3px; font-family: 'Courier New', monospace;">
                  ${code}
              </h1>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 25px;">
              This code will expire in 50 seconds. If you didn't request this verification, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
          
          <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
              This email was sent to ${email}. If you have any questions, please contact our support team.
          </p>
      </div>
  </body>
  </html>
  `;
};
