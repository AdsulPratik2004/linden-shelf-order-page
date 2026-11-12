# API Documentation

## Product API

### GET /api/product

Returns product data for the Linden shelf.

#### Response

```json
{
  "name": "Linden shelf",
  "description": "A solid linden wall shelf with hidden brackets.",
  "priceCents": 18000,
  "fulfillment": [
    {
      "code": "pickup",
      "label": "Pickup",
      "priceCents": 0
    },
    {
      "code": "delivery",
      "label": "Delivery",
      "priceCents": 2500
    }
  ],
  "extras": [
    {
      "code": "assembly",
      "label": "Assembly",
      "priceCents": 4000,
      "requires": "delivery"
    },
    {
      "code": "hardware",
      "label": "Hardware kit",
      "priceCents": 3000,
      "requires": null
    }
  ]
}
```

#### Fields

- `name`: Product name (string)
- `description`: Product description (string)
- `priceCents`: Base price in cents (number)
- `fulfillment`: Array of fulfillment options
  - `code`: Unique identifier (string)
  - `label`: Display label (string)
  - `priceCents`: Additional cost in cents (number)
- `extras`: Array of available extras
  - `code`: Unique identifier (string)
  - `label`: Display label (string)
  - `priceCents`: Additional cost in cents (number)
  - `requires`: Fulfillment code required, or null if no requirement (string | null)

## API Modes

The API route supports different modes via the `PRODUCT_API_MODE` environment variable. Set this in `.env.local`:

### Default Mode (unset or any other value)

Returns product data immediately with status 200.

### Slow Mode

```env
PRODUCT_API_MODE=slow
```

Waits 2 seconds before returning product data. Useful for testing loading states.

### Error Mode

```env
PRODUCT_API_MODE=error
```

Returns a 500 error with the following response:

```json
{
  "error": "unavailable"
}
```

Useful for testing error handling and retry functionality.

## Usage Example

```typescript
const response = await fetch('/api/product');
const product = await response.json();
```

## Validation

The API response is validated on the client side using Zod schema (`productSchema` in `src/lib/schemas.ts`). If the response doesn't match the expected schema, an error is thrown.
