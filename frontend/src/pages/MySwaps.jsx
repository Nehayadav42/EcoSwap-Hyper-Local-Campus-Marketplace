import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

const MySwaps = () => {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | active | completed

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/swaps');
      setSwaps(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'active') {
      return swaps.filter((s) => ['pending_artisan', 'accepted', 'upcycling'].includes(s.status));
    }
    if (filter === 'completed') {
      return swaps.filter((s) => s.status === 'delivered');
    }
    return swaps;
  }, [filter, swaps]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">My Swaps</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm border font-semibold ${
              filter === 'all' ? 'bg-eco-light text-eco border-eco-border' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm border font-semibold ${
              filter === 'active' ? 'bg-eco-light text-eco border-eco-border' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm border font-semibold ${
              filter === 'completed' ? 'bg-eco-light text-eco border-eco-border' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-sm text-gray-600">
            Loading swaps…
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-lg font-bold text-gray-900">No swaps found</div>
            <p className="text-sm text-gray-600 mt-1">Go to Dashboard and upload a waste photo to start your first swap.</p>
          </div>
        ) : (
          filtered.map((swap) => (
            <div key={swap._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex gap-4">
                  <img
                    src={swap.wasteImage}
                    alt="Swap"
                    className="h-14 w-14 rounded-xl object-cover border border-gray-200"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {swap.detectedMaterial ? `${swap.detectedMaterial} swap` : 'Swap request'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {swap.createdAt ? `Started ${new Date(swap.createdAt).toLocaleDateString()}` : ''}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    swap.status === 'delivered'
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-eco-light text-eco'
                  }`}
                >
                  {swap.status}
                </span>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  className="bg-eco text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-eco-dark"
                  onClick={fetchSwaps}
                >
                  Refresh
                </button>
                <Link
                  to="/chats"
                  className="bg-white border border-eco-border text-eco px-4 py-2 rounded-lg text-sm font-semibold hover:bg-eco-light"
                >
                  Chat
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default MySwaps;