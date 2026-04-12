import React from "react";
import { motion } from "framer-motion";

const StudioBackground = ({ children }) => {
    return (
        <div className="min-h-screen relative overflow-x-hidden">
            {/* 
                THE STATIC BASE: 
                This layer stays perfectly still while content slides on top.
            */}
            <div className="fixed inset-0 bg-[#E9DCD6] -z-10">
                {/* Animated Ribbons - Fixed at the top background area */}
                <div className="absolute top-0 left-0 right-0 h-[800px] overflow-hidden pointer-events-none opacity-50">
                    <motion.svg
                        className="absolute top-0 left-[-10%] w-[120%] h-full text-white/40" viewBox="0 0 1000 1000" preserveAspectRatio="none"
                    >
                        {/* Layer 1: Main Thick Ribbon */}
                        <motion.path
                            animate={{
                                x: [-30, 30, -30],
                                y: [-20, 20, -20]
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            fill="none" stroke="currentColor" strokeWidth="100" strokeLinecap="round"
                            d="M-100,400 C150,100 350,700 500,400 C650,100 850,700 1100,400"
                        />
                        {/* Layer 2: Medium Ribbon */}
                        <motion.path
                            animate={{
                                x: [40, -40, 40],
                                y: [10, -30, 10]
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            fill="none" stroke="white" strokeWidth="60" strokeLinecap="round" opacity="0.3"
                            d="M-100,550 C150,250 350,850 500,550 C650,250 850,850 1100,550"
                        />
                        {/* Layer 3: Thin accent lines */}
                        <motion.path
                            animate={{ rotate: [0, 6, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            fill="none" stroke="white" strokeWidth="15" strokeLinecap="round" opacity="0.2"
                            d="M-100,450 C200,100 400,800 600,450 C800,100 900,800 1100,450"
                        />
                        {/* Layer 4: Deep bottom ribbon */}
                        <motion.path
                            animate={{ x: [-100, 100, -100] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            fill="none" stroke="currentColor" strokeWidth="80" strokeLinecap="round" opacity="0.2"
                            d="M-100,700 C150,400 350,1000 500,700 C650,400 850,1000 1100,700"
                        />
                    </motion.svg>
                </div>
            </div>

            {/* 
                THE SLIDING LAYER: 
                This container holds the animated content.
            */}
            <div className="relative z-10 w-full pt-[130px] pb-20">
                {children}
            </div>
        </div>
    );
};

export default StudioBackground;
