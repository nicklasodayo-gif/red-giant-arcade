import { NetworkState, SyncQueueItem } from '../types';

type Listener = (state: NetworkState, pendingCount: number) => void;

class OfflineSyncEngine {
  private networkState: NetworkState = 'ONLINE';
  private listeners: Set<Listener> = new Set();
  private syncTimer: any = null;
  private isSyncing = false;
  private readonly QUEUE_STORAGE_KEY = 'redgiant_sync_queue_v1';

  constructor() {
    if (typeof window !== 'undefined') {
      this.networkState = navigator.onLine ? 'ONLINE' : 'OFFLINE';

      window.addEventListener('online', () => {
        this.networkState = 'ONLINE';
        this.notify();
        this.processQueue();
      });

      window.addEventListener('offline', () => {
        this.networkState = 'OFFLINE';
        this.notify();
      });

      // Regular check interval for syncing pending items
      this.syncTimer = setInterval(() => {
        if (navigator.onLine && !this.isSyncing) {
          const queue = this.getQueue();
          if (queue.length > 0) {
            this.processQueue();
          }
        }
      }, 10000);
    }
  }

  public getNetworkState(): NetworkState {
    return this.networkState;
  }

  public getPendingCount(): number {
    return this.getQueue().filter((item) => item.status !== 'COMPLETED').length;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.networkState, this.getPendingCount());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const count = this.getPendingCount();
    this.listeners.forEach((l) => l(this.networkState, count));
  }

  public getQueue(): SyncQueueItem[] {
    try {
      const raw = localStorage.getItem(this.QUEUE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(queue: SyncQueueItem[]) {
    try {
      localStorage.setItem(this.QUEUE_STORAGE_KEY, JSON.stringify(queue));
      this.notify();
    } catch (e) {
      console.error('Failed to write to sync queue localStorage:', e);
    }
  }

  /**
   * Enqueues an action with idempotency key
   */
  public enqueue(endpoint: string, method: 'POST' | 'PUT' | 'PATCH', payload: any): string {
    const idempotencyKey = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newItem: SyncQueueItem = {
      id: idempotencyKey,
      idempotencyKey,
      endpoint,
      method,
      payload,
      retryCount: 0,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const queue = this.getQueue();
    // Duplicate prevention
    const exists = queue.some((item) => item.idempotencyKey === idempotencyKey);
    if (!exists) {
      queue.push(newItem);
      this.saveQueue(queue);
    }

    // Attempt immediate sync if online
    if (this.networkState === 'ONLINE') {
      setTimeout(() => this.processQueue(), 50);
    }

    return idempotencyKey;
  }

  /**
   * Drain queue with backoff and retry
   */
  public async processQueue(): Promise<void> {
    if (this.isSyncing || !navigator.onLine) return;

    const queue = this.getQueue();
    const pending = queue.filter((item) => item.status === 'PENDING' || item.status === 'FAILED');

    if (pending.length === 0) return;

    this.isSyncing = true;
    this.networkState = 'SYNCING';
    this.notify();

    let hasError = false;

    for (const item of pending) {
      try {
        item.status = 'SYNCING';
        item.updatedAt = new Date().toISOString();
        this.saveQueue(queue);

        const response = await fetch(item.endpoint, {
          method: item.method,
          headers: {
            'Content-Type': 'application/json',
            'X-Idempotency-Key': item.idempotencyKey
          },
          body: JSON.stringify(item.payload)
        });

        if (response.ok || response.status === 409) {
          // 409 Conflict = already recorded, treated as success
          item.status = 'COMPLETED';
        } else {
          item.retryCount += 1;
          item.status = item.retryCount >= 5 ? 'FAILED' : 'PENDING';
          item.errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          hasError = true;
        }
      } catch (err: any) {
        item.retryCount += 1;
        item.status = item.retryCount >= 5 ? 'FAILED' : 'PENDING';
        item.errorMessage = err.message || 'Network request failed';
        hasError = true;
      }
      item.updatedAt = new Date().toISOString();
      this.saveQueue(queue);
    }

    // Clean up completed items older than 1 hour or prune to 100
    const pruned = queue.filter((item) => item.status !== 'COMPLETED');
    this.saveQueue(pruned);

    this.isSyncing = false;
    this.networkState = hasError ? 'SYNC_ERROR' : 'ONLINE';
    this.notify();
  }

  public async drainQueue(): Promise<void> {
    await this.processQueue();
  }

  public queueAction(type: string, payload: any): string {
    return this.enqueue('/api/v1/sync', 'POST', { type, payload });
  }

  public clearQueue() {
    this.saveQueue([]);
  }
}

export const offlineSync = new OfflineSyncEngine();
