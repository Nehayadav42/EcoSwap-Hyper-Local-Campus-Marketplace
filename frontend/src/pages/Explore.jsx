import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Recycle, Search, Users, MapPin, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Explore = () => {
  const [products, setProducts] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [activeTab, setActiveTab] = useState('finished_good');
  const [isLoading, setIsLoading] = useState(true);

  // User Info and Role check
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
  const isArtisan = userInfo?.role === 'artisan';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get('http://localhost:5000/api/listings/public').catch(() => ({ data: [] }));
        setProducts(productsRes.data);

        // Sirf tabhi fetch karo jab user Artisan nahi hai (Optimization)
        if (!isArtisan) {
          const artisansRes = await axios.get('http://localhost:5000/api/auth/artisans').catch(() => ({ data: [] }));
          setArtisans(artisansRes.data);
        }
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isArtisan]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await axios.delete(`http://localhost:5000/api/listings/${id}`);
        toast.success("Listing removed!");
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  const filteredProducts = products.filter(p => p.listingType === activeTab);

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-eco" /> 
            EcoSwap Directory
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {isArtisan ? 'Manage your listings and explore raw materials.' : 'Discover upcycled products and skilled local artisans.'}
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-eco outline-none text-sm shadow-sm" />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex items-center gap-6 border-b border-gray-200 pb-px overflow-x-auto custom-scrollbar">
        <button 
          onClick={() => setActiveTab('finished_good')}
          className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeTab === 'finished_good' ? 'border-eco text-eco' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          Upcycled Products
        </button>
        <button 
          onClick={() => setActiveTab('raw_material')}
          className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeTab === 'raw_material' ? 'border-eco text-eco' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          Raw Materials
        </button>
        
        {/* 👇 Conditionally hide "Meet Artisans" for Artisan role */}
        {!isArtisan && (
          <button 
            onClick={() => setActiveTab('artisans')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'artisans' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
          >
            <Users className="w-4 h-4" /> Meet Artisans
          </button>
        )}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex justify-center py-20 text-eco animate-pulse"><ShoppingBag className="w-8 h-8" /></div>
      ) : activeTab === 'artisans' ? (
        // Artisans Grid (Only for Eco Members)
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {artisans.map((artisan) => (
            <div key={artisan._id} className="bg-white border border-gray-200 rounded-3xl p-6 text-center hover:shadow-xl transition-all group">
              <div className="w-20 h-20 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl font-black mb-4 group-hover:scale-110 transition-transform">
                {artisan.name?.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{artisan.name}</h3>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-1 font-medium">
                <MapPin className="w-3 h-3" /> {artisan.location || 'Local Creator'}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
                <button className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors w-full">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Products Grid (For Everyone)
        filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200 border-dashed">
            <Recycle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No items found</h3>
            <p className="text-sm text-gray-500">List an item to see it here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full shadow-sm relative">
                
                {/* 👇 Delete Icon: Current user owns the listing */}
                {(product.sellerId?._id === userInfo._id || product.sellerId === userInfo._id) && (
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="absolute top-4 left-4 z-20 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-50 hover:scale-110"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="h-56 relative overflow-hidden shrink-0">
                  <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.title} />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl text-xs font-black text-gray-900 shadow-sm">
                    ₹{product.price}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-black text-eco uppercase tracking-widest mb-2">
                    <Recycle className="w-3.5 h-3.5" /> 
                    {product.listingType === 'finished_good' ? `Made from: ${product.madeFrom}` : 'Raw Material'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-medium">By <span className="font-bold text-gray-800">{product.sellerId?.name || 'User'}</span></span>
                    {/* Hide Buy button for owner */}
                    {product.sellerId?._id !== userInfo._id && product.sellerId !== userInfo._id && (
                      <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-eco shadow-md transition-all">
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Explore;