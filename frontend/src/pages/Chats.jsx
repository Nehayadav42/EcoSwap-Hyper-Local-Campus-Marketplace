import { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare, Clock, ImageIcon } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Chats = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || { name: 'Eco Warrior', _id: '69f0399aecdb320e99e25f99' };

  // 1. Fetch Orders (Taaki list dikh sake)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/swaps/my-active?userId=${userInfo._id}`);
        // Sirf wahi orders dikhao jo accepted ya in_progress hain
        const chatableOrders = data.filter(order => order.status === 'accepted' || order.status === 'in_progress');
        setActiveOrders(chatableOrders);
        if (chatableOrders.length > 0) setSelectedSwap(chatableOrders[0]); // Pehla order auto-select kar lo
      } catch (error) {
        console.error("Failed to load orders for chat", error);
      }
    };
    fetchOrders();
  }, [userInfo._id]);

  // 2. Fetch Messages jab bhi naya swap select ho
  const fetchMessages = async (swapId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/chats/${swapId}`);
      setMessages(data);
    } catch (error) {
      console.error("Failed to load messages", error);
    }
  };

  useEffect(() => {
    if (selectedSwap) {
      fetchMessages(selectedSwap._id);
      // Real-time feel ke liye har 3 second mein refresh (Simple polling)
      const interval = setInterval(() => fetchMessages(selectedSwap._id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedSwap]);

  // Scroll to bottom jab naya message aaye
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Send Message Handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSwap) return;

    try {
      const payload = {
        swapId: selectedSwap._id,
        senderId: userInfo._id,
        text: newMessage
      };
      
      const { data } = await axios.post('http://localhost:5000/api/chats', payload);
      setMessages(prev => [...prev, data]); // UI turant update karo
      setNewMessage(""); // Input clear karo
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[80vh] bg-white rounded-3xl border border-gray-200 shadow-sm flex overflow-hidden">
      
      {/* LEFT SIDEBAR: Chat List */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-eco" /> Messages
          </h2>
        </div>
        
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {activeOrders.length === 0 ? (
            <div className="text-center text-gray-500 mt-10 text-sm">
              No active chats. Wait for an artisan to accept your order.
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
                    <User className="w-3 h-3" /> {order.artisanAssigned?.name || "Artisan"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedSwap ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-4 bg-white shadow-sm z-10">
              <img src={selectedSwap.wasteImage} alt="item" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-gray-900">{selectedSwap.suggestedProducts?.[0]?.title}</h3>
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Chatting with {selectedSwap.artisanAssigned?.name}
                </p>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Clock className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">Start the conversation! Say Hi to your artisan.</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.senderId === userInfo._id;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={idx} 
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe ? 'bg-eco text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex gap-2">
              <button type="button" className="p-3 text-gray-400 hover:text-eco transition-colors">
                <ImageIcon className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..." 
                className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-eco focus:ring-0 rounded-xl px-4 py-2 outline-none transition-all"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="bg-eco text-white p-3 rounded-xl hover:bg-eco-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
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