const dns = require('dns');
const mongoose = require('mongoose');

/**
 * mongodb+srv Atlas SRV kayıtları için DNS kullanır. Bazı yerel DNS (ör. 127.0.0.1)
 * SRV iletmeyince querySrv ECONNREFUSED oluşur; isteğe bağlı olarak genel DNS kullanılır.
 */
function applyMongoSrvDnsIfNeeded(uri) {
  if (!uri.startsWith('mongodb+srv://') || process.env.MONGODB_USE_SYSTEM_DNS === 'true') {
    return;
  }
  const servers = process.env.MONGODB_DNS_SERVERS
    ? process.env.MONGODB_DNS_SERVERS.split(',').map((s) => s.trim()).filter(Boolean)
    : ['8.8.8.8', '1.1.1.1'];
  dns.setServers(servers);
}

/**
 * MongoDB bağlantısını kurar.
 * @param {string} uri
 * @returns {Promise<typeof mongoose>}
 */
async function connectDB(uri) {
  if (!uri || typeof uri !== 'string') {
    throw new Error('Geçerli bir MONGODB_URI gerekli.');
  }
  applyMongoSrvDnsIfNeeded(uri);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15_000,
  });
  return mongoose;
}

module.exports = { connectDB };
