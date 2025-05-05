import { createAsyncThunk } from '@reduxjs/toolkit';
import { initial } from '../../axios/initial';

export const getPriceRange = createAsyncThunk('priceRange', async () => {
    try {
        const [minPriceResponse, maxPriceResponse] = await Promise.all([
            initial.get(`sneakers?sortBy=price&_select=price&limit=1`),
            initial.get(`sneakers?sortBy=-price&_select=price&limit=1`),
        ]);
        const minPrice = minPriceResponse.data.items.flatMap((item: { price: number[] }) => item.price)[0];
        const maxPrice = maxPriceResponse.data.items.flatMap((item: { price: number[] }) => item.price)[0];
        return { min: minPrice, max: maxPrice };
    } catch (error) {
        console.error(error);
    }
});
