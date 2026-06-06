
import { prisma } from "../../config/db.js";
import { Logger } from "../../config/logger.js";
import { emailService } from "../../shared/email.js";
import { BadRequestError,NotFoundError } from '../../shared/globals/helpers/error-handler.js';

class QuoteService {
  constructor() {
    this.log = new Logger('QuoteService');
  }

  async createQuote(data) {
    try {
      this.log.info(`Creating quote request for ${data.email}`);
      
      const quote = await prisma.quoteRequest.create({
        data: {
          helpType: data.helpType,
          urgency: data.urgency,
          subject: data.subject,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          message: data.message,
        },
      });

      // Send email to admin
      await this.sendQuoteNotificationToAdmin(quote);
      
      // Send confirmation email to user
      await this.sendQuoteConfirmationToUser(quote);

      this.log.info(`Quote request created successfully: ${quote.id}`);
      return quote;
      
    } catch (error) {
      this.log.error('Failed to create quote request', error);
      throw new BadRequestError('Failed to create quote request: ' + error.message);
    }
  }

  async sendQuoteNotificationToAdmin(quote) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail) {
        this.log.warn('Admin email not configured, skipping notification');
        return;
      }
      
      const helpTypeMap = {
        'DO_MY_ONLINE_CLASS': 'Do My Online Class',
        'TAKE_MY_PROCTORED_EXAM': 'Take My Proctored Exam',
        'RESEARCH_PAPER': 'Research Paper',
        'TAKE_MY_ONLINE_TEST': 'Take My Online Test',
        'ACADEMIC_ESSAY': 'Academic Essay',
        'CLASS_PROJECT': 'Class Project',
        'OTHER': 'Other'
      };
      
      const urgencyMap = {
        'TODAY': 'Today',
        '24_HOURS': '24 Hours',
        '2_3_DAYS': '2-3 Days',
        'THIS_WEEK': 'This Week',
        'FLEXIBLE_ACADEMY': 'Flexible Academy'
      };
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 20px; border-radius: 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #4F46E5; }
            .value { margin-top: 5px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Quote Request Received</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Help Type:</div>
                <div class="value">${helpTypeMap[quote.helpType] || quote.helpType}</div>
              </div>
              <div class="field">
                <div class="label">Urgency:</div>
                <div class="value">${urgencyMap[quote.urgency] || quote.urgency}</div>
              </div>
              <div class="field">
                <div class="label">Subject/Course:</div>
                <div class="value">${quote.subject}</div>
              </div>
              <div class="field">
                <div class="label">Customer Name:</div>
                <div class="value">${quote.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${quote.email}</div>
              </div>
              <div class="field">
                <div class="label">Phone Number:</div>
                <div class="value">${quote.phoneNumber}</div>
              </div>
              <div class="field">
                <div class="label">Message/Details:</div>
                <div class="value">${quote.message}</div>
              </div>
              <div class="field">
                <div class="label">Received At:</div>
                <div class="value">${new Date(quote.createdAt).toLocaleString()}</div>
              </div>
            </div>
            <div class="footer">
              <p>Quote Request ID: ${quote.id}</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      await emailService.sendEmail({
        to: adminEmail,
        subject: 'New Quote Request - Action Required',
        html: emailHtml,
      });
      
      this.log.info(`Quote notification sent to admin: ${adminEmail}`);
      
    } catch (error) {
      this.log.error('Failed to send admin notification', error);
    }
  }

  async sendQuoteConfirmationToUser(quote) {
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10B981; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 20px; border-radius: 8px; }
            .message { margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Quote Request Received!</h2>
            </div>
            <div class="content">
              <p>Dear ${quote.name},</p>
              <p>Thank you for reaching out to us. We have received your quote request and our team will review it shortly.</p>
              <div class="message">
                <p><strong>Your Request Summary:</strong></p>
                <p><strong>Help Type:</strong> ${quote.helpType.replace(/_/g, ' ')}</p>
                <p><strong>Urgency:</strong> ${quote.urgency.replace(/_/g, ' ')}</p>
                <p><strong>Subject:</strong> ${quote.subject}</p>
              </div>
              <p>Our team will contact you within 24 hours with a detailed quote and next steps.</p>
              <p>If you have any urgent questions, please feel free to reply to this email.</p>
              <p>Best regards,<br>Your Support Team</p>
            </div>
            <div class="footer">
              <p>Reference ID: ${quote.id.substring(0, 8)}</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      await emailService.sendEmail({
        to: quote.email,
        subject: 'Quote Request Confirmation - We\'ll Get Back to You Soon',
        html: emailHtml,
      });
      
      this.log.info(`Confirmation email sent to user: ${quote.email}`);
      
    } catch (error) {
      this.log.error('Failed to send user confirmation', error);
    }
  }
}

export const quoteService = new QuoteService();