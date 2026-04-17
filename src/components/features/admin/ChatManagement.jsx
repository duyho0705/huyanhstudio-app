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
    FiX
} from "react-icons/fi";
import { db, storage } from "../../../api/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
    const fileInputRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const commonEmojis = ["😀", "😂", "🥰", "🙏", "👍", "😭", "✨", "🔥", "💯", "🎉", "📸", "🎥", "🎤", "🎧", "🎶", "🌟", "💌", "💖", "🎊", "👋", "✨", "🎵", "🥰", "🍀"];

    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const quickReplies = [
        "hastudio xin chào! Bạn đang quan tâm đến dịch vụ Thu âm hay Chụp ảnh ạ?",
        "Dạ, bạn cho mình xin SĐT để các bạn Sale bên mình tư vấn và gửi báo giá chi tiết nhé! 💖",
        "Bên mình làm việc từ 8:00 - 22:00 tất cả các ngày. Bạn muốn đặt lịch khung giờ nào ạ?",
        "Để setup đúng phong cách mong muốn, bạn gửi giúp mình vài ảnh mẫu minh họa nhé!",
        "Nếu cần hỗ trợ gấp, bạn có thể gọi qua Hotline ạ. Cảm ơn bạn đã tin chọn hastudio!"
    ];

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

        const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        if (isToday) return timeStr;
        if (isYesterday) return `Hôm qua ${timeStr}`;
        return `${timeStr} ${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}`;
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

            // Mark as read when opening
            const userRef = doc(db, "chat_list", selectedUser);
            updateDoc(userRef, { unreadCount: 0, unread: false }).catch(() => { });
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

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn tệp hình ảnh hợp lệ!");
            return;
        }
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const clearImagePreview = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setSelectedImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!inputValue.trim() && !selectedImage) || !selectedUser) return;

        let imageUrl = null;
        let finalMessage = inputValue.trim();

        if (selectedImage) {
            setUploadingImage(true);
            try {
                const formData = new FormData();
                formData.append('file', selectedImage);
                formData.append('userId', selectedUser);

                const token = localStorage.getItem("accessToken");
                const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, "");
                
                // Upload through Spring Boot Backend (which syncs to Cloudinary)
                const uploadResponse = await fetch(`${baseUrl}/media/upload-chat`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                
                if (!uploadResponse.ok) {
                    throw new Error("Lỗi mạng khi tải lên backend");
                }
                
                const responseData = await uploadResponse.json();
                
                if (responseData.code === 'UPLOAD_SUCCESS') {
                    imageUrl = responseData.data; // secure_url from Cloudinary
                } else {
                    throw new Error(responseData.message || "Lỗi tải ảnh");
                }

                if (!finalMessage) finalMessage = "Đã gửi một hình ảnh 📸";
            } catch (error) {
                console.error("Error uploading image:", error);
                setUploadingImage(false);
                alert("Lỗi tải ảnh lên: " + error.message);
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
            await addDoc(collection(db, "chat_rooms", selectedUser, "messages"), chatMessage);

            await updateDoc(doc(db, "chat_list", selectedUser), {
                lastMessage: finalMessage,
                timestamp: serverTimestamp(),
                unread: false
            });

            setInputValue("");
            clearImagePreview();
            setUploadingImage(false);
        } catch (err) {
            console.error("Error sending admin message:", err);
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
                                            className={`px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-[14px] sm:text-[15px] leading-relaxed shadow-sm ${msg.senderId === 'admin'
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                                }`}
                                        >
                                            {msg.imageUrl && (
                                                <div className="mb-2 max-w-[200px] sm:max-w-[250px] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-black/5">
                                                    <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                                                        <img src={msg.imageUrl} alt="chat attachment" className="w-full h-auto object-cover rounded-lg" />
                                                    </a>
                                                </div>
                                            )}
                                            <div className="flex flex-wrap items-end gap-3">
                                                <span className="flex-1 max-w-full break-words">
                                                    {msg.content !== "Đã gửi một hình ảnh 📸" && msg.content}
                                                </span>
                                                <span className={`text-[10px] sm:text-[11px] mt-1 shrink-0 ${msg.senderId === 'admin' ? 'text-blue-200' : 'text-slate-400'}`}>
                                                    {formatMessageTime(msg.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Image Preview Area */}
                        {previewUrl && (
                            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={clearImagePreview}
                                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 hover:bg-red-500 rounded-full text-white flex items-center justify-center transition-colors"
                                    >
                                        <FiX size={12} />
                                    </button>
                                </div>
                                <span className="text-sm font-medium text-slate-500">Đính kèm ảnh sơ bộ</span>
                            </div>
                        )}

                        {/* Quick Replies */}
                        <div
                            className="px-4 sm:px-6 py-2.5 bg-slate-50 flex items-center gap-2 overflow-x-auto border-t border-slate-100 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                            onWheel={(e) => {
                                if (e.deltaY !== 0) {
                                    e.currentTarget.scrollLeft += e.deltaY;
                                }
                            }}
                        >
                            <span className="text-[14px] font-medium text-slate-600  mr-1 shrink-0">Tin mẫu</span>
                            {quickReplies.map((reply, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setInputValue(reply)}
                                    title={reply}
                                    className="whitespace-nowrap px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-[13px] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm shrink-0"
                                >
                                    {reply.length > 35 ? reply.substring(0, 35) + '...' : reply}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
                            <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3 items-center">
                                {/* Plus/Image Component Button */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-all shrink-0 shadow-sm"
                                    title="Gửi hình ảnh/tệp"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                                </button>

                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    ref={fileInputRef}
                                    onChange={handleImageSelect}
                                />

                                {/* Pill Shaped Input Wrap */}
                                <div className="flex-1 relative flex items-center bg-slate-100 rounded-full px-2 shadow-inner border border-slate-200/50">
                                    <input
                                        type="text"
                                        placeholder={uploadingImage ? "Đang tải ảnh lên..." : "Để lại lời nhắn..."}
                                        className="w-full pl-3 pr-10 py-2.5 sm:py-3 bg-transparent border-none text-[14px] sm:text-[15px] focus:ring-0 outline-none placeholder:text-slate-500 text-slate-800"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        disabled={uploadingImage}
                                    />

                                    {/* Inside Input Emoji Picker button */}
                                    <div className="absolute right-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className="w-8 h-8 rounded-full hover:bg-slate-200/80 text-blue-500 font-bold flex items-center justify-center transition-all"
                                            title="Biểu tượng cảm xúc"
                                        >
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"></path><circle cx="9" cy="9" r="1.5" fill="white"></circle><circle cx="15" cy="9" r="1.5" fill="white"></circle></svg>
                                        </button>

                                        {showEmojiPicker && (
                                            <div className="absolute bottom-[calc(100%+12px)] right-0 origin-bottom-right bg-white border border-slate-100 shadow-2xl rounded-2xl p-3 w-[260px] sm:w-[280px] z-[100] animate-in fade-in zoom-in-95 duration-200">
                                                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-50">
                                                    <span className="text-[13px] font-bold text-slate-600 ">Cảm xúc</span>
                                                    <button type="button" onClick={() => setShowEmojiPicker(false)} className="text-slate-400 hover:text-red-500"><FiX size={14} /></button>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {commonEmojis.map((emoji, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => {
                                                                setInputValue(prev => prev + emoji);
                                                            }}
                                                            className="w-8 h-8 flex items-center justify-center text-xl hover:bg-slate-100 rounded-lg transition-colors cursor-pointer hover:scale-110"
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={uploadingImage || (!inputValue.trim() && !selectedImage)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${uploadingImage || (!inputValue.trim() && !selectedImage)
                                        ? "text-slate-300 pointer-events-none"
                                        : "text-blue-500 hover:bg-blue-50 active:scale-95"
                                        }`}
                                >
                                    {uploadingImage ? (
                                        <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    )}
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
