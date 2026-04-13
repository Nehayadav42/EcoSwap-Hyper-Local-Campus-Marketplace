import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-56px)] overflow-hidden px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-eco/35 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-300/35 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-lg rounded-2xl border border-white/70 bg-white/90 p-8 shadow-xl backdrop-blur-md sm:p-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
        <p className="text-base text-gray-600 mb-8">
          Already a member? <Link to="/login" className="text-eco font-semibold hover:underline">Sign in instead</Link>
        </p>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full name</label>
            <input
              type="text"
              placeholder="Rahul Kumar"
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-base text-gray-900 focus:outline-none focus:border-eco focus:ring-1 focus:ring-eco transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
            <input
              type="email"
              placeholder="rahul@example.com"
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-base text-gray-900 focus:outline-none focus:border-eco focus:ring-1 focus:ring-eco transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
            <input
              type="text"
              placeholder="Mumbai, Maharashtra"
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-base text-gray-900 focus:outline-none focus:border-eco focus:ring-1 focus:ring-eco transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-base text-gray-900 focus:outline-none focus:border-eco focus:ring-1 focus:ring-eco transition-colors"
            />
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-eco text-white h-12 rounded-lg text-base font-semibold hover:bg-eco-dark transition-colors mt-4"
          >
            Create account →
          </button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          <span className="text-sm text-gray-500">or sign up with</span>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        <button className="w-full bg-white border border-gray-300 text-gray-700 h-12 rounded-lg text-base font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
};
export default Register;