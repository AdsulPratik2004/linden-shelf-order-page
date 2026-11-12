# Linden shelf product page

**Git repo URL:** https://github.com/AdsulPratik2004/linden-shelf-order-page

**Deployed application:** https://linden-shelf-order-page.vercel.app/

A small Next.js take-home app for a furniture product page. A visitor can view the Linden shelf, open an order dialog, choose pickup or delivery plus extras, see a live total, and confirm the order.

This is a frontend assignment. There is no real checkout, payment, or backend database. Product data comes from a local API route.

## What a user can do

1. Open the site and wait for the product to load.
2. Read the product name, description, and shelf price.
3. Click **Add to order**.
4. Choose **Pickup** or **Delivery**.
5. Optionally add extras:
   - **Hardware kit** with either pickup or delivery.
   - **Assembly** only with delivery.
6. Watch the **Total** update as they change options.
7. Submit the order and see a confirmation of what they selected.
8. Click **Back to product** to close the dialog and return to the page.

They can also:

- Click **Try again** if the product fails to load.
- Press **Escape** or click the dimmed backdrop to close the dialog without submitting.

## Tech stack

- **Node version:** v22.16.0
- **Package manager:** npm
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Vitest + React Testing Library

## Setup

### Prerequisites

- **Node.js:** v22.16.0 or higher
- **npm:** comes with Node.js

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AdsulPratik2004/linden-shelf-order-page.git
cd linden-shelf-order-page
```

2. Install dependencies:

```bash
npm install
```

3. Optional: configure environment variables.

Create a `.env.local` file in the project root to configure API behavior:

```env
# API Mode Configuration
# Leave empty for normal operation (returns product data immediately)
PRODUCT_API_MODE=

# Available modes:
# - empty or any other value: Normal mode - returns product data immediately
# - slow: Waits 2 seconds before returning product data
# - error: Returns 500 error (for testing error handling)
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

Other scripts:

```bash
npm test      # Vitest
npm run lint  # ESLint
npm run build # Production build
```

## Data fetching

Product data is **fetched on the client**. The React application requests the product data from the local `/api/product` route and handles loading, success, and error states in the UI.

## Documentation

For detailed information about the project architecture, API, and implementation details, see the `docs` folder:

- `docs/ARCHITECTURE.md` - Project structure, data flow, and component hierarchy.
- `docs/API.md` - API endpoint documentation and configuration.

## AI tools

I used AI tools as part of the development and learning workflow:

- **ChatGPT:** Used to understand the assignment requirements, clarify implementation decisions, and understand the code and concepts used in the project.
- **Cursor:** Used during the initial project setup and implementation while free usage was available.
- **Windsurf (Cascade):** Used to continue the implementation, assist with code refactoring, documentation updates, and Git commit organization.

**One thing I changed or threw away:** Initially, I added a slide-up animation for the dialog on both mobile and desktop. After testing, I removed the desktop animation and kept only the mobile slide-up animation, as the desktop dialog appears centered and doesn't need the slide effect. The mobile animation uses a smooth cubic-bezier easing for better UX.
---

**Time spent:** ~4 hours