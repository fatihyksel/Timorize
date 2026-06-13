require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { initializeApp } = require('./config/redis.js');

// Rota tanımlamaları
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const timerRoutes = require('./routes/timerRoutes');
const techniqueRoutes = require('./routes/techniqueRoutes');
const { getCachedJson, setCachedJson } = require('./services/cache');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware ayarları
const corsOptions = {
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()) 
    : true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotalar
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/timers', timerRoutes);
app.use('/api/techniques', techniqueRoutes);

// Sağlık kontrolü
app.get('/health', async (_req, res) => {
  const payload = { status: 'ok', service: 'timorize-api' };
  try {
    const cached = await getCachedJson('health:status');
    if (cached) return res.status(200).json(cached);
    await setCachedJson('health:status', payload, 60);
  } catch (e) {
    console.error("Health check Redis hatası:", e.message);
  }
  return res.status(200).json(payload);
});

// Başlatma mantığı
async function startApp() {
  try {
    console.log("Servisler başlatılıyor...");
    
    // DB Bağlantıları
    await connectDB(process.env.MONGODB_URI);
    await initializeApp();
    
    console.log("Servisler hazır!");

    // Sadece yerel/Docker ortamında dinlemeyi başlat
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`Sunucu http://localhost:${PORT} adresinde dinliyor.`);
      });
    }
  } catch (err) {
    console.error("KRİTİK HATA:", err.message);
    process.exit(1);
  }
}

// Uygulamayı tetikle
startApp();

// Vercel için dışa aktar
module.exports = app;