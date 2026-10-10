# Cartivo

A fast, mobile-first e-commerce storefront built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, **NextAuth** and **Server Actions**, on top of the Route e-commerce REST API.

## Features

- Catalog: home, shop with search / category filter / sort / pagination, product details with gallery and related products, categories (with sub-category filters) and brands
- Auth: sign in, register (auto sign-in), forgot password (email code → reset), protected routes
- Cart: add, update quantity, remove, clear — shared live state for header and bottom-nav badges
- Wishlist: optimistic heart toggle everywhere, dedicated wishlist page
- Checkout: saved or new address, **card (Stripe)** or **cash on delivery**
- Account: orders history, profile update, password change, address book
- Mobile: app-style bottom tab bar, swipeable filters, safe-area support, installable manifest

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

## Architecture

```
src/
├── app/                    Routes only — thin pages that compose components
│   ├── (shop)/             products, categories, brands        (public, cached/ISR)
│   ├── (account)/          cart, checkout, wishlist, allorders, profile (protected)
│   ├── (auth)/             login, register, forgot-password
│   ├── (info)/             about, contact, help, policies
│   └── api/auth/           NextAuth route handler
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
└── middleware.ts           Route protection
```

### Key decisions

- **The access token never reaches the browser.** It lives in the encrypted NextAuth cookie and is read only on the server (`lib/auth/session.ts`). Client components call Server Actions instead of the API directly.
- **Public pages are statically cached** (ISR, 1 hour) and product pages are pre-rendered at build time.
- **Search runs on the server** over the cached catalog, because the backend keyword search is unreliable.
- Every action returns `{ ok, data } | { ok: false, error }`, so the UI never has to `try/catch`.
