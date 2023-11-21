import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.css';
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { CategoryContextProvider } from "./context/CategoryContext";
import { CardContextProvider } from "./context/CardContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  /* <React.StrictMode> */
  <AuthContextProvider>
    <CategoryContextProvider>
      <CardContextProvider>
        <App />
      </CardContextProvider>
    </CategoryContextProvider>
  </AuthContextProvider>
  /* </React.StrictMode> */
);
