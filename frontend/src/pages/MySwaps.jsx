import { Link } from 'react-router-dom';

const MySwaps = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">My Swaps</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-eco-light text-eco font-semibold rounded-lg text-sm border border-eco-border">All</button>
          <button className="px-4 py-2 bg-white text-gray-600 font-medium rounded-lg text-sm border border-gray-200 hover:bg-gray-50">Active</button>
          <button className="px-4 py-2 bg-white text-gray-600 font-medium rounded-lg text-sm border border-gray-200 hover:bg-gray-50">Completed</button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Active Swap */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Old Denim → Tote Bag</h3>
              <p className="text-sm text-gray-500">Started 8 Apr 2026</p>
            </div>
            <span className="bg-eco-light text-eco px-3 py-1 rounded-full text-xs font-bold">Upcycling in progress</span>
          </div>
          <p className="text-base text-gray-600 mb-4">Artisan: Meera Craft Studio, Mumbai</p>
          <div className="flex gap-3 mt-4">
            <button className="bg-eco text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-eco-dark">Track order</button>
            <Link to="/chats" className="bg-white border border-eco-border text-eco px-4 py-2 rounded-lg text-sm font-semibold hover:bg-eco-light">Chat</Link>
          </div>
        </div>

        {/* Completed Swap */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-75">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Glass Bottles → Hanging Lamp</h3>
              <p className="text-sm text-gray-500">Completed 2 Mar 2026</p>
            </div>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">Delivered</span>
          </div>
          <p className="text-base text-gray-600 mb-4">Artisan: Ravi Glassworks, Delhi</p>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">View product</button>
        </div>
      </div>
    </div>
  );
};
export default MySwaps;