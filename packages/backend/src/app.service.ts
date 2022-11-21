import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import {
  WebhookEvent,
  IssuesOpenedEvent,
  WorkflowDispatchEvent,
  WorkflowJobEvent,
  WorkflowRunEvent,
} from '@octokit/webhooks-types';
import { AppGateway } from './app.gateway';
import { WorkflowJobEntity } from './entities/workflow_job.entity';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(WorkflowJobEntity)
    private readonly workflowRepo: EntityRepository<WorkflowJobEntity>,
    private readonly gateway: AppGateway,
  ) {}

  async handleHook(body: WorkflowJobEvent): Promise<void> {
    if (!('action' in body)) return;

    // check if we have that ID in the database already - if not, save new otherwise update
    const exists = await this.workflowRepo.findOne({
      githubId: body.workflow_job.id,
    });

    const obj: WorkflowJobEntity = Object.assign(
      exists || new WorkflowJobEntity(),
      {
        createdAt: new Date(),
        githubId: body.workflow_job.id,
        repo: body.repository.name,
        job: body.workflow_job.name,
        status: body.workflow_job.status,
        url: body.workflow_job.html_url,
        conclusion: body.workflow_job.conclusion,
      },
    );

    await this.workflowRepo.persistAndFlush(obj);

    this.gateway.send([obj]);
  }
}
