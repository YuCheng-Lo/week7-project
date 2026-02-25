import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/global.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // 行為 / 互動

import { createHashRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import "./api/axiosSetup";
import { Provider } from "react-redux";
import { store } from "./store";

import MessageToast from "./components/MessageToast";

const router = createHashRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <MessageToast />
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
