import React from "react";
import "./LoginModal.scss";
import Login from "./Login"; // file login bạn đã có sẵn

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // nếu chưa click thì không hiển thị gì

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <Login />
      </div>
    </div>
  );
};

export default LoginModal;
