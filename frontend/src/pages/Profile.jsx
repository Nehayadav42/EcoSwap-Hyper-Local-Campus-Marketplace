const Profile = () => {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-eco-light text-eco flex items-center justify-center text-2xl font-bold">
            RK
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rahul Kumar</h1>
            <p className="text-base text-gray-500">rahul@example.com · Mumbai, Maharashtra</p>
            <div className="flex gap-2 mt-3">
              <span className="bg-eco-light text-eco text-xs font-bold px-3 py-1 rounded-md">Eco member since 2025</span>
              <span className="bg-eco-light text-eco text-xs font-bold px-3 py-1 rounded-md">2.5 kg waste saved</span>
            </div>
          </div>
        </div>
  
        <div className="grid md:grid-cols-2 gap-6">
          {/* Form Settings */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input type="text" defaultValue="Rahul Kumar" className="w-full h-11 border border-gray-300 rounded-lg px-3 text-base focus:border-eco focus:outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input type="email" defaultValue="rahul@example.com" className="w-full h-11 border border-gray-300 rounded-lg px-3 text-base focus:border-eco focus:outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" defaultValue="Mumbai, Maharashtra" className="w-full h-11 border border-gray-300 rounded-lg px-3 text-base focus:border-eco focus:outline-none"/>
              </div>
              <button className="w-full bg-eco text-white h-11 rounded-lg text-base font-semibold hover:bg-eco-dark mt-2">Save Changes</button>
            </div>
          </div>
  
          {/* Stats & Toggles */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">My Eco Impact</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-eco">7</div>
                  <div className="text-sm text-gray-500">Total swaps</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-eco">2.5 kg</div>
                  <div className="text-sm text-gray-500">Waste saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  export default Profile;