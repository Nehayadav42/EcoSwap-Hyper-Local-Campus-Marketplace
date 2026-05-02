import { useRef, useState, useEffect } from 'react';
import { UploadCloud, Leaf, Award, Loader2, Sparkles, Clock, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // --- STATES ---
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // Drag & Drop State
  
  const [aiResult, setAiResult] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]); 
  const [ecoStats, setEcoStats] = useState({ totalKg: 0, completedCount: 0 });

  const [selectedIdea, setSelectedIdea] = useState(null);
  const [customIdea, setCustomIdea] = useState('');
  const [zoomedImage, setZoomedImage] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};

  // --- FETCH DATA ---
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

  // --- UPLOAD & DRAG HANDLERS ---
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    setAiResult(null); 
    setSelectedIdea(null);
    setCustomIdea('');
    
    try {
      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const imageUrl = uploadRes.data.imageUrl;
      setIsUploading(false); 
      setIsAnalyzing(true);
      toast.success('Image uploaded! AI is analyzing...');

      const aiRes = await axios.post('http://localhost:5000/api/ai/analyze', { imageUrl, userId: userInfo._id });
      
      toast.success('AI found great ideas! Select one.');
      setAiResult(aiRes.data.aiData); 

    } catch (error) {
      toast.error('Something went wrong!');
      setIsUploading(false);
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange({ target: { files: [file] } });
  };

  // --- CONFIRM ORDER ---
  const handleConfirmSwap = async () => {
    setIsUploading(true);
    try {
      let finalProduct = selectedIdea === 'custom' ? {
        title: "Custom Upcycle Request",
        description: customIdea,
        estimatedEcoScore: 1.5,
        generatedImage: aiResult.wasteImage 
      } : selectedIdea;

      await axios.post('http://localhost:5000/api/swaps', {
        userId: userInfo._id,
        wasteImage: aiResult.wasteImage,
        detectedMaterial: aiResult.detectedMaterial,
        selectedProduct: finalProduct
      });

      toast.success("Order sent to Artisans!");
      setAiResult(null);
      setSelectedIdea(null);
      setCustomIdea('');
      fetchDashboardData(); 
    } catch (error) {
      toast.error("Failed to submit request.");
    } finally {
      setIsUploading(false);
    }
  };

  const getLevelInfo = () => {
    if (ecoStats.completedCount >= 5) return { title: 'Level 3: Eco Master', goal: 20 };
    if (ecoStats.completedCount >= 1) return { title: 'Level 2: Earth Guardian', goal: 10 };
    return { title: 'Level 1: Seedling', goal: 5 };
  };
  const levelInfo = getLevelInfo();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      
      {/* ZOOM MODAL */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setZoomedImage(null)}
          >
            <div className="relative max-w-2xl w-full">
              <button onClick={() => setZoomedImage(null)} className="absolute -top-12 right-0 text-white hover:text-eco transition-colors">
                <X className="w-8 h-8" />
              </button>
              <img src={zoomedImage} alt="Zoomed idea" className="w-full h-auto rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {userInfo.name?.split(' ')[0] || 'User'}! Let's make an impact today.</p>
        </div>
      </div>

      {/* LEVEL CARD */}
      <div className="bg-gradient-to-r from-eco to-eco-dark rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <Leaf className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-eco-border" />
              <h2 className="text-lg font-bold text-eco-border">{levelInfo.title}</h2>
            </div>
            <p className="text-sm text-eco-light mb-4">You have saved <span className="font-bold text-white">{ecoStats.totalKg} kg</span> of waste!</p>
            <div className="w-full bg-black/20 rounded-full h-2.5 mb-1 overflow-hidden">
              <div className="bg-eco-border h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((ecoStats.totalKg / levelInfo.goal) * 100, 100)}%` }}></div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px] border border-white/20">
            <div className="text-3xl font-bold text-white">{ecoStats.completedCount}</div>
            <div className="text-xs text-eco-light font-medium mt-1">Completed Swaps</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: UPLOAD / SELECTION */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[500px]">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          {aiResult ? (
            <div className="flex flex-col h-full animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-center bg-eco-light/50 p-3 rounded-xl border border-eco-border mb-3">
                <h3 className="text-sm font-bold text-gray-900">
                  Detected: <span className="text-eco">{aiResult.detectedMaterial}</span>
                </h3>
                <button onClick={() => setAiResult(null)} className="text-xs text-gray-500 hover:text-red-500 font-medium">Cancel</button>
              </div>

              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Select an idea or write your own</p>

              <div className="space-y-3 overflow-y-auto pr-2 flex-1 pb-4 custom-scrollbar">
                {aiResult.suggestedProducts?.slice(0, 3).map((product, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => { setSelectedIdea(product); setCustomIdea(''); }}
                    className={`p-3 rounded-xl cursor-pointer flex gap-3 items-center transition-all border-2 ${selectedIdea?.title === product.title ? 'border-eco bg-eco-light/20 shadow-md' : 'border-gray-100 bg-white hover:border-eco-light'}`}
                  >
                    <div className="relative group shrink-0 bg-gray-100 rounded-xl">
                      <img 
                        src={product.generatedImage} 
                        onError={(e) => {
                          e.target.onError = null; 
                          const shortName = encodeURIComponent(product.title.split(' ').slice(0, 3).join(' '));
                          e.target.src = `https://placehold.co/400x400/dcfce7/166534?font=Montserrat&text=${shortName}`;
                        }}
                        onClick={(e) => { e.stopPropagation(); setZoomedImage(product.generatedImage); }}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-200 group-hover:opacity-80 transition-opacity"
                        alt={product.title}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                        <span className="bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">Zoom</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900">{product.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                    </div>
                    {selectedIdea?.title === product.title && <CheckCircle className="w-5 h-5 text-eco shrink-0" />}
                  </div>
                ))}

                <div 
                  onClick={() => setSelectedIdea('custom')}
                  className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${selectedIdea === 'custom' ? 'border-eco bg-eco-light/20' : 'border-gray-100 bg-white hover:border-eco-light'}`}
                >
                  <h4 className="text-sm font-bold text-gray-900 mb-1 flex justify-between items-center">
                    I have a specific idea 
                    {selectedIdea === 'custom' && <CheckCircle className="w-5 h-5 text-eco" />}
                  </h4>
                  {selectedIdea === 'custom' ? (
                    <textarea 
                      autoFocus
                      value={customIdea}
                      onChange={(e) => setCustomIdea(e.target.value)}
                      placeholder="E.g., Turn this into a desk organizer..."
                      className="w-full mt-2 text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-eco bg-white"
                      rows="2"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Click here to write your own instructions.</p>
                  )}
                </div>
              </div>

              <button 
                onClick={handleConfirmSwap} 
                disabled={!selectedIdea || (selectedIdea === 'custom' && !customIdea.trim()) || isUploading}
                className="w-full bg-eco text-white py-3.5 rounded-xl text-sm font-bold mt-2 hover:bg-eco-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isUploading ? 'Sending to Artisans...' : 'Confirm & Request Upcycle'}
              </button>
            </div>
          ) : (
            // DRAG AND DROP ZONE
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isUploading && !isAnalyzing && fileInputRef.current.click()} 
              className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all duration-300 ease-in-out ${
                isUploading || isAnalyzing 
                  ? 'border-gray-200 bg-gray-50' 
                  : isDragging 
                    ? 'border-eco bg-eco-light/40 scale-[1.02] shadow-inner' 
                    : 'border-gray-300 hover:border-eco bg-gray-50 hover:bg-eco-light/30 cursor-pointer'
              }`}
            >
              {isAnalyzing ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4 text-center">
                  <div className="bg-white p-4 rounded-full shadow-sm relative">
                    <Sparkles className="w-8 h-8 text-amber-500 animate-pulse relative z-10" />
                  </div>
                  <p className="text-base font-bold text-gray-900">AI is analyzing material...</p>
                </motion.div>
              ) : isUploading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-full shadow-sm"><Loader2 className="w-8 h-8 text-eco animate-spin" /></div>
                  <p className="text-base font-bold text-gray-900">Uploading image...</p>
                </div>
              ) : (
                <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center text-center">
                  <div className={`p-4 rounded-full shadow-sm transition-all duration-300 ${isDragging ? 'bg-eco text-white scale-110' : 'bg-white text-eco'}`}>
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className={`text-base font-bold mt-4 transition-colors ${isDragging ? 'text-eco' : 'text-gray-900'}`}>
                    {isDragging ? 'Drop image right here!' : 'Click or Drag & Drop waste photo'}
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ACTIVE ORDERS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[500px]">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-eco"/> Active Orders</h2>
          <div className="space-y-3 overflow-y-auto pr-2 flex-1 custom-scrollbar">
            {activeOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <Clock className="w-8 h-8 mb-3 opacity-20" />
                <p className="text-sm">No active orders right now.</p>
              </div>
            ) : (
              activeOrders.map((order) => {
                const productName = order.suggestedProducts?.[0]?.title || "Custom Item";
                return (
                  <div key={order._id} className="border border-gray-100 p-4 rounded-xl flex flex-col hover:border-eco-light transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold text-eco uppercase tracking-wider bg-eco-light px-2 py-1 rounded-md">
                        {order.status === 'accepted' ? 'Artisan Assigned' : order.status === 'in_progress' ? 'Upcycling' : 'Finding Artisan'}
                      </span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <img src={order.wasteImage} alt="waste" className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{productName}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Artisan: {order.artisanAssigned ? <span className="text-eco font-medium">{order.artisanAssigned.name}</span> : 'Waiting...'}
                        </p>
                      </div>
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