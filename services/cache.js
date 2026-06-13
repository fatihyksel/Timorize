const { getRedisClient, isRedisEnabled } = require('../config/redis');

const DEFAULT_TTL_SECONDS = Number(process.env.REDIS_TTL_SECONDS) || 300;

async function getCachedJson(key) {
  if (!isRedisEnabled()) return null;

  const redis = await getRedisClient();
  if (!redis) return null;

  const raw = await redis.get(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    await redis.del(key);
    return null;
  }
}

async function setCachedJson(key, value, ttlSeconds = DEFAULT_TTL_SECONDS) {
  if (!isRedisEnabled()) return;

  const redis = await getRedisClient();
  if (!redis) return;

  await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
}

async function deleteCached(key) {
  if (!isRedisEnabled()) return;

  const redis = await getRedisClient();
  if (!redis) return;

  await redis.del(key);
}

module.exports = {
  getCachedJson,
  setCachedJson,
  deleteCached,
};
