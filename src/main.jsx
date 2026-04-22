import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import './i18n'; // Enterprise standard: Initialize i18n

createRoot(document.getElementById("root")).render(<App />);
