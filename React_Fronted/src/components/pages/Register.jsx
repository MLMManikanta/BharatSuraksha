import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    // Basic client-side validation for name
    const name = (formData.name || "").trim();
    if (!name || name.length < 2 || name.length > 50) {
      setError("Full Name is required (2-50 characters)");
      setLoading(false);
      return;
    }

    const payload = {
      name,
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      mobile: formData.mobileNumber.trim(),
    };

    const res = await api.post("/register", payload);

    setSuccess("Registration successful.");
  } catch (err) {
    console.error("REGISTER ERROR:", err.response?.data || err.message);
    setError(err.response?.data?.error || "Registration failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#E8F1FF] via-[#F0F6FF] to-[#E8F1FF] font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-blue-100 transition-all duration-500 animate-in fade-in zoom-in duration-500">
        <div className="grid md:grid-cols-2 min-h-[640px]">
          <div className="hidden md:flex bg-gradient-to-br from-[#1A5EDB] to-[#0F4BA8] text-white px-10 py-12 flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-20%] w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col gap-6 justify-center items-center text-center">
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                <img src="/images/Logo-circle.png" className="w-32 h-auto drop-shadow-xl" alt="Bharat Suraksha Logo" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2 drop-shadow-md">Bharat Suraksha</h1>
                <p className="text-blue-100 text-lg font-medium max-w-xs mx-auto leading-relaxed">
                  Create your account to access claims, utilities, and policy services.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 sm:px-10 md:px-16 py-12 bg-white flex flex-col justify-center">
            <div className="flex md:hidden items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                <img src="/images/Logo-circle.png" className="w-8 brightness-200" alt="Logo" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Welcome to</p>
                <h1 className="text-xl font-black text-slate-800">Bharat Suraksha</h1>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Create your account ✅</h2>
              <p className="text-slate-500 text-sm">Create an account to continue with your policy journey.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {success}
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/login', { state: { from: location.state?.from || '/plans' } })}
                      className="px-3 py-1 bg-white border border-slate-200 text-slate-800 rounded-xl text-sm font-bold"
                    >
                      Proceed to Login
                    </button>
                  </div>
                </div>
              )}

              {/* Policy Number removed from registration so users can create an account without one */}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  required
                />

                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mt-3">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="+91XXXXXXXXXX"
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  required
                />
              </div>

              <div className="space-y-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full rounded-xl bg-[#1A5EDB] hover:bg-[#0F4BA8] text-white font-bold py-3.5 shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? "opacity-80 cursor-wait" : ""}`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500 mb-2">Already registered?</p>
              <Link
                to="/login"
                state={{ from: location.state?.from || '/plans' }}
                className="inline-flex items-center gap-2 text-blue-600 font-black text-lg hover:text-blue-800 transition-colors group"
              >
                Login <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
