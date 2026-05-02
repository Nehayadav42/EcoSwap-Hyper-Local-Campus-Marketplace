import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hammer, CheckCircle, Clock, Leaf, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ArtisanDashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || { name: 'Artisan', _id: '60f0399aecdb320e99e25f99' };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/swaps/pending');
      setPendingOrders(data);
    } catch (error) {
      toast.error('Failed to load pending orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptOrder = async (swapId) => {
    setAcceptingId(swapId);
    try {
      await axios.put(`http://localhost:5000/api/swaps/${swapId}/accept`, {
        artisanId: userInfo._id
      });

      toast.success('Order Accepted!');
      setPendingOrders(prev => prev.filter(order => order._id !== swapId));
    } catch (error) {
      toast.error('Could not accept order');
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
          <p className="text-gray-400">
            Welcome back, {userInfo.name.split(' ')[0]}
          </p>
        </div>
      </div>

      {/* Orders */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-eco" />
          <h2 className="text-xl font-bold text-gray-900">
            Available Requests
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-eco" />
          </div>
        ) : pendingOrders.length === 0 ? (
          <div className="bg-gray-50 border rounded-2xl p-12 text-center">
            <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold">No pending orders</h3>
          </div>
        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingOrders.map((order, index) => {
              const idea = order.suggestedProducts?.[0] || {};
              
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col"
                >

                  {/* 🔥 SPLIT IMAGE VIEW */}
               {/* ArtisanDashboard.jsx mein Card ke Image Area ko isse replace karo */}
<div className="flex gap-3 mb-4">
  
  {/* Left: Original Waste Image */}
  <div className="w-1/2 relative group rounded-xl overflow-hidden border border-gray-200">
    <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
      Waste
    </div>
    <img 
      src={order.wasteImage} 
      alt="Received waste" 
      className="w-full h-40 object-cover" 
    />
  </div>

  {/* Right: Target / Expected Outcome Image */}
  <div className="w-1/2 relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
    <div className="absolute top-2 right-2 bg-eco text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
      Output
    </div>
    
    <img 
      // Yahan se generated image aayegi
      src={order.suggestedProducts?.[0]?.generatedImage} 
      alt="Target output" 
      className="w-full h-40 object-cover"
      // Agar Custom Idea hai ya image load na ho, toh yeh blank gray box dikhayega, Waste photo nahi!
      onError={(e) => {
        e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop"; 
        // 👆 Ek aesthetic placeholder fallback (ya tum koi aur default image laga sakti ho)
      }} 
    />
  </div>

</div>

                  {/* Content */}
                  <div className="p-5 pt-2 flex flex-col flex-1">

                    <p className="text-xs text-gray-500 mb-2">
                      Uploaded by {order.user?.name}
                    </p>

                    <h3 className="font-bold text-gray-900">
                      {idea.title || "Upcycling Idea"}
                    </h3>

                    <p className="text-sm text-gray-500 mb-4">
                      {idea.description}
                    </p>

                    <button
                      onClick={() => handleAcceptOrder(order._id)}
                      disabled={acceptingId === order._id}
                      className="mt-auto bg-black text-white py-2 rounded-xl font-bold hover:bg-eco flex justify-center items-center gap-2"
                    >
                      {acceptingId === order._id ? (
                        <>
                          <Loader2 className="animate-spin w-4 h-4" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Accept Order
                        </>
                      )}
                    </button>

                  </div>
                </motion.div>
              );
            })}
          </div>

        )}
      </div>

    </div>
  );
};

export default ArtisanDashboard;