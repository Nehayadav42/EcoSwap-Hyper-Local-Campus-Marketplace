import { useState, useEffect } from 'react';
import { Package, ArrowRight, User, LayoutDashboard, Star, MessageSquare, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const MySwaps = () => {
  const navigate = useNavigate();
  const [swaps, setSwaps] = useState([]);
  const [filter, setFilter] = useState('All'); 
  const [isLoading, setIsLoading] = useState(true);

  // Feedback Modal States
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, swapId: null });
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
  const isArtisan = userInfo.role === 'artisan';

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/swaps/history?userId=${userInfo._id}`);
      setSwaps(data);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo._id) fetchHistory();
  }, [userInfo._id]);

  const filteredSwaps = swaps.filter(swap => {
    if (filter === 'All') return true;
    if (filter === 'Active') return ['pending_artisan', 'accepted', 'in_progress'].includes(swap.status);
    if (filter === 'Completed') return swap.status === 'completed';
    return true;
  });

  // 👇 FEEDBACK SUBMIT FUNCTION
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) return toast.error("Please write a short review");

    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/swaps/${feedbackModal.swapId}/feedback`, {
        rating,
        review
      });
      toast.success("Feedback submitted! Artisan will be happy.");
      setFeedbackModal({ isOpen: false, swapId: null });
      setRating(5);
      setReview('');
      fetchHistory(); // Refresh to show the updated feedback
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      
      {/* FEEDBACK MODAL (POPUP) */}
      <AnimatePresence>
        {feedbackModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setFeedbackModal({ isOpen: false, swapId: null })}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Rate your Artisan</h2>
                <p className="text-sm text-gray-500 mt-1">How was the upcycled product and your interaction?</p>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                {/* Star Rating Selection */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star className={`w-10 h-10 ${rating >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                    </button>
                  ))}
                </div>

                <div>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your experience here... (e.g., The quality was amazing!)"
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-eco focus:ring-1 focus:ring-eco outline-none min-h-[100px] bg-gray-50"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-eco text-white py-3 rounded-xl font-bold hover:bg-eco-dark transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Tabs */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-6 h-6 text-eco" />
          {isArtisan ? 'Accepted Orders' : 'My Swaps'}
        </h1>

        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
          {['All', 'Active', 'Completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === tab ? 'bg-white text-eco shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading your history...</div>
      ) : filteredSwaps.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No orders found</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto mb-6">
            {isArtisan ? "You haven't accepted any orders yet." : "You haven't started any swaps yet."}
          </p>
          <button 
            onClick={() => navigate(isArtisan ? '/artisan-dashboard' : '/dashboard')}
            className="bg-eco text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-eco-dark inline-flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" /> Go to Workspace
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSwaps.map((swap) => {
            const productName = swap.suggestedProducts?.[0]?.title || "Custom Order";
            const isCompleted = swap.status === 'completed';
            const hasFeedback = !!swap.feedback?.rating;
            
            return (
              <div key={swap._id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-5 items-center hover:border-eco-light transition-colors">
                
                <img src={swap.wasteImage} alt="waste" className="w-20 h-20 rounded-xl object-cover border border-gray-100 shrink-0" />
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {isCompleted ? 'Completed' : 'Active'}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900">
                    {swap.detectedMaterial || "Material"} <ArrowRight className="w-4 h-4 inline text-gray-400 mx-1" /> {productName}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mt-1 flex items-center justify-center md:justify-start gap-1">
                    <User className="w-4 h-4 text-gray-400" />
                    {isArtisan ? (
                      <>User: <span className="font-semibold text-gray-800">{swap.user?.name || 'User'}</span></>
                    ) : (
                      <>Artisan: <span className="font-semibold text-gray-800">{swap.artisanAssigned?.name || 'Pending...'}</span></>
                    )}
                  </p>

                  {/* Feedback Display (Agar feedback de diya hai) */}
                  {isCompleted && hasFeedback && (
                    <div className="mt-3 flex items-center gap-2 bg-amber-50 inline-flex px-3 py-1.5 rounded-lg border border-amber-100">
                       <div className="flex">
                         {[...Array(swap.feedback.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />)}
                       </div>
                       <span className="text-xs text-gray-600 italic">"{swap.feedback.review}"</span>
                    </div>
                  )}
                </div>

                <div className="shrink-0 w-full md:w-auto flex flex-col gap-2">
                  {!isCompleted && (
                    <button 
                      onClick={() => navigate('/chats')}
                      disabled={!swap.artisanAssigned}
                      className="w-full md:w-auto px-6 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-eco hover:text-white hover:border-eco transition-all disabled:opacity-50"
                    >
                      <MessageSquare className="w-4 h-4 inline mr-1 mb-0.5" /> Chat
                    </button>
                  )}
                  
                  {/* 👇 LEAVE FEEDBACK BUTTON (Sirf User ko dikhega jab order complete ho jaye) */}
                  {!isArtisan && isCompleted && !hasFeedback && (
                    <button 
                      onClick={() => setFeedbackModal({ isOpen: true, swapId: swap._id })}
                      className="w-full md:w-auto px-6 py-2 bg-amber-400 text-white rounded-xl text-sm font-bold hover:bg-amber-500 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <Star className="w-4 h-4 fill-white" /> Leave Feedback
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default MySwaps;