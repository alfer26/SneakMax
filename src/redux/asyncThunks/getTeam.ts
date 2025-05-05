import { createAsyncThunk } from '@reduxjs/toolkit';
import { initial } from '../../axios/initial';

export const getTeam = createAsyncThunk('team', async () => {
    try {
        const response = await initial.get(`team`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
});
