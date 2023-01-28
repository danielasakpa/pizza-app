import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      // Check if product already exists 
      if (state.products.findIndex(product => product.title === action.payload.title) > -1) {
        // Find index of product
        const index = state.products.findIndex(e => e.title === action.payload.title)
        // Increment and Update product
        state.products[index] = { ...state.products[index], "quantity": Number(action.payload.quantity) + Number(state.products[index].quantity) }
      } else {
        // If product doesn't exist add to cart
        state.products.push(action.payload);
        // Increment cart quantity
        state.quantity += 1;
      }
      // Update cart total quantity
      state.total += action.payload.price * action.payload.quantity;
    },
    addOneProduct: (state, action) => {
      // Find index of product
      const index = state.products.findIndex(e => e.title === action.payload.title)
      // Increment and Update product
      state.products[index] = { ...state.products[index], "quantity": Number(state.products[index].quantity) + 1 }
      // Update cart total quantity
      state.total += action.payload.price;
    },
    removeOneProduct: (state, action) => {
      // Find index of product
      const index = state.products.findIndex(e => e.title === action.payload.title)
      if (state.products[index].quantity === 1) {
        // Decrement and Update product
        state.products[index] = { ...state.products[index], "quantity": Number(state.products[index].quantity) - 1 }
        // Filter out the product
        state.products = state.products.filter(product => product.title !== action.payload.title)
      } else {
        // Decrement and Update product
        state.products[index] = { ...state.products[index], "quantity": Number(state.products[index].quantity) - 1 }
      }
      // Update cart total quantity
      state.total -= action.payload.price;
    },
    reset: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
  }
})

export const { addProduct, addOneProduct, removeOneProduct, reset } = cartSlice.actions;
export default cartSlice.reducer;
