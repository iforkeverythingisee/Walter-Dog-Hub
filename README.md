# Wsg Yall🥺

I really don't know what to say.
My Google site got blocked, so I'm switching to the new world of GITHUB.
Copy the launcher code into w3Schools, Google Sites, or CodeBeautify.
I don't really use this that much, this is for my friends.

This project is completely FREE and open source but please credit
https://github.com/iforkeverythingisee if u are using this

ok bye.

---

## Table of contents

- [What's in it](#whats-in-it)
- [How to use it](#how-to-use-it)
- [Settings](#settings)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Project structure](#project-structure)
- [Developing](#developing)
- [Credits](#credits)
- [License](#license)

## What's in it

| Tab | What you get |
| --- | --- |
| **Home** | Animated starfield, typewriter greeting, live clock/date |
| **Games** | The full UGS game list, searchable, grouped A-Z |
| **Movies** | The movie list, searchable, plus a **Surprise me** button |
| **Tools/Apps** | An `about:blank` launcher for opening URLs or local files |
| **Credits** | Everyone who made this possible |
| **Settings** | Cursor, accent colour, background, star density, animations |

This is all in a SINGLE FILE launcher btw.

## How to use it

### 1. The Launcher (easiest)

Open [`Launcher`](Launcher), click **Open**, and the hub pops up in a clean
`about:blank` tab. Copy the launcher's code into w3Schools, Google Sites or
CodeBeautify and it works from there too.

### 2. Host it yourself

Fork the repo and turn on **GitHub Pages** (`Settings → Pages → Deploy from a
branch → main`). The whole site is `Hub.html`.

## Settings

Your settings are saved in `localStorage`, so they stick between visits.
If storage is unavailable (for example when the hub is injected into an
`about:blank` window), everything still works — the settings just reset.

| Setting | Options |
| --- | --- |
| Custom Cursor | Default, McDonald Cat, Sad Hamster |
| Accent Color | 6 swatches |
| Background Style | 6 swatches |
| Star Density | Low, Medium, High |
| Animations | On, Off |

The page also honours your OS-level **prefers reduced motion** setting.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `/` | Jump to the search box for the tab you're on |
| `Esc` | Close the open dialog |
| `Alt` + `1`…`6` | Jump to Home / Games / Movies / Tools / Credits / Settings |
| `Tab` | Move around — focus is trapped inside open dialogs |

## Project structure

```
Hub.html                 the whole hub (markup, styles, scripts)
Launcher                 one-click launcher that fetches and injects Hub.html
README.md                this file
Logs                     the to-do list / version notes
Extras/                  code of conduct
Reference/               design references: game list, movie links, cursor art
scripts/                 local checks (HTML lint, JS syntax, smoke test)
.github/workflows/       CI - runs the checks on every push and pull request
```

## Developing

The site itself needs nothing installed. The checks below are only for
contributors:

```bash
npm install     # dev tooling only (html-validate + jsdom)
npm run lint    # validate Hub.html + Launcher
npm run check:js# syntax-check every inline <script> block
npm test        # boot the page in jsdom and assert it actually works
npm run verify  # all three
```

CI runs `npm run verify` on every push and pull request, so a broken page
gets caught before it lands.

## Credits

See the in-app **Credits** tab for the full list. Highlights:

- **Walter Dog** — created and maintains this hub
- **UGS** — the games
- **Eclip Games** — partnership
- **Express Airways** — first to suggest switching to GitHub
- Contributors: Cra-Z Gaming, Velcro's proxies, Mukundan S and friends
- **1st web designer** — the background
- **W3 Schools** — how to glassmorphism
- **Google Fonts** — Montserrat & Courier Prime

## License

See [`LICENSE`](LICENSE). Keep the credit link in the README if you reuse any
of it, please and thank you. 🥹
