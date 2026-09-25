import burgerConstructorSlice, {
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clear
} from '../burgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';

const { reducer } = burgerConstructorSlice;

describe('Тест редюсера burgerConstructorSlice', () => {
  const mockIngredients: TConstructorIngredient[] = [
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
      image_mobile: 'string',
      id: '1'
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
      image_mobile: 'string',
      id: '2'
    },
    {
      _id: '3',
      name: 'test3',
      type: 'main',
      proteins: 3,
      fat: 3,
      carbohydrates: 3,
      calories: 3,
      price: 3,
      image: 'string',
      image_large: 'string',
      image_mobile: 'string',
      id: '3'
    }
  ];

  test('Обработка экшена addIngredient для булок', () => {
    const newState = reducer(initialState, addIngredient(mockIngredients[0]));
    expect(newState.bun).toEqual(mockIngredients[0]);
    expect(newState.ingredients).toEqual([]);
  });

  test('Обработка экшена addIngredient для начинок', () => {
    const newState = reducer(initialState, addIngredient(mockIngredients[1]));
    expect(newState.ingredients).toEqual([mockIngredients[1]]);
    expect(newState.bun).toBeNull();
  });

  test('Обработка экшена removeIngredient', () => {
    const mockState = {
      ...initialState,
      bun: mockIngredients[0],
      ingredients: [mockIngredients[1], mockIngredients[2]]
    };
    const newState = reducer(mockState, removeIngredient(1));
    expect(newState).toEqual({
      bun: mockIngredients[0],
      ingredients: [mockIngredients[1]]
    });
  });

  test('Обработка экшена moveIngredient', () => {
    const mockState = {
      ...initialState,
      bun: mockIngredients[0],
      ingredients: [mockIngredients[1], mockIngredients[2]]
    };
    const newState = reducer(mockState, moveIngredient({ from: 1, to: 0 }));
    expect(newState).toEqual({
      bun: mockIngredients[0],
      ingredients: [mockIngredients[2], mockIngredients[1]]
    });
  });

  test('Обработка экшена clear', () => {
    const mockState = {
      ...initialState,
      bun: mockIngredients[0],
      ingredients: [mockIngredients[1], mockIngredients[2]]
    };
    const newState = reducer(mockState, clear());
    expect(newState).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('Обработка экшена не существующего в приложении', () => {
    const newState = reducer(undefined, { type: 'UNKNOWN' });
    expect(newState).toEqual(initialState);
  });
});
