import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import messageReducer from "./slices/messageSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    message: messageReducer,
  },
});
