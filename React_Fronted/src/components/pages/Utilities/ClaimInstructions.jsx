import React from "react";

function ClaimInstructions() {
  const handlePrint = () => window.print();

  return (
    <main id="main-content" className="bg-linear-to-b from-slate-50 to-white min-h-screen py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Utilities</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Claim Instructions</h1>
            <p className="text-slate-600 mt-1">Step-by-step guidance, eligibility, documents, timelines, and best practices.</p>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 text-blue-700 font-semibold bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
          >
            🖨️ Print
          </button>
        </header>

        <section className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Step-by-Step Claim Process</h2>
            <ol className="space-y-3 text-slate-800">
              <li><span className="font-semibold text-slate-900">1. Notify:</span> Inform us within 24 hours of admission (planned) or within 48 hours (emergency).</li>
              <li><span className="font-semibold text-slate-900">2. Pre-auth:</span> Share the pre-authorization form at the network hospital desk.</li>
              <li><span className="font-semibold text-slate-900">3. Documents:</span> Upload bills, discharge summary, prescriptions, and diagnostics.</li>
              <li><span className="font-semibold text-slate-900">4. Review:</span> We verify eligibility, coverage, and limits.</li>
              <li><span className="font-semibold text-slate-900">5. Settlement:</span> Cashless for network hospitals; reimbursement for non-network.</li>
              <li><span className="font-semibold text-slate-900">6. Track:</span> Monitor status in the My Claims page; respond to any queries.</li>
            </ol>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">Eligibility Criteria</h3>
              <ul className="list-disc list-inside text-slate-800 space-y-2">
                <li>Active policy with premium paid up to date.</li>
                <li>Condition covered under policy terms (waiting periods satisfied).</li>
                <li>Treatment taken at registered medical facilities.</li>
                <li>Claim submitted within filing timelines.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">Required Documents</h3>
              <ul className="list-disc list-inside text-slate-800 space-y-2">
                <li>Hospital bills and receipts (itemized).</li>
                <li>Discharge summary and admission note.</li>
                <li>Doctor prescriptions and diagnostic reports.</li>
                <li>Photo ID, policy copy, and cancelled cheque.</li>
              </ul>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">Timelines</h3>
              <ul className="list-disc list-inside text-slate-800 space-y-2">
                <li>Planned admission intimation: 48 hours prior.</li>
                <li>Emergency admission intimation: within 24-48 hours.</li>
                <li>Reimbursement submission: within 30 days of discharge.</li>
                <li>Typical review cycle: 7-10 working days.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">Do's and Don'ts</h3>
              <ul className="list-disc list-inside text-slate-800 space-y-2">
                <li>Do keep originals safely until settlement completes.</li>
                <li>Do respond promptly to additional document requests.</li>
                <li>Don't submit altered or unclear scans.</li>
                <li>Don't delay hospital intimation for emergencies.</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-700 space-y-2">
            <p className="font-semibold text-slate-900">Print-friendly layout</p>
            <p>Use the print button to save or share a PDF copy. For assistance, contact care@bharatsuraksha.in or call 1800-265-000.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ClaimInstructions;
