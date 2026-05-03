import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  MessageSquare, 
  UploadCloud, 
  X, 
  Loader2,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ArtisanDashboard = () => {
  const navigate = useNavigate();
  const [newRequests, setNewRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- SELL MODAL STATES ---
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellForm, setSellForm] = useState({ title: '', description: '', price: '', madeFrom: '' });
  const [sellImage, setSellImage] = useState(null);
  const [isSubmittingSell, setIsSubmittingSell] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Fetching pending requests for artisans to accept
        const { data } = await axios.get('http://localhost:5000/api/swaps/history');
        setNewRequests(data.filter(req => req.status === 'pending_artisan'));
      } catch (error) {
        console.error("Error fetching requests", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/swaps/${orderId}/status`, {
        status: 'accepted',
        artisanId: userInfo._id
      });
      toast.success("Order accepted! Check 'Accepted Orders' tab.");
      setNewRequests(newRequests.filter(req => req._id !== orderId));
    } catch (error) {
      toast.error("Failed to accept order.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* 1. SELL MODAL (Same as User Dashboard) */}
      <AnimatePresence>
        {isSellModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">List Upcycled Masterpiece</h2>
                <button onClick={() => setIsSellModalOpen(false)} className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm"><X className="w-5 h-5"/></button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-eco hover:bg-eco-light/10 transition-colors cursor-pointer relative">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setSellImage(e.target.files[0])} />
                  {sellImage ? (
                    <p className="font-bold text-eco text-sm">Selected: {sellImage.name}</p>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="font-bold text-gray-700 text-sm">Upload masterpiece image</p>
                    </>
                  )}
                </div>

                <input type="text" placeholder="Product Title" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-eco focus:bg-white text-sm" value={sellForm.title} onChange={e => setSellForm({...sellForm, title: e.target.value})} />
                <textarea placeholder="Describe how you upcycled this..." rows="3" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-eco focus:bg-white text-sm" value={sellForm.description} onChange={e => setSellForm({...sellForm, description: e.target.value})}></textarea>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500 font-bold">₹</span>
                    <input type="number" placeholder="Price" className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-eco text-sm" value={sellForm.price} onChange={e => setSellForm({...sellForm, price: e.target.value})} />
                  </div>
                  <input type="text" placeholder="Material (e.g. Scrap Metal)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-eco text-sm" value={sellForm.madeFrom} onChange={e => setSellForm({...sellForm, madeFrom: e.target.value})} />
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-white">
                <button 
                  onClick={async () => {
                    setIsSubmittingSell(true);
                    try {
                      const formData = new FormData();
                      formData.append('image', sellImage);
                      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData);

                      const payload = {
                        sellerId: userInfo._id,
                        listingType: 'finished_good',
                        title: sellForm.title,
                        description: sellForm.description,
                        price: Number(sellForm.price),
                        imageUrl: uploadRes.data.imageUrl,
                        madeFrom: sellForm.madeFrom
                      };

                      await axios.post('http://localhost:5000/api/listings/create', payload);
                      toast.success('Product live in Explore page!');
                      setIsSellModalOpen(false);
                      setSellForm({ title: '', description: '', price: '', madeFrom: '' });
                      setSellImage(null);
                    } catch (error) {
                      toast.error('Failed to list product');
                    } finally {
                      setIsSubmittingSell(false);
                    }
                  }}
                  disabled={!sellForm.title || !sellForm.price || !sellImage || isSubmittingSell}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-eco transition-all disabled:opacity-50 flex justify-center"
                >
                  {isSubmittingSell ? <Loader2 className="w-5 h-5 animate-spin" /> : 'List for Sale'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HEADER WITH SELL BUTTON */}
      <div className="flex justify-between items-center bg-gray-900 p-8 rounded-[2rem] text-white shadow-xl">
        <div>
          <h1 className="text-3xl font-black tracking-tight italic uppercase">Artisan Workspace</h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">Manage custom orders or list your own creations.</p>
        </div>
        <button 
          onClick={() => setIsSellModalOpen(true)}
          className="bg-white text-gray-900 px-6 py-3 rounded-2xl font-black text-sm hover:bg-eco hover:text-white transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Sell Masterpiece
        </button>
      </div>

      {/* 3. NEW REQUESTS SECTION */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" /> New Upcycle Requests
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-eco" /></div>
        ) : newRequests.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No new requests in your area yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newRequests.map((req) => (
              <div key={req._id} className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-4 mb-4">
                  <img src={req.wasteImage} className="w-24 h-24 rounded-2xl object-cover border" alt="waste" />
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight mb-1">{req.selectedProduct?.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-3">{req.selectedProduct?.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleAcceptOrder(req._id)}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-eco transition-all shadow-md"
                >
                  Accept Order
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanDashboard;