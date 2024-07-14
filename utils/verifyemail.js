const nodemailer = require('nodemailer');

const sendVerificationEmail = async (toEmail, verificationCode) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD // Your Gmail password or app-specific password
      }
    });

    let info = await transporter.sendMail({
      from: `"Sash Designers" <${process.env.EMAIL_USER}>`, // Sender address
      to: toEmail, // List of receivers
      subject: 'Verification Code for Account Registration', // Subject line
      text: `Your verification code is: ${verificationCode}`, // Plain text body
      html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Template</title>
              <style>
                /* Email styles here */
                /* Example: */
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f0f0f0;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                }
                .verification-code {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin-bottom: 20px;
                }
                .code-digit {
                  width: 50px;
                  height: 50px;
                  background-color: #f0f0f0;
                  border-radius: 6px;
                  margin: 0 5px;
                  font-size: 1.5rem;
                  line-height: 50px;
                  text-align: center;
                }
                .copy-button {
                  background-color: #4d5bf2;
                  color: #ffffff;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 6px;
                  cursor: pointer;
                  transition: background-color 0.3s ease;
                  text-decoration: none;
                  display: inline-block;
                  margin-top: 20px;
                }
                .copy-button:hover {
                  background-color: #8f44fd;
                }
                .copyright {
                  text-align: center;
                  margin-top: 20px;
                  color: #999;
                }
                .copyright span {
                  display: inline-block;
                  width: 30px;
                  height: 30px;
                  line-height: 30px;
                  text-align: center;
                  border-radius: 50%;
                  background-color: #4d5bf2;
                  color: #ffffff;
                  font-size: 0.8rem;
                  margin-right: 5px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Verification Code</h2>
                <div class="verification-code">
                  <div class="code-digit">${verificationCode[0]}</div>
                  <div class="code-digit">${verificationCode[1]}</div>
                  <div class="code-digit">${verificationCode[2]}</div>
                  <div class="code-digit">${verificationCode[3]}</div>
                  <div class="code-digit">${verificationCode[4]}</div>
                  <div class="code-digit">${verificationCode[5]}</div>
                </div>
                <p style="text-align: center; color: #555;">Your verification code is: <strong>${verificationCode}</strong></p>
               <div class="copyright">
                <span>&copy;</span> 2024 Your Company Name. All rights reserved.
                </div>
              </div>
            </body>
            </html>
          ` // HTML body
    });

    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};

const sendForgotEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail, sendForgotEmail
};
