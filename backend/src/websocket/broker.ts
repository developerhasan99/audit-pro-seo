import { getWsServer, WsMessage } from './server';

export enum EventType {
  CRAWL_STARTED = 'CRAWL_STARTED',
  CRAWL_PROGRESS = 'CRAWL_PROGRESS',
  CRAWL_COMPLETED = 'CRAWL_COMPLETED',
  CRAWL_STOPPED = 'CRAWL_STOPPED',
  ISSUE_FOUND = 'ISSUE_FOUND',
}

export class Broker {
  public static publish(type: EventType, payload: any): void {
    try {
      const wsServer = getWsServer();
      const message: WsMessage = {
        type,
        payload,
      };
      wsServer.broadcast(message);
    } catch (error) {
      // WebSocket might not be initialized in some contexts (e.g. tests)
      console.warn('Could not publish event to WebSocket:', error);
    }
  }
}
