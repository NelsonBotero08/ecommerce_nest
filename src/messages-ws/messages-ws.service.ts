import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';


interface ConnectedClientes {
    [id: string]: Socket
}

@Injectable()
export class MessagesWsService {

    private connectedClients = {}

    registerClient (client: Socket){
        this.connectedClients[client.id] = client
    }

    removeCliente (clientId: string){
        delete this.connectedClients[clientId]
    }

    getConnetedClient(): string[] {
        return Object.keys( this.connectedClients)
    }
}
