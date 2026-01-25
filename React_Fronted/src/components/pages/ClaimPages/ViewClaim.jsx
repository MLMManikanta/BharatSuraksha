import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../utils/api";

const ViewClaim = ({ claimId, isOpen, onClose }) => {
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && claimId) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/api/claims/${claimId}`, { auth: true });
          setClaim(response);
        } catch (err) {
          console.error("Failed to fetch claim details:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, claimId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Dialog Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {loading ? (
              <div className="p-20 text-center font-bold text-blue-700 animate-pulse">
                Loading Details...
              </div>
            ) : claim ? (
              <>
                <div className="bg-blue-700 p-8 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black">Claim Summary</h2>
                      <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1">
                        ID: {claimId.slice(-6).toUpperCase()}
                      </p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white text-xl">✕</button>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-blue-700 uppercase tracking-widest block">Beneficiary</label>
                      <p className="font-bold text-slate-900">{claim.dependentName}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-blue-700 uppercase tracking-widest block">Type</label>
                      <p className="font-bold text-slate-600">{claim.claimType}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-blue-700 uppercase tracking-widest block">Hospital Address</label>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{claim.hospitalAddress}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Status</span>
                      <span className="text-[10px] font-black text-blue-700 uppercase">{claim.status}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-200">
                      <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Claimed Amount</label>
                      <p className="text-2xl font-black text-slate-900 italic">₹{claim.claimedAmount.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Diagnosis</label>
                      <p className="text-xs text-slate-700 font-bold italic">"{claim.diagnosis}"</p>
                    </div>
                  </div>
                </div>
                
                <div className="px-8 pb-8">
                  <button 
                    onClick={onClose}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all"
                  >
                    Close Summary
                  </button>
                </div>
              </>
            ) : (
              <div className="p-10 text-center text-red-500 font-bold">Error loading claim.</div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ViewClaim;