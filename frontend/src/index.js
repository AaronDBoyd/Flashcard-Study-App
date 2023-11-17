import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { CategoryContextProvider } from "./context/CategoryContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <CategoryContextProvider>
        <App />
      </CategoryContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
