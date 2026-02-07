import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

function JustificationLetter() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const logoPath = "/images/Logo-circle.png";

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/claims", { auth: true });
        const formattedClaims = (res || []).map((claim, index) => {
          const displayId = claim.referenceId || `Claim_2026-${String(index + 1).padStart(3, "0")}`;

          // Calculate number of days if not provided but dates exist
          let numberOfDays = claim.numberOfDays || "N/A";
          if (!numberOfDays || numberOfDays === "N/A") {
            if (claim.admissionDate && claim.dischargeDate) {
              const admission = new Date(claim.admissionDate);
              const discharge = new Date(claim.dischargeDate);
              const days = Math.ceil((discharge - admission) / (1000 * 60 * 60 * 24));
              numberOfDays = days > 0 ? days : "N/A";
            }
          }

          return {
            id: displayId,
            claimId: claim._id,
            date: claim.createdAt
              ? new Date(claim.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "N/A",
            policyNumber: claim.policyNumber || "N/A",
            patientName: claim.patientName || user?.name || "Policy Holder",
            dependentName: claim.dependentName || "",
            hospitalName: claim.hospitalName || "Hospital",
            hospitalType: claim.hospitalType || "Multi-specialty Hospital",
            hospitalAddress: claim.hospitalAddress || "Hospital Address",
            nation: claim.nation || "India",
            hospital: claim.hospitalAddress || "Hospital Name",
            amount: `₹ ${Number(claim.claimedAmount || 0).toLocaleString("en-IN")}`,
            diagnosis: claim.diagnosis || "Not specified",
            admissionDate: claim.admissionDate
              ? new Date(claim.admissionDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "N/A",
            dischargeDate: claim.dischargeDate
              ? new Date(claim.dischargeDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "N/A",
            status: claim.status || "Pending",
            treatmentType: claim.treatmentType || claim.claimType || "Hospitalization",
            preExistingCondition: claim.preExistingCondition || "No",
            hospitalizationType: claim.hospitalizationType || "General",
            numberOfDays: numberOfDays,
          };
        });
        setClaims(formattedClaims);
      } catch (err) {
        console.error("Error fetching claims:", err);
        if (err.status === 401) {
          navigate("/login", {
            state: { message: "Your session has expired. Please log in again." },
          });
          return;
        }
        setError(err.message || "Failed to fetch claims");
        setClaims([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleClaimChange = (claim) => {
    setSelectedClaim(claim);
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-10 font-sans">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="flex flex-col sm:flex-row items-start justify-between gap-6 no-print">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Justification Letter
            </h1>
            <p className="max-w-xl text-sm text-slate-500 font-medium">
              Generate an official statement for your pending claims. This document can be presented
              to hospital authorities as proof of insurance processing.
            </p>
          </div>

          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Back
            to Dashboard
          </button>
        </header>

        <section className="rounded-4xl border border-slate-200 bg-white shadow-2xl shadow-blue-900/5 overflow-hidden no-print">
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Workflow Step 01
                </label>
                <h3 className="font-bold text-slate-800">Select Active Claim</h3>
              </div>
              <button
                onClick={handlePrint}
                disabled={!selectedClaim}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-30 disabled:shadow-none transition-all active:scale-95"
              >
                🖨️ Print Document
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-end">
              <div className="space-y-3">
                <Listbox value={selectedClaim} onChange={handleClaimChange}>
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-pointer rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 pl-5 pr-12 text-left focus:outline-none focus:border-blue-500 transition-all">
                      <span
                        className={`block truncate font-bold ${selectedClaim ? "text-slate-900" : "text-slate-400"}`}
                      >
                        {selectedClaim ? selectedClaim.id : "Choose a Claim ID..."}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                        ▼
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={React.Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5 focus:outline-none">
                        {claims.length === 0 ? (
                          <div className="px-4 py-3 text-center text-xs text-slate-400">
                            {loading ? "Loading claims..." : "No claims found."}
                          </div>
                        ) : (
                          claims.map((claim) => (
                            <Listbox.Option
                              key={claim.id}
                              className={({ active }) =>
                                `relative cursor-pointer select-none rounded-xl py-3 px-4 transition-colors ${
                                  active ? "bg-blue-50 text-blue-700" : "text-slate-700"
                                }`
                              }
                              value={claim}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-bold">{claim.id}</span>
                                <span className="text-[10px] opacity-60">{claim.date}</span>
                              </div>
                            </Listbox.Option>
                          ))
                        )}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Letter Preview
                </h4>
                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full border border-amber-100">
                  READ-ONLY DRAFT
                </span>
              </div>

              <div className="print-area rounded-3xl border-2 border-slate-100 bg-slate-50/30 p-8 md:p-12 min-h-100 relative">
                <AnimatePresence>
                  {isRefreshing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-3xl flex items-center justify-center z-50"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  {!selectedClaim ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20"
                    >
                      <div className="text-4xl opacity-20">📄</div>
                      <p className="text-slate-400 font-medium">
                        Select a claim above to preview the justification letter.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="prose prose-slate max-w-none text-slate-700"
                    >
                      <div className="mb-10 flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <img src={logoPath} alt="Bharat Suraksha Logo" className="h-16 w-16" />
                          <div>
                            <h2 className="text-xl font-black text-blue-900 m-0">
                              BHARAT SURAKSHA
                            </h2>
                            <p className="text-xs text-slate-600 font-bold m-0 tracking-widest">
                              Claims Department
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-xs font-bold text-slate-900 tracking-tighter">
                          Date:{" "}
                          {new Date().toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                      </div>

                      <h3 className="text-center font-black underline underline-offset-8 decoration-blue-200 mb-10">
                        TO WHOMSOEVER IT MAY CONCERN
                      </h3>

                      <p className="leading-relaxed mb-6">
                        This is to certify that <strong>{selectedClaim.patientName}</strong>
                        {selectedClaim.dependentName &&
                          ` on behalf of dependent ${selectedClaim.dependentName},`}{" "}
                        is a bonafide policy holder under Bharat Suraksha General Insurance Ltd.
                        with Policy Number
                        <strong> {selectedClaim.policyNumber}</strong>. The medical insurance claim
                        with reference ID
                        <strong> {selectedClaim.id}</strong> has been filed on{" "}
                        <strong>{selectedClaim.date}</strong> for a claimed amount of{" "}
                        <strong>{selectedClaim.amount}</strong>.
                      </p>

                      <p className="leading-relaxed mb-6">
                        The claim pertains to <strong>{selectedClaim.treatmentType}</strong>{" "}
                        treatment received at <strong>{selectedClaim.hospitalName}</strong> (
                        {selectedClaim.hospitalType})
                        {selectedClaim.hospitalizationType &&
                          `, ${selectedClaim.hospitalizationType} hospitalization`}
                        , located at <strong>{selectedClaim.hospitalAddress}</strong>,{" "}
                        <strong>{selectedClaim.nation}</strong>. The policy holder was admitted on{" "}
                        <strong>{selectedClaim.admissionDate}</strong> and was discharged on{" "}
                        <strong>{selectedClaim.dischargeDate}</strong> after a hospital stay of
                        approximately <strong>{selectedClaim.numberOfDays}</strong> days.
                      </p>

                      <p className="leading-relaxed mb-6">
                        The medical condition for which treatment was sought is as follows:{" "}
                        <strong>{selectedClaim.diagnosis}</strong>. The pre-existing condition
                        status is recorded as <strong>{selectedClaim.preExistingCondition}</strong>.
                      </p>

                      <p className="leading-relaxed mb-6">
                        This is to confirm that the above-mentioned policy holder is covered under
                        an active and valid health insurance policy with Bharat Suraksha General
                        Insurance Ltd. The claim is being processed through our medical adjudication
                        team, and this letter serves as formal justification acknowledging the
                        legitimacy of the claim and the ongoing review process.
                      </p>

                      <p className="leading-relaxed mb-6">
                        Please present this letter to the hospital administration, accounts
                        department, and any other relevant departments as evidence that the
                        insurance claim has been filed and is under active processing. This document
                        shall act as confirmation of our commitment to process the claim at the
                        earliest. For any further clarification or status updates, please contact
                        our customer support team at the details provided below.
                      </p>

                      <div className="mt-12 space-y-1">
                        <p className="font-bold m-0 text-slate-900">Regards,</p>
                        <p className="font-black text-blue-900 m-0">The Claims Team</p>
                        <p className="text-xs text-slate-500 font-bold m-0">
                          Bharat Suraksha General Insurance Ltd.
                        </p>
                      </div>

                      <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap gap-6 text-[10px] font-bold text-slate-400 uppercase">
                        <p>📞 9063807489</p>
                        <p>✉️ care@bharatsuraksha.in</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      </div>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          .print-area { 
            border: none !important; 
            background: white !important; 
            padding: 0 !important; 
            box-shadow: none !important; 
          }
          main { padding: 0 !important; }
          .mx-auto { max-width: 100% !important; }
        }
      `}</style>
    </main>
  );
}
export default JustificationLetter;
