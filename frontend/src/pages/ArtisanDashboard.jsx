import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer, CheckCircle, Clock, Leaf, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ArtisanDashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ NEW STATES
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, orderId: null });
  const [timeline, setTimeline] = useState('1 week');

  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/swaps/pending');
      setPendingOrders(data);
    } catch {
      toast.error('Failed to load pending orders');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ UPDATED ACCEPT FUNCTION
  const handleAcceptOrder = async () => {
    try {
      await axios.put(`http://localhost:5000/api/swaps/${confirmModal.orderId}/accept`, {
        artisanId: userInfo._id,
        timeline: timeline
      });

      toast.success(`Order accepted (${timeline})`);

      setPendingOrders(prev =>
        prev.filter(order => order._id !== confirmModal.orderId)
      );

      setConfirmModal({ isOpen: false, orderId: null });

    } catch {
      toast.error("Failed to accept order");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
        <h1 className="text-3xl font-bold">Artisan Workspace</h1>
      </div>

      {/* Orders */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin w-8 h-8 text-eco" />
        </div>
      ) : pendingOrders.length === 0 ? (
        <div className="bg-gray-50 p-12 text-center rounded-2xl">
          <Leaf className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <h3>No pending orders</h3>
        </div>
      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingOrders.map((order) => {
            const idea = order.suggestedProducts?.[0] || {};

            return (
              <div key={order._id} className="bg-white rounded-2xl shadow border p-4 flex flex-col">

                {/* Split Image */}
                <div className="flex gap-2 mb-3">
                  <img src={order.wasteImage} className="w-1/2 h-32 object-cover rounded" />
                  <img src={idea.generatedImage} className="w-1/2 h-32 object-cover rounded" />
                </div>

                <h3 className="font-bold">{idea.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{idea.description}</p>

                {/* ✅ BUTTON NOW OPENS MODAL */}
                <button
                  onClick={() => setConfirmModal({ isOpen: true, orderId: order._id })}
                  className="mt-auto bg-black text-white py-2 rounded-xl font-bold"
                >
                  Accept Order
                </button>

              </div>
            );
          })}
        </div>
      )}

      {/* ✅ MODAL */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
          >
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm">
              
              <h3 className="font-bold mb-4">Set Timeline</h3>

              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full p-3 border rounded-xl mb-4"
              >
                <option>3-4 days</option>
                <option>1 week</option>
                <option>2 weeks</option>
                <option>1 month</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmModal({ isOpen: false })}
                  className="flex-1 bg-gray-100 py-2 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAcceptOrder}
                  className="flex-1 bg-eco text-white py-2 rounded-xl"
                >
                  Confirm
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ArtisanDashboard;