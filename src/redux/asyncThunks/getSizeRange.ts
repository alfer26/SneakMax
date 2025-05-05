import { createAsyncThunk } from '@reduxjs/toolkit';
import { initial } from '../../axios/initial';

export const getSizeRange = createAsyncThunk('sizeRange', async () => {
    try {
        const sizesResponse = await initial.get('sneakers?_select=sizes');
        const sizesArray = sizesResponse.data
            .flatMap((item: { sizes: number[] }) => item.sizes)
        return { min: Math.min(...sizesArray), max: Math.max(...sizesArray) };
    } catch (error) {
        console.error(error);
    }
});
