import { Link } from 'react-router-dom';
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

const Landing = () => {
  const [featuredSwaps, setFeaturedSwaps] = useState([]);

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
      {/* Hero Section */}
      <div className="bg-white">
        <div id="products" className="relative z-10 max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-14 items-center border-b border-gray-100">
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
              {/* ✅ UPDATED: Added Link to Register */}
              <Link to="/register" className="bg-eco text-white px-8 py-4 rounded-xl font-bold hover:bg-eco-dark transition-all flex items-center gap-2 shadow-lg hover:shadow-eco/20">
                Start swapping →
              </Link>
            </div>
          </div>

          {/* Upload Card Visual */}
          {/* ✅ UPDATED: Wrapped entire card in Link to Register */}
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

        {/* Stats Row */}
        <div className="relative z-10 grid grid-cols-3 max-w-5xl mx-auto border-b border-gray-100 py-10">
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

        {/* Steps Section */}
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

        {/* About Section */}
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

      {/* Wall of Impact Section */}
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
                {/* Product Image */}
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={swap.imageUrl} 
                    alt={swap.productName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black text-eco flex items-center gap-2 shadow-sm">
                    <Leaf className="w-3.5 h-3.5" /> {swap.ecoScore} kg saved
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                    <Recycle className="w-4 h-4 text-eco" />
                    <span>From {swap.wasteMaterial}</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{swap.productName}</h3>
                  <p className="text-sm text-gray-500 mb-8 font-medium italic">Crafted by <span className="text-eco font-bold not-italic">{swap.artisanName}</span></p>
                  
                  {/* ✅ UPDATED: Button Link to Register */}
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