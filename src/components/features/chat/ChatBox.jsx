import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiUser, FiClock } from 'react-icons/fi';
import { AuthContext } from '../../../api/AuthContext';
import { db } from '../../../api/firebase';
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

const ChatBox = ({ isOpen, onToggle, onlyWindow = false }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef(null);

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

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.5, y: 100, x: 50, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 100, x: 50, transition: { duration: 0.3 } }}
            className="bg-white w-[320px] sm:w-[380px] h-[500px] rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#35104C] p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <FiUser className="text-white" size={20} />
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
                className="hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
              {messages.length === 0 && (
                <div className="text-center py-10 opacity-30">
                  <FiMessageCircle size={32} className="mx-auto mb-3 text-[#35104C]" />
                  <p className="text-xs font-bold text-[#35104C]">Để lại lời nhắn, tư vấn viên sẽ phản hồi bạn ngay!</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col ${msg.senderId === currentUserId ? 'items-end' : 'items-start'} max-w-[85%]`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.senderId === currentUserId
                        ? 'bg-[#35104C] text-white rounded-tr-none'
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                        }`}
                    >
                      {msg.imageUrl && (
                        <div className="mb-2 max-w-[200px] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-black/5">
                          <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                            <img src={msg.imageUrl} alt="attachment" className="w-full h-auto object-cover rounded-lg" />
                          </a>
                        </div>
                      )}
                      <div className="flex flex-wrap items-end gap-3">
                          <span className="flex-1 max-w-full break-words">
                              {msg.content !== "Đã gửi một hình ảnh 📸" && msg.content}
                          </span>
                          <span className={`text-[10px] sm:text-[11px] mt-1 shrink-0 ${msg.senderId === currentUserId ? 'text-white/70' : 'text-slate-400'}`}>
                              {formatMessageTime(msg.timestamp)}
                          </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-[#35104C] hover:bg-[#4a166a] text-white flex items-center justify-center transition-all shrink-0 shadow-sm"
              >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              </button>
              
              <div className="flex-1 relative flex items-center bg-slate-100 rounded-full px-2 shadow-inner border border-slate-200/50">
                <input
                  type="text"
                  placeholder="Nhập nội dung..."
                  className="w-full pl-3 pr-10 py-2 bg-transparent border-none text-[14px] focus:ring-0 outline-none placeholder:text-slate-500 text-slate-800"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                
                <div className="absolute right-1">
                    <button 
                        type="button"
                        className="w-7 h-7 rounded-full hover:bg-slate-200/80 text-[#35104C] flex items-center justify-center transition-all"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"></path><circle cx="9" cy="9" r="1.5" fill="white"></circle><circle cx="15" cy="9" r="1.5" fill="white"></circle></svg>
                    </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${!inputValue.trim()
                        ? "text-slate-300 pointer-events-none"
                        : "text-[#35104C] hover:bg-slate-100 active:scale-95"
                    }`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
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
            className="bg-[#35104C] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(53,16,76,0.3)] relative group"
          >
            <FiMessageCircle size={28} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#6CD1FD] rounded-full border-4 border-white shadow-sm"></span>

            <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-[#35104C] text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl">
              Hỗ trợ trực tuyến
            </div>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default ChatBox;
