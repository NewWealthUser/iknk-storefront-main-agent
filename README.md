<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>

<h1 align="center">
  Medusa Next.js Starter Template
</h1>

<p align="center">
Combine Medusa's modules for your commerce backend with the newest Next.js 15 features for a performant storefront.</p>

<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

### Prerequisites

To use the [Next.js Starter Template](https://medusajs.com/nextjs-commerce/), you should have a Medusa server running locally on port 9000.
For a quick setup, run:

```shell
npx create-medusa-app@latest
```

Check out [create-medusa-app docs](https://docs.medusajs.com/learn/installation) for more details and troubleshooting.

# Overview

The Medusa Next.js Starter is built with:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Medusa](https://medusajs.com/)

Features include:

- Full ecommerce support:
  - Product Detail Page
  - Product Overview Page
  - Product Collections
  - Cart
  - Checkout with Stripe
  - User Accounts
  - Order Details
- Full Next.js 15 support:
  - App Router
  - Next fetching/caching
  - Server Components
  - Server Actions
  - Streaming
  - Static Pre-Rendering

# Quickstart

### Setting up the environment variables

Navigate into your projects directory and get your environment variables ready:

```shell
cd nextjs-starter-medusa/
mv .env.template .env.local
```

### Install dependencies

Use Yarn to install all dependencies.

```shell
yarn
```

### Start developing

You are now ready to start up your project.

```shell
yarn dev
```

### Open the code and start customizing

Your site is now running at http://localhost:8000!

# Payment integrations

By default this starter supports the following payment integrations

- [Stripe](https://stripe.com/)

To enable the integrations you need to add the following to your `.env.local` file:

```shell
NEXT_PUBLIC_STRIPE_KEY=<your-stripe-public-key>
```

You'll also need to setup the integrations in your Medusa server. See the [Medusa documentation](https://docs.medusajs.com) for more information on how to configure [Stripe](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe#main).

# Resources

## Learn more about Medusa

- [Website](https://www.medusajs.com/)
- [GitHub](https://github.com/medusajs)
- [Documentation](https://docs.medusajs.com/)

## Learn more about Next.js

- [Website](https://nextjs.org/)
- [GitHub](https://github.com/vercel/next.js)
- [Documentation](https://nextjs.org/docs)

---

# Developer Diagnostics & Environment Troubleshooting

If you encounter issues, especially with Medusa backend communication, follow these steps:

### 1) Ensure only one package manager is used (Yarn)

It's crucial to avoid mixed package managers. Clean up and reinstall:

```bash
cd "~/dyad-apps/iknk-storefront-main copy" # Adjust path if different
rm -rf node_modules .pnpm-store
rm -f package-lock.json pnpm-lock.yaml
yarn cache clean
yarn install
```

### 2) Verify environment variables

Check if your `NEXT_PUBLIC_MEDUSA_URL` is correctly set and accessible. It should be a full, absolute URL (e.g., `https://your-medusa-host.com` or `http://localhost:9000`).

```bash
echo $NEXT_PUBLIC_MEDUSA_URL
echo $NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
```

### 3) Ping Medusa directly

Test if your Medusa backend is reachable from your development environment:

```bash
curl -I "$NEXT_PUBLIC_MEDUSA_URL/store"
curl -I "$NEXT_PUBLIC_MEDUSA_URL/store/regions"
```

You should see HTTP status codes like `200 OK` or `401 Unauthorized` (if no auth is sent, which is expected for these endpoints without a publishable key in `curl`). If you see "connection refused" or a timeout, your backend is likely not running or not accessible at that URL.

### 4) Run local health route

Start your Next.js development server:

```bash
yarn dev
```

Then, open your browser to `http://localhost:3000/api/medusa/health`. This route will attempt to ping your Medusa backend and report its status.

### 5) (If CORS issues) Ensure Medusa backend ALLOWS your storefront origin

If you see CORS errors in your browser console, ensure your Medusa backend is configured to allow requests from your storefront's origin (e.g., `http://localhost:3000`). This is typically configured in `medusa-config.js` or via environment variables on your Medusa server.

Example `medusa-config.js` snippet:

```javascript
// ...
const plugins = [
  // ...
];

const modules = {
  // ...
};

const projectConfig = {
  // ...
  store_cors: process.env.STORE_CORS || "http://localhost:3000",
  admin_cors: process.env.ADMIN_CORS || "http://localhost:7001",
  // ...
};

module.exports = {
  plugins,
  projectConfig,
  modules,
};
```

Ensure `STORE_CORS` includes your storefront's URL.

### 6) (If still flaky) Temporarily bypass cart on SSR

If the site is still unstable during server-side rendering, you can temporarily bypass cart and customer data fetching on the server:

```bash
echo 'BYPASS_CART_ON_SSR=true' >> .env.local
yarn dev
```

This will allow the site to render with empty cart/customer data, and client-side fetching will attempt to populate it. This is a diagnostic step, not a permanent solution.

---