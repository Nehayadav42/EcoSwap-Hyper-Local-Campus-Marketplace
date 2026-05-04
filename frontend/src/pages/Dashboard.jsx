import { useRef, useState, useEffect } from 'react';
import { UploadCloud, Leaf, Award, Loader2, Sparkles, Clock, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar'; 

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

  // --- SELL MODAL STATES ---
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellForm, setSellForm] = useState({ title: '', description: '', price: '', madeFrom: '' });
  const [sellImage, setSellImage] = useState(null);
  const [isSubmittingSell, setIsSubmittingSell] = useState(false);
  
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
  const isArtisan = userInfo.role === 'artisan';

  const fetchDashboardData = async () => {
    if (!userInfo._id) return;
    try {
      const { data } = await axios.get(`http://localhost:5000/api/swaps/history?userId=${userInfo._id}`);
      console.log("Dashboard Orders API Response:", data); //
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange({ target: { files: [file] } });
  };

  const levelInfo = (ecoStats.completedCount >= 5) ? { title: 'Level 3: Eco Master', goal: 20 } : 
                  (ecoStats.completedCount >= 1) ? { title: 'Level 2: Earth Guardian', goal: 10 } : 
                  { title: 'Level 1: Seedling', goal: 5 };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      
      {/* 1. ZOOM MODAL */}
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
              <img src={zoomedImage} alt="Zoomed" className="w-full h-auto rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SELL ITEM MODAL (NEW) */}
      <AnimatePresence>
        {isSellModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
              
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">
                  {isArtisan ? 'List Upcycled Product' : 'List Raw Material'}
                </h2>
                <button onClick={() => setIsSellModalOpen(false)} className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm"><X className="w-5 h-5"/></button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-eco hover:bg-eco-light/10 transition-colors cursor-pointer relative">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setSellImage(e.target.files[0])} />
                  {sellImage ? (
                    <p className="font-bold text-eco text-sm">Image Selected: {sellImage.name}</p>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="font-bold text-gray-700 text-sm">Click to upload product image</p>
                    </>
                  )}
                </div>

                <input type="text" placeholder="Title (e.g. Denim Jacket)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-eco focus:bg-white text-sm" value={sellForm.title} onChange={e => setSellForm({...sellForm, title: e.target.value})} />
                
                <textarea placeholder="Describe the item..." rows="3" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-eco focus:bg-white text-sm" value={sellForm.description} onChange={e => setSellForm({...sellForm, description: e.target.value})}></textarea>
                
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-3 text-gray-500 font-bold">₹</span>
                    <input type="number" placeholder="Price" className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-eco focus:bg-white text-sm" value={sellForm.price} onChange={e => setSellForm({...sellForm, price: e.target.value})} />
                  </div>
                  {isArtisan && (
                     <input type="text" placeholder="Made from (e.g. Old Jeans)" className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-eco focus:bg-white text-sm" value={sellForm.madeFrom} onChange={e => setSellForm({...sellForm, madeFrom: e.target.value})} />
                  )}
                </div>
              </div>

             {/* YAHAN SE REPLACE KARO */}
<div className="p-6 border-t border-gray-100 bg-white">
  <button 
    onClick={async () => {
      setIsSubmittingSell(true);
      try {
        console.log("🚀 Publish button clicked! Starting API calls..."); 

        // 1. Pehle Image Upload karo 
        const formData = new FormData();
        formData.append('image', sellImage);
        const uploadRes = await axios.post('http://localhost:5000/api/upload', formData);
        
        console.log("✅ Image uploaded:", uploadRes.data.imageUrl);

        // 2. Listing data backend bhejo
        const payload = {
          sellerId: userInfo._id,
          listingType: isArtisan ? 'finished_good' : 'raw_material',
          title: sellForm.title,
          description: sellForm.description,
          price: Number(sellForm.price),
          imageUrl: uploadRes.data.imageUrl,
          madeFrom: isArtisan ? sellForm.madeFrom : 'Raw Waste' 
        };

        await axios.post('http://localhost:5000/api/listings/create', payload);
        
        console.log("✅ Listing saved to database!");
        toast.success('Listed successfully on EcoStore!');
        setIsSellModalOpen(false);
        setSellForm({ title: '', description: '', price: '', madeFrom: '' });
        setSellImage(null);
      } catch (error) {
        console.error("❌ API Error:", error);
        toast.error('Failed to publish listing');
      } finally {
        setIsSubmittingSell(false);
      }
    }}
    disabled={!sellForm.title || !sellForm.price || !sellImage || isSubmittingSell}
    className="w-full bg-eco text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-eco-dark transition-all disabled:opacity-50 flex justify-center"
  >
    {isSubmittingSell ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Listing'}
  </button>
</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. HEADER (UPDATED WITH SELL BUTTON) */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {userInfo.name?.split(' ')[0] || 'User'}!</p>
        </div>
        <button 
          onClick={() => setIsSellModalOpen(true)}
          className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-xl hover:bg-eco transition-all flex items-center justify-center gap-2"
        >
          <UploadCloud className="w-4 h-4" />
          {isArtisan ? 'Sell Masterpiece' : 'Sell Raw Waste'}
        </button>
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
        
        {/* LEFT CARD: UPLOAD BOX OR SUGGESTIONS */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col h-[500px]">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />

          {aiResult ? (
            <div className="flex flex-col h-full animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-center bg-eco-light/50 p-3 rounded-xl border border-eco-border mb-3">
                <h3 className="text-sm font-bold text-gray-900">
                  Detected: <span className="text-eco">{aiResult.detectedMaterial}</span>
                </h3>
                <button onClick={() => setAiResult(null)} className="text-xs text-gray-500 hover:text-red-500 font-medium">Cancel</button>
              </div>

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
                          const shortName = encodeURIComponent(product.title.split(' ').slice(0, 2).join(' '));
                          e.target.src = `https://placehold.co/400x400/dcfce7/166534?font=Montserrat&text=${shortName}`;
                        }}
                        onClick={(e) => { e.stopPropagation(); setZoomedImage(product.generatedImage); }}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                        alt={product.title}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900">{product.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-tight">{product.description}</p>
                    </div>
                    {selectedIdea?.title === product.title && <CheckCircle className="w-5 h-5 text-eco shrink-0" />}
                  </div>
                ))}

                <div onClick={() => setSelectedIdea('custom')} className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${selectedIdea === 'custom' ? 'border-eco bg-eco-light/20' : 'border-gray-100 bg-white hover:border-eco-light'}`}>
                  <h4 className="text-sm font-bold text-gray-900 mb-1 flex justify-between items-center">
                    I have a specific idea {selectedIdea === 'custom' && <CheckCircle className="w-4 h-4 text-eco" />}
                  </h4>
                  {selectedIdea === 'custom' && (
                    <textarea autoFocus value={customIdea} onChange={(e) => setCustomIdea(e.target.value)} placeholder="What do you want to make?" className="w-full mt-2 text-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-eco bg-white" rows="2" onClick={(e) => e.stopPropagation()}/>
                  )}
                </div>
              </div>

              <button onClick={handleConfirmSwap} disabled={!selectedIdea || (selectedIdea === 'custom' && !customIdea.trim()) || isUploading} className="w-full bg-eco text-white py-3 rounded-xl text-sm font-bold mt-2 hover:bg-eco-dark transition-colors shadow-md disabled:opacity-50">
                {isUploading ? 'Sending...' : 'Confirm & Request Upcycle'}
              </button>
            </div>
          ) : (
            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current.click()} className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${isDragging ? 'border-eco bg-eco-light/20 scale-[1.02]' : 'border-gray-300 hover:border-eco'}`}>
              {isAnalyzing ? (
                <div className="text-center"><Sparkles className="w-8 h-8 text-amber-500 animate-pulse mx-auto" /><p className="font-bold mt-2">Analyzing...</p></div>
              ) : isUploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-eco" />
              ) : (
                <><UploadCloud className="w-8 h-8 text-eco" /><p className="font-bold mt-2">{isDragging ? 'Drop here!' : 'Click or Drag Image'}</p></>
              )}
            </div>
          )}
        </div>

        {/* RIGHT CARD: ACTIVE ORDERS */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col h-[500px]">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-eco" /> Active Orders</h2>
          <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {activeOrders.length === 0 ? (
              <p className="text-gray-400 text-sm text-center mt-10">No active orders</p>
            ) : (
              activeOrders.map((order) => {
                // Fixed Labels for Progress Bar
                const stages = [
                  { key: 'pending_artisan', label: 'Finding' },
                  { key: 'accepted', label: 'Accepted' },
                  { key: 'in_progress', label: 'Crafting' },
                  { key: 'completed', label: 'Done' }
                ];
                const currentStageIndex = stages.findIndex(s => s.key === order.status);
                
                return (
                  <div key={order._id} className="border border-gray-100 p-4 rounded-2xl flex flex-col shadow-sm">
                    <div className="flex gap-3 items-center mb-4">
                      <img src={order.wasteImage} className="w-12 h-12 rounded-lg object-cover border shrink-0" alt="waste" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 truncate">{order.suggestedProducts?.[0]?.title || "Custom Item"}</h3>
                        <p className="text-[11px] text-gray-500">{order.artisanAssigned ? `Artisan: ${order.artisanAssigned.name}` : 'Finding Artisan...'}</p>
                      </div>
                    </div>
                    {/* PROGRESS BAR */}
                    <div className="relative mb-5 px-1">
                      <div className="absolute top-1.5 left-2 right-2 h-1 bg-gray-100 rounded-full"></div>
                      <div className="absolute top-1.5 left-2 h-1 bg-eco rounded-full transition-all duration-700" style={{ width: `${(Math.max(0, currentStageIndex) / (stages.length - 1)) * 100}%`, maxWidth: 'calc(100% - 16px)' }}></div>
                      <div className="relative flex justify-between w-full">
                        {stages.map((stage, idx) => (
                          <div key={stage.key} className="flex flex-col items-center w-10">
                            <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 z-10 ${idx <= currentStageIndex ? 'bg-eco border-eco scale-110 shadow-sm' : 'bg-white border-gray-200'}`}></div>
                            <span className={`text-[8px] font-black mt-2 tracking-wide ${idx <= currentStageIndex ? 'text-eco' : 'text-gray-400'}`}>{stage.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      {order.estimatedTimeline ? (
                        <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md"><Clock className="w-3 h-3" /><span className="text-[10px] font-bold">Ready in {order.estimatedTimeline}</span></div>
                      ) : <div className="text-[10px] text-gray-400 italic">Processing...</div>}
                      <button onClick={() => navigate('/chats')} className={`text-[10px] font-black px-3 py-1 rounded-lg transition-all ${order.artisanAssigned ? 'bg-eco text-white shadow-sm' : 'hidden'}`}>CHAT</button>
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