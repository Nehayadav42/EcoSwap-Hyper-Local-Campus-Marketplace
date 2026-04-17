import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Manual Registration Logic
  const handleManualRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend ko data bhej rahe hain
      const { data } = await axios.post('http://localhost:5000/api/auth/register', formData);
      toast.success(data.message);
      
      // Register hone ke baad user ko Login page par bhej do
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Google Auth Logic (Same as Login)
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/google', {
        tokenId: credentialResponse.credential
      });
      
      localStorage.setItem('ecoswap_token', data.token);
      localStorage.setItem('ecoswap_user', JSON.stringify(data));
      
      toast.success('Account created and logged in with Google!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Google sign up failed. Please try again.');
    }
  };

  return (
    <div className="grid md:grid-cols-2 min-h-[calc(100vh-56px)]">
      {/* Left Side Banner */}
      <div className="bg-eco p-12 flex flex-col justify-between hidden md:flex">
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">Join the EcoSwap community</h2>
          <p className="text-lg text-eco-border leading-relaxed">Every swap you make keeps waste out of landfills.</p>
        </div>
        <div className="text-4xl font-bold text-eco-border">
          320+<span className="block text-base font-normal mt-2">verified artisans ready to help</span>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="bg-white p-12 flex flex-col justify-center max-w-lg mx-auto w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
        <p className="text-base text-gray-600 mb-8">
          Already a member? <Link to="/login" className="text-eco font-semibold hover:underline">Sign in instead</Link>
        </p>

        <form className="space-y-4" onSubmit={handleManualRegister}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full name</label>
            <input 
              type="text" 
              required
              placeholder="Rahul Kumar" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-base focus:border-eco focus:ring-1 focus:ring-eco outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
            <input 
              type="email" 
              required
              placeholder="rahul@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-base focus:border-eco focus:ring-1 focus:ring-eco outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              placeholder="Create a strong password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-base focus:border-eco focus:ring-1 focus:ring-eco outline-none"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-eco text-white h-12 rounded-lg text-base font-semibold hover:bg-eco-dark transition-colors mt-4 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account →'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          <span className="text-sm text-gray-500">or sign up with</span>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        {/* The Google Button on Register Page */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google Sign-Up was unsuccessful')}
            shape="rectangular"
            theme="outline"
            size="large"
            text="signup_with" // Yeh button ka text "Sign up with Google" kar dega
          />
        </div>
      </div>
    </div>
  );
};
export default Register;