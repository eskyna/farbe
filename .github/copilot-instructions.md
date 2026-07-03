# Copilot / AI Agent Instructions

Read `AGENTS.md` before editing. Important project rules:

- Edit source files, not generated `dist/`.
- Run `npm run check` after changes; it includes Behave/Cucumber requirements after the build.
- Keep all visible UI strings translated in `i18n.js` for German, English and Russian.
- Keep UI language customer-friendly; do not expose technical color-distance values or field numbers.
- Preserve ESKYNA branding: Montserrat, warm cream/gold palette, `assets/sign_gold.png` as logo.
- Keep customer-name personalization client-side only; do not write names to manifests, caches, versions or logs.
- For PWA/cache changes, verify `version.json` and `sw.js` after a build.


- Add or update `features/requirements_*.feature` and `features/steps/requirements_steps.py` when product behavior changes.

