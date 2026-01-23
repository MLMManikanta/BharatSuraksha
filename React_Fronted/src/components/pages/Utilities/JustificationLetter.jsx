import React, { useMemo, useState } from "react";

const CLAIMS = [
  { id: "CLM-10221", date: "05 Jan 2026", amount: "₹1,25,000", summary: "Knee replacement - Pre auth" },
  { id: "CLM-10230", date: "18 Dec 2025", amount: "₹42,500", summary: "Diagnostic tests" },
  { id: "CLM-10188", date: "02 Nov 2025", amount: "₹2,10,000", summary: "Hospitalization" },
];

function JustificationLetter() {
  const [selectedClaim, setSelectedClaim] = useState('');

  const currentClaim = useMemo(
    () => CLAIMS.find((claim) => claim.id === selectedClaim),
    [selectedClaim]
  );

  const letterBody = useMemo(() => {
    if (!currentClaim) return '';
    return `This letter certifies that claim ${currentClaim.id} filed on ${currentClaim.date} for ${currentClaim.amount} is under review. Please use this document as justification for employer or insurer communications.`;
  }, [currentClaim]);

  const handleDownload = () => {
    const blob = new Blob([letterBody], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentClaim?.id || "justification"}-letter.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  return (
    <main id="main-content" className="bg-linear-to-b from-slate-50 to-white min-h-screen py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Utilities</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Download Justification Letter</h1>
            <p className="text-slate-600 mt-1">Select a claim ID to view a read-only justification letter. Download or print as needed.</p>
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

        <section className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Select Claim ID</label>
            <select
              value={selectedClaim}
              onChange={(e) => setSelectedClaim(e.target.value)}
              className="rounded-lg border border-slate-200 px-4 py-3 shadow-inner bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            >
              <option value="" disabled>Select claim to view</option>
              {CLAIMS.map((claim) => (
                <option key={claim.id} value={claim.id}>
                  {claim.id} — {claim.summary} ({claim.date})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase text-slate-500 font-semibold">Claim</p>
                <p className="text-base font-bold text-slate-900">{currentClaim?.id || 'No claim selected'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase text-slate-500 font-semibold">Filed on</p>
                <p className="text-sm font-semibold text-slate-800">{currentClaim?.date || '-'}</p>
              </div>
            </div>
            <p className="text-sm text-slate-700">Amount: <span className="font-semibold">{currentClaim?.amount || '-'}</span></p>
            <p className="text-sm text-slate-700">Summary: {currentClaim?.summary || '—'}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-inner p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Justification Letter Preview</p>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Read-only</span>
            </div>
            <div className="prose prose-sm max-w-none text-slate-800">
              {letterBody ? <p>{letterBody}</p> : <p className="text-sm text-slate-600">Please select a claim from the dropdown to preview the justification letter.</p>}
              <p>
                Please present this letter to the concerned authority as evidence that your claim is being
                processed. For any clarification, contact us at <strong>care@bharatsuraksha.in</strong> or call
                <strong> 1800-265-000</strong>.
              </p>
              <p>Regards,<br />Claims Team, Bharat Suraksha</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default JustificationLetter;
