import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoadingFeed: boolean;
  errorFeed: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoadingFeed: false,
  errorFeed: null
};

export const fetchFeeds = createAsyncThunk('fetch/fetchFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoadingFeed = true;
        state.errorFeed = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoadingFeed = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoadingFeed = false;
        state.errorFeed = action.error.message || 'Ошибка';
      });
  }
});

export default feedSlice;
