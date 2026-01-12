# Test Organization

This project supports testing with both **Playwright** and **Vibium** browser automation frameworks.

## Directory Structure

```
tests/
├── helpers.ts              # Shared test utilities (framework-agnostic)
├── playwright/             # Playwright test implementations
│   ├── example.spec.ts
│   ├── health.spec.ts
│   └── pictures.spec.ts
└── vibium/                 # Vibium test implementations
    ├── example.spec.ts
    ├── health.spec.ts
    └── pictures.spec.ts
```

## Running Tests

### Run all tests (both frameworks)
```bash
npm test
```

### Run only Playwright tests
```bash
npm run test:playwright
```

### Run only Vibium tests
```bash
npm run test:vibium
```

### Run both frameworks sequentially
```bash
npm run test:all
```

## Framework Differences

### Playwright
- More mature and feature-rich
- Better file upload support
- More comprehensive API
- Better debugging tools
- Uses `locator()` API for element selection

### Vibium
- Lighter weight
- Simpler API
- Uses `find()` API for element selection
- May have limitations with some advanced features (e.g., file uploads)

## Shared Utilities

The `helpers.ts` file contains framework-agnostic utilities that are used by both test suites:
- `checkServerRunning()` - Verifies the server is accessible
- `printServerNotRunningMessage()` - Displays helpful error messages

## Adding New Tests

When adding new tests:

1. **Create the test in both directories** to maintain feature parity:
   - `tests/playwright/your-test.spec.ts`
   - `tests/vibium/your-test.spec.ts`

2. **Use framework-specific APIs**:
   - Playwright: `page.locator()`, `page.goto()`, `page.waitForURL()`
   - Vibium: `vibe.find()`, `vibe.go()`, `element.click()`

3. **Import shared helpers** from `../helpers`:
   ```typescript
   import { checkServerRunning, printServerNotRunningMessage } from '../helpers';
   ```

## Notes

- Both test suites verify the same functionality but use different APIs
- Some tests may have framework-specific implementations due to API differences
- The server must be running before executing tests (use `npm start` in a separate terminal)
