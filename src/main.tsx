import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { getStoredTheme, applyTheme } from "./lib/theme";

applyTheme(getStoredTheme());

createRoot(document.getElementById("root")!).render(<App />);
