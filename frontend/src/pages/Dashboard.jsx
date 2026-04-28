import { useRef, useState } from 'react';
import { UploadCloud, Leaf, Zap, ChevronRight, Award, Loader2, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // States for Uploading and AI Analyzing
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Local storage se user data nikalna
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || { name: 'Eco Warrior' };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    setAiResult(null); 
    
    try {
      // Step 1: Upload Image to Cloudinary
      const uploadRes = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const imageUrl = uploadRes.data.imageUrl;
      setIsUploading(false); 
      console.log("Cloudinary URL:", imageUrl);
      console.log("User ID:", userInfo._id);

      // Safety check
      if (!imageUrl) {
         toast.error("Failed to get image URL from Cloudinary");
         setIsAnalyzing(false);
         return;
      }
      
      // Step 2: Send Image URL to Gemini AI
      setIsAnalyzing(true);
      toast.success('Image uploaded! AI is analyzing now...');

      // 👉 YEH EXACT BLOCK USE KIYA HAI:
      const payloadData = {
        imageUrl: imageUrl,
        userId: userInfo._id || "60f0399aecdb320e99e25f99" // Fallback added
      };
      
      console.log("📦 Sending this payload:", payloadData);

      const aiRes = await axios.post('http://localhost:5000/api/ai/analyze', payloadData);
      
      toast.success('AI found great upcycling ideas!');
      setAiResult(aiRes.data.swapData); 

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong!');
      setIsUploading(false);
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
      className="max-w-5xl mx-auto space-y-6 pb-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {userInfo.name?.split(' ')[0]}! Let's make an impact today.</p>
        </div>
        <button 
          onClick={() => navigate('/swaps')}
          className="bg-eco text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-eco-dark transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          View All Swaps <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Level Card */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-eco to-eco-dark rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <Leaf className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-eco-border" />
              <h2 className="text-lg font-bold text-eco-border">Level 2: Earth Guardian</h2>
            </div>
            <p className="text-sm text-eco-light mb-4">You are 1.5 kg away from unlocking Level 3!</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upload Action Card OR AI Results */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-eco scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
          
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-amber-500" />
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {aiResult ? 'AI Analysis Complete' : 'Start New Swap'}
            </div>
          </div>
          
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          {/* DYNAMIC CONTENT: Upload Box OR AI Results */}
          {aiResult ? (
            <div className="flex flex-col h-full animate-in fade-in zoom-in duration-500">
              <div className="bg-eco-light/50 p-4 rounded-xl border border-eco-border mb-4">
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  Material Detected: <span className="text-eco">{aiResult.detectedMaterial}</span>
                </h3>
                <p className="text-xs text-gray-600">Select an idea to send to artisan:</p>
              </div>
              
              <div className="space-y-3 flex-1">
                {aiResult.suggestedProducts.map((product, idx) => (
                  <div key={idx} className="border border-gray-200 p-3 rounded-xl hover:border-eco hover:shadow-md cursor-pointer transition-all flex justify-between items-center bg-white group">
                    <div className="pr-2">
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-eco transition-colors">{product.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1">
                        <Leaf className="w-3 h-3"/> {product.estimatedEcoScore} kg
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setAiResult(null)} 
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-bold mt-4 hover:bg-gray-200 transition-colors"
              >
                Scan Another Item
              </button>
            </div>
          ) : (
            <div 
              onClick={() => !isUploading && !isAnalyzing && fileInputRef.current.click()} 
              className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all duration-300 min-h-[250px] ${
                (isUploading || isAnalyzing) ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-300 group-hover:border-eco bg-gray-50 group-hover:bg-eco-light/30 cursor-pointer'
              }`}
            >
              {isAnalyzing ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-full shadow-sm relative">
                    <Sparkles className="w-8 h-8 text-amber-500 animate-pulse relative z-10" />
                    <div className="absolute inset-0 bg-amber-200 rounded-full animate-ping opacity-50"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-gray-900">AI is analyzing material...</p>
                    <p className="text-xs text-gray-500 mt-1">Detecting fabric and possibilities</p>
                  </div>
                </div>
              ) : isUploading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-full shadow-sm">
                    <Loader2 className="w-8 h-8 text-eco animate-spin" />
                  </div>
                  <p className="text-base font-bold text-gray-900">Uploading image...</p>
                </div>
              ) : (
                <>
                  <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud className="w-8 h-8 text-eco" />
                  </div>
                  <p className="text-base font-bold text-gray-900 mt-2">Tap to upload waste photo</p>
                  <span className="text-sm text-gray-500 text-center px-4">AI will detect the material and suggest 3 products</span>
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Active Order Card */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xs font-bold text-eco uppercase tracking-wider bg-eco-light px-3 py-1 rounded-full">Active Now</div>
            <span className="text-xs text-gray-400 font-medium">Started 2 days ago</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Old Denim → Tote Bag</h3>
          <p className="text-sm text-gray-600 mb-6">Artisan: <Link to="/artisan" className="text-eco hover:underline font-medium">Meera Craft Studio</Link></p>
          
          <div className="relative mb-6 mt-auto">
            <div className="absolute top-2 left-0 w-full h-1 bg-gray-100 rounded-full -z-10"></div>
            <div className="absolute top-2 left-0 w-[50%] h-1 bg-eco rounded-full -z-10 transition-all duration-1000"></div>
            
            <div className="flex justify-between">
              <div className="flex flex-col items-center gap-2"><div className="w-5 h-5 rounded-full bg-eco border-4 border-white shadow-sm"></div><span className="text-[11px] font-bold text-gray-900">Pickup</span></div>
              <div className="flex flex-col items-center gap-2"><div className="w-5 h-5 rounded-full bg-eco border-4 border-white shadow-sm"></div><span className="text-[11px] font-bold text-gray-900">Approved</span></div>
              <div className="flex flex-col items-center gap-2"><div className="w-5 h-5 rounded-full bg-eco border-4 border-eco-light shadow-sm animate-pulse"></div><span className="text-[11px] font-bold text-eco">Upcycling</span></div>
              <div className="flex flex-col items-center gap-2"><div className="w-5 h-5 rounded-full bg-gray-200 border-4 border-white shadow-sm"></div><span className="text-[11px] font-medium text-gray-400">Delivered</span></div>
            </div>
          </div>

          <button onClick={() => navigate('/chats')} className="block w-full text-center bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-bold hover:border-eco hover:text-eco hover:bg-eco-light/50 transition-all">
            Chat with Artisan
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;