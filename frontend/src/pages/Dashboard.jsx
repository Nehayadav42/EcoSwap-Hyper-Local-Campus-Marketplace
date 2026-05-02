import { useRef, useState, useEffect } from 'react';
import { UploadCloud, Leaf, Award, Loader2, Sparkles, Clock, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [aiResult, setAiResult] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]); 
  const [ecoStats, setEcoStats] = useState({ totalKg: 0, completedCount: 0 });

  const [selectedIdea, setSelectedIdea] = useState(null);
  const [customIdea, setCustomIdea] = useState('');
  const [zoomedImage, setZoomedImage] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};

  const fetchDashboardData = async () => {
    if (!userInfo._id) return;
    try {
      const { data } = await axios.get(`http://localhost:5000/api/swaps/history?userId=${userInfo._id}`);
      setActiveOrders(data.filter(order => order.status !== 'completed'));

      const completed = data.filter(order => order.status === 'completed');
      const totalEcoScore = completed.reduce((total, order) => total + Number(order.suggestedProducts?.[0]?.estimatedEcoScore || 1.5), 0);
      setEcoStats({ totalKg: totalEcoScore.toFixed(1), completedCount: completed.length });
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };

  useEffect(() => { fetchDashboardData(); }, [userInfo._id]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setIsUploading(true);
    setAiResult(null); 
    try {
      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData);
      const imageUrl = uploadRes.data.imageUrl;
      setIsUploading(false); 
      setIsAnalyzing(true);
      const aiRes = await axios.post('http://localhost:5000/api/ai/analyze', { imageUrl, userId: userInfo._id });
      setAiResult(aiRes.data.aiData); 
    } catch (error) {
      toast.error('Upload failed');
      setIsUploading(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange({ target: { files: [file] } });
  };

  const getLevelInfo = () => {
    if (ecoStats.completedCount >= 5) return { title: 'Level 3: Eco Master', goal: 20 };
    if (ecoStats.completedCount >= 1) return { title: 'Level 2: Earth Guardian', goal: 10 };
    return { title: 'Level 1: Seedling', goal: 5 };
  };
  const levelInfo = getLevelInfo();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
  
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {userInfo.name?.split(' ')[0] || 'User'}!</p>
        </div>
      </div>
  
      {/* LEVEL CARD */}
      <div className="bg-gradient-to-r from-eco to-eco-dark rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{levelInfo.title}</h2>
            <p className="text-sm">You saved <b>{ecoStats.totalKg} kg</b> waste</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{ecoStats.completedCount}</p>
            <p className="text-xs font-medium">Completed</p>
          </div>
        </div>
      </div>
  
      <div className="grid md:grid-cols-2 gap-6">
  
        {/* LEFT: UPLOAD BOX */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col h-[500px]">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
          {aiResult ? (
            <div className="text-center animate-in fade-in zoom-in duration-300">
              <h3 className="font-bold text-lg text-eco">{aiResult.detectedMaterial}</h3>
              <p className="text-sm mt-2">AI Suggestions Ready</p>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
                isDragging ? 'border-eco bg-eco-light/20 scale-[1.02]' : 'border-gray-300 hover:border-eco'
              }`}
            >
              {isAnalyzing ? (
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-amber-500 animate-pulse mx-auto" />
                  <p className="font-bold mt-2">Analyzing...</p>
                </div>
              ) : isUploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-eco" />
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-eco" />
                  <p className="font-bold mt-2">{isDragging ? 'Drop here!' : 'Click or Drag Image'}</p>
                </>
              )}
            </div>
          )}
        </div>
  
        {/* RIGHT: ACTIVE ORDERS WITH PROGRESS BAR */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col h-[500px]">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-eco" /> Active Orders
          </h2>

          <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {activeOrders.length === 0 ? (
              <p className="text-gray-400 text-sm text-center mt-10">No active orders</p>
            ) : (
              activeOrders.map((order) => {
                const productName = order.suggestedProducts?.[0]?.title || "Custom Item";
                
                // --- PROGRESS BAR LOGIC ---
                const stages = ['pending_artisan', 'accepted', 'in_progress', 'completed'];
                const currentStageIndex = stages.indexOf(order.status);

                return (
                  <div key={order._id} className="border border-gray-100 p-4 rounded-2xl flex flex-col hover:border-eco-light transition-all shadow-sm">
                    
                    <div className="flex gap-3 items-center mb-4">
                      <img src={order.wasteImage} className="w-12 h-12 rounded-lg object-cover border shrink-0" alt="waste" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 truncate">{productName}</h3>
                        <p className="text-[11px] text-gray-500">
                          {order.artisanAssigned ? `Artisan: ${order.artisanAssigned.name}` : 'Finding Artisan...'}
                        </p>
                      </div>
                    </div>

                    {/* 🔥 DYNAMIC PROGRESS BAR 🔥 */}
                    <div className="relative mb-5 px-1 mt-1">
                      {/* Background Line */}
                      <div className="absolute top-1.5 left-0 w-full h-1 bg-gray-100 rounded-full"></div>
                      {/* Active Line */}
                      <div 
                        className="absolute top-1.5 left-0 h-1 bg-eco rounded-full transition-all duration-700"
                        style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                      ></div>
                      {/* Dots & Text */}
                      <div className="relative flex justify-between">
                        {stages.map((stage, idx) => (
                          <div key={stage} className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 z-10 ${
                              idx <= currentStageIndex ? 'bg-eco border-eco scale-110 shadow-sm' : 'bg-white border-gray-200'
                            }`}></div>
                            <span className={`text-[8px] font-black mt-2 uppercase tracking-tighter ${
                              idx <= currentStageIndex ? 'text-eco' : 'text-gray-300'
                            }`}>
                              {stage.split('_')[0]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline & Chat Button */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      {order.estimatedTimeline ? (
                        <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-bold">Ready in {order.estimatedTimeline}</span>
                        </div>
                      ) : <div className="text-[10px] text-gray-400 italic">Processing...</div>}
                      
                      <button 
                        onClick={() => navigate('/chats')}
                        className={`text-[10px] font-black px-3 py-1 rounded-lg transition-all ${
                          order.artisanAssigned ? 'bg-eco-light text-eco hover:bg-eco hover:text-white' : 'hidden'
                        }`}
                      >
                        CHAT
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;