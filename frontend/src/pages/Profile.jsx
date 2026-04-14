import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Award, Leaf, ShieldCheck, Bell, Camera, Mail } from 'lucide-react';

const Profile = () => {
  // State for interactive toggles
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    marketing: false
  });

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
      className="max-w-5xl mx-auto space-y-8 pb-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* 1. Hero Profile Header (Engaging Gradient) */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative">
        {/* Banner Image / Gradient */}
        <div className="h-32 md:h-48 bg-gradient-to-r from-eco-dark via-eco to-eco-light relative">
          <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-full transition-colors">
            <Camera className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 sm:px-10 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20 relative z-10">
          {/* Avatar with Camera Overlay */}
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-2 shadow-lg">
              <div className="w-full h-full bg-eco-light text-eco rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white">
                RK
              </div>
            </div>
            <div className="absolute inset-2 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* User Info */}
          <div className="text-center md:text-left flex-1 mt-4 md:mt-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">Rahul Kumar</h1>
            <p className="text-base text-gray-600 flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4" /> Mumbai, Maharashtra
            </p>
          </div>
          
          {/* Primary Action */}
          <button className="w-full md:w-auto bg-gray-900 text-white px-8 py-3 rounded-xl text-base font-bold hover:bg-gray-800 transition-colors shadow-md">
            Edit Profile
          </button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Gamification & Stats */}
        <div className="md:col-span-1 md:h-full flex flex-col gap-8">
          
          {/* Badges Earned (New Gamification Feature) */}
          <motion.div variants={itemVariants} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-eco" /> Badges Earned
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-eco-light/50 p-3 rounded-2xl border border-eco-border/50">
                <div className="bg-eco text-white p-3 rounded-xl shadow-sm"><Leaf className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Eco Starter</h3>
                  <p className="text-sm text-gray-500">Completed 5 swaps</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-amber-50 p-3 rounded-2xl border border-amber-200/50">
                <div className="bg-amber-500 text-white p-3 rounded-xl shadow-sm"><ShieldCheck className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Verified User</h3>
                  <p className="text-sm text-gray-500">Identity confirmed</p>
                </div>
              </div>
              {/* Locked Badge to show future progression */}
              <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-200 opacity-60 grayscale">
                <div className="bg-gray-300 text-gray-500 p-3 rounded-xl"><Award className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Planet Savior</h3>
                  <p className="text-sm text-gray-500">Save 10kg waste (Locked)</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Lifetime Impact</h2>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-center min-h-[128px] flex flex-col justify-center">
                <div className="text-3xl font-bold text-eco mb-1">7</div>
                <div className="text-sm font-medium text-gray-500">Swaps Done</div>
              </div>
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-center min-h-[128px] flex flex-col justify-center">
                <div className="text-3xl font-bold text-eco mb-1">2.5<span className="text-lg">kg</span></div>
                <div className="text-sm font-medium text-gray-500">Waste Saved</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Settings & Details */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Account Details Form (Larger Fonts & Inputs) */}
          <motion.div variants={itemVariants} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Details</h2>
            <form className="space-y-6" onSubmit={e => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input type="text" defaultValue="Rahul" className="w-full h-12 border border-gray-300 rounded-xl px-4 text-base text-gray-900 focus:border-eco focus:ring-1 focus:ring-eco focus:outline-none transition-colors bg-gray-50 focus:bg-white"/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input type="text" defaultValue="Kumar" className="w-full h-12 border border-gray-300 rounded-xl px-4 text-base text-gray-900 focus:border-eco focus:ring-1 focus:ring-eco focus:outline-none transition-colors bg-gray-50 focus:bg-white"/>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" defaultValue="rahul@example.com" className="w-full h-12 border border-gray-300 rounded-xl pl-12 pr-4 text-base text-gray-900 focus:border-eco focus:ring-1 focus:ring-eco focus:outline-none transition-colors bg-gray-50 focus:bg-white"/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">City & State</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" defaultValue="Mumbai, Maharashtra" className="w-full h-12 border border-gray-300 rounded-xl pl-12 pr-4 text-base text-gray-900 focus:border-eco focus:ring-1 focus:ring-eco focus:outline-none transition-colors bg-gray-50 focus:bg-white"/>
                </div>
              </div>
              
              <button className="bg-eco text-white px-8 py-3 rounded-xl text-base font-bold hover:bg-eco-dark transition-colors shadow-sm">
                Save Changes
              </button>
            </form>
          </motion.div>

          {/* Notifications (Interactive Custom Toggles) */}
          <motion.div variants={itemVariants} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bell className="w-6 h-6 text-gray-400" /> Notification Preferences
            </h2>
            <div className="space-y-2">
              
              {/* Toggle Item 1 */}
              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100" onClick={() => setNotifications({...notifications, email: !notifications.email})}>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Email Updates</h3>
                  <p className="text-sm text-gray-500">Order status and chat messages</p>
                </div>
                <div className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${notifications.email ? 'bg-eco' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${notifications.email ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Toggle Item 2 */}
              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100" onClick={() => setNotifications({...notifications, sms: !notifications.sms})}>
                <div>
                  <h3 className="text-base font-bold text-gray-900">SMS Alerts</h3>
                  <p className="text-sm text-gray-500">Delivery tracking and pickup times</p>
                </div>
                <div className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${notifications.sms ? 'bg-eco' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${notifications.sms ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>

            </div>
          </motion.div>
          
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;