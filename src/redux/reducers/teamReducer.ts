import { createSlice } from '@reduxjs/toolkit';
import { Person, TeamInitialState } from '../../Types';
import { getTeam } from '../asyncThunks/getTeam';

const initialState: TeamInitialState = {
    data: [],
    status: '',
};

const teamReducer = createSlice({
    name: 'Team',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTeam.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(getTeam.fulfilled, (state, { payload }) => {
                state.status = 'fulfilled';
                state.data = [
                    ...state.data,
                    ...payload.filter((item: Person) => !state.data.some((person) => person.id === item.id)),
                ];
            })
            .addCase(getTeam.rejected, (state) => {
                state.status = 'rejected';
            });
    },
});

export default teamReducer.reducer;
