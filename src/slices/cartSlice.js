import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showAsyncMessage } from "./messageSlice";
import axios from "axios";

const url = import.meta.env.VITE_URL;
const path = import.meta.env.VITE_PATH;

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    carts: [],
    final_total: 0,
    total: 0,
    loading: false,
    loadingItemId: { add: null, remove: null, update: null },
    error: null,
    initialized: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //getCart
      .addCase(getAsyncCart.pending, (state) => {
        //只有在第一次載入（沒資料時）才顯示全螢幕loading
        if (!state.initialized) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(getAsyncCart.fulfilled, (state, action) => {
        state.loading = false;
        state.carts = action.payload.carts;
        state.final_total = action.payload.final_total;
        state.total = action.payload.total;
        state.initialized = true;
      })
      .addCase(getAsyncCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //addToCart
      .addCase(addToCartAsync.pending, (state, action) => {
        state.loadingItemId.add = action.meta.arg.productId;
      })
      .addCase(addToCartAsync.fulfilled, (state) => {
        state.loadingItemId.add = null;
      })
      .addCase(addToCartAsync.rejected, (state) => {
        state.loadingItemId.add = null;
      })
      //removeCart
      .addCase(removeCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCartAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeCartAsync.rejected, (state) => {
        state.loading = false;
      })
      //removeCartItem
      .addCase(removeCartItemAsync.pending, (state, action) => {
        state.loadingItemId.remove = action.meta.arg;
      })
      .addCase(removeCartItemAsync.fulfilled, (state) => {
        state.loadingItemId.remove = null;
      })
      .addCase(removeCartItemAsync.rejected, (state) => {
        state.loadingItemId.remove = null;
      })
      //updateCartItemQty
      .addCase(updateCartItemQtyAsync.pending, (state, action) => {
        state.loadingItemId.update = action.meta.arg.cartItemId;
      })
      .addCase(updateCartItemQtyAsync.fulfilled, (state) => {
        state.loadingItemId.update = null;
      })
      .addCase(updateCartItemQtyAsync.rejected, (state) => {
        state.loadingItemId.update = null;
      });
  },
});

export const getAsyncCart = createAsyncThunk(
  "cart/getAsyncCart",
  async (_, params) => {
    try {
      const res = await axios.get(`${url}/api/${path}/cart`);
      return res.data.data;
    } catch (err) {
      return params.rejectWithValue(err.message);
    }
  },
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ productId, qty = 1 }, params) => {
    try {
      const data = {
        product_id: productId,
        qty,
      };
      const res = await axios.post(`${url}/api/${path}/cart`, { data });

      params.dispatch(
        showAsyncMessage({
          id: params.requestId,
          type: "success",
          title: "成功",
          text: res.data.message,
        }),
      );

      params.dispatch(getAsyncCart());
    } catch (err) {
      params.dispatch(
        showAsyncMessage({
          id: params.requestId,
          type: "danger", //搭配bootstrap來做toast
          title: "失敗",
          text: "加入購物車失敗，請稍後再試",
        }),
      );
      return params.rejectWithValue(err.message);
    }
  },
);

export const removeCartAsync = createAsyncThunk(
  "cart/removeCartAsync",
  async (_, params) => {
    try {
      await axios.delete(`${url}/api/${path}/carts`);
      params.dispatch(getAsyncCart());
    } catch (err) {
      params.dispatch(
        showAsyncMessage({
          id: params.requestId,
          type: "danger",
          title: "失敗",
          text: "購物車清除失敗",
        }),
      );
      return params.rejectWithValue(err.message);
    }
  },
);

export const removeCartItemAsync = createAsyncThunk(
  "cart/removeCartItemAsync",
  async (cartItemId, params) => {
    try {
      await axios.delete(`${url}/api/${path}/cart/${cartItemId}`);
      params.dispatch(getAsyncCart());
    } catch (err) {
      params.dispatch(
        showAsyncMessage({
          id: params.requestId,
          type: "danger",
          title: "失敗",
          text: "購物車項目刪除失敗",
        }),
      );
      return params.rejectWithValue(err.message);
    }
  },
);

export const updateCartItemQtyAsync = createAsyncThunk(
  "cart/updateCartItemQtyAsync",
  async ({ cartItemId, productId, qty }, params) => {
    if (qty < 1) {
      return params.rejectWithValue("數量不可小於 1");
    }
    try {
      const data = {
        product_id: productId,
        qty,
      };

      await axios.put(`${url}/api/${path}/cart/${cartItemId}`, {
        data,
      });

      params.dispatch(getAsyncCart());
    } catch (err) {
      params.dispatch(
        showAsyncMessage({
          id: params.requestId,
          type: "danger",
          title: "更新失敗",
          text: "更新商品數量失敗，請稍後再試",
        }),
      );
      return params.rejectWithValue(err.message);
    }
  },
);

export default cartSlice.reducer;

export const selectCartItemsCount = (state) => {
  const carts = state.cart.carts;
  return carts.length > 0
    ? carts.reduce((total, item) => total + item.qty, 0)
    : 0;
};
