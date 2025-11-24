## Ankor Charters UI

Ankor Charters is a modern yacht-charter discovery experience built with the Next.js App Router, Tailwind v4, and custom UI primitives. It showcases live yacht inventory, detailed vessel pages, search, sort, filter tooling, and both grid and table layouts.

![Yacht grid screenshot](docs/screens/yacht-grid.png)

---

## Features

- **Live yacht data** pulled from `services/yacht-service.ts` with normalization and fallbacks.
- **Responsive layouts** for cards, table view, sticky filters, and a dedicated yacht detail page.
- **Search, sort, and range filters** (price, guest capacity, length) with custom sliders.
- **Accessible interactions** for buttons, toggles, and card navigation.
- **Jest unit tests** covering data helpers as a starting point for broader coverage.

---

## Tech Stack

| Layer     | Tools / Notes                                       |
| --------- | --------------------------------------------------- |
| Framework | Next.js 16 (App Router, Server + Client Components) |
| Styling   | Tailwind CSS v4, custom theme tokens                |
| Icons     | Lucide React                                        |
| Testing   | Jest å                                              |

---

## Getting Started

Install dependencies (uses pnpm):

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command      | Description                       |
| ------------ | --------------------------------- |
| `pnpm dev`   | Start Next.js in development mode |
| `pnpm build` | Build the production bundle       |
| `pnpm start` | Serve the production build        |
| `pnpm lint`  | Run ESLint                        |
| `pnpm test`  | Execute Jest unit tests           |

---

## Testing

Jest is configured via `jest.config.js` with the Next.js preset. Tests live under `__tests__/`.

```bash
pnpm test
```

The suite currently covers critical data utilities (length parsing, availability mapping) and can be extended to components or hooks as needed.

---

## Project Structure (excerpt)

```
app/                # App Router routes, layouts, detail view
components/         # UI primitives and feature components
services/           # Data fetching and normalization
__tests__/          # Jest test suites
public/             # Static assets
```

## License

This repository is private and intended for Ankor Charters internal use. Contact the project maintainers for access or licensing questions.
