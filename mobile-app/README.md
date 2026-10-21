# LAM ÉVÉNEMENTIEL & EVENTS — Mobile app starter

This folder contains the first cross-platform mobile app prototype for iOS and Android, built with Expo and React Native.

## Current prototype
- Brand palette: Vert Anis, Gris, Bleu Cobalt, Rouge, Jaune, Orange.
- Home, Services, Booking Request, and Contact screens.
- Booking form fields for client and event details.
- Link to the current official website.

## Important before launch
This is a starter prototype, not a store-ready release. The booking form currently validates fields locally and does **not** transmit or save requests. No payment is collected. Before release, connect a secure backend/email workflow, verify the 70% deposit contract and payment provider, add the approved LAM logo and app icon assets, complete privacy disclosures, test on physical devices, and configure Apple/Google developer accounts.

## Run locally
Install a current Node.js LTS release, then from this directory run:

```sh
npm install
npx expo start
```

Use Expo Go for an initial preview where supported. For App Store and Google Play builds, configure EAS Build and review the current Apple and Google submission requirements.

Official website: https://themercuryjupiterevents.github.io/LAM--V-NEMENTIEL-EVENTS-/
