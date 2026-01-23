import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ECard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const policyNumber = (user && user.policyNumber) || localStorage.getItem("latestPolicyNumber");

  const handleDownload = () => {
    // simple placeholder download when active
    const cardText = `Bharat Suraksha E-Card\nPolicy: ${policyNumber || "N/A"}`;
    const blob = new Blob([cardText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Bharat-Suraksha-E-Card.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  if (!policyNumber) {
    return (
      <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-xl font-bold">No active policy</h2>
            <p className="mt-2 text-sm text-slate-600">Your e-card will appear here after you purchase a policy.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button onClick={() => navigate('/plans')} className="px-4 py-2 bg-blue-600 text-white rounded-xl">Get a Quote</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="bg-linear-to-b from-slate-50 to-white min-h-screen py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Utilities</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Download E-Card</h1>
            <p className="text-slate-600 mt-1">View and download your digital insurance e-card. This view is read-only.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              ⬇️ Download
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 text-blue-700 font-semibold bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
            >
              🖨️ Print
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Policyholder</p>
                <h2 className="text-xl font-bold text-slate-900">Policyholder</h2>
                <p className="text-sm text-slate-500">Policy #{policyNumber}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">Active</span>
            </div>

            <div className="p-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-slate-500 font-semibold">Plan</p>
                <p className="text-base font-semibold text-slate-900">{localStorage.getItem('latestPlanName') || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 font-semibold">Validity</p>
                <p className="text-base font-semibold text-slate-900">{localStorage.getItem('latestPolicyValidity') || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 font-semibold">Email</p>
                <p className="text-base text-slate-900">{(user && user.email) || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 font-semibold">Phone</p>
                <p className="text-base text-slate-900">{(user && user.mobileNumber) || '—'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-slate-500 font-semibold">Digital Card</p>
                <h3 className="text-lg font-bold text-slate-900">Preview</h3>
              </div>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">Read-only</span>
            </div>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-indigo-600 shadow-lg text-white">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,#fff_0,transparent_45%)]" />
              <div className="p-5 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] font-semibold">Bharat Suraksha</p>
                    <h4 className="text-xl font-bold mt-1">{localStorage.getItem('latestPlanName') || '—'}</h4>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-semibold">Policy #{policyNumber}</p>
                    <p className="text-blue-100">{localStorage.getItem('latestPolicyValidity') || ''}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-blue-100">Policyholder</p>
                  <h5 className="text-2xl font-extrabold">{(user && user.email) || 'Policyholder'}</h5>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="space-y-1 text-blue-100">
                    <p>Emergency: 1800-265-000</p>
                    <p>Email: care@bharatsuraksha.in</p>
                  </div>
                  <div className="h-14 w-14 rounded-lg bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center text-lg font-bold tracking-widest">
                    BS
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">Cashless enabled</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">Carry a photo ID during hospital visit</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">For emergencies, call toll-free</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ECard;
