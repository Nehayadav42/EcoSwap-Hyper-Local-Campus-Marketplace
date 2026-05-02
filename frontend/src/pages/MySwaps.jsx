import { useState, useEffect } from 'react';
import { Package, CheckCircle, ArrowRight, User, LayoutDashboard } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MySwaps = () => {
  const navigate = useNavigate();
  const [swaps, setSwaps] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // User Role Check
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
  const isArtisan = userInfo.role === 'artisan';

  useEffect(() => {
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
    if (userInfo._id) fetchHistory();
  }, [userInfo._id]);

  // ✅ Complete Order Function
  const handleCompleteOrder = async (swapId) => {
    try {
      await axios.put(`http://localhost:5000/api/swaps/${swapId}/complete`);
      toast.success('Awesome! Order marked as completed.');

      // Update UI instantly
      setSwaps(prevSwaps =>
        prevSwaps.map(swap =>
          swap._id === swapId ? { ...swap, status: 'completed' } : swap
        )
      );
    } catch (error) {
      toast.error('Failed to complete order.');
    }
  };

  // Filter Logic
  const filteredSwaps = swaps.filter(swap => {
    if (filter === 'All') return true;
    if (filter === 'Active') return ['pending_artisan', 'accepted', 'in_progress'].includes(swap.status);
    if (filter === 'Completed') return swap.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">

      {/* Header */}
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
                filter === tab
                  ? 'bg-white text-eco shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading your history...</div>
      ) : filteredSwaps.length === 0 ? (

        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No orders found</h3>
          <p className="text-sm text-gray-500 mt-2 mb-6">
            {isArtisan
              ? "You haven't accepted any orders yet."
              : "You haven't started any swaps yet."}
          </p>
          <button
            onClick={() => navigate(isArtisan ? '/artisan-dashboard' : '/dashboard')}
            className="bg-eco text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-eco-dark transition-colors inline-flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            Go to {isArtisan ? 'Workspace' : 'Dashboard'}
          </button>
        </div>

      ) : (

        <div className="space-y-4">
          {filteredSwaps.map((swap) => {
            const productName = swap.suggestedProducts?.[0]?.title || "Custom Order";
            const isCompleted = swap.status === 'completed';

            return (
              <div key={swap._id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-5 items-center">

                <img src={swap.wasteImage} alt="waste" className="w-20 h-20 rounded-xl object-cover" />

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-bold text-gray-900">
                    {swap.detectedMaterial} <ArrowRight className="inline w-4" /> {productName}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">
                    {isArtisan
                      ? <>User: {swap.user?.name}</>
                      : <>Artisan: {swap.artisanAssigned?.name || 'Pending...'}</>}
                  </p>
                </div>

                {/* ✅ UPDATED BUTTON SECTION */}
                <div className="shrink-0 w-full md:w-auto flex flex-col gap-2">

                  <button
                    onClick={() => navigate('/chats')}
                    disabled={!swap.artisanAssigned}
                    className="w-full md:w-auto px-6 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-eco hover:text-white hover:border-eco transition-all disabled:opacity-50"
                  >
                    {isCompleted ? 'View Details' : 'Open Chat'}
                  </button>

                  {isArtisan && !isCompleted && (
                    <button
                      onClick={() => handleCompleteOrder(swap._id)}
                      className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete
                    </button>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MySwaps;