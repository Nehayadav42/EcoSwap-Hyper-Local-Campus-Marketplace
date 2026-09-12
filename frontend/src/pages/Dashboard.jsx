import { useRef, useState, useEffect } from 'react';
import { UploadCloud, Leaf, Award, Loader2, Sparkles, Clock, CheckCircle, X, AlertCircle, Package, Tag, Layers, IndianRupee, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';
import FlowIndicator, { getFlowStepIndex } from '../components/FlowIndicator'; 

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
  const [sellForm, setSellForm] = useState({ title: '', description: '', price: '', madeFrom: '', quantity: '1' });
  const [sellImage, setSellImage] = useState(null);
  const [sellImagePreview, setSellImagePreview] = useState(null);
  const [isSubmittingSell, setIsSubmittingSell] = useState(false);
  
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
  const isArtisan = userInfo.role === 'artisan';

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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSellFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSellImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSellImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSellImage = () => {
    setSellImage(null);
    setSellImagePreview(null);
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

      {/* 2. PREMIUM SELL ITEM MODAL */}
      <AnimatePresence>
        {isSellModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <div className="bg-white rounded-[2rem] w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[95vh]">
              
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <Package className="w-6 h-6 text-eco" />
                  {isArtisan ? 'List Upcycled Product' : 'List Raw Material'}
                </h2>
                <button onClick={() => { setIsSellModalOpen(false); removeSellImage(); }} className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm transition-colors"><X className="w-5 h-5"/></button>
              </div>

              <div className="p-8 overflow-y-auto space-y-6 custom-scrollbar">
                
                {/* Image Upload Area */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-2">
                    <UploadCloud className="w-4 h-4 text-eco" /> Image *
                  </label>
                  {sellImagePreview ? (
                    <div className="relative inline-block mt-2 p-2 bg-gray-50 border border-gray-200 rounded-xl">
                      <img src={sellImagePreview} alt="Preview" className="h-40 w-40 object-cover rounded-lg shadow-sm" />
                      <button 
                        type="button" onClick={removeSellImage}
                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md transition-colors z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50 hover:border-eco hover:bg-eco/5 transition-colors cursor-pointer relative overflow-hidden group">
                      <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleSellFileChange} />
                      <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-2 group-hover:text-eco transition-colors" />
                      <p className="font-bold text-gray-700 text-sm">Click or drag an image here to upload</p>
                      <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG, JPEG (Max 5MB)</p>
                    </div>
                  )}
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-2">
                      <Tag className="w-4 h-4 text-eco" /> Title *
                    </label>
                    <input type="text" placeholder={isArtisan ? "e.g. Denim Jacket" : "e.g. 5kg Old Newspapers"} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:border-eco outline-none transition-colors" value={sellForm.title} onChange={e => setSellForm({...sellForm, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-2">
                      <Layers className="w-4 h-4 text-eco" /> {isArtisan ? "Made From" : "Material Type"}
                    </label>
                    <input type="text" placeholder={isArtisan ? "e.g. Old Jeans" : "e.g. Paper / Cardboard"} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:border-eco outline-none transition-colors" value={sellForm.madeFrom} onChange={e => setSellForm({...sellForm, madeFrom: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-2">
                      <IndianRupee className="w-4 h-4 text-eco" /> Price (₹) *
                    </label>
                    <input type="number" placeholder="e.g. 150" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:border-eco outline-none transition-colors" value={sellForm.price} onChange={e => setSellForm({...sellForm, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-2">
                      <Package className="w-4 h-4 text-eco" /> Quantity Available *
                    </label>
                    <input type="number" min="1" placeholder="e.g. 1" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:border-eco outline-none transition-colors" value={sellForm.quantity} onChange={e => setSellForm({...sellForm, quantity: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-2">
                    <FileText className="w-4 h-4 text-eco" /> Description
                  </label>
                  <textarea placeholder="Describe the condition, weight, or any details..." rows="3" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:border-eco outline-none transition-colors resize-none" value={sellForm.description} onChange={e => setSellForm({...sellForm, description: e.target.value})}></textarea>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-white">
                <button 
                  onClick={async () => {
                    setIsSubmittingSell(true);
                    const toastId = toast.loading("Publishing...");
                    try {
                      const formData = new FormData();
                      formData.append('image', sellImage);
                      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData);
                      
                      const payload = {
                        sellerId: userInfo._id,
                        listingType: isArtisan ? 'finished_good' : 'raw_material',
                        title: sellForm.title,
                        description: sellForm.description || 'Raw material for upcycling',
                        price: Number(sellForm.price),
                        stock: Number(sellForm.quantity) || 1, // Quantity map ho gaya stock pe
                        imageUrl: uploadRes.data.imageUrl,
                        madeFrom: sellForm.madeFrom || 'Raw Waste' 
                      };

                      await axios.post('http://localhost:5000/api/listings/create', payload);
                      
                      toast.success('Listed successfully on EcoStore!', { id: toastId });
                      setIsSellModalOpen(false);
                      setSellForm({ title: '', description: '', price: '', madeFrom: '', quantity: '1' });
                      removeSellImage();
                    } catch (error) {
                      toast.error('Failed to publish listing', { id: toastId });
                    } finally {
                      setIsSubmittingSell(false);
                    }
                  }}
                  disabled={!sellForm.title || !sellForm.price || !sellImage || isSubmittingSell}
                  className="w-full bg-eco text-white py-4 rounded-xl font-black shadow-lg shadow-eco/30 hover:bg-emerald-600 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmittingSell ? <span className="animate-pulse flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Processing...</span> : <><CheckCircle className="w-5 h-5"/> Publish Listing</>}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. HEADER */}
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
        
        {/* LEFT CARD: PREMIUM AI UPLOAD BOX OR SUGGESTIONS */}
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
            <div 
              onDragOver={handleDragOver} 
              onDragLeave={handleDragLeave} 
              onDrop={handleDrop} 
              onClick={() => fileInputRef.current.click()} 
              className={`flex-1 relative overflow-hidden border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group ${isDragging ? 'border-eco bg-eco/5 scale-[1.02] shadow-inner' : 'border-gray-200 hover:border-eco hover:bg-emerald-50/30 hover:shadow-sm'}`}
            >
              {/* Subtle background gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 pointer-events-none"></div>

              {isAnalyzing ? (
                <div className="text-center z-10">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-amber-200 blur-xl opacity-50 rounded-full animate-pulse"></div>
                    <Sparkles className="w-12 h-12 text-amber-500 animate-bounce mx-auto relative z-10" />
                  </div>
                  <h3 className="font-black text-gray-800 text-lg">AI is analyzing...</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Detecting materials & finding ideas</p>
                </div>
              ) : isUploading ? (
                <div className="text-center z-10">
                  <Loader2 className="w-12 h-12 animate-spin text-eco mx-auto mb-4" />
                  <h3 className="font-bold text-gray-800">Uploading securely...</h3>
                  <p className="text-xs text-gray-500 mt-1">Please wait a moment</p>
                </div>
              ) : (
                <div className="text-center z-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-eco/10 transition-transform duration-300 shadow-sm border border-gray-100 group-hover:border-eco/30">
                    <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-eco transition-colors" />
                  </div>
                  <h3 className="font-black text-gray-800 text-xl mb-2">
                    {isDragging ? 'Drop your image here!' : 'Upload Waste Image'}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mb-6 max-w-[220px] leading-relaxed">
                    Drag & drop or <span className="text-eco font-bold cursor-pointer">browse</span> to get AI upcycling ideas
                  </p>
                  
                  {/* Supported Formats Badge */}
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100/50 px-4 py-2 rounded-xl border border-gray-100">
                    <span>PNG</span> • <span>JPG</span> • <span>Max 5MB</span>
                  </div>
                </div>
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
                const stages = [
                  { key: 'pending_artisan', label: 'Finding' },
                  { key: 'pending_advance', label: 'Quoted' },
                  { key: 'ready_for_pickup', label: 'Paid' },
                  { key: 'picked_up', label: 'Picked' },
                  { key: 'in_progress', label: 'Crafting' },
                  { key: 'completed', label: 'Done' }
                ];

                const currentStageIndex = getFlowStepIndex(order.status);

                const displayTitle = order.selectedProduct?.title || order.suggestedProducts?.[0]?.title || "Custom Item";
                const isActionRequired = order.status === 'pending_advance';
                
                return (
                  <div key={order._id} className="border border-gray-100 p-4 rounded-2xl flex flex-col shadow-sm">
                    <div className="flex gap-3 items-center mb-4">
                      <img src={order.wasteImage} className="w-12 h-12 rounded-lg object-cover border shrink-0" alt="waste" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 truncate">{displayTitle}</h3>
                        <p className="text-[11px] text-gray-500">
                          {order.artisanAssigned ? `Artisan: ${order.artisanAssigned.name}` : 'Finding Artisan...'}
                        </p>
                      </div>
                    </div>

                    <FlowIndicator
                      steps={stages}
                      currentIndex={currentStageIndex}
                      size="sm"
                    />

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      {isActionRequired ? (
                        <div className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Action required
                        </div>
                      ) : order.estimatedTimeline ? (
                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-bold">Ready in {order.estimatedTimeline}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-gray-400 italic">Processing...</div>
                      )}

                      <div className="flex gap-2">
                         {isActionRequired && (
                           <button onClick={() => navigate('/swaps')} className="text-[10px] font-black bg-amber-500 text-white px-3 py-1 rounded-lg shadow-sm">PAY NOW</button>
                         )}
                         <button onClick={() => navigate('/chats')} className={`text-[10px] font-black px-3 py-1 rounded-lg transition-all ${order.artisanAssigned ? 'bg-eco text-white shadow-sm' : 'hidden'}`}>CHAT</button>
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