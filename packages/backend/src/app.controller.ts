import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { WebhookEvent, WorkflowJobEvent } from '@octokit/webhooks-types';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('webhook')
  @ApiBody({})
  async handlwebhook(@Body() body: WorkflowJobEvent) {
    return this.appService.handleHook(body);
  }
}
