# Tailwind CSS Setup Guide (Vue 3 + Vite + Tailwind v4)

This guide documents how Tailwind CSS was installed and configured in this project, plus key gotchas to watch for.

## Prerequisites

- Node 20+ (see `package.json` → `engines`)
- Vite + Vue 3 app scaffolded

## 1) Install dependencies

```bash
# from the frontend/ directory
npm i -D tailwindcss @tailwindcss/postcss autoprefixer postcss
```

This project uses Tailwind v4 with its official PostCSS plugin.

## 2) Configure PostCSS

Create `postcss.config.cjs` at the project root (`frontend/postcss.config.cjs`):

```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

Notes:
- Use CommonJS (`.cjs`) to avoid Windows ESM detection issues.
- If you already have `postcss.config.js`, delete or rename it so only one config is present.

## 3) Add the Tailwind entry CSS

Create or edit `src/assets/main.css`:

```css
@import "tailwindcss";
```

Notes:
- For Tailwind v4, a single `@import "tailwindcss";` is recommended instead of `@tailwind base/components/utilities`.

## 4) Import the CSS into your app

Ensure `src/main.ts` imports the CSS once:

```ts
import './assets/main.css';
```

Avoid also linking it in `index.html`. Choose one method (this project uses the import above).

## 5) Optional: Tailwind config

A minimal `tailwind.config.js` is included:

```js
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
};
```

Tailwind v4 works without a config, but add one if you need to extend theme, plugins, or customizations.

## 6) Use utilities in components

Example (`src/views/HomePage.vue`):

```vue
<template>
  <div class="text-center">
    <header class="mb-5">
      <h1 class="text-2xl font-bold">Smart Canteen</h1>
      <p class="text-base">A modern and efficient canteen management system.</p>
    </header>
    <nav class="flex justify-center gap-2.5">
      <router-link
        to="/register"
        class="px-5 py-2.5 border border-gray-300 rounded text-base no-underline text-gray-700 hover:bg-gray-100"
      >
        Register
      </router-link>
      <router-link
        to="/login"
        class="px-5 py-2.5 border border-gray-300 rounded text-base no-underline text-gray-700 hover:bg-gray-100"
      >
        Login
      </router-link>
    </nav>
  </div>
</template>
```

## 7) Run the dev server

```bash
npm run dev
```

Open the local URL and verify styles.

---

# Things to Keep Track Of (Gotchas)

- **One CSS import path**
  - Import `./assets/main.css` in `src/main.ts`. Do not also link it in `index.html` to avoid duplication.

- **PostCSS config format**
  - Prefer `postcss.config.cjs` with CommonJS on Windows. Having both `.js` and `.cjs` can cause the wrong config to load.

- **Scoped styles vs Tailwind utilities**
  - `<style scoped>` increases selector specificity and can override utilities (e.g., `h1 { font-size: 24px }`).
  - Prefer utilities; remove or limit scoped element selectors. If needed, use `!` important utilities (e.g., `!text-2xl`).

- **Router view placement**
  - Keep `<router-view />` inside your main app container in `App.vue` to avoid odd DOM structure.

- **HMR cache**
  - If utilities don’t appear, hard refresh the browser (Ctrl+F5) or restart the dev server after changing PostCSS/Tailwind config.

- **Verify Tailwind actually loads**
  - In DevTools, search the CSS bundle for `--tw-` or classes like `.text-2xl`.
  - If missing, PostCSS isn’t processing Tailwind. Re-check `postcss.config.cjs` and the CSS import.

- **Class existence**
  - If a utility doesn’t work, test a simple one like `bg-red-500` to validate Tailwind is active.

- **Content paths (if using config)**
  - Ensure `tailwind.config.js` `content` includes `index.html` and all `src` Vue/TS/JS files so utilities are not purged.

---

## Quick Checklist

- **Installed**: `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `autoprefixer`.
- **Config**: `postcss.config.cjs` with `@tailwindcss/postcss` and `autoprefixer`.
- **CSS entry**: `@import "tailwindcss";` in `src/assets/main.css`.
- **Imported**: `import './assets/main.css'` in `src/main.ts`.
- **Utilities**: Use Tailwind classes in your components; avoid conflicting scoped element rules.
- **Restart/Refresh**: After config changes, restart dev server and hard refresh.
