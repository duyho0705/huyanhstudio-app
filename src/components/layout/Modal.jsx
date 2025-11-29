import { useEffect } from "react";
import "../../styles/Modal.scss";

const Modal = ({ isOpen, onClose, title, content }) => {
  // Khi modal mở, disable scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // cleanup khi component unmount
    return () => {
      document.body.style.overflow = "auto";
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
