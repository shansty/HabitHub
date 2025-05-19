import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("Welcome to HabitHub – Your Personal Habit Tracker")
    const login_button = page.getByRole('button', { name: 'Log in' });
    await login_button.click();
    await expect(page).toHaveURL('/login');
});


test('Testing a form filled with correct data', async ({ page }) => {

    await page.goto('/');

    // const heading = page.locator('h1');
    // await expect(heading).toBeVisible();
    // await expect(heading).toHaveText("Welcome to HabitHub – Your Personal Habit Tracker")
    // const login_button = page.getByRole('button', { name: 'Log in' });
    // await login_button.click();
    // await expect(page).toHaveURL('/login');

    const username_field = page.getByPlaceholder("Enter your username")
    await username_field.fill("Anastasiya")
    const password_field = page.getByPlaceholder("Enter your password")
    await password_field.fill('mypassword12345!Q')
    const submit_button = page.getByRole('button', { name: 'Log in' });
    await submit_button.click();
    await expect(page).toHaveURL('/profile');

    const usernameHeading = page.locator('h2', { hasText: 'Anastasiya' });
    await expect(usernameHeading).toBeVisible();
    const add_habit_button = page.getByRole('button', { name: 'Add Habit' });
    await expect(add_habit_button).toBeVisible();
});

test('Testing a form filled with incorrect data', async ({ page }) => {

    // await page.goto('/');

    // const heading = page.locator('h1');
    // await expect(heading).toBeVisible();
    // await expect(heading).toHaveText("Welcome to HabitHub – Your Personal Habit Tracker")
    // const login_button = page.getByRole('button', { name: 'Log in' });
    // await login_button.click();
    // await expect(page).toHaveURL('/login');

    // const username_field = page.getByPlaceholder("Enter your username")
    // await username_field.fill("Wrong")
    // const password_field = page.getByPlaceholder("Enter your password")
    // await password_field.fill('Data')
    // const submit_button = page.getByRole('button', { name: 'Log in' });
    // await submit_button.click();
    // const error = page.getByTestId('custom-error');
    // await expect(error).toHaveText('Invalid credentials. Please try again.', { timeout: 10000 });

    // await expect(error).toHaveText('Invalid credentials. Please try again.');
});