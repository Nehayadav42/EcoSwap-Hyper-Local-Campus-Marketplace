import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Package, User, CheckCircle, Loader2, ArrowLeft, Edit2, Trash2, Ban } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const Chats = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [activeSwaps, setActiveSwaps] = useState([]);
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingMessageId, setEditingMessageId] = useState(null);
  
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
  const isArtisan = userInfo.role === 'artisan';
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/swaps/history?userId=${userInfo._id}`);
        if (Array.isArray(data)) {
          let myOrders = data.filter(swap => {
            if (swap.status === 'completed') return false; 
            if (isArtisan) {
              return swap.artisanAssigned?._id === userInfo._id || swap.artisanAssigned === userInfo._id;
            } else {
              return swap.user?._id === userInfo._id || swap.user === userInfo._id;
            }
          });
          
          setActiveSwaps(myOrders);

          // 🔥 PERFECT AUTO-OPEN LOGIC 🔥
          if (location.state?.autoOpenChatId) {
            const target = myOrders.find(s => s._id === location.state.autoOpenChatId);
            if (target) setSelectedSwap(target);
          } else if (myOrders.length > 0) {
            setSelectedSwap(myOrders[0]);
          }
        }
      } catch (error) { 
        console.error(error); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchActiveOrders();
    // eslint-disable-next-line
  }, [isArtisan, userInfo._id, location.state]);

  const fetchMessages = async () => {
    if (!selectedSwap) return;
    try {
      const { data } = await axios.get(`http://localhost:5000/api/chats/${selectedSwap._id}`);
      setMessages(data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    let interval;
    if (selectedSwap) {
      fetchMessages();
      interval = setInterval(fetchMessages, 3000); 
    }
    return () => clearInterval(interval);
  }, [selectedSwap]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSwap) return;
    const msgText = newMessage;
    setNewMessage(''); 

    try {
      if (editingMessageId) {
        await axios.put(`http://localhost:5000/api/chats/${editingMessageId}`, { text: msgText });
        setEditingMessageId(null);
        toast.success("Message edited");
      } else {
        await axios.post('http://localhost:5000/api/chats', {
          swapId: selectedSwap._id, 
          senderId: userInfo._id,
          text: msgText
        });
      }
      fetchMessages(); 
    } catch (error) { 
      toast.error("Failed to send message"); 
    }
  };

  const startEditing = (msg) => { setEditingMessageId(msg._id); setNewMessage(msg.text); };
  const cancelEdit = () => { setEditingMessageId(null); setNewMessage(''); };
  const handleDeleteMessage = async (msgId) => {
    try {
      await axios.delete(`http://localhost:5000/api/chats/${msgId}`);
      toast.success("Message deleted");
      fetchMessages();
    } catch (error) { toast.error("Failed to delete message"); }
  };

  if (isLoading) return <div className="flex justify-center items-center h-[70vh]"><Loader2 className="w-10 h-10 animate-spin text-eco" /></div>;

  return (
    <div className="max-w-6xl mx-auto h-[85vh] flex flex-col md:flex-row bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
      
      {/* SIDEBAR */}
      <div className={`w-full md:w-1/3 bg-gray-50 border-r border-gray-100 flex flex-col ${selectedSwap ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 bg-gray-900 text-white">
          <h2 className="text-xl font-black flex items-center gap-2">
            <Package className="w-6 h-6 text-eco" /> Active Chats
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-3">
          {activeSwaps.map((swap) => {
            const isActive = selectedSwap?._id === swap._id;
            const title = swap.selectedProduct?.title || swap.suggestedProducts?.[0]?.title || "Custom Order";
            const isInquiry = swap.detectedMaterial === 'Product Inquiry';
            
            return (
              <div 
                key={swap._id} onClick={() => setSelectedSwap(swap)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${isActive ? 'bg-eco-light/20 border-eco/50 shadow-sm' : 'bg-white border-gray-100 hover:border-eco/30'}`}
              >
                <h3 className={`font-bold text-sm line-clamp-1 ${isActive ? 'text-eco-dark' : 'text-gray-900'}`}>{title}</h3>
                <span className={`text-[9px] uppercase font-bold tracking-wider mt-1 block ${isInquiry ? 'text-blue-500' : 'text-gray-400'}`}>
                  {isInquiry ? '🛒 Product Inquiry' : '🛠️ Swap Request'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT INTERFACE */}
      <div className={`w-full md:w-2/3 flex flex-col h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/50 ${!selectedSwap ? 'hidden md:flex' : 'flex'}`}>
        {selectedSwap ? (
          <>
            <div className="p-4 md:p-6 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <button className="md:hidden p-2 bg-gray-100 rounded-full" onClick={() => setSelectedSwap(null)}><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
                <div>
                  <h2 className="font-black text-gray-900 text-lg">{selectedSwap.selectedProduct?.title || "Custom Order"}</h2>
                  <p className="text-xs text-gray-500 font-medium flex items-center gap-1"><User className="w-3 h-3" /> {isArtisan ? "Client Chat" : "Artisan Chat"}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              <div className="text-center my-4">
                <span className="bg-white/80 border border-gray-200 text-gray-400 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                  {selectedSwap.detectedMaterial === 'Product Inquiry' ? 'Product Inquiry Channel' : 'Order Chat Started'}
                </span>
              </div>
              
              {messages.map((msg) => {
                const isMe = msg.sender === userInfo._id; 
                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                    <div className="flex flex-col max-w-[75%] relative">
                      {isMe && !msg.isDeleted && (
                        <div className="absolute -top-3 right-0 hidden group-hover:flex bg-white shadow-md border border-gray-100 rounded-lg overflow-hidden z-10">
                          <button onClick={() => startEditing(msg)} className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-gray-50"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteMessage(msg._id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-50"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      )}
                      <div className={`px-5 py-3 rounded-2xl shadow-sm ${msg.isDeleted ? 'bg-gray-100 text-gray-500 italic' : isMe ? 'bg-eco text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                        {msg.isDeleted ? <p className="text-sm font-medium opacity-80 flex items-center gap-1"><Ban className="w-3 h-3" /> Message Deleted</p> : <p className="text-sm font-medium">{msg.text}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100 z-10">
              {editingMessageId && (
                <div className="flex justify-between items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-t-xl text-xs font-bold border-b border-blue-100">
                  <span className="flex items-center gap-1"><Edit2 className="w-3 h-3"/> Editing Message</span>
                  <button onClick={cancelEdit} className="hover:text-red-500"><Ban className="w-3 h-3"/></button>
                </div>
              )}
              <form onSubmit={handleSendMessage} className={`flex items-center gap-3 bg-gray-50 p-2 border border-gray-200 focus-within:bg-white transition-colors shadow-inner ${editingMessageId ? 'rounded-b-2xl rounded-t-none border-t-0 border-blue-200' : 'rounded-2xl focus-within:border-eco'}`}>
                <input type="text" placeholder={selectedSwap.detectedMaterial === 'Product Inquiry' ? "Ask artisan about restock..." : "Type your message..."} className="flex-1 bg-transparent outline-none px-4 text-sm font-medium" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <button type="submit" disabled={!newMessage.trim()} className="bg-eco text-white p-3 rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-md">
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white m-8 rounded-[2rem] border-2 border-dashed border-gray-200">
            <Package className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600">No Chat Selected</h3>
            <p className="text-sm mt-1">Select an active order or inquiry to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;