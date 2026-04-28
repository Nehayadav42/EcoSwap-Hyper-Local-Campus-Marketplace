const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const connectDB = require('./config/db'); 
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const swapRoutes = require('./routes/swapRoutes');
const aiRoutes = require('./routes/airoutes');

dotenv.config();

// Connect to MongoDB
connectDB(); // <-- Initialize Connection

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('EcoSwap API is running! 🌍');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});