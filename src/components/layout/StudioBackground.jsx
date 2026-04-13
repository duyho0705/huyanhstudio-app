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
                <style>
                    {`
                        @keyframes drift1 {
                            0%, 100% { transform: translate(-30px, -20px); }
                            50% { transform: translate(30px, 20px); }
                        }
                        @keyframes drift2 {
                            0%, 100% { transform: translate(40px, 10px); }
                            50% { transform: translate(-40px, -30px); }
                        }
                        @keyframes drift3 {
                            0%, 100% { transform: rotate(0deg); }
                            50% { transform: rotate(6deg); }
                        }
                        @keyframes drift4 {
                            0%, 100% { transform: translateX(-100px); }
                            50% { transform: translateX(100px); }
                        }
                        .ribbon-layer-1 { animation: drift1 5s ease-in-out infinite; }
                        .ribbon-layer-2 { animation: drift2 6s ease-in-out infinite; }
                        .ribbon-layer-3 { animation: drift3 4s ease-in-out infinite; transform-origin: center; }
                        .ribbon-layer-4 { animation: drift4 8s linear infinite; }
                    `}
                </style>
                {/* Animated Ribbons - Fixed at the top background area */}
                <div className="absolute top-0 left-0 right-0 h-[800px] overflow-hidden pointer-events-none opacity-50">
                    <svg
                        className="absolute top-0 left-[-10%] w-[120%] h-full text-white/40" viewBox="0 0 1000 1000" preserveAspectRatio="none"
                    >
                        <path
                            className="ribbon-layer-1"
                            fill="none" stroke="currentColor" strokeWidth="100" strokeLinecap="round"
                            d="M-100,400 C150,100 350,700 500,400 C650,100 850,700 1100,400"
                        />
                        <path
                            className="ribbon-layer-2"
                            fill="none" stroke="white" strokeWidth="60" strokeLinecap="round" opacity="0.3"
                            d="M-100,550 C150,250 350,850 500,550 C650,250 850,850 1100,550"
                        />
                        <path
                            className="ribbon-layer-3"
                            fill="none" stroke="white" strokeWidth="15" strokeLinecap="round" opacity="0.2"
                            d="M-100,450 C200,100 400,800 600,450 C800,100 900,800 1100,450"
                        />
                        <path
                            className="ribbon-layer-4"
                            fill="none" stroke="currentColor" strokeWidth="80" strokeLinecap="round" opacity="0.2"
                            d="M-100,700 C150,400 350,1000 500,700 C650,400 850,1000 1100,700"
                        />
                    </svg>
                </div>
            </div>

            {/* 
                THE SLIDING LAYER: 
                This container holds the animated content.
            */}
            <div className="relative z-10 w-full pt-[130px]">
                {children}
            </div>
        </div>
    );
};

export default StudioBackground;
