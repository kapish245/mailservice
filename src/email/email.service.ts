import { PrismaService } from './../../../authenticationService/src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { userData } from '../dto/user.dto';
import { Injectable } from '@nestjs/common';
import * as formData from 'form-data';
import Mailgun from 'mailgun.js';

@Injectable()
export class EmailService {
  constructor(private config: ConfigService, private prisma: PrismaService) {}
  sendBulkEmail(userData: userData[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const API_KEY = this.config.get('EMAIL_SERVER_API_KEY');
        const DOMAIN = this.config.get('EMAIL_SERVER_DOMAIN');
        const USERNAME = this.config.get('EMAIL_SERVER_USERNAME');
        const mailgun = new Mailgun(formData);
        const client = mailgun.client({ username: USERNAME, key: API_KEY });
        const EMAIL_FROM = this.config.get('EMAIL_FROM');

        for (let i = 0; i < userData.length; i++) {
          const messageData = {
            from: EMAIL_FROM,
            to: userData[i].email,
            subject: 'Mail Engine',
            html: `
        <img width=0 height=0 src="${this.config.get('ANALYTICS_URL')}/${
              userData[i].id
            }" alt="greetings"/>`,
          };

          const response = await client.messages.create(DOMAIN, messageData);

          console.log('this is response', response);
          console.log('starting creating data');
          await this.prisma.mailauditlogs.create({
            data: {
              sent: 1,
              email: userData[i].email,
              userId: userData[i].id,
              serviceId: '',
            },
          });
          console.log('done creating data');
        }
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }
}
