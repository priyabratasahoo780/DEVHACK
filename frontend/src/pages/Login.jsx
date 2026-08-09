import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sprout, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(identifier, password);
      toast.success('Successfully logged in! Welcome back, Kisaan!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await googleLogin();
    } catch (error) {
      toast.error('Google login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] dark:bg-gray-950 flex items-center justify-center p-4 sm:p-8 transition-colors duration-500">
      <Helmet>
        <title>Login — Access Your AgriSaar Dashboard</title>
        <meta name="description" content="Sign in to your AgriSaar account to access personalized crop recommendations, soil reports, weather alerts, and smart farming tools." />
      </Helmet>
      
      <div className="max-w-6xl w-full bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-800">
        
        {/* Left Side - Farming Theme Image */}
        <div className="md:w-5/12 bg-primary-600 relative overflow-hidden flex flex-col justify-between p-10 text-white min-h-[250px] md:min-h-[650px]">
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8 group">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">AgriSaar</span>
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Your Digital<br />Farming Companion
            </h1>
            <p className="text-primary-100 text-lg font-medium max-w-sm leading-relaxed hidden md:block">
              Log in to get personalized soil analysis, weather updates, and crop advice designed just for your farm.
            </p>
          </div>
          
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/40 to-transparent"></div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-7/12 p-8 md:p-14 flex flex-col justify-center bg-white dark:bg-gray-900">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Welcome Back, Farmer!</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">Please enter your details to sign in.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 mb-1.5">Mobile / Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-900 dark:text-white"
                    placeholder="Email or Mobile Number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 mb-1.5">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-900 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 bg-white dark:bg-gray-800" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">Remember me</span>
                </label>
                <button type="button" className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-lg shadow-primary-600/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Dashboard'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="px-3 bg-white dark:bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-bold transition-all active:scale-[0.98]"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                Sign in with Google
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const mockUser = { email: 'demo@agrisaar.com', user_metadata: { full_name: 'Demo Farmer' } };
                  localStorage.setItem('agrisaar_demo_user', JSON.stringify(mockUser));
                  toast.success('Demo mode activated!');
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                }}
                className="w-full flex items-center justify-center gap-3 bg-gray-100 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-bold transition-all active:scale-[0.98]"
              >
                Continue as Demo User
              </button>
            </div>

            <p className="mt-8 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
              New to AgriSaar?{' '}
              <Link to="/signup" className="font-black text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:underline underline-offset-2">
                Create Free Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
