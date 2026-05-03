import { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare, Clock, ImageIcon, Edit2, Trash2, X, Check } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';

// Backend se connect karo
const socket = io('http://localhost:5000');

const Chats = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  
  // Edit mode state
  const [editMode, setEditMode] = useState({ active: false, msgId: null, text: "" });
  const messagesEndRef = useRef(null);

  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
  const isArtisan = userInfo.role === 'artisan';

  // 1. Fetch Orders List
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/swaps/my-active?userId=${userInfo._id}`);
        const chatableOrders = data.filter(order => order.status === 'accepted' || order.status === 'in_progress');
        setActiveOrders(chatableOrders);
        if (chatableOrders.length > 0) setSelectedSwap(chatableOrders[0]); 
      } catch (error) {
        console.error("Failed to load orders for chat", error);
      }
    };
    if (userInfo._id) fetchOrders();
  }, [userInfo._id]);

  // 2. Fetch Initial Messages when a chat is selected
  const fetchMessages = async (swapId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/chats/${swapId}`);
      setMessages(data);
    } catch (error) {
      console.error("Failed to load messages", error);
    }
  };

  // 3. Socket.io Logic (Real-time magic)
  useEffect(() => {
    if (!selectedSwap) return;

    // Load initial DB messages
    fetchMessages(selectedSwap._id);

    // Join the specific room for this order
    socket.emit('join_chat', selectedSwap._id);

    // Listeners for real-time events
    const handleReceive = (msg) => setMessages((prev) => [...prev, msg]);
    
    const handleEdited = ({ msgId, newText }) => {
      setMessages((prev) => prev.map(m => m._id === msgId ? { ...m, text: newText, isEdited: true } : m));
    };

    const handleDeleted = ({ msgId }) => {
      setMessages((prev) => prev.map(m => m._id === msgId ? { ...m, text: "🚫 This message was deleted", isDeleted: true } : m));
    };

    socket.on('receive_message', handleReceive);
    socket.on('message_saved', handleReceive);
    socket.on('message_edited', handleEdited);
    socket.on('message_deleted', handleDeleted);

    // Cleanup listeners when switching chats
    return () => {
      socket.off('receive_message', handleReceive);
      socket.off('message_saved', handleReceive);
      socket.off('message_edited', handleEdited);
      socket.off('message_deleted', handleDeleted);
    };
  }, [selectedSwap]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Send or Edit Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSwap) return;

    if (editMode.active) {
      // Edit mode workflow
      socket.emit('edit_message', { swapId: selectedSwap._id, msgId: editMode.msgId, newText: newMessage });
      setEditMode({ active: false, msgId: null, text: "" });
    } else {
      // New message workflow
      socket.emit('send_message', {
        swapId: selectedSwap._id,
        senderId: userInfo._id,
        text: newMessage
      });
    }
    setNewMessage("");
  };

  // 5. Delete Message
  const handleDelete = (msgId) => {
    if(window.confirm("Are you sure you want to delete this message?")) {
      socket.emit('delete_message', { swapId: selectedSwap._id, msgId });
    }
  };

  const getDisplayName = (order) => {
    if (!order) return "User";
    return isArtisan ? (order.user?.name || "Eco Member") : (order.artisanAssigned?.name || "Artisan");
  };

  return (
    <div className="max-w-6xl mx-auto h-[80vh] bg-white rounded-3xl border border-gray-200 shadow-sm flex overflow-hidden">
      
      {/* Sidebar: Active Chats List */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-eco" /> Messages
          </h2>
        </div>
        
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {activeOrders.length === 0 ? (
            <div className="text-center text-gray-500 mt-10 text-sm">
              No active chats available.
            </div>
          ) : (
            activeOrders.map(order => (
              <div 
                key={order._id} 
                onClick={() => setSelectedSwap(order)}
                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${selectedSwap?._id === order._id ? 'bg-eco-light/30 border-eco-border border' : 'bg-white border border-transparent hover:border-gray-200'}`}
              >
                <img src={order.wasteImage} alt="item" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {order.suggestedProducts?.[0]?.title || "Custom Order"}
                  </h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                    <User className="w-3 h-3" /> {getDisplayName(order)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedSwap ? (
          <>
            <div className="p-4 border-b border-gray-200 flex items-center gap-4 bg-white shadow-sm z-10">
              <img src={selectedSwap.wasteImage} alt="item" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-gray-900">{selectedSwap.suggestedProducts?.[0]?.title}</h3>
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Chatting with {getDisplayName(selectedSwap)}
                </p>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Clock className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  // 1. Bulletproof Identity Check (DB 'sender' aur Socket 'senderId' dono ke liye)
                  const msgSenderId = msg.sender?._id || msg.sender || msg.senderId;
                  const isMe = msgSenderId === userInfo._id; 
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg._id || idx} 
                      className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* 2. Flex Row Setup taaki buttons side mein perfectly fit hon */}
                      <div className={`flex items-center gap-2 group max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        
                        {/* Message Bubble */}
                        <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                          msg.isDeleted ? 'bg-gray-100 text-gray-400 italic border border-gray-200' :
                          isMe ? 'bg-eco text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                        }`}>
                          {msg.text}
                          
                          {/* Edited Status right inside bubble */}
                          {msg.isEdited && !msg.isDeleted && (
                            <span className="block text-[9px] mt-1 opacity-70 text-right">
                              (Edited)
                            </span>
                          )}
                        </div>
            
                        {/* 3. Action Buttons (Ab ye bagal mein smoothly fade-in honge) */}
                        {isMe && !msg.isDeleted && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 px-1">
                            <button 
                              onClick={() => { setEditMode({ active: true, msgId: msg._id, text: msg.text }); setNewMessage(msg.text); }} 
                              className="bg-gray-100 text-gray-500 hover:text-blue-500 hover:bg-blue-100 p-1.5 rounded-full transition-colors"
                              title="Edit Message"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(msg._id)} 
                              className="bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-100 p-1.5 rounded-full transition-colors"
                              title="Delete Message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="bg-white border-t border-gray-200 p-4">
              {/* Edit Mode Indicator */}
              {editMode.active && (
                <div className="flex justify-between items-center text-xs font-bold text-blue-600 bg-blue-50 p-2.5 rounded-xl mb-3 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <Edit2 className="w-4 h-4" /> Editing message...
                  </div>
                  <button onClick={() => { setEditMode({ active: false, msgId: null, text: "" }); setNewMessage(""); }} className="hover:text-blue-800 bg-blue-100 p-1 rounded-full"><X className="w-4 h-4" /></button>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                <button type="button" className="p-3 text-gray-400 hover:text-eco transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..." 
                  className={`flex-1 border-transparent focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all text-sm ${
                    editMode.active ? 'bg-blue-50 focus:bg-white focus:border-blue-300 border' : 'bg-gray-100 focus:bg-white focus:border-eco border'
                  }`}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-xl text-white shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    editMode.active ? 'bg-blue-500 hover:bg-blue-600' : 'bg-eco hover:bg-eco-dark'
                  }`}
                >
                  {editMode.active ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
            <p>Select an order from the left to start chatting</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Chats;