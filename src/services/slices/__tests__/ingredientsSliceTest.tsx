import ingredientsSlice, {
  initialState,
  fetchIngredients
} from '../ingredientSlice';
import { TIngredient } from '@utils-types';

const { reducer } = ingredientsSlice;

describe('Тест редюсера ingredientsSlice', () => {
  test('Обработка экшена fetchIngredients.pending', () => {
    const newState = reducer(
      initialState,
      fetchIngredients.pending('', undefined)
    );
    expect(newState.isIngredientsLoading).toBe(true);
    expect(newState.errorIngredients).toBeNull();
  });

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'test1',
      type: 'bun',
      proteins: 1,
      fat: 1,
      carbohydrates: 1,
      calories: 1,
      price: 1,
      image: 'string',
      image_large: 'string',
      image_mobile: 'string'
    },
    {
      _id: '2',
      name: 'test2',
      type: 'main',
      proteins: 2,
      fat: 2,
      carbohydrates: 2,
      calories: 2,
      price: 2,
      image: 'string',
      image_large: 'string',
      image_mobile: 'string'
    }
  ];
  const mockError = 'test ingredients error';

  test('Обработка экшена fetchIngredients.fulfilled', () => {
    const newState = reducer(
      initialState,
      fetchIngredients.fulfilled(mockIngredients, '', undefined)
    );
    expect(newState).toEqual({
      ...initialState,
      ingredients: mockIngredients,
      isIngredientsLoading: false,
      errorIngredients: null
    });
  });

  test('Обработка экшена fetchIngredients.rejected', () => {
    const newState = reducer(
      initialState,
      fetchIngredients.rejected(new Error(mockError), '', undefined)
    );
    expect(newState.isIngredientsLoading).toBe(false);
    expect(newState.errorIngredients).toEqual(mockError);
  });

  test('Обработка экшена не существующего в приложении', () => {
    const newState = reducer(undefined, { type: 'UNKNOWN' });
    expect(newState).toEqual(initialState);
  });
});
