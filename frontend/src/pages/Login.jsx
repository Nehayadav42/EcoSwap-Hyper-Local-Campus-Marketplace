import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

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
      const { data } = await api.post('/api/auth/login', {
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
  const handleGoogleLoginSuccess = async (googleData) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/google', { token: googleData.credential });
      
      localStorage.setItem('ecoswap_token', data.token);
      localStorage.setItem('ecoswap_user', JSON.stringify(data.user));
  
      // CHECK THE ROLE
      if (!data.user.role || data.user.role === 'pending') {
        // Naya Google user hai, isko role choose karne bhej do
        navigate('/choose-role');
      } else if (data.user.role === 'artisan') {
        navigate('/artisan-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Google Login failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
            <p className="text-sm text-gray-600 mt-1">
              No account yet?{' '}
              <Link to="/register" className="text-eco font-semibold hover:underline">
                Create one free
              </Link>
            </p>
          </div>

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

        <div className="flex items-center gap-4 my-7">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          <span className="text-sm text-gray-500">or continue with</span>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        {/* The Official Google Button */}
        <div className="flex justify-center">
          <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
            onError={() => toast.error('Google Sign-In was unsuccessful')}
            useOneTap
            shape="rectangular"
            theme="outline"
            size="large"
          />
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          By continuing, you agree to keep EcoSwap respectful and spam-free.
        </p>
        </div>
      </div>
    </div>
  );
};
export default Login;