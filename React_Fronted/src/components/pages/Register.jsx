import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";

const sanitizePolicyNumber = (value) => String(value || "").toUpperCase().trim();

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const storedPolicyNumber = useMemo(() => {
    const fromState = location.state?.policyNumber;
    const fromStorage = localStorage.getItem("latestPolicyNumber");
    return sanitizePolicyNumber(fromState || fromStorage || "");
  }, [location.state]);

  const [formData, setFormData] = useState({
    policyNumber: '',
    email: "",
    mobileNumber: "",
    password: "",
  });

  const planDisplayToCode = {
    'NEEV': 'NEEV',
    'NEEV SURAKSHA': 'NEEV',
    'PARIVAR': 'PARI',
    'PARIVAR SURAKSHA': 'PARI',
    'PARI': 'PARI',
    'VISHWA': 'VISH',
    'VISHWA SURAKSHA': 'VISH',
    'VISH': 'VISH',
    'VAJRA': 'VAJR',
    'VAJRA SURAKSHA': 'VAJR',
    'VAJR': 'VAJR'
  };

  const normalize = (s) => String(s || '').toUpperCase().trim();
  const initialPlanFromState = normalize(location.state?.planName || localStorage.getItem('latestPlanName') || 'PARIVAR');
  const initialPlan = planDisplayToCode[initialPlanFromState] || (initialPlanFromState || 'PARI');

  const extractPlanFromPolicy = (pn) => {
    if (!pn) return null;
    const m = String(pn).toUpperCase().trim().match(/^BS-([A-Z0-9]{2,5})-/);
    return m ? m[1] : null;
  };

  const planFromStoredPolicy = extractPlanFromPolicy(storedPolicyNumber);
  const [selectedPlan, setSelectedPlan] = useState(planFromStoredPolicy || initialPlan);
  const [txnId, setTxnId] = useState(localStorage.getItem("latestTransactionId") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [policyEdited, setPolicyEdited] = useState(false);

  useEffect(() => {
    // If there's a stored policy number from previous flow, keep it available in localStorage.
    if (storedPolicyNumber) {
      localStorage.setItem('latestPolicyNumber', storedPolicyNumber);
    }
  }, [storedPolicyNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "policyNumber" ? sanitizePolicyNumber(value) : value,
    }));
    if (name === 'policyNumber') setPolicyEdited(true);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      if (!selectedPlan) throw new Error("Select a plan to generate policy number");
      const data = await api.get(`/api/auth/generate?plan=${encodeURIComponent(selectedPlan)}`);
      if (data.policyNumber) {
        setFormData((prev) => ({ ...prev, policyNumber: data.policyNumber }));
        setTxnId(data.transactionId || "");
        localStorage.setItem("latestPolicyNumber", data.policyNumber);
        localStorage.setItem("latestPlanName", selectedPlan);
        if (data.transactionId) localStorage.setItem("latestTransactionId", data.transactionId);
      }
    } catch (err) {
      setError(err.message || "Failed to generate policy number");
    } finally {
      setLoading(false);
    }
  };

  const generatePolicyPreview = (planCode) => {
    const code = String(planCode || 'GEN').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0,4) || 'GEN';
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `BS-${code}-${year}-${rand}`;
  };

  useEffect(() => {
    // if backend provided a stored policyNumber, prefer that; otherwise generate preview for selected plan
    if (!policyEdited) {
      const preview = storedPolicyNumber || generatePolicyPreview(selectedPlan);
      setFormData((prev) => ({ ...prev, policyNumber: preview }));
      // derive selectedPlan from preview if not already set
      const derived = extractPlanFromPolicy(preview);
      if (derived) setSelectedPlan(derived);
    }
  }, [selectedPlan, storedPolicyNumber, policyEdited]);

  const [issuedPolicy, setIssuedPolicy] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Prepare payload depending on whether policyNumber was supplied/generated
      const payload = {
        password: formData.password,
      };

      // Include policyNumber and send canonical plan code (derive from policy if needed)
      if (formData.policyNumber) payload.policyNumber = formData.policyNumber;
      const planFromPolicy = extractPlanFromPolicy(formData.policyNumber);
      if (planFromPolicy) {
        payload.plan = planFromPolicy;
      } else if (selectedPlan) {
        payload.plan = selectedPlan;
      }
      if (txnId) payload.transactionId = txnId;

      // Optional fields
      if (formData.email) payload.email = formData.email.trim().toLowerCase();
      if (formData.mobileNumber) payload.mobileNumber = formData.mobileNumber.trim();

      const res = await api.post("/api/auth/register", payload);

      // cache latest
      if (res.policyNumber) localStorage.setItem("latestPolicyNumber", res.policyNumber);
      if (res.plan) localStorage.setItem("latestPlanName", res.plan);

      // Show success and present issued policy as read-only display
      setIssuedPolicy(res.policyNumber || "");
      setSuccess("Registration successful.");
    } catch (err) {
      setError(err.message || "Registration failed");
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
              <p className="text-slate-500 text-sm">Use your issued policy number to register.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 space-y-2">
                  <div>{success}</div>
                  {issuedPolicy ? (
                    <div className="mt-2">
                      <p className="text-xs text-slate-600">Your Policy Number</p>
                      <div className="mt-1 flex items-center gap-3">
                        <p className="font-mono font-semibold text-blue-600">{issuedPolicy}</p>
                        <button
                          type="button"
                          onClick={async () => { if (navigator.clipboard) await navigator.clipboard.writeText(issuedPolicy); }}
                          className="px-3 py-1 bg-blue-600 text-white rounded-xl text-sm font-bold"
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('/login')}
                          className="px-3 py-1 bg-white border border-slate-200 text-slate-800 rounded-xl text-sm font-bold"
                        >
                          Proceed to Login
                        </button>
                      </div>
                      <p className="text-xs text-red-500 mt-2">Please save this number. It is required for login.</p>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Select Plan removed — policy number entry will determine plan code */}

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Policy Number</label>

                <input
                  type="text"
                  name="policyNumber"
                  placeholder="BS-PARI-2026-5222"
                  value={formData.policyNumber}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-mono"
                />

                <div className="text-xs text-gray-500 mt-2 leading-relaxed">
                  <p>
                    Enter your Policy Number in the format:{' '}
                    <span className="font-mono">BS-XXXX-YYYY-NNNN</span>
                  </p>
                  <p className="mt-1">
                    Example: <span className="font-mono">BS-PARI-2026-5222</span>
                  </p>

                  <p className="mt-2 font-medium text-gray-600">Plan Code Reference:</p>
                  <ul className="ml-4 list-disc">
                    <li><strong>NEEV</strong> – Neev Suraksha</li>
                    <li><strong>PARI</strong> – Parivar Suraksha</li>
                    <li><strong>VISH</strong> – Vishwa Suraksha</li>
                    <li><strong>VAJR</strong> – Vajra Suraksha</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
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
