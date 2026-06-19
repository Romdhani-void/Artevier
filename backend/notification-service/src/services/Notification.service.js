const Contact = require('../models/Contact.model');
const { sendEmail } = require('./Email.service');
const { AppError } = require('../../../shared/errors');
const logger = require('../../../shared/logger');

class ContactService {
  async submit(data) {
    const contact = await Contact.create(data);

    await sendEmail({
      to: process.env.FROM_EMAIL || 'support@artisansinkstudio.com',
      subject: `Contact Form: ${data.subject}`,
      html: `<h2>New Contact Message</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p>${data.message}</p>`,
      text: `From: ${data.name} (${data.email})\nSubject: ${data.subject}\n\n${data.message}`,
    }).catch((err) => logger.warn(`Contact notification email failed: ${err.message}`));

    return { message: 'Message sent successfully', id: contact._id };
  }
}

class NotificationService {
  async sendWelcomeEmail({ email, firstName }) {
    await sendEmail({
      to: email,
      subject: 'Welcome to Artisan Sink Studio!',
      html: `<h1>Welcome, ${firstName}!</h1>
        <p>Thank you for joining Artisan Sink Studio — your destination for handcrafted sinks.</p>
        <p>Explore our collection of artisan-made sinks and find the perfect piece for your home.</p>
        <p>Happy shopping!</p>`,
      text: `Welcome, ${firstName}! Thank you for joining Artisan Sink Studio.`,
    });
    return { message: 'Welcome email sent' };
  }

  async sendOrderConfirmation({ email, orderId, totalPrice, items }) {
    const itemsList = items
      .map((i) => `<li>${i.name} x ${i.quantity} — $${(i.price * i.quantity).toFixed(2)}</li>`)
      .join('');

    await sendEmail({
      to: email,
      subject: `Order Confirmation #${orderId}`,
      html: `<h1>Order Confirmed!</h1>
        <p>Your order <strong>#${orderId}</strong> has been placed successfully.</p>
        <ul>${itemsList}</ul>
        <p><strong>Total: $${totalPrice.toFixed(2)}</strong></p>
        <p>We'll notify you when your order ships.</p>`,
      text: `Order #${orderId} confirmed. Total: $${totalPrice.toFixed(2)}`,
    });
    return { message: 'Order confirmation sent' };
  }
}

module.exports = {
  contactService: new ContactService(),
  notificationService: new NotificationService(),
};
