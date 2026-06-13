require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

function applyMongoSrvDnsIfNeeded(uri) {
  if (!uri.startsWith('mongodb+srv://') || process.env.MONGODB_USE_SYSTEM_DNS === 'true') {
    return;
  }
}

async function connectDB(uri) {
  if (!uri || typeof uri !== 'string') {
    throw new Error('Geçerli bir MONGODB_URI gerekli.');
  }
  
  applyMongoSrvDnsIfNeeded(uri);
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15_000,
    });
    console.log("MongoDB başarıyla bağlandı!");
    return mongoose;
  } catch (err) {
    console.error("MongoDB bağlantı hatası:", err.message);
    throw err;
  }
}

module.exports = { connectDB };