import nodemailer from 'nodemailer';
import { config } from '../config/config.js';
import { Logger } from '../config/logger.js';

class EmailService {
  constructor() {
    this.log = new Logger('EmailService');
    this.transporter = null;
    this.init();
  }

  init() {
    try {
      // Use EMAIL_USER/EMAIL_PASS from your config
      const emailUser = config.EMAIL_USER || process.env.EMAIL_USER;
      const emailPass = config.EMAIL_PASS || process.env.EMAIL_PASS;
      
      if (emailUser && emailPass) {
        this.transporter = nodemailer.createTransport({
          host: config.SMTP_HOST || 'smtp.gmail.com',
          port: config.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });
        this.log.info('Email service initialized');
      } else {
        this.log.warn('Email credentials not configured');
      }
    } catch (error) {
      this.log.error('Failed to initialize email service', error);
    }
  }

  async sendEmail({ to, subject, html, text }) {
    if (!this.transporter) {
      this.log.warn('Email service not configured, skipping email send');
      return;
    }

    try {
      const from = config.SMTP_FROM || config.EMAIL_USER || process.env.EMAIL_USER;
      
      const info = await this.transporter.sendMail({
        from: `"Support" <${from}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      });
      
      this.log.info(`Email sent to ${to}: ${info.messageId}`);
      return info;
      
    } catch (error) {
      this.log.error(`Failed to send email to ${to}`, error);
      throw error;
    }
  }
}

export const emailService = new EmailService();