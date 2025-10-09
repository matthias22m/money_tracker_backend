import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ISendMail } from './interfaces/mail.interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(options: ISendMail): Promise<void> {
    await this.mailerService.sendMail(options);
  }
}
