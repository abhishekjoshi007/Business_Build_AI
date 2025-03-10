import nodemailer from 'nodemailer';

const email = process.env.EMAIL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendMail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  const mailOptions = { from: email, to, subject, text };
  console.log(
    'sending mail to ' + to + ' with subject ' + subject + ' and text ' + text
  )
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}