import { createContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);

  const openModal = (name, data = null) => {
    setModal({ name, data });
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModal(null);
    document.body.style.overflow = "auto";
  };

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
