import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OFFSET = 100;

export default function ScrollToHash() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hash, state } = location;

  // Scroll khi URL có hash (#section)
  useEffect(() => {
    if (!hash) return;
    const id = hash.substring(1);
    scrollToId(id);
  }, [hash]);

  // Scroll khi navigate("/", { state: { scrollTo: "products" } })
  useEffect(() => {
    if (state?.scrollTo) {
      scrollToId(state.scrollTo);

      // Xóa state để tránh scroll lại khi refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [state]);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: top - OFFSET,
      behavior: "smooth",
    });

    // Cập nhật hash mà không tạo scroll lần 2
    window.history.replaceState(null, "", `#${id}`);
  };

  return null;
}
