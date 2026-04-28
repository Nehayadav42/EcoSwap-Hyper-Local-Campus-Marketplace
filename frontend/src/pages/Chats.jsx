import { Send } from 'lucide-react';

const Chats = () => {
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
  const firstName = userInfo?.name?.split(' ')[0] || 'there';

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-120px)] bg-white rounded-xl border border-gray-200 shadow-sm flex overflow-hidden">
      
      {/* Sidebar for Chat List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Active Chat Contact */}
          <div className="p-4 border-b border-gray-100 bg-eco-light cursor-pointer">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-full bg-eco text-white flex items-center justify-center font-bold text-sm shrink-0">MC</div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Meera Craft Studio</h3>
                <p className="text-sm text-eco-dark truncate">Your bag is 70% done!</p>
              </div>
            </div>
          </div>
          
          {/* Inactive Chat Contact */}
          <div className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm shrink-0">RG</div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Ravi Glassworks</h3>
                <p className="text-sm text-gray-500 truncate">Delivered! Hope you love it</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-eco text-white flex items-center justify-center font-bold text-xs shrink-0">MC</div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Meera Craft Studio</h3>
            <p className="text-xs text-eco font-medium">Online — currently working on your tote bag</p>
          </div>
        </div>

        {/* Chat Bubbles */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="max-w-[70%] bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-sm shadow-sm">
            <p className="text-base text-gray-800">Hello {firstName}! I just received your denim package. Beautiful quality fabric - this will make a wonderful tote bag.</p>
            <span className="text-xs text-gray-400 mt-2 block">10:30 AM</span>
          </div>
          
          <div className="max-w-[70%] bg-eco text-white p-4 rounded-2xl rounded-tr-sm shadow-sm ml-auto">
            <p className="text-base">That is great to hear! How long will the upcycling take?</p>
            <span className="text-xs text-eco-light mt-2 block text-right">10:32 AM</span>
          </div>

          <div className="max-w-[70%] bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-sm shadow-sm">
            <p className="text-base text-gray-800">About 2 more days. I'll send you progress photos at each stage. Your bag is 70% complete right now!</p>
            <span className="text-xs text-gray-400 mt-2 block">10:35 AM</span>
          </div>
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-white border-t border-gray-200 flex gap-3">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 h-12 border border-gray-300 rounded-lg px-4 text-base focus:outline-none focus:border-eco"
          />
          <button className="w-12 h-12 bg-eco text-white rounded-lg flex items-center justify-center hover:bg-eco-dark transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Chats;