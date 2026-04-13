import { Link } from 'react-router-dom';
import { Leaf, UploadCloud, ArrowRight, Star } from 'lucide-react';

const Landing = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div id="products" className="max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-14 items-center border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-2 bg-eco-light rounded-full px-4 py-2 mb-5">
            <Leaf className="w-4 h-4 text-eco" />
            <span className="text-sm font-semibold text-eco">12,400+ swaps completed today</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900 mb-5">
            Turn your waste into <br/><em className="not-italic text-eco">beautiful products</em>
          </h1>
          <p className="text-base text-gray-600 leading-relaxed mb-9">
            Upload a photo of your old materials — our AI matches you with skilled local artisans who transform them into something you'll love and use every day.
          </p>
          <div className="flex gap-3">
            <Link to="/register" className="bg-eco text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-eco-dark transition-colors">
              Start swapping →
            </Link>
          </div>
        </div>

        {/* Upload Card Visual */}
        <div className="bg-eco-card rounded-2xl p-7 border border-eco-border shadow-sm">
          <div className="border-2 border-dashed border-eco-border rounded-xl p-10 flex flex-col items-center gap-2 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            <UploadCloud className="w-9 h-9 text-eco" />
            <p className="text-sm font-semibold text-gray-900">Tap to upload waste photo</p>
            <span className="text-sm text-gray-500 text-center">AI will identify your material and suggest the best upcycled products</span>
          </div>
          <div className="mt-4 bg-eco-light rounded-lg p-3.5 text-sm text-eco-dark font-medium flex items-center gap-2">
             <span className="animate-pulse">✦</span> AI scanning... Denim detected — 3 artisans available nearby
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 max-w-5xl mx-auto border-b border-gray-100 py-10">
        <div className="text-center border-r border-gray-100">
          <div className="text-3xl font-bold text-eco">12,400+</div>
          <div className="text-sm text-gray-500">Swaps completed</div>
        </div>
        <div className="text-center border-r border-gray-100">
          <div className="text-3xl font-bold text-eco">840 kg</div>
          <div className="text-sm text-gray-500">Waste diverted</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-eco">320+</div>
          <div className="text-sm text-gray-500">Verified artisans</div>
        </div>
      </div>

      {/* Steps Section */}
      <div id="how-it-works" className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-xs font-bold text-eco uppercase tracking-widest mb-1">How it works</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Three steps to a greener home</h2>
          <p className="text-sm text-gray-600 mb-8">No hassle, no guesswork — just upload and let us handle the rest.</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Upload your waste', desc: 'Snap a photo of old clothes, packaging, or scrap. Our AI identifies the material type instantly.' },
              { num: '02', title: 'Match with an artisan', desc: 'We connect you with a verified local craftsperson who specialises in your material.' },
              { num: '03', title: 'Receive your product', desc: 'Track upcycling live and get your brand-new creation delivered to your door.' }
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <span className="inline-block bg-eco-light text-eco text-xs font-bold px-2 py-1 rounded-md mb-3">{step.num}</span>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="about" className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">About EcoSwap</h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            EcoSwap helps local communities reduce waste by connecting usable materials with artisans
            who transform them into practical products.
          </p>
        </div>
      </div>
    </div>
  );
};
export default Landing;