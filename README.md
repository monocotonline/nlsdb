# NLS Digital Bookshop

SvelteKit (server-side) + PocketBase. Customers browse, add to a cart and pay without an account; admins manage products, orders and support.

## Run locally

```sh
pnpm install
cp .env.example .env        # fill in the PocketBase superuser details
cd pocketbase && ./pocketbase serve   # applies pb_migrations on start
pnpm dev                    # in another terminal
```

- Create the first **shop admin** in the PocketBase dashboard (http://127.0.0.1:8090/_/) → `admins` collection → New record. Further admins are registered from `/nls-console/admins`.
- Admin login: `/nls-console/login` (the path is set in `src/lib/admin-path.ts`; the route folder `src/routes/nls-console` must match).
- Customer accounts are optional: they sign up and log in from a dialog (Log in in the header). Guests can always check out without one.
- After pulling new migrations, restart PocketBase so they apply.
- With `PAYSTACK_SECRET_KEY` empty, dev uses a mock gateway (`/pay/mock`) so the whole flow can be tried. Production refuses to start payments without a key.

## Environment

| Variable                                       | Purpose                                                          |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| `PB_URL`                                       | PocketBase URL (default `http://127.0.0.1:8090`)                 |
| `PB_SUPERUSER_EMAIL` / `PB_SUPERUSER_PASSWORD` | Used by the server to write orders on behalf of anonymous buyers |
| `PAYSTACK_SECRET_KEY`                          | Paystack secret key. Webhook URL: `/api/paystack/webhook`        |

## Passwords and email

- **Customers** use "Forgot password?" in the log in dialog. PocketBase emails a link that opens the dialog on "Choose a new password". They can also change it from their account page.
- **Email must be set up for this to work in production:** PocketBase dashboard → Settings → Mail settings (SMTP), and set **Application URL** (Settings → Application) to the shop's address, because the reset link is built from it.
- **In development, without SMTP,** the reset link is printed in the terminal running PocketBase (`[dev] Open: …`), so you can still try the flow. It assumes the shop is at `http://localhost:5173`; set a `SHOP_URL` environment variable for PocketBase if it isn't.
- **Admins:** any admin can set another admin's (or their own) password from **Admins** → the lock icon. If every admin is locked out, run `./pocketbase superuser upsert you@example.com NewPassword` and create or edit an admin in the dashboard.

## Support

- Customers write to support at `/support`. Each message starts a private conversation at `/support/<long-random-link>`, where they can keep replying and see answers; it refreshes by itself. Guests can also look up an order there with its number and email.
- Admins answer in **Support** (a badge shows conversations waiting for a reply) and mark them resolved. A customer reply reopens a conversation.
- Replies are **not emailed**. Use "Email the link" or "Copy customer link" on a conversation to send the customer back to it.

## Orders

Paid orders have a **fulfilment** status (Processing, Shipped, Delivered) that admins change in **Transactions**. Customers see it as a progress tracker on their receipt.

## Cover images on Cloudflare R2

PocketBase stores covers itself and can use any S3-compatible bucket: dashboard → Settings → Files storage → enable S3, then use your R2 endpoint, bucket and access keys. No app code changes needed.

## Scripts

`pnpm dev` · `pnpm build` · `pnpm check` · `pnpm lint` · `pnpm format` · `pnpm test` · `pnpm seed`
