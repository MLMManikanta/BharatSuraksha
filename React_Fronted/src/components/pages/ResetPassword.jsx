import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../utils/api";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) setToken(tokenFromUrl);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/reset-password", { token: token.trim(), password });
      setSuccess(res.message || "Password updated successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1600);
    } catch (err) {
      setError(err.data?.error || err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#E8F1FF] via-[#F0F6FF] to-[#E8F1FF] font-sans">
      <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-blue-100 transition-all duration-500 animate-in fade-in zoom-in duration-500">
        <div className="grid md:grid-cols-2 min-h-[520px]">
          <div className="hidden md:flex bg-gradient-to-br from-[#1A5EDB] to-[#0F4BA8] text-white px-10 py-12 flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-20%] w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col gap-6 justify-center items-center text-center">
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                <img
                  src="/BharatSuraksha/images/Logo-circle.png"
                  className="w-28 h-auto drop-shadow-xl"
                  alt="Bharat Suraksha Logo"
                />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2 drop-shadow-md">
                  Bharat Suraksha
                </h1>
                <p className="text-blue-100 text-lg font-medium max-w-xs mx-auto leading-relaxed">
                  Create a new password to secure your account.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 sm:px-10 md:px-16 py-12 bg-white flex flex-col justify-center">
            <div className="flex md:hidden items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                <img src="/BharatSuraksha/images/Logo-circle.png" className="w-8 brightness-200" alt="Logo" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Welcome to
                </p>
                <h1 className="text-xl font-black text-slate-800">Bharat Suraksha</h1>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Reset password</h2>
              <p className="text-slate-500 text-sm">Enter the reset token and your new password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                  <p className="font-bold">{success}</p>
                </div>
              )}

              {!searchParams.get("token") && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Reset token <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste the reset token"
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  New password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a new password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Confirm password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
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
                      Updating password...
                    </>
                  ) : (
                    "Update password"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500 mb-2">Remembered your password?</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-blue-600 font-black text-lg hover:text-blue-800 transition-colors group"
              >
                Back to Login{" "}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
