import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, Sprout, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, googleLogin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, name, phone);
      toast.success('Account created! Welcome to AgriSaar family!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await googleLogin();
    } catch (error) {
      toast.error('Google signup failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] dark:bg-gray-950 flex items-center justify-center p-4 sm:p-8 transition-colors duration-500">
      <Helmet>
        <title>Join AgriSaar — Free AI Farming Account for Kisaan</title>
        <meta name="description" content="Create your free AgriSaar account and unlock AI-powered smart farming tools." />
      </Helmet>
      
      <div className="max-w-6xl w-full bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse border border-gray-100 dark:border-gray-800">
        
        {/* Right Side - Farming Theme Image */}
        <div className="md:w-5/12 bg-primary-700 relative overflow-hidden flex flex-col justify-between p-10 text-white min-h-[200px] md:min-h-[650px]">
          <div className="relative z-10 text-right">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8 group justify-end">
              <span className="text-2xl font-black tracking-tight">AgriSaar</span>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <Sprout className="w-6 h-6 text-white" />
              </div>
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Join the<br />Smart Farming<br />Revolution
            </h1>
            <p className="text-primary-100 text-lg font-medium leading-relaxed hidden md:block ml-auto max-w-xs">
              Access India's most advanced AI platform. 11+ modules, 50+ crops, unlimited AI analysis.
            </p>
          </div>
          
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/40 to-transparent"></div>
        </div>

        {/* Left Side - Form */}
        <div className="md:w-7/12 p-8 md:p-14 flex flex-col justify-center bg-white dark:bg-gray-900">
          <div className="max-w-lg w-full mx-auto">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Create Free Account</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">Join thousands of farmers optimizing their yield.</p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Kisan Name"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all font-medium text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all font-medium text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all font-medium text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all font-medium text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Register Now
                      <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="px-3 bg-white dark:bg-gray-900 text-gray-400">Or register with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignup}
                disabled={loading}
                className="w-full py-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 text-gray-700 dark:text-gray-200 rounded-xl font-bold transition-all flex items-center justify-center gap-3 group active:scale-[0.98] shadow-sm text-sm"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                Sign up with Google
              </button>
            </div>

            <p className="mt-8 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-black text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:underline underline-offset-2">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
