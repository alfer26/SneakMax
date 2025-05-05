import { createAsyncThunk } from '@reduxjs/toolkit';
import { initial } from '../../axios/initial';
import { CurrentPageAndFilter } from '../../Types';

export const getSneakers = createAsyncThunk('sneakers', async (currentPageAndFilter: CurrentPageAndFilter) => {
    const [currentPage, filter] = currentPageAndFilter;
    try {
        const request = `sneakers?_select=-description,-stars,-oldPrice,-color,-compound,-country${
            filter.price.min && filter.price.max ? `&price[from]=${filter.price.min}&price[to]=${filter.price.max}` : ''
        }${filter.gender ? `&gender=${filter.gender}` : ''}${
            filter.sizes.length
                ? filter.sizes.reduce((acc, item) => {
                      return acc + `&sizes[]=${item}`;
                  }, '')
                : ''
        }&page=${currentPage}&limit=6`;
        const response = await initial.get(request);

        return response.data;
    } catch (error) {
        console.error(error);
    }
});
