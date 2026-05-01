import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hammer, CheckCircle, Clock, Leaf, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ArtisanDashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  // Local storage se logged-in user (Artisan) ka data nikalo
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || { name: 'Artisan', _id: '60f0399aecdb320e99e25f99' };

  // Fetch Pending Orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/swaps/pending');
      setPendingOrders(data);
    } catch (error) {
      toast.error('Failed to load pending orders');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Accept Order Function
  const handleAcceptOrder = async (swapId) => {
    setAcceptingId(swapId);
    try {
      await axios.put(`http://localhost:5000/api/swaps/${swapId}/accept`, {
        artisanId: userInfo._id
      });
      
      toast.success('Order Accepted! Added to your workspace.');
      
      // List mein se wo order hata do kyunki ab wo pending nahi raha
      setPendingOrders(prev => prev.filter(order => order._id !== swapId));
    } catch (error) {
      toast.error('Could not accept order. Try again.');
      console.error(error);
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <Hammer className="absolute -right-4 -bottom-4 w-40 h-40 text-white/5 -rotate-12" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Artisan Workspace</h1>
          <p className="text-gray-400">Welcome back, {userInfo.name.split(' ')[0]}. Here are the latest materials waiting for your magic touch.</p>
        </div>
      </div>

      {/* Available Orders Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-eco" />
          <h2 className="text-xl font-bold text-gray-900">Available Requests <span className="bg-eco/10 text-eco text-sm px-2 py-0.5 rounded-full ml-2">{pendingOrders.length}</span></h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-eco animate-spin" />
          </div>
        ) : pendingOrders.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700">No pending orders</h3>
            <p className="text-sm text-gray-500">You've cleared the queue! Check back later for new materials.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingOrders.map((order, index) => {
              const mainIdea = order.suggestedProducts?.[0] || { title: 'Upcycling Idea', description: 'Create something beautiful.' };
              
              return (
                <motion.div 
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group"
                >
                  {/* Image Section */}
                  <div className="h-48 relative overflow-hidden bg-gray-100">
                    <img src={order.wasteImage} alt="Waste Material" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                      {order.detectedMaterial || 'Mixed Material'}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                      <MapPin className="w-3 h-3" /> 
                      <span>Uploaded by <span className="font-semibold text-gray-700">{order.user?.name || 'User'}</span></span>
                    </div>

                    <div className="bg-eco/5 border border-eco/20 rounded-xl p-3 mb-4 flex-1">
                      <h4 className="text-xs font-bold text-eco uppercase tracking-wider mb-1">AI Suggestion</h4>
                      <p className="text-sm font-bold text-gray-900">{mainIdea.title}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{mainIdea.description}</p>
                    </div>

                    <button 
                      onClick={() => handleAcceptOrder(order._id)}
                      disabled={acceptingId === order._id}
                      className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-eco transition-colors flex justify-center items-center gap-2 disabled:bg-gray-400"
                    >
                      {acceptingId === order._id ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Accepting...</>
                      ) : (
                        <><CheckCircle className="w-4 h-4" /> Accept Order</>
                      )}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default ArtisanDashboard;