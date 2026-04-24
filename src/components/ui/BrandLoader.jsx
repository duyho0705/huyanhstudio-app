import React from 'react';
import { motion } from 'framer-motion';

const BrandLoader = () => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-10">
      <div className="relative">
        {/* Decorative Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 -m-4 border-2 border-dashed border-[#6CD1FD]/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 -m-8 border border-[#35104C]/10 rounded-full"
        />

        {/* Central Logo Box */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 20px 40px rgba(53, 16, 76, 0.1)",
              "0 20px 60px rgba(108, 209, 253, 0.2)",
              "0 20px 40px rgba(53, 16, 76, 0.1)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 bg-[#35104C] rounded-2xl flex items-center justify-center relative z-10"
        >
          <span className="text-white font-black text-2xl tracking-tighter">HA</span>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 flex flex-col items-center gap-3"
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                height: [4, 12, 4],
                backgroundColor: ["#35104C", "#6CD1FD", "#35104C"]
              }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                delay: i * 0.15 
              }}
              className="w-1 rounded-full"
            />
          ))}
        </div>
        <p className="text-[12px] font-bold text-[#35104C]/30 uppercase tracking-[0.3em] ml-1">Loading</p>
      </motion.div>
    </div>
  );
};

export default BrandLoader;
