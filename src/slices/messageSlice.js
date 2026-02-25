import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  name: "message",
  initialState: [],
  reducers: {
    createMessage: (state, action) => {
      state.push(action.payload);
    },

    removeMessage: (state, action) => {
      return state.filter((msg) => msg.id !== action.payload);
    },
  },
});

export const showAsyncMessage = createAsyncThunk(
  "message/showAsyncMessage",
  (payload, { dispatch }) => {
    dispatch(createMessage(payload));

    setTimeout(() => {
      dispatch(removeMessage(payload.id));
    }, 3000);
  },
);

export const { createMessage, removeMessage } = messageSlice.actions;

export default messageSlice.reducer;
