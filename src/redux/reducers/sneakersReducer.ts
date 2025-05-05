import { createSlice } from '@reduxjs/toolkit';
import { SneakersInitialState } from '../../Types';
import { getSneakers } from '../asyncThunks/getSneakers';

const initialState: SneakersInitialState = {
    data: [],
    status: '',
    totalPages: 0,
    currentPage: 0,
    filter: {
        price: {
            min: null,
            max: null,
        },
        gender: null,
        sizes: [],
    },
};

const sneakersReducer = createSlice({
    name: 'Sneakers',
    initialState,
    reducers: {
        incPageCount: (state) => {
            ++state.currentPage;
        },
        applyFilters: (state, { payload }) => {
            state.filter = payload;
        },
        updatePairSneakersData: (state, { payload }) => {
            state.data[state.data.findIndex((data) => data.id === payload[0])] = payload[1];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSneakers.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(getSneakers.fulfilled, (state, { payload }) => {
                state.status = 'fulfilled';
                state.data = [
                    ...state.data.slice(0, payload.meta.per_page * (payload.meta.current_page - 1)),
                    ...payload.items,
                ];
                state.currentPage = payload.meta.current_page;
                state.totalPages = payload.meta.total_pages;
            })
            .addCase(getSneakers.rejected, (state) => {
                state.status = 'rejected';
            });
    },
});

export const { incPageCount, applyFilters, updatePairSneakersData } = sneakersReducer.actions;
export default sneakersReducer.reducer;
