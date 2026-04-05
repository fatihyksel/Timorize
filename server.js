require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const timerRoutes = require('./routes/timerRoutes');
const techniqueRoutes = require('./routes/techniqueRoutes');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Ortam Değişkeni Kontrolleri
if (!MONGODB_URI) {
  console.error('Hata: MONGODB_URI ortam değişkeni tanımlı değil.');
}

if (!process.env.JWT_SECRET) {
  console.error('Hata: JWT_SECRET ortam değişkeni tanımlı değil.');
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

// Veritabanı Bağlantısını Kur (Vercel her istekte bunu çağırabilir)
connectDB(MONGODB_URI).catch(err => console.error("DB Bağlantı Hatası:", err));

// Rotalar
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'timorize-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/timers', timerRoutes);
app.use('/api/techniques', techniqueRoutes);

// --- VERCEL İÇİN KRİTİK DEĞİŞİKLİK ---
// Sadece local'de çalışırken app.listen kullanıyoruz.
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Sunucu http://localhost:${PORT} adresinde dinliyor.`);
    });
}

// Vercel'in rotaları görebilmesi için app nesnesini dışa aktarıyoruz
module.exports = app;