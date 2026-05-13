import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Award, MessageCircle, X, CheckCircle, Package, Users, Leaf } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Explore = () => {
  const navigate = useNavigate();
  
  // States
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'materials', 'artisans'
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Data States
  const [artisans, setArtisans] = useState([]);
  const [upcycledProducts, setUpcycledProducts] = useState([]);

  // Modal States
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Data (Dummy data + API structure setup)
  // Fetch Real Data from Backend
 // Fetch Real Data from Backend (Bulletproof version)
 useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    
    // 1. Fetch Real Artisans (Alag Block)
    try {
      const artisanRes = await axios.get('http://localhost:5000/api/auth/artisans');
      const realArtisans = artisanRes.data.map(artisan => ({
        ...artisan,
        rating: artisan.rating || 4.9,
        swaps: artisan.swaps || 0,
        saved: artisan.saved || 0
      }));
      setArtisans(realArtisans);
    } catch (error) {
      console.error("❌ Artisans route not found yet:", error.message);
    }

    // 2. Fetch Real Upcycled Products (Alag Block)
    try {
      const productRes = await axios.get('http://localhost:5000/api/listings/public');
      setUpcycledProducts(productRes.data);
    } catch (error) {
      console.error("❌ Listings route error:", error.message);
    } 
    
    setIsLoading(false);
  };
  fetchData();
}, []);

  // 🔥 INSTANT SEARCH FILTER LOGIC
  const filteredArtisans = artisans.filter(artisan => 
    artisan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = upcycledProducts.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
      
      {/* 1. HEADER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-eco" /> EcoSwap Directory
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Discover upcycled products and skilled local artisans.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <input 
            type="text"
            placeholder="Search artisans or products..."
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-eco focus:bg-white transition-all shadow-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* 2. TABS NAVIGATION */}
      <div className="flex gap-8 border-b border-gray-200 px-4">
        <button 
          onClick={() => setActiveTab('products')}
          className={`pb-4 font-bold transition-colors flex items-center gap-2 ${activeTab === 'products' ? 'text-eco border-b-2 border-eco' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Package className="w-4 h-4"/> Upcycled Products
        </button>
        <button 
          onClick={() => setActiveTab('materials')}
          className={`pb-4 font-bold transition-colors flex items-center gap-2 ${activeTab === 'materials' ? 'text-eco border-b-2 border-eco' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Leaf className="w-4 h-4"/> Raw Materials
        </button>
        <button 
          onClick={() => setActiveTab('artisans')}
          className={`pb-4 font-bold transition-colors flex items-center gap-2 ${activeTab === 'artisans' ? 'text-eco border-b-2 border-eco' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Users className="w-4 h-4"/> Meet Artisans
        </button>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-eco border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <>
            {/* --- ARTISANS TAB CONTENT --- */}
            {activeTab === 'artisans' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtisans.length > 0 ? (
                  filteredArtisans.map((artisan) => (
                    <div key={artisan._id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                      <div className="h-24 bg-gradient-to-r from-eco-light/60 to-emerald-100/40 relative">
                        <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-2xl p-1 shadow-md group-hover:scale-105 transition-transform">
                          <div className="w-full h-full bg-eco text-white flex items-center justify-center rounded-xl text-2xl font-black shadow-inner">
                            {artisan.name.charAt(0)}
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-black text-eco flex items-center gap-1 shadow-sm">
                          <CheckCircle className="w-3 h-3" /> VERIFIED
                        </div>
                      </div>

                      <div className="pt-10 p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg leading-tight">{artisan.name}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium">
                              <MapPin className="w-3 h-3 text-gray-400"/> Local Creator
                            </p>
                          </div>
                          <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 border border-amber-100">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500"/> {artisan.rating}
                          </span>
                        </div>

                        <div className="flex gap-4 my-5 py-4 border-y border-gray-50">
                          <div className="text-center flex-1">
                            <div className="text-lg font-black text-gray-900">{artisan.swaps}</div>
                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Swaps</div>
                          </div>
                          <div className="w-px bg-gray-100"></div>
                          <div className="text-center flex-1">
                            <div className="text-lg font-black text-eco">{artisan.saved}kg</div>
                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Saved</div>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setSelectedArtisan(artisan);
                            setIsModalOpen(true);
                          }} 
                          className="w-full bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-900 text-sm font-bold py-3 rounded-xl transition-all duration-300"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-gray-100">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No artisans found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}

            {/* --- PRODUCTS TAB CONTENT --- */}
{activeTab === 'products' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredProducts.length > 0 ? (
      filteredProducts.map(product => (
        <div key={product._id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
          
          {/* 🔥 REAL IMAGE RENDER HOGI YAHAN 🔥 */}
          <div className="h-40 bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
             {product.imageUrl ? (
               <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
             ) : (
               <span className="text-gray-400 font-bold">No Image</span>
             )}
             <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-black shadow-sm border border-gray-100 text-gray-900">
                ₹{product.price}
             </div>
          </div>

          <h3 className="font-bold text-gray-900">{product.title}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
          
          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
             {/* Agar backend seller ka naam bhej raha hai toh wo yahan dikhega */}
             <span className="text-[10px] font-bold text-eco uppercase tracking-wider">
               {product.madeFrom ? `Made of ${product.madeFrom}` : 'Upcycled'}
             </span>
             <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-eco transition-colors">Buy Now</button>
          </div>
        </div>
      ))
    ) : (
      <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-gray-100">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No products found matching "{searchTerm}"</p>
      </div>
    )}
  </div>
)}

            {/* --- MATERIALS TAB CONTENT --- */}
            {activeTab === 'materials' && (
              <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
                <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 text-xl">Raw Materials Marketplace</h3>
                <p className="text-gray-500 font-medium mt-2">Coming soon! Buy and sell raw waste materials directly.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* 4. ARTISAN PROFILE MODAL POPUP */}
      <AnimatePresence>
        {isModalOpen && selectedArtisan && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors z-10"
              >
                <X className="w-5 h-5"/>
              </button>

              <div className="h-32 bg-gradient-to-r from-eco to-emerald-600 relative"></div>
              
              <div className="px-8 pb-8">
                <div className="relative -top-12 flex justify-between items-end mb-2">
                  <div className="w-24 h-24 bg-white rounded-2xl p-1.5 shadow-lg">
                    <div className="w-full h-full bg-eco-light/30 text-eco flex items-center justify-center rounded-xl text-4xl font-black">
                      {selectedArtisan.name.charAt(0)}
                    </div>
                  </div>
                  <div className="mb-12">
                    <span className="bg-eco-light text-eco text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <Award className="w-4 h-4" /> Top Rated
                    </span>
                  </div>
                </div>

                <div className="mt-[-2rem]">
                  <h2 className="text-2xl font-black text-gray-900">{selectedArtisan.name}</h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">Passionate about upcycling old materials into beautiful, functional everyday items.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <div className="text-2xl font-black text-gray-900">{selectedArtisan.rating}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">Average Rating</div>
                  </div>
                  <div className="bg-eco-light/20 p-4 rounded-2xl border border-eco/10">
                    <div className="text-2xl font-black text-eco">100%</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">Completion Rate</div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    navigate('/chats'); // Chats page par jayega
                  }}
                  className="w-full mt-6 bg-gray-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-eco transition-colors shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" /> Message Artisan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Explore;