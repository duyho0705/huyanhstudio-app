import { useModal } from "../../api/ModalContext";

const ModalRoot = () => {
  const { modal, closeModal } = useModal();

  if (!modal) return null;

  switch (modal.name) {
    case "login":
      return <LoginModal isOpen={true} onClose={closeModal} />;
    default:
      return null;
  }
};

export default ModalRoot;
