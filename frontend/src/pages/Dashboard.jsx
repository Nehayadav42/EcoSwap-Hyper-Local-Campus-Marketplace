import { UploadCloud, ArrowRight, Package, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Monday, 13 April 2026</p>
        </div>
        <button className="bg-eco text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-eco-dark transition-colors">
          + New Swap
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Total swaps</div>
          <div className="text-3xl font-bold text-gray-900">7</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Eco-score</div>
          <div className="text-3xl font-bold text-eco">2.5 kg</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Active orders</div>
          <div className="text-3xl font-bold text-gray-900">1</div>
        </div>
      </div>

      {/* Main Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Action Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Start a Swap</div>
          <div className="flex-1 border-2 border-dashed border-eco-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-eco-card/30 cursor-pointer hover:bg-eco-card transition-colors">
            <UploadCloud className="w-10 h-10 text-eco" />
            <p className="text-base font-semibold text-gray-900">Tap to upload photo</p>
            <span className="text-sm text-gray-500 text-center">AI suggests best products for your material</span>
          </div>
        </div>

        {/* Active Order Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Active Swap</div>
          <h3 className="text-lg font-bold text-gray-900">Old Denim → Tote Bag</h3>
          <p className="text-sm text-gray-500 mb-6">Artisan: Meera Craft Studio, Mumbai</p>
          
          {/* Stepper */}
          <div className="flex items-center justify-between mb-2">
            <div className="w-4 h-4 rounded-full bg-eco border-2 border-eco"></div>
            <div className="flex-1 h-1 bg-eco"></div>
            <div className="w-4 h-4 rounded-full bg-eco border-2 border-eco"></div>
            <div className="flex-1 h-1 bg-eco"></div>
            <div className="w-4 h-4 rounded-full bg-eco border-2 border-eco"></div>
            <div className="flex-1 h-1 bg-gray-200"></div>
            <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300"></div>
          </div>
          <div className="flex justify-between text-xs font-semibold text-gray-400 mb-6">
            <span className="text-eco">Pickup</span>
            <span className="text-eco">Approved</span>
            <span className="text-eco">Upcycling</span>
            <span>Delivered</span>
          </div>

          <Link to="/chats" className="block w-full text-center bg-white border-2 border-eco-border text-eco py-2.5 rounded-lg text-sm font-semibold hover:bg-eco-light transition-colors">
            Chat with artisan →
          </Link>
        </div>
      </div>

      {/* Impact Bar */}
      <div className="bg-eco-light rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Leaf className="w-5 h-5 text-eco" />
          <p className="text-sm font-semibold text-eco-dark">Your impact: 2.5 kg waste kept out of landfill this month</p>
        </div>
        <span className="text-sm font-bold text-eco">Keep going!</span>
      </div>
    </div>
  );
};
export default Dashboard;