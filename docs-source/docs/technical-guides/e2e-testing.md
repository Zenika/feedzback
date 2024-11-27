# E2E testing

E2E tests are performed using [Playwright](https://playwright.dev/).

## NPM scripts

To run the tests, open a terminal in `<rootDir>/client` directory and run the following command:

```bash
npm run e2e:test
```

All scripts related to E2E tests start with `"e2e:*"`:

```json title="<rootDir>/client/package.json"
{
  "scripts": {
    "e2e:test": "playwright test",
    "e2e:report": "playwright show-report",
    "e2e:ui": "playwright test --ui",
    "e2e:codegen": "playwright codegen"
  }
}
```

## Playwright configuration

Here's part of the Playwright configuration:

```ts title="<rootDir>/client/playwright.config.ts"
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Tests are located in the following directory
  testDir: './e2e',

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run stack:e2e',
    port: 4200,
    reuseExistingServer: !process.env['CI'],
  },
});
```

Before starting the tests, Playwright executes the command `npm run stack:e2e` and waits for the application to be available on port `4200`.
Due to the `reuseExistingServer` option (enabled for non-CI environment), the command will not be executed if the application is already available.

Therefore, you can run the command `npm run stack:e2e` in one terminal, wait for the application to be available on port `4200`, and then run the command `npm run e2e:test` in another terminal.
In this case, Playwright will skip the `webServer.command`, starting the tests immediately.

## Running Playwright

### Method 1

To have Playwright start the app and the tests, run the following command:

```bash
npm run e2e:test
```

:::warning
At the end of the tests, Playwright may not stop the `webServer` properly.
If this happens, look for a "ghost" process named `java` and kill it manually.

To avoid this problem, use the method 2 instead.
:::

### Method 2

To start the app once and then have Playwright only start the tests, run the following commands in two separate terminals:

```bash
npm run stack:e2e # First terminal
```

```bash
npm run e2e:test # Second terminal
```

:::tip
As an alternative to the above command in the first terminal, run `npm run stack:emulators` instead, to start the app in "watch" mode.
:::
