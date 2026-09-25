import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });
  await page.goto('/');
  await expect(page.getByTestId('burger-ingredient').first()).toBeVisible();
});

test.describe('Тестирование конструктора бургеров', () => {
  test('Список ингредиентов загружается', async ({ page }) => {
    const bun = page
      .getByTestId('burger-ingredient')
      .filter({ hasText: 'Краторная булка N-200i' });
    await expect(bun).toBeVisible();
  });

  test('Корзина пуста по умолчанию', async ({ page }) => {
    await expect(page.getByTestId('constructor-bun-top-default')).toBeVisible();
    await expect(page.getByTestId('constructor-bun-bot-default')).toBeVisible();
    await expect(
      page.getByTestId('constructor-ingredients-default')
    ).toBeVisible();
  });

  test('Добавление булки в конструктор через кнопку "Добавить"', async ({
    page
  }) => {
    const bunCard = page
      .getByTestId('burger-ingredient')
      .filter({ hasText: 'Краторная булка N-200i' });

    await expect(bunCard).toBeVisible();

    const addButton = bunCard.getByRole('button', { name: 'Добавить' });
    await expect(addButton).toBeVisible();
    await addButton.click();

    const bunTop = page.getByTestId('constructor-bun-top');
    const bunBot = page.getByTestId('constructor-bun-bot');

    await expect(bunTop).toBeVisible();
    await expect(bunBot).toBeVisible();
    await expect(bunTop).toContainText('Краторная булка N-200i');
    await expect(bunBot).toContainText('Краторная булка N-200i');
  });

  test('Добавление начинок в конструктор через кнопку "Добавить"', async ({
    page
  }) => {
    const ingredientsList = page.getByTestId('constructor-ingredients');

    const ingredient = page
      .getByTestId('burger-ingredient')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });

    await expect(ingredient).toBeVisible();

    const addIngredient = ingredient.getByRole('button', { name: 'Добавить' });
    await expect(addIngredient).toBeVisible();
    await addIngredient.click();

    await expect(ingredientsList).toBeVisible();
    await expect(ingredientsList).toContainText(
      'Биокотлета из марсианской Магнолии'
    );

    const sauce = page
      .getByTestId('burger-ingredient')
      .filter({ hasText: 'Соус фирменный Space Sauce' });

    await sauce.scrollIntoViewIfNeeded();
    await expect(sauce).toBeVisible();

    const addSauce = sauce.getByRole('button', { name: 'Добавить' });
    await expect(addSauce).toBeVisible();
    await addSauce.click();

    await expect(ingredientsList).toContainText('Соус фирменный Space Sauce');
  });
});

test.describe('Тестирование модального окна ингредиентов', () => {
  test.beforeEach(
    'Тестирование открытия модального окна ингредиента',
    async ({ page }) => {
      const ingredient = page
        .getByTestId('burger-ingredient')
        .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
      await expect(ingredient).toBeVisible();
      await ingredient.click();
      await expect(page.getByTestId('modal')).toBeVisible();
    }
  );

  test('Проверка, что модальное окно открыто', async ({ page }) => {
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText(
      'Биокотлета из марсианской Магнолии'
    );
  });

  test('Проверка, что модальное окно закрывается при нажатии на крестик', async ({
    page
  }) => {
    const closeButton = page.getByTestId('modal-close');
    await closeButton.click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('Проверка закрытия модального окна по клику на оверлей', async ({
    page
  }) => {
    const overlay = page.getByTestId('modal-overlay');
    await overlay.click({ position: { x: 10, y: 10 } });
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});

test.describe('Тестирование создания заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false
    });

    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/api/orders',
      update: false
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.goto('/');
    await expect(page.getByTestId('burger-ingredient').first()).toBeVisible();

    const bun = page
      .getByTestId('burger-ingredient')
      .filter({ hasText: 'Краторная булка N-200i' });
    await bun.getByRole('button', { name: 'Добавить' }).click();

    const ingredient = page
      .getByTestId('burger-ingredient')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    const sauce = page
      .getByTestId('burger-ingredient')
      .filter({ hasText: 'Соус фирменный Space Sauce' });
    await sauce.getByRole('button', { name: 'Добавить' }).click();
  });

  test('Открытие модального окна заказа', async ({ page }) => {
    await page.getByTestId('order-button').click();
    await expect(page.getByTestId('modal')).toBeVisible({
      timeout: 10000
    });
    const orderNumber = '8535';
    await expect(page.getByTestId('order-number')).toContainText(orderNumber);
  });

  test('Очистка конструктора после заказа', async ({ page }) => {
    await page.getByTestId('order-button').click();
    await expect(page.getByTestId('modal')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('constructor-bun-top-default')).toBeVisible({
      timeout: 10000
    });
    await expect(page.getByTestId('constructor-bun-bot-default')).toBeVisible({
      timeout: 10000
    });
    await expect(
      page.getByTestId('constructor-ingredients-default')
    ).toBeVisible({ timeout: 10000 });
  });

  test('Закрытие модального окна заказа', async ({ page }) => {
    await page.getByTestId('order-button').click();
    await expect(page.getByTestId('modal')).toBeVisible({ timeout: 10000 });
    const modalCloseIcon = page.getByTestId('modal-close');
    await modalCloseIcon.click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});
