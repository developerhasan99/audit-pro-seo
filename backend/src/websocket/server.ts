import { Server } from 'ws';
import { Server as HttpServer, IncomingMessage } from 'http';
import { verifyToken } from '../utils/auth';
import { parse } from 'url';

export interface WsMessage {
  type: string;
  payload: any;
}

export class WsServer {
  private wss: Server;
  private clients: Set<any> = new Set();

  constructor(server: HttpServer) {
    this.wss = new Server({ server });

    this.wss.on('connection', (ws, req: IncomingMessage) => {
      const { query } = parse(req.url || '', true);
      const token = query.token as string;

      if (!token) {
        console.log('✗ WebSocket connection rejected: Missing token');
        ws.close(1008, 'Token required');
        return;
      }

      try {
        const user = verifyToken(token);
        (ws as any).user = user;
        console.log(`✓ WebSocket client connected: ${user.email}`);
        this.clients.add(ws);
      } catch (error) {
        console.log('✗ WebSocket connection rejected: Invalid token');
        ws.close(1008, 'Invalid token');
        return;
      }

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
