import { useState, useEffect } from 'react';
import { Users, Star, Award, MessageSquare, MapPin } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FindArtisans = () => {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/artisans');
        setArtisans(data);
      } catch (error) {
        console.error("Failed to load artisans", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtisans();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto space-y-6 pb-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-eco-light to-white p-8 rounded-3xl border border-eco-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-eco" />
            Discover Artisans
          </h1>
          <p className="text-gray-600 mt-2 max-w-xl">
            Connect with skilled local creators who can turn your waste into beautiful, sustainable products.
          </p>
        </div>
        <div className="hidden md:flex flex-col items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
           <div className="text-3xl font-black text-eco">{artisans.length}</div>
           <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Creators</div>
        </div>
      </div>

      {/* Grid of Artisans */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-400 font-medium">Loading talented artisans...</div>
      ) : artisans.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">No artisans have joined yet. Be the first to invite someone!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artisans.map((artisan) => {
            // Generate initials for Avatar
            const initials = artisan.name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'A';
            
            return (
              <motion.div key={artisan._id} variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-eco-border transition-all p-6 flex flex-col">
                
                {/* Profile Header */}
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-eco-light text-eco flex items-center justify-center text-xl font-bold border-2 border-white shadow-sm shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{artisan.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> Campus / Local
                    </p>
                  </div>
                </div>

                {/* Badges/Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-gray-50 text-gray-600 text-[11px] font-bold px-2.5 py-1 rounded-md border border-gray-100 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" /> Top Rated
                  </span>
                  <span className="bg-green-50 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-md border border-green-100 flex items-center gap-1">
                    <Award className="w-3 h-3" /> Eco Creator
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                  <button 
                    onClick={() => navigate('/chats')}
                    className="flex-1 bg-eco text-white py-2.5 rounded-xl text-sm font-bold hover:bg-eco-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Message
                  </button>
                  <button className="flex-1 bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-100 transition-colors">
                    View Profile
                  </button>
                </div>

              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  );
};

export default FindArtisans;