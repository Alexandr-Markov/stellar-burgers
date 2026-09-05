import { combineReducers } from '@reduxjs/toolkit';
import ingredientsSlice from './slices/ingredientSlice';
import burgerConstructorSlice from './slices/burgerConstructorSlice';
import orderSlice from './slices/orderSlice';
import feedSlice from './slices/feedSlice';
import userSlice from './slices/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: burgerConstructorSlice.reducer,
  order: orderSlice.reducer,
  feed: feedSlice.reducer,
  user: userSlice.reducer
});
