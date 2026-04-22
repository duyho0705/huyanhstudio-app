import { useState, useEffect, useRef } from "react";
import {
    FiSend,
    FiUser,
    FiSearch,
    FiClock,
    FiMoreVertical,
    FiMessageCircle,
    FiArrowLeft,
    FiImage,
    FiX,
    FiCheck,
    FiSettings,
    FiPlus,
    FiTrash2
} from "react-icons/fi";
import { db } from "../../../api/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, writeBatch } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";

const ChatManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showSidebar, setShowSidebar] = useState(true);
    const scrollRef = useRef(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const commonEmojis = ["😀", "😂", "🥰", "🙏", "👍", "😭", "✨", "🔥", "💯", "🎉", "📸", "🎥", "🎤", "🎧", "🎶", "🌟", "💌", "💖", "🎊", "👋", "✨", "🎵", "🥰", "🍀"];

    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [quickReplies, setQuickReplies] = useState([
        "hastudio xin chào! Bạn đang quan tâm đến dịch vụ Thu âm hay Chụp ảnh ạ?",
        "Dạ, bạn cho mình xin SĐT để các bạn Sale bên mình tư vấn và gửi báo giá chi tiết nhé! 💖",
        "Bên mình làm việc từ 8:00 - 22:00 tất cả các ngày. Bạn muốn đặt lịch khung giờ nào ạ?",
        "Để setup đúng phong cách mong muốn, bạn gửi giúp mình vài ảnh mẫu minh họa nhé!",
        "Nếu cần hỗ trợ gấp, bạn có thể gọi qua Hotline ạ. Cảm ơn bạn đã tin chọn hastudio!"
    ]);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);

    const formatTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMins = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMins / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMins < 1) return "Vừa xong";
        if (diffInMins < 60) return `${diffInMins} phút trước`;
        if (diffInHours < 24) return `${diffInHours} giờ trước`;
        if (diffInDays === 1) return "Hôm qua";
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    };

    const formatMessageTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const now = new Date();

        const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

        const timeStr = date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        if (isToday) return `hôm nay, ${timeStr}`;
        if (isYesterday) return `hôm qua, ${timeStr}`;

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${timeStr} ${day} tháng ${month}, ${year}`;
    };

    // 0. Listen to templates
    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "settings", "chat_templates"), (snapshot) => {
            if (snapshot.exists()) {
                setQuickReplies(snapshot.data().templates || []);
            }
        });
        return () => unsubscribe();
    }, []);

    const updateTemplates = async (newTemplates) => {
        try {
            await updateDoc(doc(db, "settings", "chat_templates"), {
                templates: newTemplates
            });
        } catch (err) {
            const { setDoc } = await import("firebase/firestore");
            await setDoc(doc(db, "settings", "chat_templates"), {
                templates: newTemplates
            });
        }
    };

    const handleAddTemplate = () => {
        if (!newTemplate.trim()) return;

        let updated;
        if (editingIndex !== null) {
            updated = [...quickReplies];
            updated[editingIndex] = newTemplate.trim();
            setEditingIndex(null);
        } else {
            updated = [...quickReplies, newTemplate.trim()];
        }

        setQuickReplies(updated);
        updateTemplates(updated);
        setNewTemplate("");
    };

    const handleDeleteTemplate = (index) => {
        const updated = quickReplies.filter((_, i) => i !== index);
        setQuickReplies(updated);
        updateTemplates(updated);
        if (editingIndex === index) {
            setEditingIndex(null);
            setNewTemplate("");
        }
    };

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
            alert("Dung lượng tệp quá lớn! Vui lòng chọn tệp dưới 10MB.");
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
            setUploadProgress(0);

            try {
                const formData = new FormData();
                formData.append('file', imageToUpload);
                formData.append('userId', selectedUser);

                const response = await axiosClient.post('/media/upload-chat', formData, {
                    headers: { 'Content-Type': undefined },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                });

                if (response.data && response.data.code === "UPLOAD_SUCCESS") {
                    imageUrl = response.data.data;
                } else if (response.code === "UPLOAD_SUCCESS") {
                    imageUrl = response.data;
                } else {
                    throw new Error(response.message || "Lỗi từ Server");
                }

                if (!finalMessage) {
                    if (imageToUpload.type.startsWith('image')) {
                        finalMessage = "Đã gửi một hình ảnh 📸";
                    } else if (imageToUpload.type.startsWith('video')) {
                        finalMessage = "Đã gửi một video 🎥";
                    } else {
                        finalMessage = `Đã gửi tệp: ${imageToUpload.name} 📄`;
                    }
                }
            } catch (error) {
                setUploadingImage(false);
                setInputValue(messageToSend);
                setSelectedImage(imageToUpload);
                alert("Lỗi tải lên: " + (error.response?.data?.message || error.message));
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
            setInputValue(messageToSend);
            setUploadingImage(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-80px)] w-full bg-white flex overflow-hidden relative">
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
                                            {u.unreadCount > 0 ? (
                                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                                                    {u.unreadCount > 99 ? '99+' : u.unreadCount}
                                                </span>
                                            ) : u.unread && (
                                                <span className="w-2.5 h-2.5 bg-red-500 rounded-full ring-4 ring-white"></span>
                                            )}
                                        </div>
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
                flex-1 flex-col bg-white min-w-0
                absolute md:relative inset-0 z-10 md:z-auto
            `}>
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
                            {/* Chat Header */}
                            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex items-center gap-3 sm:gap-4">
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
                                            <span className="text-[14px] sm:text-[14px] text-slate-600 font-medium">Đang hoạt động</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                                    <FiMoreVertical size={20} />
                                </button>
                            </div>

                            {/* Messages Area - ZERO LATENCY FLEX REVERSE */}
                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col-reverse bg-slate-50/30 scroll-smooth">
                                <div className="h-2 shrink-0" />
                                {[...messages].reverse().map((msg, idx) => {
                                    const reversedMsgs = [...messages].reverse();
                                    const olderMsg = reversedMsgs[idx + 1]; 
                                    const showTimeSeparator = !olderMsg ||
                                        (new Date(msg.timestamp).getTime() - new Date(olderMsg.timestamp).getTime() > 20 * 60 * 1000);

                                    const isStandaloneCard = msg.imageUrl && (
                                        msg.content === "Đã gửi một hình ảnh 📸" ||
                                        msg.content === "Đã gửi một video 🎥" ||
                                        msg.content.includes("Đã gửi tệp:") ||
                                        !msg.content
                                    );

                                    return (
                                        <div key={msg.id || idx} className="flex flex-col gap-4 mb-4">
                                            <div className={`flex ${msg.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`flex flex-col ${msg.senderId === 'admin' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%]`}>
                                                    <div
                                                        className={`rounded-2xl text-[14px] sm:text-[15px] leading-relaxed ${isStandaloneCard
                                                            ? ""
                                                            : `shadow-sm px-4 py-2.5 sm:px-5 sm:py-3 ${msg.senderId === 'admin'
                                                                ? 'bg-[#E9DCD6] text-slate-800 rounded-tr-none'
                                                                : 'bg-[#F0F0F0] text-slate-700 rounded-tl-none'
                                                            }`
                                                            }`}
                                                    >
                                                        {msg.imageUrl && (
                                                            <div className={`${!isStandaloneCard ? "mb-2" : ""} max-w-[280px] sm:max-w-[350px] rounded-2xl overflow-hidden cursor-pointer hover:opacity-95 transition-all shadow-md ring-1 ring-slate-100 bg-black/5`}>
                                                                <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer" className="block">
                                                                    {msg.imageUrl.toLowerCase().match(/\.(mp4|mov|webm|quicktime)$/) || msg.content.includes("video") ? (
                                                                        <video src={msg.imageUrl} className="w-full h-auto rounded-lg" />
                                                                    ) : msg.imageUrl.toLowerCase().match(/\.(printable|jpg|jpeg|png|gif|webp|heic)$/) || msg.content.includes("hình ảnh") ? (
                                                                        <img src={msg.imageUrl} alt="attachment" className="w-full h-auto object-cover rounded-lg" />
                                                                    ) : (
                                                                        <div className={`p-4 flex items-center gap-4 rounded-xl ${msg.senderId === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                                                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${msg.senderId === 'admin' ? 'bg-white/20' : 'bg-blue-50'}`}>
                                                                                <FiMessageCircle size={22} className={msg.senderId === 'admin' ? 'text-white' : 'text-blue-500'} />
                                                                            </div>
                                                                            <div className="flex-1 overflow-hidden text-left">
                                                                                <p className={`text-[13px] font-bold truncate ${msg.senderId === 'admin' ? 'text-white' : 'text-slate-700'}`}>
                                                                                    {msg.content.includes("Đã gửi tệp:")
                                                                                        ? msg.content.replace("Đã gửi tệp: ", "").replace(" 📄", "")
                                                                                        : "Tài liệu / Tệp"}
                                                                                </p>
                                                                                <p className={`text-[11px] font-medium truncate ${msg.senderId === 'admin' ? 'text-blue-100' : 'text-slate-400'}`}>Nhấn để xem/tải về</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </a>
                                                            </div>
                                                        )}
                                                        <div className="break-words">
                                                            {!isStandaloneCard && msg.content}
                                                        </div>
                                                    </div>
                                                    {msg.senderId === 'admin' && idx === 0 && (
                                                        <div className="mt-1 px-1">
                                                            <span className="text-[12px] sm:text-[13px] font-medium text-slate-500">
                                                                {msg.isRead ? "Đã xem" : "Đã gửi"}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {showTimeSeparator && (
                                                <div className="flex justify-center my-4">
                                                    <span className="text-[12px] sm:text-[13px] font-medium text-slate-500 bg-slate-100/50 px-3 py-1 rounded-full">
                                                        {formatMessageTime(msg.timestamp)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Quick Replies */}
                            <div className="px-4 sm:px-6 py-2.5 bg-slate-50 flex items-center gap-2 overflow-x-auto border-t border-slate-100 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {quickReplies.map((reply, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setInputValue(reply)}
                                        className="whitespace-nowrap px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-[13px] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm shrink-0"
                                    >
                                        {reply.length > 35 ? reply.substring(0, 35) + '...' : reply}
                                    </button>
                                ))}
                            </div>

                            <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
                                <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3 items-center">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-all shrink-0 shadow-sm"
                                    >
                                        <FiPlus size={20} />
                                    </button>
                                    <input type="file" accept="*" hidden ref={fileInputRef} onChange={handleImageSelect} />
                                    <div className="flex-1 relative flex items-center bg-slate-100 rounded-full px-2 shadow-inner border border-slate-200/50">
                                        <input
                                            type="text"
                                            placeholder={uploadingImage ? "Đang tải tệp..." : "Để lại lời nhắn..."}
                                            className="w-full pl-3 pr-10 py-2.5 sm:py-3 bg-transparent border-none text-[16px] focus:ring-0 outline-none text-slate-800"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            disabled={uploadingImage}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={uploadingImage || (!inputValue.trim() && !selectedImage)}
                                        className="text-blue-500 disabled:text-slate-300"
                                    >
                                        <FiSend size={24} />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/20 h-full">
                            <FiMessageCircle size={60} className="mb-4 opacity-20" />
                            <h3 className="text-xl font-bold text-slate-800">Chọn hội thoại</h3>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ChatManagement;
