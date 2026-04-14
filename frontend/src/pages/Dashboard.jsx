import { UploadCloud, Leaf, Zap, ChevronRight, Award, Star, MapPin } from 'lucide-react';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Animation ke liye

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Selected: ${file.name}`);
    }
  }; // Programmatic routing ke liye
  const featuredArtisans = [
    { id: 1, name: 'Meera Craft Studio', location: 'Mumbai, Maharashtra', rating: 4.9, specialty: 'Denim, Bags, Home decor', swaps: 148 },
    { id: 2, name: 'Green Thread Works', location: 'Pune, Maharashtra', rating: 4.8, specialty: 'Cotton, Apparel fixes', swaps: 121 },
    { id: 3, name: 'Urban Upcycle Lab', location: 'Bengaluru, Karnataka', rating: 4.7, specialty: 'Furniture, Wood scrap', swaps: 96 },
    { id: 4, name: 'ReKindle Studio', location: 'Hyderabad, Telangana', rating: 4.9, specialty: 'Paper craft, Decor', swaps: 110 },
    { id: 5, name: 'SecondLife Makers', location: 'Delhi, NCR', rating: 4.8, specialty: 'Plastic, Utility items', swaps: 134 }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto min-h-[calc(100vh-8rem)] py-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, let's make an impact today.</p>
        </div>
        {/* Routing Fixed: Goes to Swaps page to see all orders */}
        <button 
          onClick={() => navigate('/swaps')}
          className="bg-eco text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-eco-dark transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          View All Swaps <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* GAMIFICATION SECTION (New Engagement Feature) */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-eco to-eco-dark rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        {/* Decorative background element */}
        <Leaf className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-eco-border" />
              <h2 className="text-lg font-bold text-eco-border">Level 2: Earth Guardian</h2>
            </div>
            <p className="text-sm text-eco-light mb-4">You are 1.5 kg away from unlocking Level 3 (Planet Savior)!</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-black/20 rounded-full h-2.5 mb-1">
              <div className="bg-eco-border h-2.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-eco-light font-medium">
              <span>2.5 kg saved</span>
              <span>4.0 kg goal</span>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px] border border-white/20">
            <div className="text-3xl font-bold text-white">7</div>
            <div className="text-xs text-eco-light font-medium mt-1">Total Swaps</div>
          </div>
        </div>
      </motion.div>

      {/* Main Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upload Action Card (Engaging Hover State) */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col group relative overflow-hidden">
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="absolute top-0 left-0 w-1 h-full bg-eco scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
          
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-amber-500" />
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start New Swap</div>
          </div>
          
          <div 
            onClick={() => fileInputRef.current.click()} 
           // Will connect to actual upload logic later
            className="flex-1 border-2 border-dashed border-gray-300 group-hover:border-eco rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-gray-50 group-hover:bg-eco-light/30 cursor-pointer transition-all duration-300"
          >
            <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-8 h-8 text-eco" />
            </div>
            <p className="text-base font-bold text-gray-900 mt-2">Tap to upload waste photo</p>
            <span className="text-sm text-gray-500 text-center">AI will instantly suggest products</span>
          </div>
        </motion.div>

        {/* Active Order Card */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xs font-bold text-eco uppercase tracking-wider bg-eco-light px-3 py-1 rounded-full">Active Now</div>
            <span className="text-xs text-gray-400 font-medium">Started 2 days ago</span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900">Old Denim → Tote Bag</h3>
          <p className="text-sm text-gray-600 mb-6">Artisan: <Link to="/artisan" className="text-eco hover:underline font-medium">Meera Craft Studio</Link></p>
          
          {/* Stepper (Engaging Visuals) */}
          <div className="relative mb-6 mt-auto">
            <div className="absolute top-2 left-0 w-full h-1 bg-gray-100 rounded-full -z-10"></div>
            <div className="absolute top-2 left-0 w-[50%] h-1 bg-eco rounded-full -z-10 transition-all duration-1000"></div>
            
            <div className="flex justify-between">
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-eco border-4 border-white shadow-sm"></div>
                <span className="text-[11px] font-bold text-gray-900">Pickup</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-eco border-4 border-white shadow-sm"></div>
                <span className="text-[11px] font-bold text-gray-900">Approved</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-eco border-4 border-eco-light shadow-sm animate-pulse"></div>
                <span className="text-[11px] font-bold text-eco">Upcycling</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-200 border-4 border-white shadow-sm"></div>
                <span className="text-[11px] font-medium text-gray-400">Delivered</span>
              </div>
            </div>
          </div>

          {/* Routing Fixed: Goes to Chats */}
          <button 
            onClick={() => navigate('/chats')}
            className="block w-full text-center bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-bold hover:border-eco hover:text-eco hover:bg-eco-light/50 transition-all"
          >
            Chat with Artisan
          </button>
        </motion.div>
      </div>

      {/* Featured Artisans (Dummy Data) */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Top Local Artisans</h2>
          <Link to="/artisan" className="text-sm font-semibold text-eco hover:underline">Explore all</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {featuredArtisans.map((artisan) => (
            <div key={artisan.id} className="rounded-xl border border-gray-200 p-4 bg-gray-50/70 hover:border-eco transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{artisan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {artisan.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-current" />
                  {artisan.rating}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">{artisan.specialty}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{artisan.swaps}+ swaps completed</span>
                <Link to="/chats" className="text-xs font-bold text-eco hover:underline">
                  Message
                </Link>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;