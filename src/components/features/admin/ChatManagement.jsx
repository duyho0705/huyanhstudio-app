import { useState, useEffect, useRef } from "react";
import {
    FiSend,
    FiUser,
    FiSearch,
    FiMessageCircle,
    FiArrowLeft,
    FiMoreVertical,
    FiPlus
} from "react-icons/fi";
import { db } from "../../../api/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, writeBatch } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../../../api/axiosClient";
import { useTranslation } from "react-i18next";

const ChatManagement = () => {
    const { t, i18n } = useTranslation();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showSidebar, setShowSidebar] = useState(true);
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);

    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [quickReplies, setQuickReplies] = useState([
        "hastudio xin chào! Bạn đang quan tâm đến dịch vụ Thu âm hay Chụp ảnh ạ?",
        "Dạ, bạn cho mình xin SĐT để các bạn Sale bên mình tư vấn và gửi báo giá chi tiết nhé! 💖",
        "Bên mình làm việc từ 8:00 - 22:00 tất cả các ngày. Bạn muốn đặt lịch khung giờ nào ạ?",
        "Để setup đúng phong cách mong muốn, bạn gửi giúp mình vài ảnh mẫu minh họa nhé!",
        "Nếu cần hỗ trợ gấp, bạn có thể gọi qua Hotline ạ. Cảm ơn bạn đã tin chọn hastudio!"
    ]);

    const formatTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMins = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMins / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMins < 1) return t('admin.chat.just_now');
        if (diffInMins < 60) return `${diffInMins} ${t('admin.chat.mins_ago')}`;
        if (diffInHours < 24) return `${diffInHours} ${t('admin.chat.hours_ago')}`;
        if (diffInDays === 1) return t('admin.chat.yesterday');
        return date.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'vi-VN', { day: '2-digit', month: '2-digit' });
    };

    const formatMessageTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const now = new Date();

        const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

        const timeStr = date.toLocaleTimeString(i18n.language === 'en' ? 'en-US' : 'vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        if (isToday) return `${t('admin.chat.today')}, ${timeStr}`;
        if (isYesterday) return `${t('admin.chat.yesterday')}, ${timeStr}`;

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        if (i18n.language === 'en') {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${timeStr} ${monthNames[month - 1]} ${day}, ${year}`;
        }

        return `${timeStr} ${day} ${t('admin.chat.month')} ${month}, ${year}`;
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "settings", "chat_templates"), (snapshot) => {
            if (snapshot.exists()) {
                setQuickReplies(snapshot.data().templates || []);
            }
        });
        return () => unsubscribe();
    }, []);

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

            const unreadMessages = msgs.filter(m => m.senderId !== 'admin' && !m.isRead);
            if (unreadMessages.length > 0) {
                const batch = writeBatch(db);
                unreadMessages.forEach(m => {
                    const msgRef = doc(db, "chat_rooms", selectedUser, "messages", m.id);
                    batch.update(msgRef, { isRead: true });
                });

                const userRef = doc(db, "chat_list", selectedUser);
                batch.update(userRef, { unreadCount: 0, unread: false });
                batch.commit().catch(() => { });
            }
        });

        return () => unsubscribe();
    }, [selectedUser]);

    const handleSelectUser = (userId) => {
        setSelectedUser(userId);
        setShowSidebar(false);
    };

    const handleBackToList = () => {
        setShowSidebar(true);
        setSelectedUser(null);
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const MAX_FILE_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            alert("File too large! Max 10MB.");
            return;
        }
        setSelectedImage(file);
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl("file-placeholder");
        }
    };

    const clearImagePreview = () => {
        if (previewUrl && previewUrl !== "file-placeholder") URL.revokeObjectURL(previewUrl);
        setSelectedImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!inputValue.trim() && !selectedImage) || !selectedUser) return;

        const messageToSend = inputValue.trim();
        const imageToUpload = selectedImage;
        
        setInputValue("");
        clearImagePreview();

        let imageUrl = null;
        let finalMessage = messageToSend;

        if (imageToUpload) {
            setUploadingImage(true);
            try {
                const formData = new FormData();
                formData.append('file', imageToUpload);
                formData.append('userId', selectedUser);

                const response = await axiosClient.post('/media/upload-chat', formData, {
                    headers: { 'Content-Type': undefined }
                });

                if (response.data && response.data.code === "UPLOAD_SUCCESS") {
                    imageUrl = response.data.data;
                } else if (response.code === "UPLOAD_SUCCESS") {
                    imageUrl = response.data;
                }

                if (!finalMessage) {
                    if (imageToUpload.type.startsWith('image')) finalMessage = "Sent an image 📸";
                    else if (imageToUpload.type.startsWith('video')) finalMessage = "Sent a video 🎥";
                    else finalMessage = `Sent a file: ${imageToUpload.name} 📄`;
                }
            } catch (error) {
                setUploadingImage(false);
                setInputValue(messageToSend);
                return;
            }
        }

        const chatMessage = {
            senderId: "admin",
            receiverId: selectedUser,
            content: finalMessage,
            timestamp: serverTimestamp(),
            ...(imageUrl && { imageUrl })
        };

        try {
            await Promise.all([
                addDoc(collection(db, "chat_rooms", selectedUser, "messages"), chatMessage),
                updateDoc(doc(db, "chat_list", selectedUser), {
                    lastMessage: finalMessage,
                    timestamp: serverTimestamp(),
                    unread: false
                })
            ]);
            setUploadingImage(false);
        } catch (err) {
            setUploadingImage(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-80px)] w-full bg-white flex overflow-hidden relative">
            <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-[320px] lg:w-[380px] border-r border-slate-100 flex-col bg-slate-50/30 absolute md:relative inset-0 z-20 md:z-auto`}>
                <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-[18px] sm:text-[20px] font-bold text-slate-800 flex items-center gap-2">
                            <FiMessageCircle className="text-blue-500" /> {t('admin.chat.title')}
                        </h2>
                    </div>

                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('admin.chat.search_placeholder')}
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
                                className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all ${selectedUser === u.id
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : "hover:bg-white text-slate-600 hover:shadow-md"
                                    }`}
                            >
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-sm shrink-0 ${selectedUser === u.id ? "bg-white/20" : "bg-blue-50"
                                    }`}>
                                    <FiUser size={18} className={selectedUser === u.id ? "text-white" : "text-blue-600"} />
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-[14px] sm:text-[15px] truncate pr-2">
                                            {u.userName || u.id}
                                        </p>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {u.timestamp && (
                                                <span className={`text-[10px] sm:text-[11px] font-medium ${selectedUser === u.id ? 'text-white/80' : 'text-slate-400'}`}>
                                                    {formatTime(u.timestamp?.toDate()?.toISOString())}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className={`text-[12px] sm:text-[13px] truncate ${selectedUser === u.id ? 'text-white/80' : 'text-slate-400'}`}>
                                        {u.lastMessage || t('admin.chat.no_messages')}
                                    </p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-400">
                            <FiSearch size={40} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm">{t('admin.chat.no_users')}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className={`${!showSidebar ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-white min-w-0 absolute md:relative inset-0 z-10 md:z-auto`}>
                <AnimatePresence mode="wait">
                    {selectedUser ? (
                        <motion.div
                            key={selectedUser}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 flex flex-col min-w-0 h-full"
                        >
                            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <button onClick={handleBackToList} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 md:hidden">
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
                                            <span className="text-[14px] text-slate-600 font-medium">{t('admin.chat.active')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col-reverse bg-slate-50/30 scroll-smooth">
                                <div className="h-2 shrink-0" />
                                {[...messages].reverse().map((msg, idx) => {
                                    const reversedMsgs = [...messages].reverse();
                                    const olderMsg = reversedMsgs[idx + 1]; 
                                    const showTimeSeparator = !olderMsg || (new Date(msg.timestamp).getTime() - new Date(olderMsg.timestamp).getTime() > 20 * 60 * 1000);

                                    return (
                                        <div key={msg.id || idx} className="flex flex-col gap-4 mb-4">
                                            <div className={`flex ${msg.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`flex flex-col ${msg.senderId === 'admin' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%]`}>
                                                    <div className={`rounded-2xl text-[14px] sm:text-[15px] shadow-sm px-4 py-2.5 sm:px-5 sm:py-3 ${msg.senderId === 'admin' ? 'bg-[#E9DCD6] text-slate-800 rounded-tr-none' : 'bg-[#F0F0F0] text-slate-700 rounded-tl-none'}`}>
                                                        {msg.imageUrl && (
                                                            <div className="mb-2 max-w-[280px] rounded-2xl overflow-hidden shadow-md">
                                                                <img src={msg.imageUrl} alt="" className="w-full h-auto" />
                                                            </div>
                                                        )}
                                                        <div className="break-words">{msg.content}</div>
                                                    </div>
                                                    {msg.senderId === 'admin' && (
                                                        <div className="mt-1 px-1">
                                                            <span className="text-[12px] font-medium text-slate-500">{msg.isRead ? t('admin.chat.read') : t('admin.chat.sent')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {showTimeSeparator && (
                                                <div className="flex justify-center my-4">
                                                    <span className="text-[12px] font-medium text-slate-500 bg-slate-100/50 px-3 py-1 rounded-full">{formatMessageTime(msg.timestamp)}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="px-4 sm:px-6 py-2.5 bg-slate-50 flex items-center gap-2 overflow-x-auto border-t border-slate-100 scrollbar-hide">
                                {quickReplies.map((reply, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setInputValue(reply)}
                                        className="whitespace-nowrap px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-[13px] font-medium text-slate-600 hover:bg-blue-50 transition-all shadow-sm shrink-0"
                                    >
                                        {reply.length > 35 ? reply.substring(0, 35) + '...' : reply}
                                    </button>
                                ))}
                            </div>

                            <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
                                <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3 items-center">
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm"><FiPlus size={20} /></button>
                                    <input type="file" accept="*" hidden ref={fileInputRef} onChange={handleImageSelect} />
                                    <div className="flex-1 bg-slate-100 rounded-full px-2 border border-slate-200/50">
                                        <input
                                            type="text"
                                            placeholder={uploadingImage ? t('admin.chat.sending') : t('admin.chat.placeholder')}
                                            className="w-full pl-3 pr-4 py-2.5 sm:py-3 bg-transparent border-none text-[16px] outline-none text-slate-800"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            disabled={uploadingImage}
                                        />
                                    </div>
                                    <button type="submit" disabled={uploadingImage || (!inputValue.trim() && !selectedImage)} className="text-blue-500 disabled:text-slate-300"><FiSend size={24} /></button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/20 h-full">
                            <FiMessageCircle size={60} className="mb-4 opacity-20" />
                            <h3 className="text-xl font-bold text-slate-800">{t('admin.chat.select_convo')}</h3>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ChatManagement;
