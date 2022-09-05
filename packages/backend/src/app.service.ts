import { Injectable } from '@nestjs/common';
import {
  WebhookEvent,
  IssuesOpenedEvent,
  WorkflowDispatchEvent,
  WorkflowJobEvent,
  WorkflowRunEvent,
} from '@octokit/webhooks-types';
import { AppGateway } from './app.gateway';
@Injectable()
export class AppService {
  constructor(private readonly gateway: AppGateway) {}

  handleHook(body: WorkflowJobEvent): any {
    if (!('action' in body)) return;

    const obj = {
      createdAt: new Date(),
      id: body.workflow_job.id,
      repo: body.repository.name,
      job: body.workflow_job.name,
      status: body.workflow_job.status,
      url: body.workflow_job.html_url,
      conclusion: body.workflow_job.conclusion,
    };

    this.gateway.send(obj);
  }
}
