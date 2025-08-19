# AI Development Rules

This document outlines the rules and conventions for AI-driven development on this project. Adhering to these guidelines ensures consistency, maintainability, and leverages the existing tech stack effectively.

## Tech Stack Overview

This is a modern e-commerce storefront built with the following technologies:

*   **Framework**: Next.js 15 (using the App Router).
*   **Language**: TypeScript.
*   **UI Library**: React 19.
*   **E-commerce Backend**: MedusaJS, accessed via the `@medusajs/js-sdk`.
*   **Styling**: Tailwind CSS. All styling is done via utility classes.
*   **UI Components**: Primarily `@medusajs/ui`, supplemented by Headless UI and Radix UI for accessible primitives.
*   **Forms**: Handled with React 19's `useActionState` and Server Actions.
*   **Payments**: Stripe integration is built-in.
*   **Icons**: `@medusajs/icons` is the primary icon library.

## Library Usage and Coding Conventions

### 1. Component Library Hierarchy

-   **Primary Choice**: Always use components from `@medusajs/ui` whenever available. These are pre-styled and integrated with the project's design system.
-   **Secondary Choice (Primitives)**: If a required component or pattern (like a complex dropdown or dialog) is not in `@medusajs/ui`, use primitives from `@headlessui/react` or Radix UI. This ensures accessibility.
-   **Last Resort**: Only build a component from scratch if it's highly custom and cannot be composed from the libraries above.

### 2. Styling

-   **Tailwind CSS Exclusively**: All styling MUST be done using Tailwind CSS utility classes. Do not write custom CSS files or use CSS-in-JS libraries.
-   **Consistency**: Follow the existing styling conventions defined in `tailwind.config.js` and seen in existing components.

### 3. Data Fetching & State

-   **Server-Side First**: All data fetching from the Medusa backend MUST be done using Server Actions and server-side functions, as seen in the `src/lib/data/` directory.
-   **Client-Side State**: For client-side state, use React's built-in hooks (`useState`, `useReducer`, `useContext`). Do not introduce external state management libraries like Redux or Zustand.
-   **Forms**: Use React 19's `useActionState` hook along with Server Actions for form submissions and handling pending/error states.

### 4. Icons

-   **Primary Icon Library**: Use icons from `@medusajs/icons` whenever possible.
-   **Custom Icons**: If a specific icon is not available, you may create a new component in `src/modules/common/icons/`, following the existing format.

### 5. File Structure

-   **Pages**: Place route components inside the `src/app/[countryCode]/` directory structure.
-   **Modules**: Reusable components and features should be organized into modules within the `src/modules/` directory (e.g., `src/modules/products`, `src/modules/cart`).
-   **Common Components**: General-purpose, reusable components (like `Input`, `Button`, `Modal`) should be placed in `src/modules/common/components/`.