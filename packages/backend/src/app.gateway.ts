import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
@WebSocketGateway()
export class AppGateway {
  @WebSocketServer()
  server: any;

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string) {
    const event = 'message';
    return { event, data };
  }

  handleConnection() {
    console.log('connected');
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
