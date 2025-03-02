import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modals: {},
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { modalName } = action.payload;
      state.modals[modalName] = true;
    },
    closeModal: (state, action) => {
      const { modalName } = action.payload;
      state.modals[modalName] = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export const selectIsModalOpen = (modalName) => (state) =>
  state.modal.modals[modalName] || false;

export default modalSlice.reducer;
