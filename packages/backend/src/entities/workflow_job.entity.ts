import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'workflow-jobs' })
export class WorkflowJobEntity {
  @PrimaryKey({ autoincrement: true })
  @Property()
  id: number;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @Property()
  githubId: number;

  @Property()
  repo: string;

  @Property()
  job: string;

  @Property()
  status: string;

  @Property()
  url: string;

  @Property({ nullable: true })
  conclusion: string | null;
}
