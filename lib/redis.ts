// lib/redis.ts
import Redis from 'ioredis';

const globalForRedis = global as unknown as { redis?: Redis | null };

function createClient(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) {
    console.warn('⚠️ REDIS_URL 未設定，限流功能將停用');
    return null;
  }

  const client = new Redis(url, {
    lazyConnect: true, // 不在模組載入時立即連線
    maxRetriesPerRequest: 1, // 單一指令最多重試 1 次就失敗，避免 hang 住 request
    enableOfflineQueue: false, // 離線時指令直接失敗，不排隊等待連線
    connectTimeout: 5000,
    // 持續嘗試重連（最慢每 30 秒一次），Redis 恢復後可自動接回
    retryStrategy: times => Math.min(times * 500, 30000),
  });

  // ioredis 每次重連失敗都會 emit 'error'；沒有 listener 會變成 unhandled 而洗版/中斷。
  // 這裡集中處理並節流，避免大量重複日誌。
  let lastErrorLog = 0;
  client.on('error', err => {
    const now = Date.now();
    if (now - lastErrorLog > 30000) {
      lastErrorLog = now;
      console.error('⚠️ Redis 連線錯誤:', err.message);
    }
  });

  return client;
}

const redis: Redis | null = globalForRedis.redis ?? createClient();
if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

/**
 * 以「盡力而為 (best-effort)」方式執行 Redis 操作。
 * 未設定 REDIS_URL、連不到或指令失敗時，回傳 fallback 而非拋錯，
 * 讓限流的故障不會影響主要流程（登入、寄信仍可正常運作）。
 */
export async function withRedis<T>(
  fn: (client: Redis) => Promise<T>,
  fallback: T
): Promise<T> {
  if (!redis) return fallback;
  try {
    return await fn(redis);
  } catch (err) {
    console.error(
      '⚠️ Redis 操作失敗，略過此次限流:',
      err instanceof Error ? err.message : err
    );
    return fallback;
  }
}

export default redis;
