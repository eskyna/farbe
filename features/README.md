# Behave / Cucumber requirements tests

This directory contains executable BDD requirements for ESKYNA Farbe. The tests are written as product requirements, not as low-level implementation notes, so people and AI agents can understand what customer-visible behavior must stay intact.

Run them after dependencies are installed:

```bash
npm run build
npm run test:bdd
```

Or run the full quality gate:

```bash
npm run check
```

## Structure

- `requirements_*.feature` contains the Gherkin scenarios for the accumulated requirements.
- `steps/requirements_steps.py` implements the assertions.
- `support/inspect-app.mjs` evaluates the real frontend color naming, i18n and color-story helpers in a small static browser harness.
- `environment.py` exposes project paths to Behave.

The BDD suite checks source files and the generated `dist/` folder. Build first when running `npm run test:bdd` directly, or use `npm run test:bdd:build` to build and test in one command.

