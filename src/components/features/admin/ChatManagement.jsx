import { useState, useEffect, useRef } from "react";
import { 
    FiSend, 
    FiUser, 
    FiSearch, 
    FiClock, 
    FiMoreVertical,
    FiMessageCircle,
    FiArrowLeft
} from "react-icons/fi";
import { db } from "../../../api/firebase";
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    addDoc, 
    serverTimestamp,
    updateDoc,
    doc 
} from "firebase/firestore";

const ChatManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showSidebar, setShowSidebar] = useState(true);
    const scrollRef = useRef(null);

    // 1. Listen to chat list (sidebar)
    useEffect(() => {
        const q = query(collection(db, "chat_list"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userList);
        });
        return () => unsubscribe();
    }, []);

    // 2. Listen to messages for selected user
    useEffect(() => {
        if (!selectedUser) return;

        const q = query(
            collection(db, "chat_rooms", selectedUser, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate()?.toISOString() || new Date().toISOString()
            }));
            setMessages(msgs);
            
            // Mark as read when opening
            const userRef = doc(db, "chat_list", selectedUser);
            updateDoc(userRef, { unread: false }).catch(() => {});
        });

        return () => unsubscribe();
    }, [selectedUser]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSelectUser = (userId) => {
        setSelectedUser(userId);
        setShowSidebar(false); // on mobile, hide sidebar when selecting a user
    };

    const handleBackToList = () => {
        setShowSidebar(true);
        setSelectedUser(null);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !selectedUser) return;

        const chatMessage = {
            senderId: "admin",
            receiverId: selectedUser,
            content: inputValue,
            timestamp: serverTimestamp(),
        };

        try {
            // Add message to room
            await addDoc(collection(db, "chat_rooms", selectedUser, "messages"), chatMessage);
            
            // Update last message in chat list
            await updateDoc(doc(db, "chat_list", selectedUser), {
                lastMessage: inputValue,
                timestamp: serverTimestamp(),
                unread: false
            });

            setInputValue("");
        } catch (err) {
            console.error("Error sending admin message:", err);
        }
    };

    const filteredUsers = users.filter(u => 
        u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-120px)] w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 flex overflow-hidden border border-slate-100 relative">
            {/* Sidebar */}
            <div className={`
                ${showSidebar ? 'flex' : 'hidden'}
                md:flex
                w-full md:w-[320px] lg:w-[380px] 
                border-r border-slate-100 flex-col bg-slate-50/30
                absolute md:relative inset-0 z-20 md:z-auto
            `}>
                <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-[18px] sm:text-[20px] font-bold text-slate-800 flex items-center gap-2">
                            <FiMessageCircle className="text-blue-500" /> Tin nhắn
                        </h2>
                    </div>
                    
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 space-y-1">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => (
                            <button
                                key={u.id}
                                onClick={() => handleSelectUser(u.id)}
                                className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all ${
                                    selectedUser === u.id 
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                                    : "hover:bg-white text-slate-600 hover:shadow-md"
                                }`}
                            >
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-sm shrink-0 ${
                                    selectedUser === u.id ? "bg-white/20" : "bg-blue-50"
                                }`}>
                                    <FiUser size={18} className={selectedUser === u.id ? "text-white" : "text-blue-600"} />
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-[14px] sm:text-[15px] truncate pr-2">
                                            {u.userName || u.id}
                                        </p>
                                        {u.unread && (
                                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full ring-4 ring-white shrink-0"></span>
                                        )}
                                    </div>
                                    <p className={`text-[12px] sm:text-[13px] truncate ${selectedUser === u.id ? 'text-white/80' : 'text-slate-400'}`}>
                                        {u.lastMessage || "Chưa có tin nhắn"}
                                    </p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-400">
                            <FiSearch size={40} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm">Không tìm thấy ai</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`
                ${!showSidebar ? 'flex' : 'hidden'}
                md:flex
                flex-1 flex-col bg-white
                absolute md:relative inset-0 z-10 md:z-auto
            `}>
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-3 sm:gap-4">
                                {/* Back button for mobile */}
                                <button 
                                    onClick={handleBackToList}
                                    className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 md:hidden"
                                >
                                    <FiArrowLeft size={20} />
                                </button>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <FiUser size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-[15px] sm:text-[17px]">
                                        {users.find(u => u.id === selectedUser)?.userName || selectedUser}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        <span className="text-[11px] sm:text-[12px] text-slate-400 font-medium">Đang trực tuyến</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                                <FiMoreVertical size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 bg-slate-50/30">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex flex-col ${msg.senderId === 'admin' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%]`}>
                                        <div
                                            className={`p-3 sm:p-4 rounded-2xl text-[14px] sm:text-[15px] leading-relaxed shadow-sm ${
                                                msg.senderId === 'admin'
                                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                            }`}
                                        >
                                            {msg.content}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-2 text-[10px] sm:text-[11px] text-slate-400 font-medium px-1">
                                            <FiClock size={12} />
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 sm:p-6 bg-white border-t border-slate-100">
                            <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-4">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Để lại lời nhắn..."
                                        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 sm:px-8 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap"
                                >
                                    <span className="hidden sm:inline">Gửi</span> <FiSend />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/20 p-6">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-500 animate-bounce">
                            <FiMessageCircle size={40} />
                        </div>
                        <h3 className="text-[18px] sm:text-[22px] font-bold text-slate-800 mb-2 text-center">Chọn một cuộc hội thoại</h3>
                        <p className="text-slate-400 max-w-[300px] text-center text-[14px] sm:text-[15px]">
                            Chọn một khách hàng từ danh sách bên trái để bắt đầu hỗ trợ họ ngay lập tức!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatManagement;
