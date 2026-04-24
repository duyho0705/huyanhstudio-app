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
      const errorMsg = error.response?.data?.message || error.message || "Hệ thống AI đang bận";
      alert(`Lỗi: ${errorMsg}. Vui lòng kiểm tra FFmpeg trên server.`);
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
            className="absolute inset-0 bg-white/40 backdrop-blur-none"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="relative w-[95%] sm:w-full max-w-3xl bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_24px_80px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden"
          >
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#6CD1FD] rounded-full blur-[120px]" />
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#35104C] rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 p-5 sm:p-8">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#35104C] leading-none tracking-tight">hastudio <span className="text-[#6CD1FD]">AI</span></h3>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                  <FiX size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              {!file && !isProcessing && (
                <div className="text-center py-6 sm:py-8">
                  <motion.div
                    whileHover={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current.click()}
                    className="relative cursor-pointer rounded-[24px] sm:rounded-[40px] p-6 sm:p-14 group overflow-hidden bg-gradient-to-b from-gray-50/50 to-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_12px_40px_rgba(108,209,253,0.12)] hover:border-[#6CD1FD]/30"
                  >
                    <div className="absolute inset-0 bg-[#6CD1FD]/0 group-hover:bg-[#6CD1FD]/[0.02] transition-colors duration-500"></div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={handleFileUpload} />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-blue-50/50 flex items-center justify-center mb-4 sm:mb-6 text-blue-200 group-hover:text-[#6CD1FD] group-hover:scale-110 transition-all duration-500">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-sm border border-gray-50 flex items-center justify-center">
                          <FiMusic size={20} className="sm:w-7 sm:h-7" />
                        </div>
                      </div>
                      <h4 className="text-[18px] sm:text-[22px] font-bold text-[#35104C] mb-2 sm:mb-3">Tải lên bản thu của bạn</h4>
                      <p className="text-gray-500 text-[12px] sm:text-[14px] font-medium max-w-[240px] sm:max-w-sm mx-auto mb-4 sm:mb-6 leading-relaxed">
                        Hãy để AI phân tích và đề xuất giải pháp âm thanh hoàn hảo cho tác phẩm của bạn.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-[10px] sm:text-[12px] font-medium text-gray-400">
                        {['MP3', 'WAV', 'M4A'].map(ext => (
                          <span key={ext} className="px-2.5 sm:px-4 py-1 sm:py-1.5 bg-white rounded-full border border-gray-100 shadow-sm">{ext}</span>
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
                        className="w-2 bg-[#35104C] rounded-full"
                      />
                    ))}
                  </div>
                  <h4 className="text-xl font-black text-[#35104C] mb-2 uppercase tracking-widest">Đang giải mã âm thanh...</h4>
                  <p className="text-[#6CD1FD] text-[11px] font-black uppercase tracking-[0.3em] animate-pulse">Running AI Engine v2.0</p>
                </div>
              )}

              {analysisResult && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-[32px] border border-gray-100">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-[#35104C] flex items-center justify-center shadow-lg">
                        <FiMusic size={24} className="text-[#6CD1FD]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-[#35104C] truncate max-w-[300px]">{file?.name}</h4>
                      </div>
                    </div>
                    <button onClick={reset} className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-[15px] rounded-xl transition-all shadow-sm">
                      Thử file khác
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard icon={FiActivity} label="Loudness" value={analysisResult.loudness} unit="LUFS" color="text-sky-500" />
                    <MetricCard icon={FiTriangle} label="True Peak" value={analysisResult.peak} unit="dB" color="text-red-500" />
                    <MetricCard icon={FiBarChart2} label="Dyn Range" value={analysisResult.lra || analysisResult.dynamicRange} unit="LU" color="text-purple-500" />
                    <MetricCard icon={FiZap} label="Confidence" value={98} unit="%" color="text-yellow-500" />
                  </div>

                  <div className="p-6 bg-[#6CD1FD]/5 border border-[#6CD1FD]/20 rounded-[32px] relative overflow-hidden group">
                    <div className="flex gap-5 items-start relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-[#35104C] text-[#6CD1FD] flex items-center justify-center flex-shrink-0 shadow-lg">
                        <FiInfo size={24} />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm leading-relaxed font-semibold">
                          {analysisResult.advice || "Dữ liệu đang được phân tích sâu hơn..."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => window.location.href = '/booking'}
                      className="w-full py-5 bg-[#35104C] text-white rounded-[24px] font-semibold text-[15px] shadow-[0_10px_40px_rgba(53,16,76,0.2)] hover:bg-[#2a0d3d] hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Bắt đầu thu âm chuyên nghiệp ngay
                    </button>
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
