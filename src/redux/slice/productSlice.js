import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProducts: [
    {
      id: Date.now(),
      title: "",
      variants: [],
    },
  ],
  selectedDiscounts: {},
  selectedVariantDiscounts: {},
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const newProduct = action.payload;

      if (!state.selectedProducts.find((p) => p.id === newProduct.id)) {
        state.selectedProducts.push(newProduct);
      }
    },

    addEmptyProduct: (state) => {
      state.selectedProducts.push({
        id: Date.now(),
        title: "",
        variants: [],
      });
    },

    reorderProducts: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const movedProduct = state.selectedProducts.splice(sourceIndex, 1)[0];
      state.selectedProducts.splice(destinationIndex, 0, movedProduct);
    },

    reorderVariants: (state, action) => {
      const { productId, sourceIndex, destinationIndex } = action.payload;
      const product = state.selectedProducts.find(
        (p) => p.id.toString() === productId
      );
      if (product) {
        const movedVariant = product.variants.splice(sourceIndex, 1)[0];
        product.variants.splice(destinationIndex, 0, movedVariant);
      }
    },

    removeProduct: (state, action) => {
      const productId = action.payload;
      state.selectedProducts = state.selectedProducts.filter(
        (p) => p.id !== productId
      );
      delete state.selectedDiscounts[productId];
    },

    addVariantDiscount: (state, action) => {
      const { productId, variantId, discount } = action.payload;
      if (!state.selectedVariantDiscounts[productId]) {
        state.selectedVariantDiscounts[productId] = {};
      }
      state.selectedVariantDiscounts[productId][variantId] = discount;
    },

    removeVariant: (state, action) => {
      const { productId, variantId } = action.payload;
      const product = state.selectedProducts.find((p) => p.id === productId);
      if (product) {
        product.variants = product.variants.filter((v) => v.id !== variantId);
      }
      if (state.selectedVariantDiscounts[productId]) {
        delete state.selectedVariantDiscounts[productId][variantId];
      }
    },

    replaceProduct: (state, action) => {
      const { newProducts, replacingProductId } = action.payload;

      state.selectedProducts = state.selectedProducts.filter(
        (p) => p.id !== replacingProductId
      );

      newProducts.forEach((newProduct) => {
        if (!state.selectedProducts.find((p) => p.id === newProduct.id)) {
          state.selectedProducts.push(newProduct);
        }
      });
    },

    setProductDiscount: (state, action) => {
      const { productId, discount } = action.payload;
      state.selectedDiscounts[productId] = discount;
    },
  },
});

export const {
  addProduct,
  removeProduct,
  addVariantDiscount,
  removeVariant,
  setProductDiscount,
  reorderProducts,
  reorderVariants,
  replaceProduct,
  addEmptyProduct,
} = productSlice.actions;

export default productSlice.reducer;
