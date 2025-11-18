import React, { useEffect } from "react";
import "../../styles/LoginModal.scss";
import Login from "./Login";

const LoginModal = ({ isOpen, onClose }) => {
  // khóa scroll khi mở modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // cleanup khi unmount
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <Login onClose={onClose} />
      </div>
    </div>
  );
};

export default LoginModal;
