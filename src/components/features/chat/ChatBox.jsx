import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiUser, FiClock, FiPlus, FiSmile, FiPaperclip } from 'react-icons/fi';
import { AuthContext } from '../../../api/AuthContext';
import { db } from '../../../api/firebase';
import axiosClient from '../../../api/axiosClient';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  setDoc,
  doc
} from 'firebase/firestore';

import boss from '../../../assets/boss.png';

const ChatBox = ({ isOpen, onToggle, onlyWindow = false }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentUserId = user?.email || user?.username || user?.id || user?.customerName;

  const formatMessageTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();

    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

    const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    if (isToday) return timeStr;
    if (isYesterday) return `Hôm qua ${timeStr}`;
    return `${timeStr} ${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}`;
  };

  useEffect(() => {
    if (!currentUserId) return;

    // Listen to messages from Firestore
    const q = query(
      collection(db, 'chat_rooms', currentUserId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()?.toISOString() || new Date().toISOString()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentUserId) return;

    const chatMessage = {
      senderId: currentUserId,
      receiverId: 'admin',
      content: inputValue,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'chat_rooms', currentUserId, 'messages'), chatMessage);

      await setDoc(doc(db, 'chat_list', currentUserId), {
        userId: currentUserId,
        userName: user.customerName || currentUserId,
        lastMessage: inputValue,
        timestamp: serverTimestamp(),
        unread: true
      });

      setInputValue('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUserId || uploading) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosClient.post('/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const fileUrl = response.data;
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      let messageContent = "Đã gửi một tệp 📄";
      if (isImage) messageContent = "Đã gửi một hình ảnh 📸";
      else if (isVideo) messageContent = "Đã gửi một video 🎥";

      const chatMessage = {
        senderId: currentUserId,
        receiverId: 'admin',
        content: messageContent,
        imageUrl: fileUrl,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'chat_rooms', currentUserId, 'messages'), chatMessage);
      await setDoc(doc(db, 'chat_list', currentUserId), {
        userId: currentUserId,
        userName: user.customerName || currentUserId,
        lastMessage: messageContent,
        timestamp: serverTimestamp(),
        unread: true
      });

    } catch (err) {
      console.error('Error uploading file:', err);
      alert("Gửi tệp thất bại. Vui lòng thử lại!");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*"
      />
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.5, y: 100, x: 50, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 100, x: 50, transition: { duration: 0.3 } }}
            className="bg-white w-[calc(100vw-48px)] sm:w-[380px] h-[min(600px,calc(90vh))] rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#E9DCD6] p-5 flex items-center justify-between text-slate-800 border-b border-black/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-black/10 overflow-hidden flex items-center justify-center bg-white">
                  <img
                    src={boss}
                    alt="Boss"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[17px]">Hỗ trợ trực tuyến</h3>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(false);
                }}
                className="hover:bg-black/5 p-2 rounded-full transition-colors text-slate-600"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
              {messages.length === 0 && (
                <div className="text-center py-10 opacity-30">
                  <FiMessageCircle size={32} className="mx-auto mb-3 text-[#E9DCD6]" />
                  <p className="text-xs font-bold text-slate-600">Để lại lời nhắn, tư vấn viên sẽ phản hồi bạn ngay!</p>
                </div>
              )}
              {messages.map((msg, idx) => {
                const prevMsg = messages[idx - 1];
                const showTimeSeparator = !prevMsg ||
                  (new Date(msg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime() > 20 * 60 * 1000);

                return (
                  <div key={idx} className="space-y-4">
                    {showTimeSeparator && (
                      <div className="flex justify-center mb-6 mt-2">
                        <span className="text-[12px] font-medium text-slate-500">
                          {formatMessageTime(msg.timestamp)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex flex-col ${msg.senderId === currentUserId ? 'items-end' : 'items-start'} max-w-[85%]`}>
                        <div
                          className={`px-4 py-2.5 rounded-[22px] text-[15px] leading-relaxed shadow-sm ${msg.senderId === currentUserId
                            ? 'bg-[#E9DCD6] text-slate-800 rounded-tr-none'
                            : 'bg-[#F0F0F0] text-slate-700 rounded-tl-none'
                            }`}
                        >
                          {msg.imageUrl && (
                            <div className="mb-2 max-w-[240px] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                              <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                                {msg.imageUrl.toLowerCase().match(/\.(printable|jpg|jpeg|png|gif|webp|heic)$/) ? (
                                  <img src={msg.imageUrl} alt="attachment" className="w-full h-auto object-cover rounded-lg shadow-sm" />
                                ) : (
                                  <div className={`p-4 flex items-center gap-3 rounded-xl ${msg.senderId === currentUserId ? 'bg-black/10' : 'bg-white shadow-sm'}`}>
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${msg.senderId === currentUserId ? 'bg-white/40' : 'bg-blue-50'}`}>
                                      <FiPaperclip size={20} className={msg.senderId === currentUserId ? 'text-slate-700' : 'text-blue-500'} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                      <p className="text-[13px] font-bold truncate text-slate-700">
                                        {msg.content.includes("Đã gửi một tệp") ? "Tài liệu / Tệp tin" : msg.content.replace("Đã gửi tệp: ", "").replace(" 📄", "")}
                                      </p>
                                      <p className="text-[13px] opacity-60 truncate">Nhấn để tải về</p>
                                    </div>
                                  </div>
                                )}
                              </a>
                            </div>
                          )}
                          <div className="break-words">
                            {(!msg.imageUrl || (
                              !msg.content.includes("Đã gửi một hình ảnh") &&
                              !msg.content.includes("Đã gửi một video") &&
                              !msg.content.includes("Đã gửi một tệp") &&
                              !msg.content.includes("Đã gửi tệp:")
                            )) && msg.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2">
              {uploading && (
                <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg animate-pulse mb-1">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[11px] font-bold">Đang tải tệp lên...</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFileClick}
                  disabled={uploading}
                  className="w-10 h-10 rounded-full bg-[#E9DCD6] text-slate-700 flex items-center justify-center shadow-sm shrink-0 active:scale-95 disabled:opacity-50"
                >
                  <FiPlus size={20} />
                </button>

                <div className="flex-1 relative flex items-center bg-slate-100 rounded-full px-2 shadow-inner border border-slate-200/50">
                  <input
                    type="text"
                    placeholder="Nhập nội dung..."
                    className="w-full pl-3 pr-10 py-2.5 bg-transparent border-none text-[16px] focus:ring-0 outline-none placeholder:text-slate-500 text-slate-800"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={uploading}
                  />

                  <div className="absolute right-1">
                    <button
                      type="button"
                      className="w-7 h-7 rounded-full hover:bg-slate-200/80 text-slate-500 flex items-center justify-center transition-all"
                    >
                      <FiSmile size={20} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || uploading}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${!inputValue.trim() || uploading
                    ? "text-slate-300 pointer-events-none"
                    : "text-slate-700 hover:bg-slate-100 active:scale-95"
                    }`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </form>
          </motion.div>
        ) : !onlyWindow ? (
          <motion.button
            key="chat-button"
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(true)}
            className="bg-[#E9DCD6] text-slate-700 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-white relative group"
          >
            <FiMessageCircle size={28} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#6CD1FD] rounded-full border-4 border-white shadow-sm"></span>

            <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-[#E9DCD6] text-slate-700 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl border border-slate-200">
              Hỗ trợ trực tuyến
            </div>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default ChatBox;
