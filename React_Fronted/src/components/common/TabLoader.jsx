import React from "react";
import { motion } from "framer-motion";

const TabLoader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md"
    >
      <div className="relative">
        {/* Outer Animated Ring */}
        <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
        
        {/* Inner Shield Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl" role="img" aria-label="shield">🛡️</span>
        </div>
      </div>
      
      {/* Updated Loading Text for Submission */}
      <motion.p 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-sm font-black text-blue-700 uppercase tracking-widest text-center"
      >
        Processing Your Claim...
      </motion.p>
    </motion.div>
  );
};

export default TabLoader;