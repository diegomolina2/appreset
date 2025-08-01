import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppProvider } from "./contexts/AppContext";

createRoot(document.getElementById("root")!).render(<App />);
