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

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!user || (!user.id && !user.email && !user.username && !user.customerName)) return;

    const userId = user.email || user.username || user.id || user.customerName;
    
    // Listen to messages from Firestore
    const q = query(
      collection(db, 'chat_rooms', userId, 'messages'),
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
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;

    const userId = user.email || user.username || user.id || user.customerName;
    const chatMessage = {
      senderId: userId,
      receiverId: 'admin',
      content: inputValue,
      timestamp: serverTimestamp(),
    };

    try {
      // 1. Add message to the conversation
      await addDoc(collection(db, 'chat_rooms', userId, 'messages'), chatMessage);

      // 2. Update chat list for admin to see
      await setDoc(doc(db, 'chat_list', userId), {
        userId: userId,
        userName: user.customerName || userId,
        lastMessage: inputValue,
        timestamp: serverTimestamp(),
        unread: true
      });

      setInputValue('');
    } catch (err) {
      console.error('Error sending message to Firebase:', err);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-[32px] shadow-2xl shadow-indigo-500/20 border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#35104C] p-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <FiUser className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[16px]">Hỗ trợ trực tuyến</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <p className="text-[12px] text-white/60">Sẵn sàng hỗ trợ bạn</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <FiX size={24} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
              {messages.length === 0 && (
                <div className="text-center py-10 opacity-40">
                  <FiMessageCircle size={40} className="mx-auto mb-3 text-[#35104C]" />
                  <p className="text-sm font-bold text-[#35104C]">Xin chào! Chúng tôi có thể giúp gì cho bạn?</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.senderId === (user.email || user.username || user.id || user.customerName) ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                      msg.senderId !== 'admin'
                        ? 'bg-[#6CD1FD] text-white rounded-tr-none'
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập nội dung tin nhắn..."
                className="flex-1 bg-slate-100/50 border-none rounded-2xl px-5 py-3 text-[14px] focus:ring-2 focus:ring-[#6CD1FD]/20 outline-none transition-all"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className="p-4 bg-[#35104C] text-white rounded-2xl shadow-lg border-none active:scale-95 transition-all"
              >
                <FiSend size={20} />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-[#35104C] text-white w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl relative"
          >
            <FiMessageCircle size={30} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#6CD1FD] rounded-full border-4 border-white"></span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBox;
