
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

if (!MONGODB_URI) {
  console.error('Hata: MONGODB_URI ortam değişkeni tanımlı değil.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('Hata: JWT_SECRET ortam değişkeni tanımlı değil.');
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

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/timers', timerRoutes);
app.use('/api/techniques', techniqueRoutes);

async function start() {
  try {
    await connectDB(MONGODB_URI);
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
