import { TConstructorIngredient } from '../../utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.bun = ingredient;
        return;
      }
      state.ingredients.push(ingredient);
    },
    removeIngredient: (state, action) => {
      state.ingredients.splice(action.payload, 1);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const ingredients = [...state.ingredients];
      const [removed] = ingredients.splice(from, 1);
      ingredients.splice(to, 0, removed);
      state.ingredients = ingredients;
    },
    clear: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const { addIngredient, removeIngredient, moveIngredient, clear } =
  burgerConstructorSlice.actions;

export default burgerConstructorSlice;
