import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Artisan = () => {
  const artisans = [
    {
      id: 1,
      initials: 'MC',
      name: 'Meera Craft Studio',
      location: 'Mumbai, Maharashtra',
      since: '2022',
      tags: ['Denim', 'Cotton', 'Bags', 'Home decor'],
      swaps: 148,
      rating: 4.9,
      turnaround: '2 days'
    },
    {
      id: 2,
      initials: 'GT',
      name: 'Green Thread Works',
      location: 'Pune, Maharashtra',
      since: '2021',
      tags: ['Cotton', 'Alterations', 'Kidswear', 'Repairs'],
      swaps: 121,
      rating: 4.8,
      turnaround: '3 days'
    },
    {
      id: 3,
      initials: 'UU',
      name: 'Urban Upcycle Lab',
      location: 'Bengaluru, Karnataka',
      since: '2020',
      tags: ['Wood scrap', 'Furniture', 'Decor', 'Storage'],
      swaps: 96,
      rating: 4.7,
      turnaround: '4 days'
    },
    {
      id: 4,
      initials: 'RS',
      name: 'ReKindle Studio',
      location: 'Hyderabad, Telangana',
      since: '2023',
      tags: ['Paper craft', 'Gift items', 'Wall art', 'Frames'],
      swaps: 110,
      rating: 4.9,
      turnaround: '2 days'
    },
    {
      id: 5,
      initials: 'SL',
      name: 'SecondLife Makers',
      location: 'Delhi, NCR',
      since: '2021',
      tags: ['Plastic', 'Utility items', 'Organizers', 'Planters'],
      swaps: 134,
      rating: 4.8,
      turnaround: '3 days'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Find Artisans</h1>
          <p className="text-sm text-gray-500 mt-1">Choose from verified local artisans for your upcycling swap.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {artisans.map((artisan) => (
            <div key={artisan.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50/70 hover:border-eco transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-eco-card text-eco-dark flex items-center justify-center text-lg font-bold">
                  {artisan.initials}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{artisan.name}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {artisan.location}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-3">Verified artisan since {artisan.since}</p>

              <div className="flex gap-2 mb-4 flex-wrap">
                {artisan.tags.map((tag) => (
                  <span key={tag} className="bg-eco-light text-eco text-xs font-bold px-3 py-1 rounded-md">{tag}</span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-base font-bold text-eco">{artisan.swaps}</div>
                  <div className="text-xs text-gray-500">Swaps</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-base font-bold text-eco flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {artisan.rating}
                  </div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-base font-bold text-eco">{artisan.turnaround}</div>
                  <div className="text-xs text-gray-500">Avg time</div>
                </div>
              </div>

              <Link to="/chats" className="block w-full bg-eco text-white text-center py-2.5 rounded-lg text-sm font-bold hover:bg-eco-dark transition-colors">
                Message Artisan
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Artisan;