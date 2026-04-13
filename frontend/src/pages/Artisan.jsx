import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Artisan = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-eco-card text-eco-dark flex items-center justify-center text-3xl font-bold">
            MC
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meera Craft Studio</h1>
            <p className="text-base text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" /> Mumbai, Maharashtra · Verified artisan since 2022
            </p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {['Denim', 'Cotton', 'Bags', 'Home decor'].map(tag => (
                <span key={tag} className="bg-eco-light text-eco text-xs font-bold px-3 py-1 rounded-md">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-eco">148</div>
            <div className="text-sm text-gray-500">Swaps completed</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-eco">4.9 / 5</div>
            <div className="text-sm text-gray-500">Customer rating</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-eco">2 days</div>
            <div className="text-sm text-gray-500">Avg turnaround</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Reviews</h2>
          <div className="bg-gray-50 p-4 rounded-xl mb-3">
            <div className="flex gap-1 mb-2 text-eco"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
            <p className="text-base text-gray-700">"Absolutely beautiful tote bag! Meera was communicative throughout and the quality is stunning."</p>
            <span className="text-sm text-gray-500 mt-2 block">— Priya R.</span>
          </div>
        </div>

        <Link to="/chats" className="block w-full bg-eco text-white text-center py-3 rounded-lg text-base font-bold hover:bg-eco-dark transition-colors">
          Message Meera →
        </Link>
      </div>
    </div>
  );
};
export default Artisan;