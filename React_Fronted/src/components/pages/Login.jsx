import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const identifier = formData.identifier.trim();
      await login({ identifier, password: formData.password });
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#E8F1FF] via-[#F0F6FF] to-[#E8F1FF] font-sans">
      
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-blue-100 transition-all duration-500 animate-in fade-in zoom-in duration-500">
        <div className="grid md:grid-cols-2 min-h-[600px]">

          {/* Left Side - Brand Visual */}
          <div className="hidden md:flex bg-gradient-to-br from-[#1A5EDB] to-[#0F4BA8] text-white px-10 py-12 flex-col justify-center items-center relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-20%] left-[-20%] w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col gap-6 justify-center items-center text-center">
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                <img src="/images/Logo-circle.png" className="w-32 h-auto drop-shadow-xl" alt="Bharat Suraksha Logo" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2 drop-shadow-md">Bharat Suraksha</h1>
                <p className="text-blue-100 text-lg font-medium max-w-xs mx-auto leading-relaxed">
                  Your trusted partner for comprehensive insurance protection.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="px-6 sm:px-10 md:px-16 py-12 bg-white flex flex-col justify-center">
            
            {/* Mobile Brand Header */}
            <div className="flex md:hidden items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                <img src="/images/Logo-circle.png" className="w-8 brightness-200" alt="Logo"/>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Welcome to</p>
                <h1 className="text-xl font-black text-slate-800">Bharat Suraksha</h1>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Welcome Back! 👋</h2>
              <p className="text-slate-500 text-sm">Please login to access your dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Policy Number / Email / Mobile <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="Enter your Policy Number (e.g. BS-PARI-2026-1234)" 
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password" 
                    autoComplete="current-password"
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium pr-14 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-4 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wide"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-500 font-medium">Remember me</span>
                </label>
                <Link to="#" className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <div className="space-y-3 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full rounded-xl bg-[#1A5EDB] hover:bg-[#0F4BA8] text-white font-bold py-3.5 shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? 'opacity-80 cursor-wait' : ''}`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Logging In...
                    </>
                  ) : (
                    "Login Securely"
                  )}
                </button>

                <button 
                  type="button" 
                  className="w-full rounded-xl border-2 border-slate-200 text-slate-600 font-bold py-3.5 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
                >
                  Login with OTP
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500 mb-2">New to Bharat Suraksha?</p>
              <Link 
                to="/plans" 
                className="inline-flex items-center gap-2 text-blue-600 font-black text-lg hover:text-blue-800 transition-colors group"
              >
                Get a Quote <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;