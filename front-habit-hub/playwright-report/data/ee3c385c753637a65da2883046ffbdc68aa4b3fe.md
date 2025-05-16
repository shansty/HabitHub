# Test info

- Name: should load Habit Hub landing page
- Location: D:\src\Vention\Task\HabitHub\front-habit-hub\tests\e2e.test.ts:3:1

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)

Locator: locator(':root')
Expected string: "http://habit-hub-frontend-s3.s3-website.eu-north-1.amazonaws.com/login$/"
Received string: "http://habit-hub-frontend-s3.s3-website.eu-north-1.amazonaws.com/login"
Call log:
  - expect.toHaveURL with timeout 5000ms
  - waiting for locator(':root')
    9 × locator resolved to <html lang="en">…</html>
      - unexpected value "http://habit-hub-frontend-s3.s3-website.eu-north-1.amazonaws.com/login"

    at D:\src\Vention\Task\HabitHub\front-habit-hub\tests\e2e.test.ts:12:24
```

# Page snapshot

```yaml
- heading "Log In to HabitHub" [level=2]
- text: Username
- textbox "Username"
- text: Password
- textbox "Password"
- text: Show
- button "Log In"
- paragraph:
  - text: Forgot the password?
  - link "Reset":
    - /url: /reset_password
- paragraph:
  - text: Don't have an account?
  - link "Sign Up":
    - /url: /sign_up
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('should load Habit Hub landing page', async ({ page }) => {
   4 |
   5 |     await page.goto('/');
   6 |
   7 |     const heading = page.locator('h1');
   8 |     await expect(heading).toBeVisible();
   9 |     await expect(heading).toHaveText("Welcome to HabitHub – Your Personal Habit Tracker")
  10 |     const login_button = page.getByRole('button', { name: 'Log in' });
  11 |     await login_button.click();
> 12 |     await expect(page).toHaveURL('\/login$/');
     |                        ^ Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)
  13 |
  14 |     const username_field = page.getByPlaceholder("Enter your username")
  15 |     await username_field.fill("Anastasiya")
  16 |     const password_field = page.getByPlaceholder("Enter your password")
  17 |     await password_field.fill('mypassword12345!Q')
  18 |     const submit_button = page.getByRole('button', { name: 'Log in' });
  19 |     await submit_button.click();
  20 |     await expect(page).toHaveURL('/profile');
  21 |
  22 |     const usernameHeading = page.locator('h2', { hasText: 'Anastasiya' });
  23 |     await expect(usernameHeading).toBeVisible();
  24 |     const add_habit_button = page.getByRole('button', { name: 'Add Habit' });
  25 |     await expect(add_habit_button).toBeVisible();
  26 | });
```