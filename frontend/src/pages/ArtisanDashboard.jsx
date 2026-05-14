import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, Clock, CheckCircle, MessageSquare, 
  UploadCloud, X, Loader2, Plus, ArrowRight, Truck, Hammer, IndianRupee, AlertCircle, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ArtisanDashboard = () => {
  const navigate = useNavigate();
  const [newRequests, setNewRequests] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  // States for accepting an order
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [acceptingOrderId, setAcceptingOrderId] = useState(null);
  const [makingCost, setMakingCost] = useState('');

  // Sell Modal States
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellForm, setSellForm] = useState({ title: '', description: '', price: '', madeFrom: '', stock: 1 });
  const [sellImage, setSellImage] = useState(null);
  const [isSubmittingSell, setIsSubmittingSell] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/swaps/history');
      
      const availableRequests = data.filter(req => req.status === 'pending_artisan' || req.status === 'pending');
      setNewRequests(availableRequests);

      // Fetching all active statuses including new ones
      const myActiveOrders = data.filter(req => 
        (req.artisanId === userInfo._id || req.artisanAssigned?._id === userInfo._id || req.artisanAssigned === userInfo._id) && 
        ['pending_advance', 'ready_for_pickup', 'picked_up', 'in_progress'].includes(req.status)
      );
      setActiveOrders(myActiveOrders);

    } catch (error) {
      console.error("Error fetching requests", error);
    } finally {
      setIsLoading(false);
    }
  }, [userInfo._id]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const openAcceptModal = (orderId) => {
    setAcceptingOrderId(orderId);
    setAcceptModalOpen(true);
  };

  // 🔥 NEW LOGIC: Accept with Quotation
  const handleConfirmAccept = async () => {
    if(!makingCost || makingCost < 50) {
      toast.error("Making cost must be at least ₹50");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/swaps/${acceptingOrderId}/accept`, {
        artisanId: userInfo._id,
        makingCost: Number(makingCost),
        timeline: '3-5 Days' // Default timeline
      });
      toast.success("Quote sent! Waiting for user to pay advance.");
      setAcceptModalOpen(false);
      setMakingCost('');
      fetchRequests(); 
    } catch (error) {
      toast.error("Failed to accept order.");
    }
  };

  const handleUpdateStatus = async (orderId, currentStatus) => {
    const statusFlow = {
      'ready_for_pickup': 'picked_up',
      'picked_up': 'in_progress',
      'in_progress': 'completed'
    };
    
    const nextStatus = statusFlow[currentStatus];
    if(!nextStatus) return;

    try {
      await axios.put(`http://localhost:5000/api/swaps/${orderId}/status`, { status: nextStatus });
      toast.success(nextStatus === 'completed' ? "🎉 Masterpiece Delivered!" : "Status Updated!");
      fetchRequests(); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status.");
    }
  };

  const getStatusButtonDetails = (status, deadline) => {
    switch(status) {
      case 'pending_advance': return { text: "Waiting for Advance...", icon: Clock, color: "bg-gray-200 text-gray-500", disabled: true };
      case 'ready_for_pickup': return { text: "Mark as Picked Up", icon: Truck, color: "bg-amber-500 hover:bg-amber-600 text-white", disabled: false };
      case 'picked_up': return { text: "Start Making", icon: Hammer, color: "bg-blue-500 hover:bg-blue-600 text-white", disabled: false };
      case 'in_progress': return { text: "Mark as Delivered", icon: CheckCircle, color: "bg-eco hover:bg-emerald-600 text-white", disabled: false };
      default: return { text: "Processing", icon: Clock, color: "bg-gray-100", disabled: true };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      
      {/* ACCEPT ORDER QUOTE MODAL */}
      <AnimatePresence>
        {acceptModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 text-center shadow-2xl relative">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Quote Your Price</h2>
              <p className="text-sm text-gray-500 mb-6">Enter your making charges. AI will automatically calculate delivery and platform fees.</p>
              
              <div className="relative mb-6">
                <span className="absolute left-4 top-3.5 text-gray-500 font-bold text-lg">₹</span>
                <input 
                  type="number" placeholder="e.g. 300" 
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-eco font-black text-xl text-gray-900"
                  value={makingCost} onChange={e => setMakingCost(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <button onClick={() => setAcceptModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 transition">Cancel</button>
                <button onClick={handleConfirmAccept} className="flex-1 py-3 rounded-xl font-bold bg-eco hover:bg-emerald-600 text-white shadow-md transition">Send Quote</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER WITH REPUTATION & SELL BUTTON */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-900 p-8 rounded-[2rem] text-white shadow-xl">
        <div>
          <h1 className="text-3xl font-black tracking-tight italic uppercase flex items-center gap-3">
            Artisan Workspace
          </h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">Manage custom orders or list your own creations.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
             <div className="flex items-center gap-1.5 text-amber-400 font-black text-xl">
               <Star className="w-5 h-5 fill-amber-400" /> 
               {userInfo.rating || '4.9'}
             </div>
             <div className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">
               Community Rating
             </div>
          </div>
          <button 
            onClick={() => navigate('/explore')} // Use explore to go sell, or open modal
            className="bg-white text-gray-900 px-6 py-4 rounded-2xl font-black text-sm hover:bg-eco hover:text-white transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Marketplace
          </button>
        </div>
      </div>

      {/* ACTIVE ORDERS SECTION */}
      {activeOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Hammer className="w-5 h-5 text-eco" /> Active Workspace
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeOrders.map((order) => {
              const productTitle = order.selectedProduct?.title || order.suggestedProducts?.[0]?.title || "Custom Upcycle";
              const targetImage = order.selectedProduct?.generatedImage || order.selectedProduct?.imageUrl;
              const btnDetails = getStatusButtonDetails(order.status);
              const BtnIcon = btnDetails.icon;

              return (
                <div key={order._id} className="bg-white border-2 border-eco/20 rounded-[2rem] p-5 shadow-sm flex flex-col h-full relative overflow-hidden">
                  <div className={`absolute top-0 right-0 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-wider ${order.status === 'ready_for_pickup' ? 'bg-amber-500' : 'bg-eco'}`}>
                    {order.status.replace(/_/g, ' ')}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 mb-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <img src={order.wasteImage} className="w-20 h-20 object-cover rounded-xl bg-white border border-gray-200" alt="waste" />
                    <ArrowRight className="w-5 h-5 text-gray-300" />
                    <img src={targetImage} className="w-20 h-20 object-cover rounded-xl bg-white border border-eco/30" alt="target" />
                    
                    <div className="flex-1 px-2">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{productTitle}</h3>
                      {order.pricing && (
                         <div className="mt-1 text-xs font-bold text-gray-500">Earnings: <span className="text-eco">₹{order.pricing.basePrice}</span></div>
                      )}
                      <button onClick={() => navigate('/chats')} className="text-xs text-eco font-bold mt-1 hover:underline">Message Customer</button>
                    </div>
                  </div>

                  {order.status === 'ready_for_pickup' && (
                    <div className="bg-amber-50 border border-amber-100 text-amber-700 text-xs p-3 rounded-xl mb-4 font-medium flex gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      Advance paid! You must pick up the raw material within 48 hours.
                    </div>
                  )}

                  <button 
                    onClick={() => handleUpdateStatus(order._id, order.status)}
                    disabled={btnDetails.disabled}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-md mt-auto flex items-center justify-center gap-2 ${btnDetails.color}`}
                  >
                    <BtnIcon className="w-5 h-5" /> {btnDetails.text}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NEW REQUESTS SECTION */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" /> New Local Requests
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-eco" /></div>
        ) : newRequests.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No new requests in your area right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newRequests.map((req) => {
              const productTitle = req.selectedProduct?.title || req.suggestedProducts?.[0]?.title;
              const aiGeneratedImage = req.selectedProduct?.generatedImage || req.suggestedProducts?.[0]?.generatedImage;

              return (
                <div key={req._id} className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <img src={req.wasteImage} className="w-16 h-16 object-cover rounded-xl border shadow-sm bg-white" alt="waste" />
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                    <img src={aiGeneratedImage} className="w-16 h-16 object-cover rounded-xl border border-eco-border shadow-sm bg-white" alt={productTitle} />
                  </div>

                  <div className="flex flex-col flex-1 mb-4">
                    <h3 className="font-bold text-gray-900 leading-tight mb-1">{productTitle}</h3>
                    {req.detectedMaterial && (
                      <span className="inline-block mt-2 bg-eco-light/50 text-eco border border-eco/20 text-[10px] font-black px-2 py-1 rounded-md uppercase w-max">
                        Material: {req.detectedMaterial}
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={() => openAcceptModal(req._id)}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-eco transition-all shadow-md mt-auto"
                  >
                    Give Quote & Accept
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanDashboard;