import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {


  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService
  ) {}


  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client)

    this.wss.emit('clients-update', this.messagesWsService.getConnetedClient())
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeCliente(client.id)

    this.wss.emit('clients-update', this.messagesWsService.getConnetedClient())
  }



}
