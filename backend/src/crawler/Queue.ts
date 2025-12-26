import { URL } from 'url';

export interface QueueItem {
  url: URL;
  ignoreDomain?: boolean;
  method?: 'GET' | 'HEAD';
  data?: any;
}

export class Queue {
  private items: QueueItem[] = [];
  private processing: boolean = false;

  add(item: QueueItem): void {
    this.items.push(item);
  }

  poll(): QueueItem | undefined {
    return this.items.shift();
  }

  size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  clear(): void {
    this.items = [];
  }

  setProcessing(processing: boolean): void {
    this.processing = processing;
  }

  isProcessing(): boolean {
    return this.processing;
  }
}
