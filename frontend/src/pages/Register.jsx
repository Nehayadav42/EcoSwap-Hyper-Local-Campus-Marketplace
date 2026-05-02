import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  
  // OTP States
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState('');

  // 1. Manual Signup Submit Handler (Step 1)
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', formData);
      toast.success(data.message);
      setShowOtpScreen(true); // Form hide karo, OTP screen dikhao
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // 2. OTP Submit Handler (Step 2)
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/verify-otp', {
        email: formData.email,
        otp: otp
      });
      
      localStorage.setItem('ecoswap_token', data.token);
      localStorage.setItem('ecoswap_user', JSON.stringify(data.user));
      
      toast.success('Email Verified & Logged In!');
      
      if (data.user.role === 'artisan') {
        navigate('/artisan-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // 3. Google Auth Logic
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await api.post('/api/auth/google', {
        tokenId: credentialResponse.credential,
        role: formData.role // Form ka role Google ke sath bhej rahe hain!
      });
      
      localStorage.setItem('ecoswap_token', data.token);
      localStorage.setItem('ecoswap_user', JSON.stringify(data));
      
      toast.success('Account created and logged in with Google!');
      
      if (data.role === 'artisan') {
        navigate('/artisan-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Google sign up failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl rounded-2xl p-8">
          
          {/* OTP SCREEN UI */}
          {showOtpScreen ? (
            <div className="text-center animate-in fade-in zoom-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
              <p className="text-sm text-gray-600 mb-6">
                We've sent a 6-digit OTP to <span className="font-semibold">{formData.email}</span>
              </p>
              
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <input 
                  type="text" 
                  maxLength="6"
                  required
                  placeholder="Enter 6-digit OTP" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full h-12 text-center text-2xl tracking-[0.5em] border border-gray-300 rounded-lg focus:border-eco focus:ring-1 focus:ring-eco outline-none"
                />
                <button 
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full bg-eco text-white h-12 rounded-lg text-base font-semibold hover:bg-eco-dark transition-colors disabled:opacity-50 mt-4"
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Login'}
                </button>
              </form>
              <button onClick={() => setShowOtpScreen(false)} className="text-sm text-gray-500 hover:text-gray-800 mt-4 underline">
                Back to registration
              </button>
            </div>
          ) : (

          /* REGISTRATION FORM UI */
          <>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
              <p className="text-sm text-gray-600 mt-1">
                Already a member?{' '}
                <Link to="/login" className="text-eco font-semibold hover:underline">
                  Sign in instead
                </Link>
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSignupSubmit}>
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Join As</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value="user" 
                      checked={formData.role === 'user'} 
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="text-eco focus:ring-eco"
                    />
                    <span className="text-sm">Eco-Warrior (User)</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value="artisan" 
                      checked={formData.role === 'artisan'} 
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="text-eco focus:ring-eco"
                    />
                    <span className="text-sm">Artisan / Creator</span>
                  </label>
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-eco text-white h-12 rounded-lg text-base font-semibold hover:bg-eco-dark transition-colors mt-4 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account →'}
              </button>
            </form>

            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <span className="text-sm text-gray-500">or sign up with</span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google Sign-Up was unsuccessful')}
                shape="rectangular"
                theme="outline"
                size="large"
                text="signup_with" 
              />
            </div>
          </>
          )}

        </div>
      </div>
    </div>
  );
};
export default Register;