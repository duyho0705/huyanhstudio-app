import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiUser } from 'react-icons/fi';
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

const ChatBox = ({ isOpen, onToggle }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [guestId, setGuestId] = useState(null);
  const scrollRef = useRef(null);

  // Tạo hoặc lấy Guest ID nếu chưa đăng nhập
  useEffect(() => {
    if (!user) {
      let storedGuestId = localStorage.getItem('hastudio_guest_id');
      if (!storedGuestId) {
        storedGuestId = 'guest_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('hastudio_guest_id', storedGuestId);
      }
      setGuestId(storedGuestId);
    } else {
      setGuestId(null);
    }
  }, [user]);

  const currentUserId = user ? (user.email || user.username || user.id || user.customerName) : guestId;

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
      isGuest: !user
    };

    try {
      await addDoc(collection(db, 'chat_rooms', currentUserId, 'messages'), chatMessage);

      await setDoc(doc(db, 'chat_list', currentUserId), {
        userId: currentUserId,
        userName: user ? (user.customerName || currentUserId) : 'Khách vãng lai (' + currentUserId.slice(-4) + ')',
        lastMessage: inputValue,
        timestamp: serverTimestamp(),
        unread: true,
        isGuest: !user
      });

      setInputValue('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

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
                  <h3 className="font-bold text-[15px]">Hỗ trợ trực tuyến</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    <p className="text-[11px] text-white/60">Chúng tôi sẵn sàng giúp bạn</p>
                  </div>
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
                  <div
                    className={`max-w-[85%] p-3 px-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                      msg.senderId === currentUserId
                        ? 'bg-[#35104C] text-white rounded-tr-none'
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập nội dung..."
                className="flex-1 bg-slate-100/50 border-none rounded-2xl px-4 py-2.5 text-[13px] focus:ring-1 focus:ring-[#35104C]/10 outline-none transition-all"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className="p-3 bg-[#35104C] text-[#6CD1FD] rounded-xl shadow-lg border-none active:scale-90 transition-all"
              >
                <FiSend size={18} />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.button
            key="chat-button"
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(true)}
            className="bg-[#35104C] text-white w-16 h-16 rounded-[24px] flex items-center justify-center shadow-[0_10px_30px_rgba(53,16,76,0.3)] relative group"
          >
            <FiMessageCircle size={28} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#6CD1FD] rounded-full border-4 border-white shadow-sm"></span>
            
            <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-[#35104C] text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl">
               Hỗ trợ trực tuyến ✨
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBox;
