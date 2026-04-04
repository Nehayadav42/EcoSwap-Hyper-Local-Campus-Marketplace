const path = require('path');
// Load .env from the backend folder (same place as server.js), not from whatever the shell cwd is.
require('dotenv').config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGODB_URI) {
  require('dotenv').config({ path: path.join(__dirname, 'src', '.env') });
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const authRoutes = require('./src/auth/authRoutes');
const itemRoutes = require('./src/items/itemRoutes');
const { errorHandler } = require('./src/middleware/errorHandler');
const { required } = require('./src/config/env');

const app = express();

required('JWT_SECRET');
required('MONGODB_URI');

mongoose.set('strictQuery', true);

process.on('unhandledRejection', reason => {
  // eslint-disable-next-line no-console
  console.error('Unhandled rejection:', reason);
});

app.use(helmet());
app.use(express.json({ limit: '1mb' }));

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: false
  })
);

app.use(morgan('dev'));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 250,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.use(errorHandler);

const port = Number(process.env.PORT || 5000);

async function start() {
  console.log('Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('MongoDB connected ✅');
  } catch (err) {
    console.error('MongoDB connection error ❌');
    console.error(err);
    process.exit(1);
  }

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`EcoSwap backend listening on http://localhost:${port}`);
  });
}

start();
