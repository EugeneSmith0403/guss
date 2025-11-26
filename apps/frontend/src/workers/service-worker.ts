import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ClickQueueItem {
  roundId: string;
  userId: number;
  timestamp: number;
}

interface ClickQueueDB extends DBSchema {
  clicks: {
    key: number;
    value: ClickQueueItem;
    indexes: { 'by-round-user': [string, number] };
  };
}

let db: IDBPDatabase<ClickQueueDB> | null = null;

const DB_NAME = 'guss-offline-db';
const DB_VERSION = 1;
const STORE_NAME = 'clicks';

const initDB = async (): Promise<IDBPDatabase<ClickQueueDB>> => {
  if (db) return db;

  db = await openDB<ClickQueueDB>(DB_NAME, DB_VERSION, {
    upgrade(database) {
      const store = database.createObjectStore(STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('by-round-user', ['roundId', 'userId']);
    },
  });

  return db;
};

const queueScoreRequest = async (roundId: string, userId: number) => {
  const database = await initDB();
  await database.add(STORE_NAME, {
    roundId,
    userId,
    timestamp: Date.now(),
  } as ClickQueueItem);
};

const flushScoreQueue = async (): Promise<void> => {
  const database = await initDB();
  const allClicks = await database.getAll(STORE_NAME);

  if (allClicks.length === 0) return;

  const grouped = new Map<string, number>();
  for (const click of allClicks) {
    const key = `${click.roundId}:${click.userId}`;
    grouped.set(key, (grouped.get(key) || 0) + 1);
  }

  const requests = Array.from(grouped.entries()).map(([key, count]) => {
    const [roundId, userId] = key.split(':');
    return fetch(`/scores/rounds/${roundId}/users/${userId}/batch`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ increment: count }),
    });
  });

  try {
    await Promise.all(requests);
    await database.clear(STORE_NAME);
  } catch (error) {
    console.error('Failed to flush score queue:', error);
  }
};

self.addEventListener('fetch', (event: Event) => {
  const fetchEvent = event as FetchEvent;
  const url = new URL(fetchEvent.request.url);

  if (url.pathname.startsWith('/scores/rounds') && fetchEvent.request.method === 'PATCH') {
    fetchEvent.respondWith(
      (async () => {
        const isOnline = self.navigator ? navigator.onLine : true;

        if (!isOnline) {
          const match = url.pathname.match(/\/scores\/rounds\/([^/]+)\/users\/(\d+)/);
          if (match) {
            const [, roundId, userId] = match;
            await queueScoreRequest(roundId, parseInt(userId, 10));
          }
          return new Response(null, { status: 202 });
        }

        try {
          return await fetch(fetchEvent.request);
        } catch (error) {
          const match = url.pathname.match(/\/scores\/rounds\/([^/]+)\/users\/(\d+)/);
          if (match) {
            const [, roundId, userId] = match;
            await queueScoreRequest(roundId, parseInt(userId, 10));
          }
          return new Response(null, { status: 202 });
        }
      })(),
    );
  }
});

self.addEventListener('sync', (event: Event) => {
  const syncEvent = event as unknown as SyncEvent;
  if (syncEvent.tag === 'sync-score-queue') {
    syncEvent.waitUntil(flushScoreQueue());
  }
});

self.addEventListener('online', () => {
  flushScoreQueue();
});

initDB();

