import * as React from "react";
import { createRoot } from "react-dom/client";
import "cfui/styles.css";
import "./gallery.css";
import App from "./App.js";

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
