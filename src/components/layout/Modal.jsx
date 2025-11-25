import { useEffect } from "react";
import "../../styles/Modal.scss";

const Modal = ({ isOpen, onClose, title, content }) => {
  // Khi modal mở, disable scroll
  useEffect(() => {
    const body = document.body;

    if (isOpen) {
      // lấy width của scrollbar
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      body.style.overflow = "hidden";
      body.style.paddingRight = `${scrollBarWidth}px`; // giữ chỗ cho scrollbar
    } else {
      body.style.overflow = "auto";
      body.style.paddingRight = "0px";
    }
    return () => {
      body.style.overflow = "auto";
      body.style.paddingRight = "0px";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // tránh đóng khi click bên trong
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>{title}</h2>
        <div className="modal-detail">{content}</div>
      </div>
    </div>
  );
};

export default Modal;
