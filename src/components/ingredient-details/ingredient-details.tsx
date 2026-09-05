import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const { ingredients, isIngredientsLoading, errorIngredients } = useSelector(
    (state) => state.ingredients
  );

  if (isIngredientsLoading) {
    return <Preloader />;
  }

  const ingredientData = useMemo(
    () => ingredients?.find((el) => el._id === id),
    [ingredients, id]
  );

  if (!ingredientData) {
    return (
      <div className='text text_type_main-medium pt-10'>{errorIngredients}</div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
