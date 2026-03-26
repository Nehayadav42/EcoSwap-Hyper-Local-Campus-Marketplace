require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const authRoutes = require('./src/auth/authRoutes');
const { errorHandler } = require('./src/middleware/errorHandler');
const { required } = require('./src/config/env');

const app = express();

required('JWT_SECRET');
required('MONGODB_URI');

// MongoDB connection (prints confirmation in the terminal).
mongoose.set('strictQuery', true);

console.log('Connecting to MongoDB Atlas...');
mongoose
  .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => {
    console.error('MongoDB connection error ❌');
    console.error(err);
  });

process.on('unhandledRejection', (reason) => {
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

app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`EcoSwap backend listening on http://localhost:${port}`);
});

