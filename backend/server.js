const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const connectDB = require('./config/db'); 
const { Server } = require('socket.io');

// Routes
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const swapRoutes = require('./routes/swapRoutes');
const aiRoutes = require('./routes/airoutes');
const chatRoutes = require('./routes/chatRoutes');
const listingRoutes = require('./routes/listingRoutes')

// 👇 YEH MISSING THA! Model import karna zaroori hai
const Message = require('./models/Message'); 

dotenv.config();

// Connect to MongoDB
connectDB(); 

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/swaps', swapRoutes); // (Maine duplicate line hata di hai)
app.use('/api/ai', aiRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/listings', listingRoutes);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"] // Put/Delete bhi allow kar do just in case
  }
});

// The Real-Time Engine
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Room Join Karna
  socket.on('join_chat', (swapId) => {
    socket.join(swapId);
    console.log(`User joined room: ${swapId}`);
  });

  // Naya Message Aana
  socket.on('send_message', async (data) => {
    try {
      // 1. DB mein save karo
      const newMessage = await Message.create({
        swapId: data.swapId,
        sender: data.senderId, // 👈 DHYAN DO: Frontend se hum 'senderId' bhej rahe hain
        text: data.text
      });
      // 2. Room mein sabko bhej do
      socket.to(data.swapId).emit('receive_message', newMessage);
      // Sender ko wapas bhej do
      socket.emit('message_saved', newMessage); 
    } catch (err) {
      console.log("Error saving message:", err);
    }
  });

  // Message Edit Karna
  socket.on('edit_message', async (data) => {
    try {
      await Message.findByIdAndUpdate(data.msgId, { text: data.newText, isEdited: true });
      io.to(data.swapId).emit('message_edited', { msgId: data.msgId, newText: data.newText });
    } catch (err) {
      console.log("Error editing message:", err);
    }
  });

  // Message Delete Karna (Soft Delete)
  socket.on('delete_message', async (data) => {
    try {
      await Message.findByIdAndUpdate(data.msgId, { text: "🚫 This message was deleted", isDeleted: true });
      io.to(data.swapId).emit('message_deleted', { msgId: data.msgId });
    } catch (err) {
      console.log("Error deleting message:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('EcoSwap API is running! 🌍');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});