# Cartivo

A fast, mobile-first e-commerce storefront built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, **NextAuth** and **Server Actions**, on top of the Route e-commerce REST API.

## Features

- Catalog: home, shop with search / category filter / sort / pagination, product details with gallery and related products, categories (with sub-category filters) and brands
- Auth: sign in, register (auto sign-in), forgot password (email code → reset), protected routes
- Cart: add, update quantity, remove, clear — shared live state for header and bottom-nav badges
- Wishlist: optimistic heart toggle everywhere, dedicated wishlist page
- Checkout: saved or new address, **card (Stripe)** or **cash on delivery**
- Account: orders history, profile update, password change, address book
- Shop filters: category, sub-category, price range, in-stock only, sorting — all in the URL, shareable
- Product page: quantity picker, stock warnings, related products
- **Arabic + English** with full right-to-left layout and an Arabic font, switchable from the header
- Mobile: app-style bottom tab bar, swipeable filters, safe-area support, installable manifest
- SEO: sitemap.xml, robots.txt, product structured data (price, stock, rating), proper 404 status codes

## Getting started

```bash
cp .env.example .env.local   # then fill NEXTAUTH_SECRET
npm install
npm run dev
```

| Variable          | Description                                   |
| ----------------- | --------------------------------------------- |
| `API_URL`         | Backend base URL (`.../api/v1`)               |
| `NEXTAUTH_URL`    | Public URL of the app                         |
| `NEXTAUTH_SECRET` | Random secret used to encrypt the session JWT |

Scripts: `dev`, `build`, `start`, `lint`, `typecheck`.

### Deploying to Vercel

Add the three variables above in **Project → Settings → Environment Variables**, with `NEXTAUTH_URL` set to your real domain (e.g. `https://cartivo.vercel.app`) and a **new** random `NEXTAUTH_SECRET`. Without them, sign-in will not work in production.

## Architecture

```
src/
├── app/
│   └── [locale]/           Every page, rendered once per language (en, ar)
│       ├── (shop)/             products, categories, brands        (public, cached/ISR)
│       ├── (account)/          cart, checkout, wishlist, allorders, profile (protected)
│       ├── (auth)/             login, register, forgot-password
│       └── (info)/             about, contact, help, policies
│   └── api/auth/           NextAuth route handler
├── i18n/                   Language config, dictionaries (en.ts, ar.ts) and helpers
├── actions/                Server Actions ("use server") — every mutation goes through here
├── lib/
│   ├── api/http.ts         The single fetch wrapper (caching, auth header, errors)
│   ├── api/catalog.ts      Products / categories / brands + server-side search & sort
│   ├── api/account.ts      Cart / wishlist / orders / addresses readers
│   ├── auth/               NextAuth options + server session helpers
│   ├── validations.ts      Zod schemas shared by forms and actions
│   └── config.ts, format.ts, utils.ts
├── providers/              Client state: session, cart, wishlist
├── components/
│   ├── layout/             Header, BottomNav, Footer, Logo
│   ├── product/ catalog/ cart/ checkout/ orders/ account/ auth/ home/ shared/
│   └── ui/                 shadcn/ui primitives
├── types/                  Domain types
└── middleware.ts           Picks the language and protects account routes
```

### Key decisions

- **Clean URLs in both languages.** The language lives in a cookie (or the browser language on first visit); middleware rewrites `/products` to `/ar/products` internally, so every page is still statically cached per language. Visiting `/ar/...` or `/en/...` sets the language.
- **All text lives in `src/i18n/dictionaries`.** Add a string to `en.ts` and TypeScript forces the same key in `ar.ts`.
- **The access token never reaches the browser.** It lives in the encrypted NextAuth cookie and is read only on the server (`lib/auth/session.ts`). Client components call Server Actions instead of the API directly.
- **Public pages are statically cached** (ISR, 1 hour) and product pages are pre-rendered at build time.
- **Search runs on the server** over the cached catalog, because the backend keyword search is unreliable.
- Every action returns `{ ok, data } | { ok: false, error }`, so the UI never has to `try/catch`.
