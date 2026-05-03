import { Link, useNavigate } from 'react-router-dom';
import { Leaf, UploadCloud, ArrowRight, Star, Recycle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useState, useEffect } from 'react';

const dummyFeaturedSwaps = [
  {
    _id: '1',
    wasteMaterial: 'Old Denim Jeans',
    productName: 'Everyday Tote Bag',
    artisanName: 'Meera Craft Studio',
    ecoScore: 1.5,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600'
  },
  {
    _id: '2',
    wasteMaterial: 'Glass Bottles',
    productName: 'Aesthetic Table Lamps',
    artisanName: 'Kiran Glassworks',
    ecoScore: 2.1,
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e9d15?auto=format&fit=crop&q=80&w=600'
  },
  {
    _id: '3',
    wasteMaterial: 'Scrap Wood',
    productName: 'Minimalist Desk Organizer',
    artisanName: 'Woodcrafters Guild',
    ecoScore: 3.0,
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=600'
  }
];

const dummyStoreProducts = [
  {
    _id: 's1',
    title: 'Vintage Denim Jacket',
    description: 'Upcycled from 3 pairs of old jeans. Features custom embroidery.',
    price: 1499,
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=600',
    madeFrom: 'Old Denim',
    sellerId: { name: 'Meera Craft Studio' }
  },
  {
    _id: 's2',
    title: 'Glass Bottle Planter',
    description: 'Hand-cut and polished wine bottles perfect for indoor plants.',
    price: 499,
    imageUrl: 'https://images.unsplash.com/photo-1599598425947-330026296904?auto=format&fit=crop&q=80&w=600',
    madeFrom: 'Glass Bottles',
    sellerId: { name: 'Kiran Glassworks' }
  },
  {
    _id: 's3',
    title: 'Rustic Wood Coffee Table',
    description: 'Made from reclaimed pallet wood. Finished with eco-friendly polish.',
    price: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=600',
    madeFrom: 'Scrap Wood',
    sellerId: { name: 'Woodcrafters Guild' }
  },
  {
    _id: 's4',
    title: 'Tote Bag from Sarees',
    description: 'Vibrant, durable, and reversible tote bag made from discarded silk sarees.',
    price: 850,
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600',
    madeFrom: 'Old Silk Sarees',
    sellerId: { name: 'Thread & Needle' }
  },
  {
    _id: 's5',
    title: 'Coconut Shell Bowl Set',
    description: '100% natural, polished coconut shells for your smoothies and salads.',
    price: 600,
    imageUrl: 'https://images.unsplash.com/photo-1610419356247-f74f7d45f5c8?auto=format&fit=crop&q=80&w=600',
    madeFrom: 'Coconut Shells',
    sellerId: { name: 'Eco Basics' }
  },
  {
    _id: 's6',
    title: 'Tyre Tube Wallet',
    description: 'Waterproof, rugged, and sleek wallet upcycled from old truck inner tubes.',
    price: 550,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600',
    madeFrom: 'Rubber Tyres',
    sellerId: { name: 'Urban Upcycle' }
  }
];

const Landing = () => {
  const navigate = useNavigate(); // Add hook for programmatic navigation
  const [featuredSwaps, setFeaturedSwaps] = useState([]);
  const [storeProducts, setStoreProducts] = useState(dummyStoreProducts);

  // REDIRECT LOGIC ADDED HERE
  const handleExploreClick = () => {
    const userInfo = JSON.parse(localStorage.getItem('ecoswap_user'));
    
    if (userInfo && userInfo._id) {
      // Agar logged in hai toh seedha Explore page par
      navigate('/explore');
    } else {
      // Agar logged in nahi hai toh Login page par
      navigate('/login');
    }
  };

  useEffect(() => {
    const fetchStoreProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/listings/public');
        if (data && data.length > 0) {
          setStoreProducts(data); // DB mein items hain toh wo dikhao
        }
      } catch (error) {
        console.log("Error fetching store products", error);
      }
    };
    fetchStoreProducts();
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/swaps/featured');
        setFeaturedSwaps(data);
      } catch (error) {
        console.error("Failed to load featured swaps", error);
      }
    };
    fetchFeatured();
  }, []);
  
  return (
    <>
      <div className="bg-white">
        
        {/* ========================================= */}
        {/* 1. HERO SECTION (Strictly 2 Columns)      */}
        {/* ========================================= */}
        <div id="products" className="relative z-10 max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-14 items-center">
          
          {/* Left Column: Text & Button */}
          <div>
            <div className="inline-flex items-center gap-2 bg-eco-light rounded-full px-4 py-2 mb-5">
              <Leaf className="w-4 h-4 text-eco" />
              <span className="text-sm font-semibold text-eco">12,400+ swaps completed today</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900 mb-5">
              Turn your waste into <br/><em className="not-italic text-eco">beautiful products</em>
            </h1>
            <p className="text-base text-gray-600 leading-relaxed mb-9">
              Upload a photo of your old materials — our AI matches you with skilled local artisans who transform them into something you'll love and use every day.
            </p>
            <div className="flex gap-3">
              <Link to="/register" className="bg-eco text-white px-8 py-4 rounded-xl font-bold hover:bg-eco-dark transition-all flex items-center gap-2 shadow-lg hover:shadow-eco/20">
                Start swapping →
              </Link>
            </div>
          </div>

          {/* Right Column: Upload Card Visual */}
          <Link to="/register" className="block group">
            <div className="bg-eco-card rounded-3xl p-7 border border-eco-border shadow-sm group-hover:shadow-xl group-hover:border-eco transition-all duration-300">
              <div className="border-2 border-dashed border-eco-border rounded-2xl p-10 flex flex-col items-center gap-4 bg-white group-hover:bg-eco-light/10 transition-colors">
                <div className="bg-white p-4 rounded-full shadow-sm text-eco group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-9 h-9" />
                </div>
                <p className="text-base font-bold text-gray-900">Tap to upload waste photo</p>
                <span className="text-sm text-gray-500 text-center max-w-xs">AI will identify your material and suggest the best upcycled products</span>
              </div>
              <div className="mt-4 bg-eco-light rounded-xl p-4 text-sm text-eco-dark font-bold flex items-center gap-3 border border-eco-border/50">
                <span className="animate-pulse flex h-2 w-2 rounded-full bg-eco"></span> 
                AI scanning... Denim detected — 3 artisans available nearby
              </div>
            </div>
          </Link>
        </div>
        {/* --- HERO SECTION ENDS HERE --- */}

{/* ========================================= */}
{/* 2. THE ECO-STORE SECTION (Now with Explore Button) */}
{/* ========================================= */}
<section className="py-20 bg-gray-50 border-t border-b border-gray-100">
  <div className="max-w-7xl mx-auto px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
        Shop Upcycled <span className="text-eco">Masterpieces</span>
      </h2>
      <p className="text-gray-500">Support local artisans and buy products made 100% from upcycled waste.</p>
    </div>

    {/* Map over exactly 6 products */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {storeProducts.slice(0, 6).map((product) => (
        <div key={product._id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
          <div className="h-64 relative overflow-hidden shrink-0">
            <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.title} />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 flex items-center gap-1 shadow-sm">
              ₹{product.price}
            </div>
          </div>
          
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-eco uppercase tracking-widest mb-2">
              <Recycle className="w-3.5 h-3.5" /> Made from: {product.madeFrom}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.description}</p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">By {product.sellerId?.name}</span>
              <Link to="/register">
                <button className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-eco transition-colors">
                  Buy Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* EXPLORE MORE BUTTON (UPDATED WITH ONCLICK) */}
    <div className="mt-16 flex justify-center">
      <button 
        onClick={handleExploreClick} 
        className="flex items-center gap-3 bg-white border-2 border-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-bold hover:border-eco hover:text-eco transition-all shadow-sm hover:shadow-md"
      >
        Explore 500+ More Products <ArrowRight className="w-5 h-5" />
      </button>
    </div>

  </div>
</section>

        {/* ========================================= */}
        {/* 3. STATS ROW                              */}
        {/* ========================================= */}
        <div className="relative z-10 grid grid-cols-3 max-w-5xl mx-auto py-10 border-b border-gray-100">
          <div className="text-center border-r border-gray-100">
            <div className="text-3xl font-bold text-eco">12,400+</div>
            <div className="text-sm text-gray-500 font-medium">Swaps completed</div>
          </div>
          <div className="text-center border-r border-gray-100">
            <div className="text-3xl font-bold text-eco">840 kg</div>
            <div className="text-sm text-gray-500 font-medium">Waste diverted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-eco">320+</div>
            <div className="text-sm text-gray-500 font-medium">Verified artisans</div>
          </div>
        </div>

        {/* ========================================= */}
        {/* 4. STEPS SECTION                          */}
        {/* ========================================= */}
        <div id="how-it-works" className="relative z-10 bg-gray-50/80 backdrop-blur-sm py-20">
          <div className="max-w-5xl mx-auto px-8">
            <div className="text-xs font-bold text-eco uppercase tracking-widest mb-1">How it works</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Three steps to a greener home</h2>
            <p className="text-sm text-gray-600 mb-8">No hassle, no guesswork — just upload and let us handle the rest.</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '01', title: 'Upload your waste', desc: 'Snap a photo of old clothes, packaging, or scrap. Our AI identifies the material type instantly.' },
                { num: '02', title: 'Match with an artisan', desc: 'We connect you with a verified local craftsperson who specialises in your material.' },
                { num: '03', title: 'Receive your product', desc: 'Track upcycling live and get your brand-new creation delivered to your door.' }
              ].map((step, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                  <span className="inline-block bg-eco-light text-eco text-xs font-black px-3 py-1.5 rounded-lg mb-4">{step.num}</span>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* 5. ABOUT SECTION                          */}
        {/* ========================================= */}
        <div id="about" className="relative z-10 bg-white/90 backdrop-blur-sm py-20">
          <div className="max-w-5xl mx-auto px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About EcoSwap</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              EcoSwap helps local communities reduce waste by connecting usable materials with artisans
              who transform them into practical products.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* 6. WALL OF IMPACT SECTION                   */}
      {/* ========================================= */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              See the <span className="text-eco">Magic</span> Before You Join
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
              Real transformations happening right now in your campus...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {dummyFeaturedSwaps.map((swap, index) => (
              <motion.div 
                key={swap._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group flex flex-col h-full"
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={swap.imageUrl} alt={swap.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black text-eco flex items-center gap-2 shadow-sm">
                    <Leaf className="w-3.5 h-3.5" /> {swap.ecoScore} kg saved
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                    <Recycle className="w-4 h-4 text-eco" />
                    <span>From {swap.wasteMaterial}</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{swap.productName}</h3>
                  <p className="text-sm text-gray-500 mb-8 font-medium italic">Crafted by <span className="text-eco font-bold not-italic">{swap.artisanName}</span></p>
                  
                  <Link to="/register" className="mt-auto">
                    <button className="w-full bg-gray-50 text-gray-900 py-4 rounded-2xl text-sm font-bold border border-gray-100 group-hover:bg-eco group-hover:text-white group-hover:border-eco group-hover:shadow-lg group-hover:shadow-eco/30 transition-all flex justify-center items-center gap-3">
                      Start Your Swap <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;