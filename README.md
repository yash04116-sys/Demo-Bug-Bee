# Fieldwork browser error demo

A multi-route React storefront with controlled, repeatable failures. No payments, customer accounts, or real shipments.

## Start locally

Node 22.13+. Run `pnpm install && pnpm dev` (or `npm install && npm run dev`) and open the printed URL. The cart is stored in localStorage so the journey survives page navigation. To start fresh, clear this site's localStorage or remove cart items on `/cart`.

## Main challenge: checkout failure

1. From `/`, open **The Field Kit** (the product detail route is `/products/field-kit`).
2. Add it to cart, continue to `/checkout`.
3. Choose **Express delivery**, type `WELCOME15` into **Have a code?**, click **Apply**.
4. Observe `POST /api/checkout/quote` returning HTTP 422 `PROMO_SHIPPING_CONFLICT`, followed by `Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'toFixed')`.

The underlying policy in `app/api/checkout/quote/route.ts` rejects that shipping+coupon combination. `app/checkout/page.tsx` still assumes that every response includes a numeric `total`. A useful diagnosis connects the **earlier shipping choice**, **promo click**, **422 response body**, and **downstream TypeError**. The same coupon with Standard delivery returns a valid quote; Express delivery with any other code also returns a valid quote. A generic console-error summary misses the cause.

## Other paths

- `/orders` → sample order `/orders/FW-1042` → **Refresh tracking**: the simulated carrier API returns HTTP 503 `CARRIER_GATEWAY_TIMEOUT` and the page produces an unhandled rejection. This failure is in the carrier integration, separate from pricing.
- `/lab`: original one-click **Reserve kit** missing-profile TypeError and **Check live warehouse stock** HTTP 503 + rejection. Use these for initial capture validation.

## Extension integration

Use page `MAIN` world injection at `document_start` to see page errors, `fetch` and console calls; a normal Chrome extension content script in the isolated world does not automatically intercept them. Bridge narrow captured messages back to the extension and validate their source. Record action labels and page URLs across navigation (a tab-scoped buffer), then tie the network response to the subsequent error. `fetch` resolves on HTTP 4xx/5xx; inspect `response.ok` or `status`. Avoid recording form contents such as email and address in bug reports. For the main challenge, the promo code and shipping method are necessary context.
