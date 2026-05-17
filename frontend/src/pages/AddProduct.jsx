import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Package, UploadCloud, IndianRupee, Tag, FileText, Layers, CheckCircle, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '1',
    material: ''
  });
  
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProductImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !productImage) {
      return toast.error("Please fill all required fields and upload an image!");
    }

    setIsLoading(true);
    const toastId = toast.loading("Uploading image to Cloudinary...");

    try {
      // STEP 1: Pehle Image ko Cloudinary par bhejo
      const imageFormData = new FormData();
      imageFormData.append('image', productImage); 
      
      const uploadRes = await axios.post('http://localhost:5000/api/upload', imageFormData);
      const finalImageUrl = uploadRes.data.imageUrl; 

      toast.loading("Publishing product details...", { id: toastId });

      // 🔥 STEP 2: PERFECT PAYLOAD (Schema ke hisaab se) 🔥
      const payload = {
        sellerId: userInfo._id,
        listingType: 'finished_good', 
        title: formData.title,
        description: formData.description || 'Upcycled Masterpiece', 
        price: Number(formData.price),
        stock: Number(formData.quantity) || 1, // 'quantity' ko 'stock' mein badla
        madeFrom: formData.material || 'Mixed Recycled Materials', // 'material' ko 'madeFrom' kiya
        imageUrl: finalImageUrl
      };

      // 🔥 CORRECT ENDPOINT 🔥
      await axios.post('http://localhost:5000/api/listings/create', payload);

      toast.success("Masterpiece listed successfully!", { id: toastId });
      navigate('/explore'); 
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to list product. Check console.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* HEADER */}
      <div className="bg-gray-900 p-8 rounded-t-[2rem] text-white flex items-center gap-4">
        <div className="bg-eco/20 p-3 rounded-2xl border border-eco/30">
          <Package className="w-8 h-8 text-eco" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">List Your Masterpiece</h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">Add details of your upcycled product for the community to buy.</p>
        </div>
      </div>

      {/* FORM AREA */}
      <div className="bg-white p-8 rounded-b-[2rem] border border-gray-100 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* IMAGE UPLOAD ZONE */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-2">
              <UploadCloud className="w-4 h-4 text-eco" /> Product Image *
            </label>
            
            {imagePreview ? (
              <div className="relative inline-block mt-4 p-2 bg-gray-50 border border-gray-200 rounded-xl">
                <img src={imagePreview} alt="Preview" className="h-40 w-40 object-cover rounded-lg shadow-sm" />
                <button 
                  type="button" onClick={removeImage}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50 hover:border-eco hover:bg-eco/5 transition-colors cursor-pointer relative group">
                <input 
                  type="file" accept="image/*" onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <UploadCloud className="w-12 h-12 text-gray-400 mx-auto group-hover:text-eco" />
                <p className="mt-3 text-sm font-medium text-gray-600">Click or drag an image here to upload</p>
                <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG, JPEG (Max 5MB)</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TITLE */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-2">
                <Tag className="w-4 h-4 text-eco" /> Product Title *
              </label>
              <input 
                type="text" name="title" value={formData.title} onChange={handleChange}
                placeholder="e.g. Woven Rugs & Mats" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:border-eco outline-none transition-colors"
              />
            </div>

            {/* MATERIAL USED */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-2">
                <Layers className="w-4 h-4 text-eco" /> Material Used
              </label>
              <input 
                type="text" name="material" value={formData.material} onChange={handleChange}
                placeholder="e.g. Old Cotton Clothes" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:border-eco outline-none transition-colors"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-2">
                <IndianRupee className="w-4 h-4 text-eco" /> Price (₹) *
              </label>
              <input 
                type="number" name="price" value={formData.price} onChange={handleChange}
                placeholder="e.g. 299" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:border-eco outline-none transition-colors"
              />
            </div>

            {/* QUANTITY */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-2">
                <Package className="w-4 h-4 text-eco" /> Quantity Available *
              </label>
              <input 
                type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1"
                placeholder="e.g. 5" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:border-eco outline-none transition-colors"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-2">
              <FileText className="w-4 h-4 text-eco" /> Description
            </label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange}
              rows="4" placeholder="Tell buyers about how you upcycled this masterpiece..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:border-eco outline-none transition-colors resize-none"
            />
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full bg-eco text-white font-black py-4 rounded-xl hover:bg-emerald-600 transition-all flex justify-center items-center gap-2 shadow-lg shadow-eco/30 disabled:opacity-70"
          >
            {isLoading ? <span className="animate-pulse flex items-center gap-2"><Loader2 className='animate-spin w-5 h-5'/> Processing...</span> : <><CheckCircle className="w-5 h-5" /> Publish to Marketplace</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;