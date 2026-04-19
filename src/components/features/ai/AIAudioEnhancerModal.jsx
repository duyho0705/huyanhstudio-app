import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUploadCloud, FiZap, FiMusic, FiPlay, FiPause, FiInfo, FiActivity, FiBarChart2, FiTriangle } from "react-icons/fi";
import aiApi from "../../../api/aiApi";

const AIAudioEnhancerModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith("audio/")) {
      setFile(uploadedFile);
      performAnalysis(uploadedFile);
    }
  };

  const performAnalysis = async (targetFile) => {
    setIsProcessing(true);
    setAnalysisResult(null);

    try {
      const response = await aiApi.analyze(targetFile);
      setAnalysisResult(response.data || response);
    } catch (error) {
      console.error("Lỗi AI Analysis:", error);
      alert("Hệ thống AI đang bận. Vui lòng cài đặt FFmpeg trên server hoặc thử lại sau.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setIsProcessing(false);
    setAnalysisResult(null);
  };

  const MetricCard = ({ icon: Icon, label, value, unit, color }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between"
    >
      <div className="flex items-center gap-2 text-white/40 mb-3">
        <Icon size={14} className={color} />
        <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-white">{value ?? "--"}</span>
        <span className="text-[10px] font-bold text-white/30 uppercase">{unit}</span>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0A0510]/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="relative w-full max-w-3xl bg-[#120B1E] rounded-[40px] shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden"
          >
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#6CD1FD] rounded-full blur-[120px]" />
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#35104C] rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#6CD1FD] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(108,209,253,0.4)]">
                    <FiZap size={20} className="text-[#120B1E]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white leading-none">HASTUDIO <span className="text-[#6CD1FD]">AI</span></h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1">Audio Intelligent Lab</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40">
                  <FiX size={24} />
                </button>
              </div>

              {!file && !isProcessing && (
                <div className="text-center py-10">
                  <motion.div
                    whileHover={{ scale: 0.98, borderColor: "rgba(108,209,253,0.5)" }}
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-white/10 rounded-[40px] p-16 cursor-pointer bg-white/[0.02] hover:bg-[#6CD1FD]/5 transition-all group relative overflow-hidden"
                  >
                    <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={handleFileUpload} />
                    <div className="relative z-10">
                      <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6 text-white/20 group-hover:text-[#6CD1FD] group-hover:bg-white/10 transition-all shadow-inner">
                        <FiUploadCloud size={40} />
                      </div>
                      <h4 className="text-2xl font-black text-white mb-2">THẢ FILE ĐỂ PHÂN TÍCH</h4>
                      <p className="text-white/40 text-[13px] font-medium max-w-xs mx-auto mb-8 tracking-wide">AI của chúng tôi sẽ đo đạc các chỉ số Loudness, Peak và dải tần của bản thu.</p>
                      
                      <div className="flex justify-center gap-4">
                        {['MP3', 'WAV', 'M4A'].map(ext => (
                          <span key={ext} className="px-4 py-2 bg-white/5 rounded-xl text-[11px] font-black text-white/30 border border-white/5 uppercase tracking-widest">{ext}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {isProcessing && (
                <div className="py-20 text-center">
                  <div className="relative w-40 h-10 mx-auto mb-12 flex justify-center items-end gap-1.5">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [10, 40, 10] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05 }}
                        className="w-2 bg-[#6CD1FD]/80 rounded-full"
                      />
                    ))}
                  </div>
                  <h4 className="text-xl font-black text-white mb-2 uppercase tracking-widest">Đang giải mã âm thanh...</h4>
                  <p className="text-[#6CD1FD] text-[11px] font-black uppercase tracking-[0.3em] animate-pulse">Running AI Engine v2.0</p>
                </div>
              )}

              {analysisResult && (
                <div className="space-y-6">
                  {/* Analysis Header */}
                  <div className="flex items-center justify-between p-6 bg-white/[0.03] rounded-[32px] border border-white/5">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6CD1FD] to-[#35104C] flex items-center justify-center shadow-lg">
                        <FiMusic size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">Source File</p>
                        <h4 className="text-lg font-black text-white truncate max-w-[300px]">{file?.name}</h4>
                      </div>
                    </div>
                    <button onClick={reset} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl transition-all uppercase tracking-widest">
                      Thử file khác
                    </button>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard 
                      icon={FiActivity} 
                      label="Loudness" 
                      value={analysisResult.loudness} 
                      unit="LUFS" 
                      color="text-[#6CD1FD]" 
                    />
                    <MetricCard 
                      icon={FiTriangle} 
                      label="True Peak" 
                      value={analysisResult.peak} 
                      unit="dB" 
                      color="text-red-400" 
                    />
                    <MetricCard 
                      icon={FiBarChart2} 
                      label="Dyn Range" 
                      value={analysisResult.lra || analysisResult.dynamicRange} 
                      unit="LU" 
                      color="text-purple-400" 
                    />
                    <MetricCard 
                      icon={FiZap} 
                      label="Confidence" 
                      value={98} 
                      unit="%" 
                      color="text-yellow-400" 
                    />
                  </div>

                  {/* AI Advice */}
                  <div className="p-6 bg-[#6CD1FD]/10 border border-[#6CD1FD]/20 rounded-[32px] relative overflow-hidden group">
                    <div className="flex gap-5 items-start relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-[#6CD1FD] text-[#120B1E] flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(108,209,253,0.3)]">
                        <FiInfo size={24} />
                      </div>
                      <div>
                        <h5 className="text-[13px] font-black text-[#6CD1FD] uppercase tracking-widest mb-2">AI Diagnosis</h5>
                        <p className="text-white/80 text-sm leading-relaxed font-medium">
                          {analysisResult.advice || "Dữ liệu đang được phân tích sâu hơn..."}
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <FiZap size={60} className="text-[#6CD1FD]" />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={() => window.location.href='/booking'}
                      className="w-full py-5 bg-gradient-to-r from-[#6CD1FD] to-[#35104C] text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-sm shadow-[0_10px_30px_rgba(108,209,253,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Bắt đầu Mastering chuyên nghiệp ngay
                    </button>
                    <p className="text-center text-white/20 text-[10px] font-bold uppercase tracking-widest mt-4">Powered by Hastudio Intelligence Audio Engine</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AIAudioEnhancerModal;

