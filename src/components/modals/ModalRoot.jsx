import Modal from "../layout/Modal";
import { useModal } from "../../api/ModalContext";
import LoginModal from "../features/auth/LoginModal";

const ModalRoot = () => {
  const { modal, closeModal } = useModal();

  if (!modal) return null;

  switch (modal.name) {
    case "login":
      return <LoginModal isOpen={true} onClose={closeModal} />;
    case "service":
      return <Modal isOpen={true} onClose={closeModal} />;
    default:
      return null;
  }
};

export default ModalRoot;
