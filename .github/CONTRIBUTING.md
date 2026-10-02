# Contributing

Thanks for wanting to help out 🥹

## Ground rules

- Be kind. The [`CODE_OF_CONDUCT.md`](../Extras/CODE_OF_CONDUCT.md) applies.
- This project is free and open source. Don't add paywalls, logins or trackers.
- Keep it a static site: plain HTML/CSS/JS, no bundler, no framework.
- If you reuse someone else's work, add them to the **Credits** tab.

## Making a change

1. Fork and create a branch (`git checkout -b my-improvement`).
2. Edit `Hub.html` (or `Launcher`).
3. Run the checks locally:

   ```bash
   npm install
   npm run verify
   ```

   That runs:
   - `npm run lint` — HTML validation (`.htmlvalidate.json` holds the rules)
   - `npm run check:js` — syntax check of every inline `<script>` block
   - `npm test` — boots the page in jsdom and asserts the tabs, search,
     settings, modal and keyboard shortcuts actually work

4. Open a pull request and describe what changed and why.

CI runs the same `npm run verify` on every push and pull request.

## Good first ideas

- New tools in the **Tools/Apps** tab (keep them self-contained)
- More accent/background swatches
- Accessibility fixes — anything that helps screen-reader or keyboard users
- Fixing a broken link in the movie or game list

Please don't commit `node_modules/`, editor config or generated files.
