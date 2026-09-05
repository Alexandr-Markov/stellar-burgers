import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface OrdersState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  userOrders: TOrder[];
  isLoadingUserOrders: boolean;
  currentOrder: TOrder | null;
  isLoadingCurrentOrder: boolean;
  errorOrder: string | null;
  errorUserOrders: string | null;
  errorCurrentOrder: string | null;
}

const initialState: OrdersState = {
  orderRequest: false,
  orderModalData: null,
  userOrders: [],
  isLoadingUserOrders: false,
  currentOrder: null,
  isLoadingCurrentOrder: false,
  errorOrder: null,
  errorUserOrders: null,
  errorCurrentOrder: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return {
      ...response.order,
      ingredients: data
    };
  }
);

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeModalOrder: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
      state.errorOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.errorOrder = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.errorOrder = action.error.message || 'Ошибка создания заказа';
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoadingUserOrders = true;
        state.errorUserOrders = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoadingUserOrders = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoadingUserOrders = false;
        state.errorUserOrders =
          action.error.message || 'Ошибка загрузки заказов';
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoadingCurrentOrder = true;
        state.errorCurrentOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoadingCurrentOrder = false;
        if (action.payload) {
          state.currentOrder = action.payload;
        } else {
          state.errorCurrentOrder = 'Заказ не найден';
          state.currentOrder = null;
        }
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoadingCurrentOrder = false;
        state.errorCurrentOrder =
          action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const { closeModalOrder } = orderSlice.actions;
export default orderSlice;
