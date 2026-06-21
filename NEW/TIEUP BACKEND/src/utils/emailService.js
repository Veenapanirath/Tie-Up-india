// services/emailService.js
import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS  // your app password
    }
  });
};

const sendContactEmail = async (to, subject, data) => {
  const transporter = createTransporter();
  
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Contact Form Submission</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b35, #4ecdc4); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 8px; background: white; border-left: 3px solid #ff6b35; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Tie Up India</h1>
          <p>New Contact Form Submission</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Contact Number:</div>
            <div class="value">${data.contactNumber}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${data.email}</div>
          </div>
          <div class="field">
            <div class="label">Purpose:</div>
            <div class="value">${data.purpose}</div>
          </div>
          <div class="field">
            <div class="label">City:</div>
            <div class="value">${data.city}</div>
          </div>
          <div class="field">
            <div class="label">Description:</div>
            <div class="value">${data.description}</div>
          </div>
          <div class="field">
            <div class="label">Submitted At:</div>
            <div class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from the Tie Up India contact form.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: htmlTemplate
  };

  return await transporter.sendMail(mailOptions);
};
export { sendContactEmail };