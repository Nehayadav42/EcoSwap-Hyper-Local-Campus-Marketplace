import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Package, Clock, IndianRupee, Star, CheckCircle, MapPin, Hammer, Loader2, ArrowRight, MessageSquare, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ArtisanDashboard = () => {
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🔥 THE SETTLEMENT WALLET STATE 🔥
  const [walletBalance, setWalletBalance] = useState(0);

  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};

  const [makingCost, setMakingCost] = useState({});
  const [timeline, setTimeline] = useState({});

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const pendingRes = await axios.get('http://localhost:5000/api/swaps/pending');
      setPendingRequests(pendingRes.data || []);

      const historyRes = await axios.get(`http://localhost:5000/api/swaps/history?userId=${userInfo._id}`);
      const myOrders = historyRes.data || [];

      const active = myOrders.filter(req => 
        (req.artisanAssigned?._id === userInfo._id || req.artisanAssigned === userInfo._id) && 
        ['pending_advance', 'ready_for_pickup', 'picked_up', 'in_progress'].includes(req.status)
      );
      setActiveOrders(active);

      // WALLET CALCULATION LOGIC
      const completed = myOrders.filter(req => 
        (req.artisanAssigned?._id === userInfo._id || req.artisanAssigned === userInfo._id) && 
        req.status === 'completed' && req.pricing
      );

      let balance = 0;
      completed.forEach(order => {
        balance += (order.pricing.advanceAmount - order.pricing.platformFee);
      });
      setWalletBalance(balance);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userInfo._id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAcceptOrder = async (orderId) => {
    if (!makingCost[orderId] || !timeline[orderId]) {
      return toast.error("Please enter making charges and timeline!");
    }

    const loadToast = toast.loading("Sending Quotation...");
    try {
      await axios.put(`http://localhost:5000/api/swaps/${orderId}/accept`, {
        artisanId: userInfo._id,
        makingCost: makingCost[orderId],
        timeline: timeline[orderId]
      });
      toast.success("Quotation Sent! Waiting for client advance.", { id: loadToast });
      fetchDashboardData(); 
    } catch (error) {
      toast.error("Failed to accept order.", { id: loadToast });
    }
  };

  // 🔥 THE HACKATHON WOW-FACTOR: WITHDRAW FUNDS LOGIC 🔥
  const handleWithdraw = () => {
    if (walletBalance <= 0) return toast.error("No pending funds to withdraw.");
    
    const loadId = toast.loading("Initiating secure bank transfer...");
    
    // Simulate API Call delay
    setTimeout(() => {
       toast.success(`₹${walletBalance} successfully transferred to your registered bank account! 🏦`, { id: loadId });
       setWalletBalance(0); // Reset balance to zero for the demo effect
    }, 2500);
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-eco" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
     {/* HEADER WITH WALLET & SELL BUTTON */}
     <div className="bg-gray-900 p-8 rounded-[2rem] text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Hammer className="w-8 h-8 text-eco" /> 
            Artisan Workspace
          </h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">Manage incoming requests, active projects, and payouts.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          
          {/* 🔥 THE MISSING SELL BUTTON IS BACK 🔥 */}
          <button 
            onClick={() => navigate('/add-product')} // ⚠️ Apna correct route yahan daal lena (e.g. /sell ya /add-product)
            className="bg-eco flex-1 md:flex-none px-6 py-3 rounded-2xl border border-eco text-white flex flex-col items-center justify-center hover:bg-emerald-600 transition-all shadow-lg shadow-eco/20"
          >
             <div className="flex items-center gap-1.5 font-black text-2xl">
               <ShoppingBag className="w-5 h-5" /> 
               Sell
             </div>
             <div className="text-[10px] text-emerald-100 uppercase tracking-widest font-bold mt-1 mb-1">List Masterpiece</div>
          </button>

          {/* 🔥 WALLET BADGE WITH WITHDRAW BUTTON 🔥 */}
          <div className="bg-white/10 flex-1 md:flex-none px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center transition-all">
             <div className="flex items-center gap-1.5 text-emerald-400 font-black text-2xl">
               <IndianRupee className="w-5 h-5 text-emerald-400" /> 
               {walletBalance}
             </div>
             <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1 mb-1">Pending Settlement</div>
             
             {walletBalance > 0 && (
               <button 
                 onClick={handleWithdraw} 
                 className="mt-1 text-[10px] bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors px-4 py-1.5 rounded-full font-bold uppercase tracking-wider"
               >
                 Withdraw to Bank
               </button>
             )}
          </div>

          <div className="bg-white/10 flex-1 md:flex-none px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center hidden sm:flex">
             <div className="flex items-center gap-1.5 text-amber-400 font-black text-2xl">
               <Star className="w-5 h-5 fill-amber-400" /> 
               {userInfo.rating || '5.0'}
             </div>
             <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Community Rating</div>
          </div>

        </div>
      </div>


      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: NEW REQUESTS */}
        <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-eco" /> New Upcycle Requests
          </h2>
          
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium text-sm">No new requests right now.</p>
              </div>
            ) : (
              pendingRequests.map(req => {
                const title = req.selectedProduct?.title || req.suggestedProducts?.[0]?.title || "Custom Job";
                const targetImg = req.selectedProduct?.generatedImage || req.selectedProduct?.imageUrl;
                
                return (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={req._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex gap-4 items-center mb-4">
                      <img src={req.wasteImage} alt="waste" className="w-16 h-16 rounded-xl object-cover border border-gray-100" />
                      <ArrowRight className="w-4 h-4 text-gray-300" />
                      <img src={targetImg} alt="target" className="w-16 h-16 rounded-xl object-cover border border-eco/30" />
                      <div>
                        <h3 className="font-bold text-gray-900 line-clamp-1">{title}</h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Local Client</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Making Charge (₹)</label>
                        <input type="number" placeholder="e.g. 250" className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:border-eco outline-none" 
                          onChange={(e) => setMakingCost({...makingCost, [req._id]: e.target.value})} 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Days to complete</label>
                        <input type="text" placeholder="e.g. 3-4 Days" className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:border-eco outline-none" 
                          onChange={(e) => setTimeline({...timeline, [req._id]: e.target.value})} 
                        />
                      </div>
                    </div>
                    <button onClick={() => handleAcceptOrder(req._id)} className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-eco transition-colors">
                      Send Quotation
                    </button>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE WORK */}
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-eco" /> Active Projects
            </h2>
            <button onClick={() => navigate('/swaps')} className="text-xs font-bold text-eco hover:underline">View Pipeline</button>
          </div>

          <div className="space-y-4">
            {activeOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Hammer className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium text-sm">No active projects.</p>
              </div>
            ) : (
              activeOrders.slice(0, 5).map(order => {
                const title = order.selectedProduct?.title || order.suggestedProducts?.[0]?.title || "Custom Order";
                const img = order.selectedProduct?.generatedImage || order.selectedProduct?.imageUrl;
                
                return (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} key={order._id} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-eco/30 transition-colors">
                    <img src={img} alt="product" className="w-14 h-14 rounded-xl object-cover bg-gray-50" />
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{title}</h3>
                      {order.pricing ? (
                        <div className="mt-1 flex flex-col gap-0.5">
                          <p className="text-[10px] font-bold text-gray-400">Total Bill: ₹{order.pricing.totalAmount}</p>
                          <p className="text-xs font-black text-emerald-600">To Collect: ₹{order.pricing.totalAmount - order.pricing.advanceAmount}</p>
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Awaiting Advance</p>
                      )}
                    </div>
                    <button onClick={() => navigate('/chats')} className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-eco hover:text-white transition-colors" title="Message Client">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </motion.div>
                )
              })
            )}
          </div>
          
          {activeOrders.length > 0 && (
            <button onClick={() => navigate('/swaps')} className="w-full mt-6 bg-eco/10 text-eco font-bold py-3 rounded-xl text-sm hover:bg-eco hover:text-white transition-colors">
              Manage all in Orders Pipeline
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ArtisanDashboard;