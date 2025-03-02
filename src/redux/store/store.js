import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "../slice/modalSlice";
import productReducer from "../slice/productSlice";

const store = configureStore({
  reducer: {
    modal: modalReducer,
    products: productReducer,
  },
});

export default store;
