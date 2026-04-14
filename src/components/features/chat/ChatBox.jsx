import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiUser, FiPhone } from 'react-icons/fi';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { AuthContext } from '../../../api/AuthContext';
import axiosClient from '../../../api/axiosClient';

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const scrollRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8080';
  const WS_URL = `${API_BASE_URL}/ws`;

  useEffect(() => {
    if (user) {
      fetchHistory();
      connectWebSocket();
    }
    return () => {
      if (stompClient) stompClient.deactivate();
    };
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const fetchHistory = async () => {
    try {
      const res = await axiosClient.get(`${API_BASE_URL}/api/chat/history`, {
        params: { userId1: user.email, userId2: 'admin' }
      });
      setMessages(res); 
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  const connectWebSocket = () => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      onConnect: () => {
        console.log('Connected to WebSocket');
        client.subscribe(`/user/${user.email}/queue/messages`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      },
    });

    client.activate();
    setStompClient(client);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !stompClient) return;

    const chatMessage = {
      senderId: user.email,
      receiverId: 'admin',
      content: inputValue,
    };

    stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(chatMessage),
    });

    setMessages((prev) => [...prev, { ...chatMessage, timestamp: new Date().toISOString() }]);
    setInputValue('');
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
            className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-[32px] shadow-2xl shadow-indigo-500/20 border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#35104C] p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-400/20 flex items-center justify-center border border-white/10">
                  <FiUser className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] leading-none mb-1">Hỗ trợ trực tuyến</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <p className="text-[11px] text-white/60 font-medium">Đang trực tuyến</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <a 
                  href="tel:0359891654" 
                  className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
                  title="Gọi hotline"
                >
                  <FiPhone size={18} className="text-white" />
                </a>
                <a 
                  href="https://zalo.me/0359891654" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
                  title="Chat Zalo"
                >
                  <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center text-[#0068ff] font-black text-[10px]">Z</div>
                </a>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors ml-1">
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
              {messages.length === 0 && (
                <div className="text-center py-10 opacity-40">
                  <FiMessageCircle size={40} className="mx-auto mb-3" />
                  <p className="text-sm font-medium">Bắt đầu cuộc trò chuyện với chúng tôi!</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.senderId === user.email ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                      msg.senderId === user.email
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
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-slate-100/50 border-none rounded-2xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-[#6CD1FD]/20 outline-none transition-all placeholder:text-slate-400"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className="p-3 bg-[#35104C] text-white rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all active:scale-95"
              >
                <FiSend size={18} />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-[#35104C] text-white w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 relative group"
          >
            <FiMessageCircle size={28} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6CD1FD] rounded-full border-2 border-white"></span>
            <div className="absolute right-full mr-4 bg-white text-slate-700 px-4 py-2 rounded-xl text-sm font-bold shadow-xl border border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Chat với chúng tôi!
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBox;
