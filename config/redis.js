const { createClient } = require('redis');
const { TECHNIQUE_NAMES } = require('../models/constants/techniqueNames');

let client = null;
let connectPromise = null;

function isRedisEnabled() {
  return Boolean(process.env.REDIS_URL);
}

async function getRedisClient() {
  if (!isRedisEnabled()) return null;
  if (client?.isOpen) return client;

  if (!connectPromise) {
    connectPromise = (async () => {
      client = createClient({ url: process.env.REDIS_URL });
      client.on('error', (err) => console.error('[Redis]', err.message));
      await client.connect();
      return client;
    })().catch((err) => {
      connectPromise = null;
      console.error('[Redis] Bağlantı kurulamadı:', err.message);
      return null;
    });
  }
  return connectPromise;
}

// Teknikleri yükleyen fonksiyonu buraya ekledik
async function initializeApp() {
  try {
    const redis = await getRedisClient();
    if (!redis) return;
    
    await redis.set('all_technique_names', JSON.stringify(TECHNIQUE_NAMES));
    console.log('[Redis] Teknik isimleri başarıyla önbelleğe alındı!');
  } catch (err) {
    console.error('[Redis] initializeApp hatası:', err.message);
  }
}

async function closeRedis() {
  if (client?.isOpen) await client.quit();
  client = null;
  connectPromise = null;
}
async function initializeApp() {
  try {
    const redis = await getRedisClient();
    if (!redis) {
      console.log('[Redis] Redis bağlantısı kurulamadı, önbellekleme yapılamadı.');
      return;
    }
    
    // DEBUG: Veri gerçekten var mı?
    console.log('[Redis] Yüklenecek veri:', TECHNIQUE_NAMES);

    if (!TECHNIQUE_NAMES) {
      console.error('[Redis] HATA: TECHNIQUE_NAMES tanımlı değil!');
      return;
    }
    
    await redis.set('all_technique_names', JSON.stringify(TECHNIQUE_NAMES));
    console.log('[Redis] Teknik isimleri başarıyla önbelleğe alındı!');
    
    // Doğrulama: Hemen okumaya çalışalım
    const test = await redis.get('all_technique_names');
    console.log('[Redis] Yazılan veriyi tekrar oku:', test);

  } catch (err) {
    console.error('[Redis] initializeApp hatası:', err.message);
  }
}

module.exports = {
  isRedisEnabled,
  getRedisClient,
  closeRedis,
  initializeApp, // <-- Bunu eklemeyi unutma!
};