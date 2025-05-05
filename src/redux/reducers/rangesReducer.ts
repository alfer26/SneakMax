import { createSlice } from '@reduxjs/toolkit';
import { RangesInitialState } from '../../Types';
import { getPriceRange } from '../asyncThunks/getPriceRange';
import { getSizeRange } from '../asyncThunks/getSizeRange';

const initialState: RangesInitialState = {
    priceRange: {
        min: 5599,
        max: 25999,
    },
    sizeRange: {
        min: 35,
        max: 43,
    },
    priceRangeStatus: '',
    sizeRangeStatus: '',
};

const rangesReducer = createSlice({
    name: 'Ranges',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPriceRange.pending, (state) => {
                state.priceRangeStatus = 'pending';
            })
            .addCase(getPriceRange.fulfilled, (state, { payload }) => {
                state.priceRangeStatus = 'fulfilled';
                state.priceRange = payload!;
            })
            .addCase(getPriceRange.rejected, (state) => {
                state.priceRangeStatus = 'rejected';
            })
            .addCase(getSizeRange.pending, (state) => {
                state.sizeRangeStatus = 'pending';
            })
            .addCase(getSizeRange.fulfilled, (state, { payload }) => {
                state.sizeRangeStatus = 'fulfilled';
                state.sizeRange = payload!;
            })
            .addCase(getSizeRange.rejected, (state) => {
                state.sizeRangeStatus = 'rejected';
            });
    },
});

export default rangesReducer.reducer;
