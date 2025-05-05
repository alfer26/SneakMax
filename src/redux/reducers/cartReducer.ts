import { createSlice } from '@reduxjs/toolkit';
import { CartInitialState } from '../../Types';

const initialState: CartInitialState = {
    data: JSON.parse(sessionStorage.getItem('cart')!) ?? [],
    addedProductId: null,
};

const cartReducer = createSlice({
    name: 'Cart',
    initialState,
    reducers: {
        addSneakersCart: (state, { payload }) => {
            state.data.push(payload);
            state.addedProductId = payload.id;

            const sessionStorageValue = JSON.stringify(state.data);
            sessionStorage.setItem('cart', sessionStorageValue);
        },
        deleteSneakersCart: (state, { payload }) => {
            state.data = state.data.filter((item) => {
                return item.idCart !== payload;
            });

            const sessionStorageValue = JSON.stringify(state.data);
            sessionStorage.setItem('cart', sessionStorageValue);
        },
        deleteAllSneakersCart: (state) => {
            state.data = [];
            sessionStorage.removeItem('cart');
        },
        resetAddedProductId: (state) => {
            state.addedProductId = null;
        },
    },
});

export const { addSneakersCart, deleteSneakersCart, deleteAllSneakersCart, resetAddedProductId } = cartReducer.actions;
export default cartReducer.reducer;
