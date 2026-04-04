require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Hata: MONGODB_URI ortam değişkeni tanımlı değil.');
  process.exit(1);
}

const corsOptions = {
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'timorize-api' });
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB bağlantısı kuruldu.');

    app.listen(PORT, () => {
      console.log(`Sunucu http://localhost:${PORT} adresinde dinliyor.`);
    });
  } catch (err) {
    console.error('Başlatma hatası:', err);
    process.exit(1);
  }
}

start();
