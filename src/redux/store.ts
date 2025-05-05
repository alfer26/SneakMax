import { configureStore } from '@reduxjs/toolkit';
import sneakersReducer from './reducers/sneakersReducer';
import teamReducer from './reducers/teamReducer';
import cartReducer from './reducers/cartReducer';
import rangesReducer from './reducers/rangesReducer';

const store = configureStore({
    reducer: {
        sneakers: sneakersReducer,
        ranges: rangesReducer,
        cart: cartReducer,
        team: teamReducer,
    },
});

export default store;
