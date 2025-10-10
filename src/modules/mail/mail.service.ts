import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ISendMail } from './interfaces/mail.interface';

@Injectable()
export class MailService {
  private transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: this.configService.get('EMAIL_PORT') === 465,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Email service connection error:', error);
      } else {
        this.logger.log('Email service is ready to send messages');
      }
    });
  }

  async sendMail(options: ISendMail): Promise<void> {
    try {
      const mailOptions = {
        from: `"Money Tracker" <${this.configService.get('EMAIL_FROM')}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Message sent: ${info.messageId}`);
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw error;
    }
  }
}
