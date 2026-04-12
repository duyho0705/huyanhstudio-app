import React, { useEffect, useContext } from "react";
import Login from "./Login";
import { AuthContext } from "../../../api/AuthContext";

const LoginModal = ({ isOpen, onClose }) => {
  const { modalMode } = useContext(AuthContext);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/[0.08] backdrop-blur-[1.5px] animate-fade-in px-4"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="animate-slide-up w-full max-w-[500px]">
        <Login onClose={onClose} initialMode={modalMode} />
      </div>
    </div>
  );
};

export default LoginModal;
