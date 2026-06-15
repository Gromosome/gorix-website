# Gorix Framework Website

A complete dark-theme Next.js website for the Gorix framework. The information architecture is inspired by modern framework websites such as NestJS, while the design uses Gorix's own orange-on-black identity and supplied slideshow artwork.

## Included

- Home page with hero, framework code panel, feature sections, architecture section, and responsive slideshow.
- Documentation rendered from local `.mdx` files in `content/docs`.
- Searchable documentation sidebar, generated page table of contents, and previous/next navigation.
- Firebase passwordless email-link verification for bug reporters.
- Protected bug-report API using Firebase Admin token verification and server-side Zod validation.
- Firestore storage with browser access denied by security rules.
- Responsive dark theme, SEO metadata, Open Graph, sitemap, and robots configuration.
- GitHub and pkg.go.dev links.

## 1. Install

```bash
npm install
```

## 2. Configure Firebase

Create a Firebase project and enable:

1. **Authentication → Sign-in method → Email/Password**
2. **Email link (passwordless sign-in)**
3. **Cloud Firestore**

Add `localhost` and your production domain under **Authentication → Settings → Authorized domains**.

Copy the environment template:

```bash
cp .env .env.local
```

Fill the public values from **Firebase Console → Project settings → Your apps → Web app**.

For the server values, create a service account under **Project settings → Service accounts**. Store the private key only in server-side environment variables. Never prefix Admin SDK variables with `NEXT_PUBLIC_`.

## 3. Deploy Firestore rules

Bug reports are written through the server API, so browser access to the collection is denied.

```bash
npm install -g firebase-tools
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules
```

## 4. Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Documentation authoring

Create an `.mdx` file in `content/docs`:

```mdx
---
title: Page title
description: One-line page description.
order: 10
section: Section name
---

## First heading

Write Markdown or MDX here.

<Callout type="warning" title="Important">
Custom React components are supported.
</Callout>
```

The dynamic documentation route automatically adds the page to the sidebar and sitemap.

## Bug-report flow

1. The reporter enters an email address.
2. Firebase sends a passwordless link to `/bug-report/verify`.
3. Firebase signs in the reporter and verifies the email.
4. The form sends the Firebase ID token to `/api/bug-reports`.
5. The server verifies the token, validates the payload, and writes the report through Firebase Admin.

## Production notes

- Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin.
- Add the same origin as an authorized Firebase Auth domain.
- Store Firebase Admin credentials in encrypted deployment secrets.
- Consider Firebase App Check, CAPTCHA, or a durable rate limiter as traffic grows.
- Review the illustrative Gorix API examples against the current tagged framework release before publishing.
