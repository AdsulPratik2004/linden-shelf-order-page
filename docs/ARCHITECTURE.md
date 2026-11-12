# Architecture

## Overview

This is a Next.js App Router application built with TypeScript, React, and Tailwind CSS. The application follows a client-side rendering pattern for the product page, with a local API route serving product data.

## Project Structure

```
src/
  app/
    page.tsx                 Main page entry point
    layout.tsx               Root layout with fonts and global styles
    globals.css              Global CSS variables and Tailwind imports
    api/product/route.ts     API route for product data
  components/
    ProductPage.tsx          Orchestrates product display and states
    ProductDetails.tsx       Product information display
    OrderDialog.tsx          Modal dialog for order form
    OrderForm.tsx            Form for fulfillment and extras selection
    OrderConfirmation.tsx    Order summary after submission
    Button.tsx               Reusable button component
  hooks/
    useProduct.ts            Custom hook for fetching product data
  lib/
    products.ts              Static product data
    types.ts                 TypeScript type definitions
    schemas.ts               Zod validation schemas
    utils.ts                 Utility functions (formatPrice, calculateOrderTotal)
```

## Data Flow

1. **Product Fetching**: `ProductPage` uses `useProduct` hook to fetch data from `/api/product`
2. **State Management**: 
   - Product state (loading, error, success) managed in `useProduct` hook
   - Form state managed by React Hook Form in `OrderForm`
   - Dialog state managed in `ProductDetails` and `OrderDialog`
3. **Validation**: Zod schemas validate API responses and form submissions
4. **User Interaction**: 
   - User clicks "Add to order" → Opens `OrderDialog`
   - User selects options → Form validates and updates total
   - User submits → Shows `OrderConfirmation`

## Key Patterns

### Custom Hooks

- `useProduct`: Encapsulates product fetching with abort controller, retry logic, and Zod validation

### Form Management

- React Hook Form with Zod resolver for validation
- `useWatch` for reactive form state monitoring
- Conditional form field disabling based on fulfillment selection

### Accessibility

- ARIA attributes for screen readers
- Focus management in dialog (focus trap, focus restoration)
- Keyboard navigation (Escape to close, Tab trap)
- Semantic HTML elements

### API Mode Switching

The `/api/product` route supports different modes via `PRODUCT_API_MODE` environment variable:
- Default: Returns product data immediately
- `slow`: Returns product data after 2 seconds (for testing loading state)
- `error`: Returns 500 error (for testing error state)

## Component Hierarchy

```
page.tsx
  └── ProductPage
      └── ProductDetails
          ├── Product info (name, description, price, image)
          ├── Button (Add to order)
          └── OrderDialog
              ├── OrderForm
              │   ├── Fulfillment radio buttons
              │   ├── Extras checkboxes
              │   └── Total display
              └── OrderConfirmation
```

## Styling

- Tailwind CSS for utility-first styling
- Custom CSS variables in `globals.css` for theming
- Responsive design with mobile-first approach
- Breakpoints: mobile (default), tablet (md:), desktop (lg:)
