import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const OFFSET = 200; // Khoảng cách từ navbar đến section (px)

export default function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.substring(1));
      if (el) {
        setTimeout(() => {
          const top = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: top - OFFSET,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }, [hash]);

  return null;
}
