import { userData } from './dto/user.dto';
import { EmailService } from './email/email.service';
import { PrismaService } from './prisma/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Mailauditlogs } from './dto/mailauditlogs.dto';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}
  sentMail(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const users: userData[] = await this.prisma.user.findMany({});
        console.log(users);
        await this.emailService.sendBulkEmail(users);
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  setAnalytics(id: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prisma.mailauditlogs.update({
          where: {
            id: id,
          },
          data: {
            open: 1,
          },
        });
        resolve();
      } catch (error) {
        reject(new InternalServerErrorException());
      }
    });
  }

  getAnalytics(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const userOpen: Mailauditlogs[] =
          await this.prisma.mailauditlogs.findMany({
            where: {
              open: 1,
            },
          });
        const userRecieved: Mailauditlogs[] =
          await this.prisma.mailauditlogs.findMany({
            where: {
              recieved: 1,
            },
          });
        const analytics = userRecieved.length / userOpen.length;
        resolve(analytics);
      } catch (error) {
        reject(new InternalServerErrorException());
      }
    });
  }

  markRecieved(serviceId: string) {
    this.prisma.Mailauditlogs.update({
      where: {
        serviceId: serviceId,
      },
      data: {
        recieved: 1,
      },
    });
    return;
  }
}
