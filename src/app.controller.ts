import { Controller, Get, Param, Post } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Cron(CronExpression.EVERY_10_SECONDS)
  sent() {
    return this.appService.sentMail();
  }

  @Post('email/analytics/user/:id')
  setAnalytics(@Param('id') id) {
    this.appService
      .setAnalytics(id)
      .then(() => {
        return;
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
  }

  @Get('email/analytics')
  getAnalytics() {
    this.appService
      .getAnalytics()
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
  }

  @Post('email/analytics/recieved/:messageId')
  markRecieved() {
    return this.appService.markRecieved();
  }
}
