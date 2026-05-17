import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, Clock, UserCheck, Truck, Hammer, CheckCircle, 
  ArrowRight, MapPin, Loader2, IndianRupee, Award, Star, FileText, ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MySwaps = () => {
  const navigate = useNavigate();
  const [swaps, setSwaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
  const isArtisan = userInfo.role === 'artisan';

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedSwapForRating, setSelectedSwapForRating] = useState(null);
  const [userRating, setUserRating] = useState(5);
  const [userReview, setUserReview] = useState('');

  const fetchMySwaps = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/swaps/history?userId=${userInfo._id}`);
      if (Array.isArray(data)) {
        const myOrders = data.filter(swap => {
          if (isArtisan) {
            return swap.artisanAssigned?._id === userInfo._id || swap.artisanAssigned === userInfo._id;
          } else {
            return swap.user?._id === userInfo._id || swap.user === userInfo._id;
          }
        });
        setSwaps(myOrders);
      }
    } catch (error) {
      console.error("Error fetching swaps:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMySwaps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayAdvance = async (swap) => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) return toast.error("Razorpay SDK failed to load.");

    try {
      const orderRes = await axios.post("http://localhost:5000/api/payments/create-order", {
        amount: swap.pricing.advanceAmount
      });

      const options = {
        key: "rzp_test_SotruoAud5nvcB", 
        amount: orderRes.data.amount,
        currency: "INR",
        name: "EcoSwap Advance",
        description: `Advance for ${swap.selectedProduct?.title || 'Custom Order'}`,
        order_id: orderRes.data.id, 
        handler: async function (response) {
          try {
            await axios.put(`http://localhost:5000/api/swaps/${swap._id}/advance-paid`, {
              paymentId: response.razorpay_payment_id
            });
            toast.success("Advance Paid! Artisan has been notified for pickup.");
            fetchMySwaps();
          } catch (err) {
            toast.error("Payment verified, but failed to update order status.");
          }
        },
        prefill: { name: userInfo.name || "EcoSwap User", email: userInfo.email || "user@ecoswap.com" },
        theme: { color: "#10B981" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error("Failed to initiate payment.");
    }
  };

  const handleSubmitRating = async () => {
    try {
      await axios.put(`http://localhost:5000/api/swaps/${selectedSwapForRating._id}/feedback`, {
        rating: userRating, review: userReview
      });
      toast.success("Thank you for the review! 🌟");
      setShowRatingModal(false);
      setUserReview(''); setUserRating(5);  
      fetchMySwaps(); 
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  const handleUpdateStatus = async (orderId, currentStatus) => {
    const statusFlow = { 'ready_for_pickup': 'picked_up', 'picked_up': 'in_progress', 'in_progress': 'completed' };
    const nextStatus = statusFlow[currentStatus];
    if (!nextStatus) return;
    try {
      await axios.put(`http://localhost:5000/api/swaps/${orderId}/status`, { status: nextStatus });
      toast.success(nextStatus === 'completed' ? "🎉 Delivered!" : "Status Updated!");
      fetchMySwaps(); 
    } catch (error) { toast.error("Failed to update status."); }
  };

  // 🔥 MISSING FUNCTION ADDED: Buttons details for Artisans
  const getStatusButtonDetails = (status) => {
    switch(status) {
      case 'pending_advance': return { text: "Waiting for Advance Pay...", color: "bg-gray-200 text-gray-500", disabled: true };
      case 'ready_for_pickup': return { text: "Mark as Picked Up", color: "bg-amber-500 hover:bg-amber-600 text-white", disabled: false };
      case 'picked_up': return { text: "Start Making", color: "bg-blue-500 hover:bg-blue-600 text-white", disabled: false };
      case 'in_progress': return { text: "Mark as Delivered", color: "bg-eco hover:bg-emerald-600 text-white", disabled: false };
      default: return { text: "Processing...", color: "bg-gray-100 text-gray-400", disabled: true };
    }
  };

  const trackingSteps = [
    { id: 'pending', label: 'Requested', icon: Clock },
    { id: 'pending_advance', label: 'Quoted', icon: FileText },
    { id: 'ready_for_pickup', label: 'Advance Paid', icon: ShieldCheck },
    { id: 'picked_up', label: 'Material Picked', icon: Truck },
    { id: 'in_progress', label: 'In Making', icon: Hammer },
    { id: 'completed', label: 'Delivered', icon: CheckCircle }
  ];

  const getStepIndex = (currentStatus) => {
    const statusMap = { 'pending': 0, 'pending_artisan': 0, 'pending_advance': 1, 'ready_for_pickup': 2, 'picked_up': 3, 'in_progress': 4, 'completed': 5 };
    return statusMap[currentStatus] !== undefined ? statusMap[currentStatus] : 0;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-gray-900 p-8 rounded-[2rem] text-white shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-eco" /> {isArtisan ? "Client Orders Pipeline" : "My Upcycle Journey"}
          </h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">
            {isArtisan ? "Manage and update the status of your accepted orders." : "Track custom orders and payments safely."}
          </p>
        </div>
        <div className="hidden md:block bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
           <div className="text-eco font-black text-2xl text-center">{swaps.length}</div>
           <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Total Orders</div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-eco" /></div>
      ) : swaps.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No active orders yet</h2>
        </div>
      ) : (
        <div className="space-y-8">
          {swaps.map((swap) => {
            const currentStepIndex = getStepIndex(swap.status);
            const isCompleted = swap.status === 'completed'; 
            const targetTitle = swap.selectedProduct?.title || swap.suggestedProducts?.[0]?.title || "Custom Upcycle";
            const targetImage = swap.selectedProduct?.generatedImage || swap.selectedProduct?.imageUrl;
            
            // Generate button details for Artisan view
            const btnDetails = getStatusButtonDetails(swap.status);

            return (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={swap._id} className={`relative overflow-hidden rounded-[2rem] p-6 transition-all ${isCompleted ? 'bg-gradient-to-br from-white to-emerald-50/50 border-2 border-eco/30 shadow-lg' : 'bg-white border border-gray-100 shadow-sm'}`}>
                <div className={`absolute top-0 right-0 text-[10px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-widest ${isCompleted ? 'bg-gradient-to-r from-eco to-emerald-600 text-white' : 'bg-gray-50 border-b border-l border-gray-100 text-gray-500'}`}>
                  {isCompleted ? '✨ Delivered & Paid' : swap.status.replace(/_/g, ' ')}
                </div>

                <div className={`flex items-center gap-4 mb-8 mt-4 p-4 rounded-2xl ${isCompleted ? 'bg-white border border-emerald-100 shadow-sm' : 'bg-gray-50 border border-gray-100'}`}>
                  <img src={swap.wasteImage} alt="waste" className="w-20 md:w-28 h-20 md:h-28 object-cover rounded-xl shadow-sm border border-gray-200 bg-white" />
                  <ArrowRight className={`w-5 h-5 ${isCompleted ? 'text-eco' : 'text-gray-300'}`} />
                  <img src={targetImage} alt="target" className={`w-20 md:w-28 h-20 md:h-28 object-cover rounded-xl bg-white ${isCompleted ? 'ring-4 ring-eco/20' : 'border border-eco/30'}`} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/dcfce7/166534?font=Montserrat&text=Custom+Masterpiece'; }}/>
                  <div className="hidden md:flex flex-col px-4">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{targetTitle}</h3>
                    {isCompleted ? (
                      <p className="text-xs text-emerald-600 mt-2 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Successfully Completed</p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Local Delivery ({swap.pricing?.distanceKm || '...'} km)</p>
                    )}
                  </div>
                </div>

                {/* USER VIEW ONLY: ADVANCE PAYMENT UI */}
                {!isArtisan && swap.status === 'pending_advance' && swap.pricing && (
                  <div className="mb-8 border-2 border-dashed border-eco/40 bg-eco-light/10 rounded-2xl p-5">
                    <h4 className="font-black text-gray-900 mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-eco" /> Quotation Received</h4>
                    <div className="space-y-2 text-sm font-medium text-gray-600">
                      <div className="flex justify-between"><span>Making Charges:</span> <span>₹{swap.pricing.basePrice}</span></div>
                      <div className="flex justify-between"><span>AI Delivery Estimate ({swap.pricing.distanceKm}km):</span> <span>₹{swap.pricing.deliveryFee}</span></div>
                      <div className="flex justify-between text-xs text-gray-400"><span>Platform Trust Fee (5%):</span> <span>₹{swap.pricing.platformFee}</span></div>
                      <div className="flex justify-between font-black text-gray-900 pt-2 border-t border-gray-200">
                        <span>Total Cost:</span> <span>₹{swap.pricing.totalAmount}</span>
                      </div>
                    </div>
                    <button onClick={() => handlePayAdvance(swap)} className="w-full mt-4 bg-eco text-white py-3.5 rounded-xl font-bold shadow-lg shadow-eco/30 hover:bg-emerald-600 flex justify-center items-center gap-2">
                      <ShieldCheck className="w-5 h-5" /> Pay ₹{swap.pricing.advanceAmount} Advance to Confirm
                    </button>
                    <p className="text-[10px] text-center text-gray-400 font-bold mt-2 uppercase tracking-wider">Remaining ₹{swap.pricing.totalAmount - swap.pricing.advanceAmount} to be paid on delivery via COD/UPI</p>
                  </div>
                )}

                {/* TRACKER */}
                {!isCompleted && swap.status !== 'pending_advance' && (
                  <div className="relative mb-8 mt-4 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
                    <div className="min-w-[500px] md:min-w-0 relative">
                      <div className="absolute top-5 left-[8%] right-[8%] h-1 bg-gray-100 rounded-full z-0">
                        <motion.div className="h-full bg-eco rounded-full transition-all duration-1000" initial={{ width: 0 }} animate={{ width: `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%` }} />
                      </div>
                      <div className="relative z-10 flex justify-between">
                        {trackingSteps.map((step, index) => {
                          const isActive = index <= currentStepIndex; const Icon = step.icon;
                          return (
                            <div key={step.id} className="flex flex-col items-center gap-2 flex-1">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${isActive ? 'bg-eco text-white ring-4 ring-eco-light/30' : 'bg-white text-gray-300 border-2 border-gray-100'}`}><Icon className="w-5 h-5" /></div>
                              <span className={`text-[9px] md:text-[10px] font-bold text-center uppercase tracking-wider ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              {/* ACTION AREA */}
              {isCompleted ? (
                  <div className="pt-4 border-t border-emerald-100/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-full"><Award className="w-6 h-6" /></div>
                      <div><p className="text-sm font-black text-gray-900">Eco-Mission Accomplished! 🌍</p></div>
                    </div>
                    {!isArtisan ? (
                      !swap.feedback?.rating ? (
                        <button onClick={() => { setSelectedSwapForRating(swap); setShowRatingModal(true); }} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white border border-gray-200 text-gray-700 hover:border-eco flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Rate Artisan
                        </button>
                      ) : (
                        <div className="px-6 py-2.5 rounded-xl font-bold text-sm bg-amber-50 text-amber-600 flex items-center gap-2"><Star className="w-4 h-4 fill-amber-500" /> Rated {swap.feedback.rating}/5</div>
                      )
                    ) : (
                      <div className="px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-50 text-emerald-700 flex items-center gap-2">Payment Received</div>
                    )}
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    {isArtisan ? (
                      <>
                        {/* 🔥 CASH TO COLLECT ALERT (NEW LOGIC) 🔥 */}
                        {swap.status === 'in_progress' && swap.pricing ? (
                          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-2 rounded-xl font-black flex items-center gap-2 shadow-sm">
                            <span>Collect Cash at Doorstep:</span>
                            <span className="text-lg">₹{swap.pricing.totalAmount - swap.pricing.advanceAmount}</span>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 font-medium">Update the status once you complete the current step.</p>
                        )}
                        
                        <button 
                          onClick={() => handleUpdateStatus(swap._id, swap.status)}
                          disabled={btnDetails.disabled}
                          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${btnDetails.color}`}
                        >
                          {btnDetails.text}
                        </button>
                      </>
                   ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* 🔥 USER REMINDER BADGE 🔥 */}
                      {!isArtisan && swap.status === 'in_progress' && swap.pricing && (
                        <div className="bg-amber-50 text-amber-700 text-xs font-black px-4 py-2.5 rounded-xl border border-amber-200 shadow-sm">
                          Keep Cash Ready: ₹{swap.pricing.totalAmount - swap.pricing.advanceAmount}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 font-medium hidden sm:block">Have questions about your order?</p>
                      <button onClick={() => navigate('/chats')} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200">
                        Message Artisan
                      </button>
                    </div>
                  )}
                  </div>
                )}
                
              </motion.div>
            );
          })}
        </div>
      )}

      {showRatingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] w-full max-w-md p-8 relative">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Rate the Artisan</h2>
            <div className="flex justify-center gap-3 mb-8 mt-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setUserRating(star)} className="focus:outline-none">
                  <Star className={`w-12 h-12 ${userRating >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                </button>
              ))}
            </div>
            <textarea placeholder="Write a quick review..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl mb-8" rows="3" value={userReview} onChange={(e) => setUserReview(e.target.value)} />
            <div className="flex gap-4">
              <button onClick={() => setShowRatingModal(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100">Cancel</button>
              <button onClick={handleSubmitRating} className="flex-1 py-3 rounded-xl font-bold text-white bg-gray-900">Submit</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MySwaps;