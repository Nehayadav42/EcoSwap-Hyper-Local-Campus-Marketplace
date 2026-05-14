import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, Clock, UserCheck, Truck, Hammer, CheckCircle, 
  ArrowRight, MapPin, Loader2, IndianRupee, Award, Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MySwaps = () => {
  const navigate = useNavigate();
  
  // ================= STATES =================
  const [swaps, setSwaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
  const isArtisan = userInfo.role === 'artisan';

  // Modal States
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedSwapForRating, setSelectedSwapForRating] = useState(null);
  const [userRating, setUserRating] = useState(5);
  const [userReview, setUserReview] = useState('');

  // ================= FETCH LOGIC =================
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

  // ================= ACTIONS =================
  const handleSubmitRating = async () => {
    try {
      await axios.put(`http://localhost:5000/api/swaps/${selectedSwapForRating._id}/feedback`, {
        rating: userRating,
        review: userReview
      });
      toast.success("Thank you for the review! 🌟");
      setShowRatingModal(false);
      setUserReview(''); // Reset review text
      setUserRating(5);  // Reset stars
      fetchMySwaps(); // Refresh UI to hide the rate button
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  const handleUpdateStatus = async (orderId, currentStatus) => {
    const statusFlow = {
      'accepted': 'picked_up',
      'picked_up': 'in_progress',
      'in_progress': 'completed'
    };
    
    const nextStatus = statusFlow[currentStatus];
    if (!nextStatus) return;
    
    try {
      await axios.put(`http://localhost:5000/api/swaps/${orderId}/status`, {
        status: nextStatus
      });
      
      if (nextStatus === 'completed') {
        toast.success("🎉 Masterpiece Delivered & Payment Collected!");
      } else {
        toast.success("Status Updated Successfully!");
      }
      
      fetchMySwaps(); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status.");
    }
  };

  const getStatusButtonDetails = (status) => {
    switch(status) {
      case 'accepted': return { text: "Mark as Picked Up", color: "bg-amber-500 hover:bg-amber-600 text-white" };
      case 'picked_up': return { text: "Start Making", color: "bg-blue-500 hover:bg-blue-600 text-white" };
      case 'in_progress': return { text: "Mark as Delivered", color: "bg-eco hover:bg-emerald-600 text-white" };
      case 'completed': return { text: "Order Completed", color: "bg-gray-100 text-gray-400", disabled: true };
      default: return { text: "Waiting...", color: "bg-gray-100 text-gray-400", disabled: true };
    }
  };

  const trackingSteps = [
    { id: 'pending', label: 'Request Sent', icon: Clock },
    { id: 'accepted', label: 'Artisan Assigned', icon: UserCheck },
    { id: 'picked_up', label: 'Material Picked', icon: Truck },
    { id: 'in_progress', label: 'In Making', icon: Hammer },
    { id: 'completed', label: 'Delivered', icon: CheckCircle }
  ];

  const getStepIndex = (currentStatus) => {
    const statusMap = { 'pending': 0, 'pending_artisan': 0, 'accepted': 1, 'picked_up': 2, 'in_progress': 3, 'completed': 4 };
    return statusMap[currentStatus] !== undefined ? statusMap[currentStatus] : 0;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* HEADER */}
      <div className="bg-gray-900 p-8 rounded-[2rem] text-white shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-eco" /> 
            {isArtisan ? "Client Orders Pipeline" : "My Upcycle Journey"}
          </h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">
            {isArtisan ? "Manage and update the status of your accepted orders." : "Track your custom orders from waste to masterpiece."}
          </p>
        </div>
        <div className="hidden md:block bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
           <div className="text-eco font-black text-2xl text-center">{swaps.length}</div>
           <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">
             {isArtisan ? "Active Projects" : "Total Swaps"}
           </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-eco" /></div>
      ) : swaps.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{isArtisan ? "No active orders yet" : "No active orders yet"}</h2>
          <p className="text-gray-500 mb-6">{isArtisan ? "Accept new requests from your workspace." : "Start your eco-journey by requesting an upcycle."}</p>
          {!isArtisan && (
            <button onClick={() => navigate('/explore')} className="bg-eco text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-600">
              Explore Marketplace
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {swaps.map((swap) => {
            const currentStepIndex = getStepIndex(swap.status);
            const isCompleted = swap.status === 'completed'; 
            
            const targetTitle = swap.selectedProduct?.title || swap.suggestedProducts?.[0]?.title || "Custom Upcycle";
            const targetImage = swap.selectedProduct?.generatedImage || swap.selectedProduct?.imageUrl || `https://placehold.co/400x400/dcfce7/166534?font=Montserrat&text=Custom`;
            
            const btnDetails = getStatusButtonDetails(swap.status);

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                key={swap._id} 
                className={`relative overflow-hidden rounded-[2rem] p-6 transition-all ${
                  isCompleted 
                    ? 'bg-gradient-to-br from-white to-emerald-50/50 border-2 border-eco/30 shadow-lg shadow-eco/5' 
                    : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
                }`}
              >
                {/* STATUS BADGE */}
                <div className={`absolute top-0 right-0 text-[10px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-widest ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-eco to-emerald-600 text-white shadow-sm' 
                    : 'bg-gray-50 border-b border-l border-gray-100 text-gray-500'
                }`}>
                  {isCompleted ? '✨ Delivered & Paid' : swap.status.replace('_', ' ')}
                </div>

                {/* 1. PRODUCT INFO */}
                <div className={`flex items-center gap-4 mb-8 mt-4 p-4 rounded-2xl ${isCompleted ? 'bg-white border border-emerald-100 shadow-sm' : 'bg-gray-50 border border-gray-100'}`}>
                  <div className="flex-1 text-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">Raw Material</span>
                    <img src={swap.wasteImage} alt="waste" className="w-full h-20 md:h-28 object-cover rounded-xl shadow-sm border border-gray-200 bg-white" />
                  </div>
                  
                  <div className="shrink-0 text-gray-300 bg-white p-2 rounded-full shadow-sm">
                    <ArrowRight className={`w-5 h-5 ${isCompleted ? 'text-eco' : 'text-gray-300'}`} />
                  </div>
                  
                  <div className="flex-1 text-center">
                    <span className="text-[10px] font-black text-eco uppercase tracking-wider block mb-2">Masterpiece</span>
                    <img src={targetImage} alt="target" className={`w-full h-20 md:h-28 object-cover rounded-xl bg-white ${isCompleted ? 'ring-4 ring-eco/20 shadow-md' : 'border border-eco/30 shadow-sm'}`} />
                  </div>
                  
                  <div className="flex-[2] hidden md:flex flex-col justify-center px-4">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{targetTitle}</h3>
                    {isCompleted ? (
                      <p className="text-xs text-emerald-600 mt-2 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3"/> Successfully Completed
                      </p>
                    ) : (
                      <>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Local Delivery</p>
                        <span className="mt-3 inline-flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-100 px-3 py-1.5 rounded-lg text-xs font-black w-max">
                          <IndianRupee className="w-3 h-3" /> COD / Collect on Delivery
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* 2. PROGRESS TRACKER (Hidden if completed) */}
                {!isCompleted && (
                  <div className="relative mb-8">
                    <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-gray-100 rounded-full z-0">
                      <motion.div 
                        className="h-full bg-eco rounded-full transition-all duration-1000"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%` }}
                      />
                    </div>

                    <div className="relative z-10 flex justify-between">
                      {trackingSteps.map((step, index) => {
                        const isActive = index <= currentStepIndex;
                        const Icon = step.icon;
                        
                        return (
                          <div key={step.id} className="flex flex-col items-center gap-2 w-1/5">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                              isActive ? 'bg-eco text-white ring-4 ring-eco-light/30' : 'bg-white text-gray-300 border-2 border-gray-100'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[9px] md:text-xs font-bold text-center uppercase tracking-wider ${
                              isActive ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. DYNAMIC ACTION AREA */}
                {isCompleted ? (
                  <div className="pt-4 border-t border-emerald-100/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-full shadow-inner">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">Eco-Mission Accomplished! 🌍</p>
                        <p className="text-xs text-emerald-600 font-medium">You saved valuable resources from the landfill.</p>
                      </div>
                    </div>
                    
                    {!isArtisan ? (
                      // Only show button if feedback is NOT already given
                      !swap.feedback?.rating ? (
                        <button 
                          onClick={() => {
                            setSelectedSwapForRating(swap);
                            setShowRatingModal(true);
                          }}
                          className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white border border-gray-200 text-gray-700 hover:border-eco hover:text-eco transition-colors shadow-sm flex items-center gap-2"
                        >
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Rate Artisan
                        </button>
                      ) : (
                        <div className="px-6 py-2.5 rounded-xl font-bold text-sm bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-2">
                          <Star className="w-4 h-4 fill-amber-500" /> You Rated {swap.feedback.rating}/5
                        </div>
                      )
                    ) : (
                      <div className="px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-2">
                        <IndianRupee className="w-4 h-4" /> Payment Received
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    {isArtisan ? (
                      <>
                        <p className="text-xs text-gray-500 font-medium">Update the status once you complete the current step.</p>
                        <button 
                          onClick={() => handleUpdateStatus(swap._id, swap.status)}
                          disabled={btnDetails.disabled}
                          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${btnDetails.color}`}
                        >
                          {btnDetails.text}
                        </button>
                      </>
                    ) : (
                      <>
                         <p className="text-xs text-gray-500 font-medium">Have questions about your order?</p>
                         <button 
                           onClick={() => navigate('/chats')}
                           className="px-6 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                         >
                           Message Artisan
                         </button>
                      </>
                    )}
                  </div>
                )}
                
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 🔥 THE RATING MODAL UI 🔥 */}
      {showRatingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl p-8 relative"
          >
            <h2 className="text-2xl font-black text-gray-900 mb-2">Rate the Artisan</h2>
            <p className="text-gray-500 text-sm mb-8 font-medium">
              Your feedback helps {selectedSwapForRating?.artisanAssigned?.name || 'the artisan'} get more projects and builds trust in the community.
            </p>
            
            {/* STAR SELECTION */}
            <div className="flex justify-center gap-3 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setUserRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star className={`w-12 h-12 ${userRating >= star ? 'text-amber-400 fill-amber-400 drop-shadow-md' : 'text-gray-200 fill-gray-200'}`} />
                </button>
              ))}
            </div>

            {/* REVIEW TEXTAREA */}
            <textarea 
              placeholder="Write a quick review about the upcycled product... (Optional)"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-eco focus:bg-white text-sm font-medium resize-none mb-8 transition-colors"
              rows="3"
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
            />

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              <button 
                onClick={() => setShowRatingModal(false)}
                className="flex-[0.8] px-4 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitRating}
                className="flex-[1.2] px-4 py-3.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-eco shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4 fill-white" /> Submit Rating
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default MySwaps;