import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, Clock, CheckCircle, MessageSquare, UploadCloud, X, Loader2, Plus, ArrowRight, Truck, Hammer, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ArtisanDashboard = () => {
  const navigate = useNavigate();
  const [newRequests, setNewRequests] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]); // 🔥 NAYA STATE ACTIVE ORDERS KE LIYE
  const [isLoading, setIsLoading] = useState(true);

  // --- SELL MODAL STATES ---
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellForm, setSellForm] = useState({ title: '', description: '', price: '', madeFrom: '', stock: 1 });
  const [sellImage, setSellImage] = useState(null);
  const [isSubmittingSell, setIsSubmittingSell] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};

  // 🔥 DATA FETCHING FUNCTION KO ALAG KIYA TAAKI REFRESH KAR SAKEIN 🔥
  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/swaps/history');
      
      // 1. Naye Orders (Jo kisi ne accept nahi kiye)
      const availableRequests = data.filter(req => 
        req.status === 'pending_artisan' || req.status === 'pending'
      );
      setNewRequests(availableRequests);

      // 2. Active Orders (Jo IS artisan ne accept kiye hain)
      const myActiveOrders = data.filter(req => 
        (req.artisanId === userInfo._id || req.artisan === userInfo._id) && 
        ['accepted', 'picked_up', 'in_progress'].includes(req.status)
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

  // ================= ACTION HANDLERS =================

  const handleAcceptOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/swaps/${orderId}/status`, {
        status: 'accepted',
        artisanId: userInfo._id
      });
      toast.success("Order accepted! Check 'Active Orders' section.");
      fetchRequests(); // Data turant refresh karo
    } catch (error) {
      toast.error("Failed to accept order.");
    }
  };

  // 🔥 THE MAGIC STATUS UPDATER 🔥
  const handleUpdateStatus = async (orderId, currentStatus) => {
    // Logic: Current Status -> Next Status
    const statusFlow = {
      'accepted': 'picked_up',
      'picked_up': 'in_progress',
      'in_progress': 'completed'
    };
    
    const nextStatus = statusFlow[currentStatus];
    
    try {
      await axios.put(`http://localhost:5000/api/swaps/${orderId}/status`, {
        status: nextStatus
      });
      
      if (nextStatus === 'completed') {
        toast.success("🎉 Masterpiece Delivered & Payment Collected!");
      } else {
        toast.success("Status Updated Successfully!");
      }
      
      fetchRequests(); // UI update karne ke liye refresh
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status.");
    }
  };

  // Helper function to get button text and icon based on status
  const getStatusButtonDetails = (status) => {
    switch(status) {
      case 'accepted': return { text: "Mark as Picked Up", icon: Truck, color: "bg-amber-500 hover:bg-amber-600" };
      case 'picked_up': return { text: "Start Making", icon: Hammer, color: "bg-blue-500 hover:bg-blue-600" };
      case 'in_progress': return { text: "Mark as Delivered", icon: CheckCircle, color: "bg-eco hover:bg-emerald-600" };
      default: return { text: "Update Status", icon: Clock, color: "bg-gray-900" };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      
      {/* ... SELL MODAL (Same as before) ... */}
      <AnimatePresence>
        {isSellModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">List Upcycled Masterpiece</h2>
                <button onClick={() => setIsSellModalOpen(false)} className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm"><X className="w-5 h-5"/></button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-eco hover:bg-eco-light/10 transition-colors cursor-pointer relative">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setSellImage(e.target.files[0])} />
                  {sellImage ? (
                    <p className="font-bold text-eco text-sm">Selected: {sellImage.name}</p>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="font-bold text-gray-700 text-sm">Upload masterpiece image</p>
                    </>
                  )}
                </div>

                <input type="text" placeholder="Product Title" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-eco focus:bg-white text-sm" value={sellForm.title} onChange={e => setSellForm({...sellForm, title: e.target.value})} />
                <textarea placeholder="Describe how you upcycled this..." rows="3" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-eco focus:bg-white text-sm" value={sellForm.description} onChange={e => setSellForm({...sellForm, description: e.target.value})}></textarea>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500 font-bold">₹</span>
                    <input type="number" placeholder="Price" className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-eco text-sm" value={sellForm.price} onChange={e => setSellForm({...sellForm, price: e.target.value})} />
                  </div>
                  
                  <input type="text" placeholder="Material" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-eco text-sm" value={sellForm.madeFrom} onChange={e => setSellForm({...sellForm, madeFrom: e.target.value})} />
                  
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-400 text-xs font-bold uppercase tracking-wider">Qty:</span>
                    <input 
                      type="number" min="1" placeholder="Stock" 
                      className="w-full pl-11 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-eco text-sm font-bold text-gray-900"
                      value={sellForm.stock}
                      onChange={e => setSellForm({...sellForm, stock: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-white">
                <button 
                  onClick={async () => {
                    setIsSubmittingSell(true);
                    try {
                      const formData = new FormData();
                      formData.append('image', sellImage);
                      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData);

                      const payload = {
                        sellerId: userInfo._id,
                        listingType: 'finished_good',
                        title: sellForm.title,
                        description: sellForm.description,
                        price: Number(sellForm.price),
                        stock: Number(sellForm.stock),
                        imageUrl: uploadRes.data.imageUrl,
                        madeFrom: sellForm.madeFrom
                      };

                      await axios.post('http://localhost:5000/api/listings/create', payload);
                      toast.success('Product live in Explore page!');
                      setIsSellModalOpen(false);
                      setSellForm({ title: '', description: '', price: '', madeFrom: '', stock: 1 });
                      setSellImage(null);
                    } catch (error) {
                      toast.error('Failed to list product');
                    } finally {
                      setIsSubmittingSell(false);
                    }
                  }}
                  disabled={!sellForm.title || !sellForm.price || !sellImage || isSubmittingSell}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-eco transition-all disabled:opacity-50 flex justify-center"
                >
                  {isSubmittingSell ? <Loader2 className="w-5 h-5 animate-spin" /> : 'List for Sale'}
                </button>
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
          {/* 🔥 NEW: ARTISAN REPUTATION BADGE 🔥 */}
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
             <div className="flex items-center gap-1.5 text-amber-400 font-black text-xl">
               <Star className="w-5 h-5 fill-amber-400" /> 
               {/* Backend se aayi rating ya default 4.9 */}
               {userInfo.rating || '4.9'}
             </div>
             <div className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">
               Community Rating
             </div>
          </div>

          <button 
            onClick={() => setIsSellModalOpen(true)}
            className="bg-white text-gray-900 px-6 py-4 rounded-2xl font-black text-sm hover:bg-eco hover:text-white transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Sell Masterpiece
          </button>
        </div>
      </div>

      {/* 🔥 NEW: ACTIVE ORDERS SECTION 🔥 */}
      {activeOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Hammer className="w-5 h-5 text-eco" /> Active Workspace (In Progress)
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeOrders.map((order) => {
              const productTitle = order.selectedProduct?.title || order.suggestedProducts?.[0]?.title || "Custom Upcycle Request";
              const targetImage = order.selectedProduct?.generatedImage || order.selectedProduct?.imageUrl;
              const btnDetails = getStatusButtonDetails(order.status);
              const BtnIcon = btnDetails.icon;

              return (
                <div key={order._id} className="bg-white border-2 border-eco/20 rounded-[2rem] p-5 shadow-sm flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-eco text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                    {order.status.replace('_', ' ')}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 mb-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <img src={order.wasteImage} className="w-20 h-20 object-cover rounded-xl bg-white border border-gray-200" alt="waste" />
                    <ArrowRight className="w-5 h-5 text-gray-300" />
                    <img src={targetImage} className="w-20 h-20 object-cover rounded-xl bg-white border border-eco/30" alt="target" />
                    
                    <div className="flex-1 px-2">
                      <h3 className="font-bold text-gray-900 text-sm">{productTitle}</h3>
                      <button onClick={() => navigate('/chats')} className="text-xs text-eco font-bold mt-1 hover:underline">
                        Message Customer
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleUpdateStatus(order._id, order.status)}
                    className={`w-full text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md mt-auto flex items-center justify-center gap-2 ${btnDetails.color}`}
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
          <Clock className="w-5 h-5 text-amber-500" /> New Upcycle Requests
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-eco" /></div>
        ) : newRequests.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No new requests in your area yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newRequests.map((req) => {
              const productTitle = req.selectedProduct?.title || req.suggestedProducts?.[0]?.title || "Custom Upcycle Request";
              const productDesc = req.selectedProduct?.description || req.suggestedProducts?.[0]?.description || "No specific description provided.";
              const aiGeneratedImage = req.selectedProduct?.generatedImage || req.suggestedProducts?.[0]?.generatedImage || req.selectedProduct?.imageUrl;

              return (
                <div key={req._id} className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div className="flex-1 text-center">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1.5 block">Uploaded Material</span>
                      <img src={req.wasteImage} className="w-full h-24 object-cover rounded-xl border border-gray-200 shadow-sm bg-white" alt="waste" />
                    </div>
                    <div className="shrink-0 text-gray-300"><ArrowRight className="w-5 h-5" /></div>
                    <div className="flex-1 text-center">
                      <span className="text-[9px] font-black text-eco uppercase tracking-wider mb-1.5 block">Wants to make</span>
                      <img 
                        src={aiGeneratedImage || ''} 
                        className="w-full h-24 object-cover rounded-xl border border-eco-border shadow-sm bg-white" 
                        alt={productTitle}
                        onError={(e) => {
                          e.target.onError = null;
                          const shortName = encodeURIComponent(productTitle.split(' ').slice(0, 2).join(' '));
                          e.target.src = `https://placehold.co/400x400/dcfce7/166534?font=Montserrat&text=${shortName}`;
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 mb-4">
                    <h3 className="font-bold text-gray-900 leading-tight mb-1">{productTitle}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{productDesc}</p>
                    {req.detectedMaterial && (
                      <div className="mt-3">
                        <span className="inline-block bg-eco-light/50 text-eco border border-eco/20 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wide">
                          Material: {req.detectedMaterial}
                        </span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => handleAcceptOrder(req._id)}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-eco transition-all shadow-md mt-auto"
                  >
                    Accept Order
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