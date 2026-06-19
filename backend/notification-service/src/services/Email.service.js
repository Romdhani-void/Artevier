const nodemailer = require('nodemailer');
const logger = require('../../../shared/logger');

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  } else {
    transporter = nodemailer.createTransport({ jsonTransport: true });
    logger.info('Using JSON transport for emails (development mode)');
  }

  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@artisansinkstudio.com',
    to,
    subject,
    html,
    text,
  };

  const info = await getTransporter().sendMail(mailOptions);
  logger.info(`Email sent to ${to}`, { messageId: info.messageId });
  return info;
};

module.exports = { sendEmail };
