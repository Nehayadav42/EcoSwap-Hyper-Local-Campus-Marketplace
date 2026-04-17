import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Manual Login Logic
  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      // Token ko localStorage mein save karo
      localStorage.setItem('ecoswap_token', data.token);
      localStorage.setItem('ecoswap_user', JSON.stringify(data));
      
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Google Login Logic
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/google', {
        tokenId: credentialResponse.credential
      });
      
      localStorage.setItem('ecoswap_token', data.token);
      localStorage.setItem('ecoswap_user', JSON.stringify(data));
      
      toast.success('Successfully logged in with Google!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Google login failed. Please try again.');
    }
  };

  return (
    <div className="grid md:grid-cols-2 min-h-[calc(100vh-56px)]">
      {/* Left Side Banner (Same as before) */}
      <div className="bg-eco p-12 flex flex-col justify-between hidden md:flex">
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">Welcome back to EcoSwap</h2>
          <p className="text-lg text-eco-border leading-relaxed">Continue your journey of turning waste into wonderful creations.</p>
        </div>
        <div className="text-4xl font-bold text-eco-border">
          840 kg<span className="block text-base font-normal mt-2">waste diverted this month</span>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="bg-white p-12 flex flex-col justify-center max-w-lg mx-auto w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
        <p className="text-base text-gray-600 mb-8">
          No account yet? <Link to="/register" className="text-eco font-semibold hover:underline">Create one free</Link>
        </p>

        <form className="space-y-5" onSubmit={handleManualLogin}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="rahul@example.com" 
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-base focus:border-eco focus:ring-1 focus:ring-eco outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••" 
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-base focus:border-eco focus:ring-1 focus:ring-eco outline-none transition-colors"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-eco text-white h-12 rounded-lg text-base font-semibold hover:bg-eco-dark transition-colors mt-4 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          <span className="text-sm text-gray-500">or continue with</span>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        {/* The Official Google Button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google Sign-In was unsuccessful')}
            useOneTap
            shape="rectangular"
            theme="outline"
            size="large"
          />
        </div>
      </div>
    </div>
  );
};
export default Login;