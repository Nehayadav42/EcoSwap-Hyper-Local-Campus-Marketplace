import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Award, MessageCircle, X, CheckCircle, Package, Users, Leaf } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Explore = () => {
  const navigate = useNavigate();
  
  // ================= LOGGED IN USER INFO =================
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};

  // ================= STATES =================
  const [activeTab, setActiveTab] = useState('products'); // Default tab
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Data States
  const [artisans, setArtisans] = useState([]);
  const [allListings, setAllListings] = useState([]); // Dono type ka data (Products + Materials) yahan aayega

  // Modal & Popup States
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successPopup, setSuccessPopup] = useState({ show: false, id: '' });

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // 1. Fetch Real Artisans
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
        console.error("❌ Artisans route error:", error.message);
      }

      // 2. Fetch All Listings (Finished Goods + Raw Materials)
      try {
        const productRes = await axios.get('http://localhost:5000/api/listings/public');
        setAllListings(productRes.data);
      } catch (error) {
        console.error("❌ Listings route error:", error.message);
      } 
      
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // ================= RAZORPAY LOGIC =================
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyNow = async (product) => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    try {
      const orderRes = await axios.post("http://localhost:5000/api/payments/create-order", {
        amount: product.price
      });

      const options = {
        key: "rzp_test_SotruoAud5nvcB", // 👈 TUMHARI TEST KEY
        amount: orderRes.data.amount,
        currency: "INR",
        name: "EcoSwap",
        description: `Purchase: ${product.title}`,
        order_id: orderRes.data.id, 
        
        handler: async function (response) {
          try {
            await axios.post("http://localhost:5000/api/payments/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              productId: product._id
            });
            // Open the success popup instead of annoying alert
            setSuccessPopup({ show: true, id: response.razorpay_payment_id });
          } catch (err) {
            console.error("Error verifying payment", err);
            alert("Payment done, but failed to update stock in database.");
          }
        },
        prefill: {
          name: userInfo.name || "EcoSwap Member",
          email: userInfo.email || "hello@ecoswap.com",
          contact: "9999999999",
        },
        theme: { color: "#10B981" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment initiation failed", error);
      alert("Backend is not responding. Please check your server.");
    }
  };

  // ================= SMART FILTER LOGIC =================
  const filteredArtisans = artisans.filter(artisan => 
    artisan.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 1. Finished Goods (Artisans ke banaye hue)
  const filteredProducts = allListings.filter(item => 
    item.listingType !== 'raw_material' && 
    (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 2. Raw Materials (Users ka waste)
  const filteredMaterials = allListings.filter(item => 
    item.listingType === 'raw_material' && 
    (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const handleContactArtisan = async (product) => {
    const targetArtisanId = product.sellerId || product.seller || product.artisanId;
    if (!targetArtisanId) return toast.error("Artisan details missing!");

    const toastId = toast.loading("Opening chat room...");
    
    try {
      // Backend ko call karo naya room banane ke liye
      const { data } = await axios.post('http://localhost:5000/api/swaps/inquiry', {
        userId: userInfo._id,
        artisanId: targetArtisanId,
        product: product
      });
      
      toast.dismiss(toastId);
      // Naye room ki ID ke sath Chats page par chale jao
      navigate('/chats', { state: { autoOpenChatId: data._id } });
    } catch (error) {
      console.error(error);
      toast.error("Failed to start chat.", { id: toastId });
    }
  };

  // ================= REUSABLE CARD COMPONENT =================
  const renderListingCard = (item, isRawMaterial = false) => (
    <div key={item._id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      <div className="h-40 bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative shrink-0">
         {item.imageUrl ? (
           <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
         ) : (
           <span className="text-gray-400 font-bold">No Image</span>
         )}
         <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-black shadow-sm border border-gray-100 text-gray-900">
            ₹{item.price}
         </div>
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.title}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-end">
         <div className="flex flex-col gap-2">
           <span className={`text-[10px] font-bold uppercase tracking-wider ${isRawMaterial ? 'text-amber-500' : 'text-gray-400'}`}>
             {isRawMaterial ? 'Raw Waste Material' : (item.madeFrom ? `Made of ${item.madeFrom}` : 'Upcycled')}
           </span>
           
           <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider border ${
             item.stock === 0 
              ? "bg-red-50 text-red-600 border-red-100" 
              : "bg-green-50 text-green-600 border-green-100"
           }`}>
             {item.stock === 0 ? '🔴 Out of Stock' : `⚡ Only ${item.stock || 1} left`}
           </span>
         </div>
         
         {item.stock === 0 ? (
           <button 
             onClick={() => navigate('/chats')}
             className="bg-gray-100 text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-1.5"
           >
             <MessageCircle className="w-4 h-4"/> Message
           </button>
         ) : (
           <button 
             onClick={() => handleBuyNow(item)}
             className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-eco transition-all shadow-md hover:shadow-lg"
           >
             Buy Now
           </button>
         )}
      </div>
    </div>
  );

  // ================= RENDER UI =================
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
      
      {/* 1. HEADER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-eco" /> EcoSwap Directory
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Discover upcycled products and raw materials.</p>
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
        
        {/* 🔥 CONDITIONAL RENDERING: Hide for Artisans 🔥 */}
        {userInfo.role !== 'artisan' && (
          <button 
            onClick={() => setActiveTab('artisans')}
            className={`pb-4 font-bold transition-colors flex items-center gap-2 ${activeTab === 'artisans' ? 'text-eco border-b-2 border-eco' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Users className="w-4 h-4"/> Meet Artisans
          </button>
        )}
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-eco border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <>
            {/* --- ARTISANS TAB --- */}
            {activeTab === 'artisans' && userInfo.role !== 'artisan' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtisans.length > 0 ? (
                  filteredArtisans.map((artisan) => (
                    <div key={artisan._id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                      <div className="h-24 bg-gradient-to-r from-eco-light/60 to-emerald-100/40 relative">
                        <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-2xl p-1 shadow-md group-hover:scale-105 transition-transform">
                          <div className="w-full h-full bg-eco text-white flex items-center justify-center rounded-xl text-2xl font-black shadow-inner">
                            {artisan.name?.charAt(0) || 'A'}
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

            {/* --- PRODUCTS TAB (Finished Goods) --- */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => renderListingCard(product, false))
                ) : (
                  <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-gray-100">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No upcycled products found.</p>
                  </div>
                )}
              </div>
            )}

            {/* --- MATERIALS TAB (Raw Waste) --- */}
            {activeTab === 'materials' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.length > 0 ? (
                  filteredMaterials.map(material => renderListingCard(material, true))
                ) : (
                  <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-gray-100">
                    <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-900 text-xl">Raw Materials Marketplace</h3>
                    <p className="text-gray-500 font-medium mt-2">No raw materials listed right now. Check back later!</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ================= MODALS & POPUPS ================= */}
      {/* 4. ARTISAN PROFILE MODAL */}
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
                      {selectedArtisan.name?.charAt(0) || 'A'}
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
                  onClick={() => { handleContactArtisan(product) }}
                  className="w-full mt-6 bg-gray-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-eco transition-colors shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" /> Message Artisan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. PAYMENT SUCCESS PREMIUM POPUP */}
      <AnimatePresence>
        {successPopup.show && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-[2rem] w-full max-w-sm p-8 text-center shadow-2xl relative"
            >
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-sm text-gray-500 font-medium mb-6">Your order has been placed securely. The seller has been notified.</p>
              <div className="bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100 shadow-sm text-left flex flex-col items-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Transaction ID</p>
                <p className="text-xs font-mono font-bold text-gray-900">{successPopup.id}</p>
              </div>
              <button 
                onClick={() => { setSuccessPopup({ show: false, id: '' }); window.location.reload(); }}
                className="w-full bg-green-500 text-white py-3.5 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
              >
                Continue Exploring
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Explore;