import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WorkflowJobEntity } from './entities/workflow_job.entity';
@WebSocketGateway()
export class AppGateway {
  constructor(
    @InjectRepository(WorkflowJobEntity)
    private readonly workflowRepo: EntityRepository<WorkflowJobEntity>,
  ) {}

  @WebSocketServer()
  server: any;

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string) {
    const event = 'message';
    return { event, data };
  }

  async handleConnection(socket: WebSocket) {
    console.log('connected');
    const jobs = await this.workflowRepo.find({}, { orderBy: { id: 1 } });
    socket.send(jobs as any);
  }

  /**
   *
   * sends a message to all connected clients
   *
   * @param message
   */
  send(message: any) {
    this.server.emit('message', message);
  }
}
