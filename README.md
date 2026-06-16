# Gorix Framework Website

A complete dark-theme Next.js website for the Gorix framework. The information architecture is inspired by modern framework websites such as NestJS, while the design uses Gorix's own orange-on-black identity and supplied slideshow artwork.

## Included

- Home page with hero, framework code panel, feature sections, architecture section, and responsive slideshow.
- Documentation rendered from local `.mdx` files in `content/docs`.
- Searchable documentation sidebar, generated page table of contents, and previous/next navigation.
- Firebase GitHub OAuth verification for bug reporters and code challenge submissions.
- Client-side Firestore submissions protected by Firebase Auth and Firestore security rules.
- Firestore-backed verified project leaderboard.
- Responsive dark theme, SEO metadata, Open Graph, sitemap, and robots configuration.
- GitHub and pkg.go.dev links.

## 1. Install

```bash
npm install
```

## 2. Configure Firebase

Create a Firebase project and enable:

1. **Authentication → Sign-in method → GitHub**
2. **Authentication → Settings → Authorized domains**
3. **Cloud Firestore**

Add `localhost` and every production host under **Authorized domains**. For this site, use:

- `gorix.gromosome.com`

Do not include a protocol (`https://`) or path in Firebase authorized domains.

In the GitHub OAuth app settings, add Firebase's GitHub callback URL from **Authentication → Sign-in method → GitHub**.

Copy the environment template:

```bash
cp .env .env.local
```

Fill the public values from **Firebase Console → Project settings → Your apps → Web app**.

For the server values, create a service account under **Project settings → Service accounts**. Store the private key only in server-side environment variables. Never prefix Admin SDK variables with `NEXT_PUBLIC_`.

## 3. Deploy Firestore rules

GitHub Pages is a static deployment, so submissions and leaderboard reads use Firebase directly from the browser. Deploy the included Firestore rules before relying on production forms.

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

## GitHub Pages Firebase setup

Set these GitHub Actions secrets before deploying the static site:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

The deploy workflow fails fast if any of these secrets are missing, because a static build embeds the public Firebase config at build time.

If production sign-in still fails with `auth/unauthorized-domain`, the GitHub Actions secrets are present but Firebase Auth is rejecting the Pages host. Add `gorix.gromosome.com` in Firebase Authentication authorized domains and redeploy.

For GitHub Pages custom domain setup:

1. Add a DNS `CNAME` record: `gorix` → `gromosome.github.io`.
2. In GitHub repository settings, go to **Pages → Custom domain** and set `gorix.gromosome.com`.
3. Keep `public/CNAME` committed so the domain survives every deploy.
4. Enable **Enforce HTTPS** after GitHub finishes DNS verification.

If production submit/listing fails with `permission-denied`, deploy the checked-in Firestore rules:

```bash
firebase deploy --only firestore:rules
```

## Submission flow

1. The visitor signs in with Firebase GitHub OAuth.
2. The form validates the input client-side with Zod.
3. The browser writes to Firestore with the signed-in Firebase user.
4. Firestore rules allow creates only from GitHub-authenticated users with the expected fields.
5. Verified code challenge projects can be read publicly by the leaderboard.

## Production notes

- Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin.
- Add the same origin as an authorized Firebase Auth domain.
- Deploy `firestore.rules` after changing submission fields or collection names.
- Consider Firebase App Check, CAPTCHA, or a durable rate limiter as traffic grows.
- Review the illustrative Gorix API examples against the current tagged framework release before publishing.
