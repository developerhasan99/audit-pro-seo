import { Server } from 'ws';
import { Server as HttpServer } from 'http';

export interface WsMessage {
  type: string;
  payload: any;
}

export class WsServer {
  private wss: Server;
  private clients: Set<any> = new Set();

  constructor(server: HttpServer) {
    this.wss = new Server({ server });

    this.wss.on('connection', (ws) => {
      console.log('✓ New WebSocket client connected');
      this.clients.add(ws);

      ws.on('close', () => {
        console.log('✗ WebSocket client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });
  }

  public broadcast(message: WsMessage): void {
    const data = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === 1) { // OPEN
        client.send(data);
      }
    });
  }
}

let instance: WsServer | null = null;

export const initWsServer = (server: HttpServer): WsServer => {
  instance = new WsServer(server);
  return instance;
};

export const getWsServer = (): WsServer => {
  if (!instance) {
    throw new Error('WebSocket server not initialized');
  }
  return instance;
};
