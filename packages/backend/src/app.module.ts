import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { WorkflowJobEntity } from './entities/workflow_job.entity';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: [WorkflowJobEntity],
      dbName: 'gh-actions.sqlite3',
      type: 'sqlite',
      allowGlobalContext: true,
    }),
    MikroOrmModule.forFeature([WorkflowJobEntity]),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
