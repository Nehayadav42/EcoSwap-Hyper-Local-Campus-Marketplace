import { Star, Package, MessageSquareText } from 'lucide-react';

const ArtisanDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto min-h-[calc(100vh-8rem)] py-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Artisan Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage incoming swaps, messages, and your delivery pipeline.</p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-eco-light text-eco border border-eco-border">
          Dummy mode
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Package className="w-4 h-4 text-eco" /> Active swaps
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-3">3</div>
          <p className="text-sm text-gray-500 mt-1">In progress right now</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MessageSquareText className="w-4 h-4 text-eco" /> Unread messages
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-3">7</div>
          <p className="text-sm text-gray-500 mt-1">Respond to keep trust high</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Star className="w-4 h-4 text-amber-500 fill-current" /> Rating
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-3">4.9</div>
          <p className="text-sm text-gray-500 mt-1">Last 30 days average</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900">Next steps</h2>
        <ul className="mt-3 text-sm text-gray-600 space-y-2">
          <li className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-eco" /> Connect this page to real artisan data after auth.</li>
          <li className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-eco" /> Add a swaps queue + status update actions.</li>
          <li className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-eco" /> Route based on stored role (already wired from register).</li>
        </ul>
      </div>
    </div>
  );
};

export default ArtisanDashboard;

