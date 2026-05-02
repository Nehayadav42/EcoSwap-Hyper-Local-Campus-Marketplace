import { useRef, useState, useEffect } from 'react';
import { UploadCloud, Leaf, Zap, ChevronRight, Award, Loader2, Sparkles, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // --- STATES ---
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]); 
  
  // Nayi State Progress Bar aur Level ke liye
  const [ecoStats, setEcoStats] = useState({ totalKg: 0, completedCount: 0 });

  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};

  // --- FETCH DATA FUNCTION ---
  const fetchDashboardData = async () => {
    if (!userInfo._id) return;
    
    try {
      // Hum History API call kar rahe hain taaki saare (Active + Completed) orders mil sakein
      const { data } = await axios.get(`http://localhost:5000/api/swaps/history?userId=${userInfo._id}`);
      
      // 1. Active Orders nikalo (Dashboard par dikhane ke liye)
      const active = data.filter(order => order.status !== 'completed');
      setActiveOrders(active);

      // 2. Completed Orders nikalo (Score calculate karne ke liye)
      const completed = data.filter(order => order.status === 'completed');
      
      const totalEcoScore = completed.reduce((total, order) => {
        // Agar AI ne score nahi diya toh default 1.5kg assume karenge
        const score = order.suggestedProducts?.[0]?.estimatedEcoScore || 1.5;
        return total + Number(score);
      }, 0);

      setEcoStats({
        totalKg: totalEcoScore.toFixed(1),
        completedCount: completed.length
      });

    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };

  // Jab page load ho tab data fetch karo
  useEffect(() => {
    fetchDashboardData();
  }, [userInfo._id]);

  // --- UPLOAD HANDLER ---
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    setAiResult(null); 
    
    try {
      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const imageUrl = uploadRes.data.imageUrl;
      setIsUploading(false); 

      if (!imageUrl) {
         toast.error("Failed to upload image");
         setIsAnalyzing(false);
         return;
      }
      
      setIsAnalyzing(true);
      toast.success('Image uploaded! AI is analyzing...');

      const payloadData = {
        imageUrl: imageUrl,
        userId: userInfo._id
      };
      
      const aiRes = await axios.post('http://localhost:5000/api/ai/analyze', payloadData);
      
      toast.success('AI found great ideas!');
      setAiResult(aiRes.data.swapData); 
      
      // Upload hone ke baad order list refresh karo
      fetchDashboardData();

    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
      setIsUploading(false);
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // --- ANIMATIONS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  // Calculate Level based on completed orders
  const getLevelInfo = () => {
    if (ecoStats.completedCount >= 5) return { title: 'Level 3: Eco Master', goal: 20 };
    if (ecoStats.completedCount >= 1) return { title: 'Level 2: Earth Guardian', goal: 10 };
    return { title: 'Level 1: Seedling', goal: 5 };
  };

  const levelInfo = getLevelInfo();
  const progressPercentage = Math.min((ecoStats.totalKg / levelInfo.goal) * 100, 100);

  return (
    <motion.div className="max-w-5xl mx-auto space-y-6 pb-10" initial="hidden" animate="visible" variants={containerVariants}>
      
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {userInfo.name?.split(' ')[0] || 'User'}! Let's make an impact today.</p>
        </div>
        <button onClick={() => navigate('/swaps')} className="bg-eco text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-eco-dark transition-all shadow-md flex items-center gap-2">
          View All Swaps <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* DYNAMIC LEVEL CARD */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-eco to-eco-dark rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <Leaf className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-eco-border" />
              <h2 className="text-lg font-bold text-eco-border">{levelInfo.title}</h2>
            </div>
            <p className="text-sm text-eco-light mb-4">
              You have saved <span className="font-bold text-white">{ecoStats.totalKg} kg</span> of waste from landfills!
            </p>
            <div className="w-full bg-black/20 rounded-full h-2.5 mb-1 overflow-hidden">
              <div className="bg-eco-border h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-eco-light font-medium">
              <span>{ecoStats.totalKg} kg saved</span>
              <span>{levelInfo.goal} kg goal</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px] border border-white/20">
            <div className="text-3xl font-bold text-white">{ecoStats.completedCount}</div>
            <div className="text-xs text-eco-light font-medium mt-1">Completed Swaps</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upload Action Card */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-eco scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-amber-500" />
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {aiResult ? 'AI Analysis Complete' : 'Start New Swap'}
            </div>
          </div>
          
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          {aiResult ? (
            <div className="flex flex-col h-full animate-in fade-in zoom-in duration-500">
              <div className="bg-eco-light/50 p-4 rounded-xl border border-eco-border mb-4">
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  Material Detected: <span className="text-eco">{aiResult.detectedMaterial}</span>
                </h3>
              </div>
              <div className="space-y-3 flex-1">
                {aiResult.suggestedProducts?.slice(0,3).map((product, idx) => (
                  <div key={idx} className="border border-gray-200 p-3 rounded-xl hover:border-eco flex justify-between items-center bg-white">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{product.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.description}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2 py-1 rounded-full shrink-0 ml-2">
                      {product.estimatedEcoScore} kg
                    </span>
                  </div>
                ))}
              </div>
              <button onClick={() => setAiResult(null)} className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-bold mt-4 hover:bg-gray-200 transition-colors">
                Scan Another Item
              </button>
            </div>
          ) : (
            <div onClick={() => !isUploading && !isAnalyzing && fileInputRef.current.click()} className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all duration-300 min-h-[250px] ${(isUploading || isAnalyzing) ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-300 group-hover:border-eco bg-gray-50 group-hover:bg-eco-light/30 cursor-pointer'}`}>
              {isAnalyzing ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-full shadow-sm relative">
                    <Sparkles className="w-8 h-8 text-amber-500 animate-pulse relative z-10" />
                    <div className="absolute inset-0 bg-amber-200 rounded-full animate-ping opacity-50"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-gray-900">AI is analyzing material...</p>
                  </div>
                </div>
              ) : isUploading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-full shadow-sm"><Loader2 className="w-8 h-8 text-eco animate-spin" /></div>
                  <p className="text-base font-bold text-gray-900">Uploading image...</p>
                </div>
              ) : (
                <>
                  <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300"><UploadCloud className="w-8 h-8 text-eco" /></div>
                  <p className="text-base font-bold text-gray-900 mt-2">Tap to upload waste photo</p>
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* ACTIVE ORDERS SECTION */}
        <div className="space-y-4">
          {activeOrders.length === 0 ? (
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center h-full min-h-[250px] text-center">
               <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                 <Clock className="w-6 h-6 text-gray-400" />
               </div>
               <h3 className="text-sm font-bold text-gray-700">No Active Swaps</h3>
               <p className="text-xs text-gray-500 mt-1">Active orders will appear here.</p>
            </motion.div>
          ) : (
            activeOrders.map((order) => {
              let progressPercent = "25%"; 
              let statusText = "Finding Artisan";
              
              if (order.status === 'accepted') { progressPercent = "50%"; statusText = "Artisan Assigned"; }
              if (order.status === 'in_progress') { progressPercent = "75%"; statusText = "Upcycling"; }
              
              const productName = order.suggestedProducts?.[0]?.title || "Custom Item";
              const material = order.detectedMaterial || "Material";

              return (
                <motion.div key={order._id} variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xs font-bold text-eco uppercase tracking-wider bg-eco-light px-3 py-1 rounded-full">{statusText}</div>
                  </div>
                  
                  <div className="flex gap-4 items-center mb-4">
                    <img src={order.wasteImage} alt="waste" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{material} → {productName}</h3>
                      <p className="text-sm text-gray-600">
                        Artisan: {order.artisanAssigned ? <span className="text-eco font-medium">{order.artisanAssigned.name}</span> : <span className="italic text-gray-400">Waiting...</span>}
                      </p>
                    </div>
                  </div>
                  
                  <button onClick={() => navigate('/chats')} disabled={!order.artisanAssigned} className={`block w-full text-center border-2 py-3 rounded-xl text-sm font-bold transition-all mt-auto ${order.artisanAssigned ? 'bg-white border-gray-200 text-gray-700 hover:border-eco hover:text-eco hover:bg-eco-light/50' : 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'}`}>
                    {order.artisanAssigned ? 'Chat with Artisan' : 'Chat available soon'}
                  </button>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;