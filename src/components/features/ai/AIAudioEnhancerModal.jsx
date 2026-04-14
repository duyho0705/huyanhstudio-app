import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUploadCloud, FiZap, FiMusic, FiCheck, FiPlay, FiPause, FiDownload, FiInfo } from "react-icons/fi";
import aiApi from "../../../api/aiApi";

const AIAudioEnhancerModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [resultReady, setResultReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  const steps = [
    "Đang tải file lên hệ thống hastudio...",
    "Đang phân tích phổ âm thanh...",
    "Loại bỏ tạp âm môi trường (Denoising)...",
    "Cân bằng tần số EQ chuyên nghiệp...",
    "Tối ưu hóa âm sắc giọng hát...",
    "Đang tạo bản demo chất lượng cao..."
  ];

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith("audio/")) {
      setFile(uploadedFile);
      startRealProcessing(uploadedFile);
    }
  };

  const startRealProcessing = async (targetFile) => {
    setIsProcessing(true);
    setProcessStep(0);

    try {
      // 1. Gửi file lên Backend
      const response = await aiApi.enhance(targetFile);
      const uuid = response.uuid;

      // 2. Chạy thanh tiến trình ảo cho đẹp
      const stepInterval = setInterval(() => {
        setProcessStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 4000);

      // 3. Polling kiểm tra trạng thái AI thật từ Auphonic
      const pollInterval = setInterval(async () => {
        try {
          const statusResp = await aiApi.getStatus(uuid);
          const statusText = statusResp.status;

          if (statusText !== "PROCESSING" && statusText !== "FAILED") {
            clearInterval(stepInterval);
            clearInterval(pollInterval);
            setResultUrl(statusText);
            setIsProcessing(false);
            setResultReady(true);
          }
        } catch (err) {
          console.error("Lỗi kiểm tra trạng thái AI:", err);
        }
      }, 3000);

    } catch (error) {
      console.error("Lỗi AI Enhance:", error);
      setIsProcessing(false);
      alert("Hệ thống AI đang bận hoặc file không hợp lệ. Vui lòng thử lại sau.");
    }
  };

  const reset = () => {
    setFile(null);
    setIsProcessing(false);
    setResultReady(false);
    setProcessStep(0);
    setResultUrl(null);
    setIsPlaying(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/50 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#6CD1FD]/20 to-[#35104C]/5 -z-10" />

            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-3xl font-black text-[#35104C]">hastudio AI</h3>
                  </div>
                </div>
              </div>

              {/* Important Notes - Moved here */}
              {!resultReady && !isProcessing && (
                <div className="mb-8 p-4 bg-slate-50 rounded-2xl text-left border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-500">
                  <p className="text-[14px] font-semibold text-slate-600 mb-2 flex items-center gap-2">
                    <FiInfo />Lưu ý:
                  </p>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-[14px] text-slate-600 ml-1">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#6CD1FD] mt-1.5 flex-shrink-0" />
                      Định dạng: MP3, WAV, M4A.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#6CD1FD] mt-1.5 flex-shrink-0" />
                      Đây chỉ là trải nghiệm tạm thời
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#6CD1FD] mt-1.5 flex-shrink-0" />
                      Trải nghiệm cùng AI để thấy sự khác biệt
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#6CD1FD] mt-1.5 flex-shrink-0" />
                      AI sẽ cho bạn demo một đoạn ngắn
                    </li>
                  </ul>
                </div>
              )}

              {!file && !isProcessing && !resultReady && (
                <div className="text-center py-6">
                  <motion.div
                    whileHover={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-slate-200 rounded-[32px] p-12 cursor-pointer hover:border-[#6CD1FD] hover:bg-[#6CD1FD]/5 transition-all group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="audio/*"
                      onChange={handleFileUpload}
                    />
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-400 group-hover:text-[#6CD1FD] group-hover:bg-white transition-all shadow-sm">
                      <FiUploadCloud size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-[#35104C] mb-2">Tải lên đoạn thu âm của bạn</h4>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">Click để chọn file từ thiết bị của bạn.</p>
                  </motion.div>

                  <div className="mt-8 flex items-center justify-center gap-6 text-slate-600 flex-wrap">
                    <div className="flex items-center gap-2 font-semibold"><FiCheck className="text-slate-600" /> Lọc nhiễu nền</div>
                    <div className="flex items-center gap-2 font-semibold"><FiCheck className="text-slate-600" /> Cân bằng âm sắc</div>
                    <div className="flex items-center gap-2 font-semibold"><FiCheck className="text-slate-600" /> Giọng hát trong trẻo</div>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="py-12 text-center">
                  <div className="relative w-32 h-32 mx-auto mb-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-4 border-dashed border-[#6CD1FD]"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-4 rounded-full bg-[#35104C] flex items-center justify-center text-[#6CD1FD]"
                    >
                      <FiZap size={32} />
                    </motion.div>
                  </div>

                  <h4 className="text-xl font-bold text-[#35104C] mb-2">Hệ thống AI đang phù phép...</h4>
                  <div className="max-w-xs mx-auto">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((processStep + 1) / steps.length) * 100}%` }}
                        className="h-full bg-gradient-to-r from-[#6CD1FD] to-[#35104C]"
                      />
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={processStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm font-bold text-slate-400 uppercase tracking-widest"
                      >
                        {steps[processStep]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {resultReady && (
                <div className="py-6">
                  <div className="bg-slate-900 rounded-[30px] p-8 text-white relative overflow-hidden mb-8 shadow-2xl">
                    <div className="absolute top-0 right-0 p-4">
                      <span className="px-3 py-1 bg-[#6CD1FD] text-[#35104C] text-[10px] font-black rounded-full uppercase italic">Thành quả của bạn</span>
                    </div>

                    <div className="flex items-center gap-6 mb-8">
                      <button
                        onClick={() => {
                          if (isPlaying) audioRef.current.pause();
                          else audioRef.current.play();
                          setIsPlaying(!isPlaying);
                        }}
                        className="w-16 h-16 rounded-full bg-[#6CD1FD] text-[#35104C] flex items-center justify-center hover:scale-110 transition-all shadow-lg active:scale-95"
                      >
                        {isPlaying ? <FiPause size={28} /> : <FiPlay className="ml-1" size={28} />}
                      </button>
                      <audio
                        ref={audioRef}
                        src={resultUrl}
                        onEnded={() => setIsPlaying(false)}
                        hidden
                      />
                      <div>
                        <p className="text-[#6CD1FD] text-xs font-black uppercase tracking-widest mb-1">Bản ghi đã làm sạch bới AI</p>
                        <h5 className="text-xl font-bold truncate max-w-[300px]">{file.name}</h5>
                      </div>
                    </div>

                    <div className="flex items-end gap-1 h-12 mb-2">
                      {[...Array(30)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: isPlaying ? [10, 40, 20, 35, 10] : 10 }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.05 }}
                          className="flex-1 bg-gradient-to-t from-[#6CD1FD] to-[#6CD1FD]/20 rounded-full"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <a
                      href={resultUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-16 rounded-2xl bg-[#35104C] text-white font-bold flex items-center justify-center gap-3 hover:bg-[#4a166b] transition-all shadow-xl no-underline"
                    >
                      <FiDownload size={20} /> Tải bản Demo
                    </a>
                    <button
                      onClick={reset}
                      className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-all font-bold"
                      title="Thử lại file khác"
                    >
                      <FiMusic size={20} />
                    </button>
                  </div>

                  <div className="mt-8 p-6 bg-blue-50 rounded-[24px] border border-blue-100 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <FiInfo size={20} />
                    </div>
                    <p className="text-sm text-blue-800 leading-relaxed italic">
                      "Đây là bản xử lý bằng công nghệ AI tự động. Tại <strong>Hastudio</strong>, chúng tôi có dàn thiết bị hàng tỷ đồng cùng các kỹ sư âm thanh chuyên nghiệp để biến bản thu của bạn thành một tuyệt phẩm thực thụ."
                    </p>
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
