# LAM ÉVÉNEMENTIEL & EVENTS — application multiplateforme

Le dossier comprend :
- `App.js` : base Expo / React Native pour créer des applications iOS et Android.
- `index.html` : version web responsive et installable pour téléphones, tablettes et ordinateurs.
- `manifest.json` et `sw.js` : métadonnées d’installation et mise en cache de base.

## Compatibilité visée
- iPhone et iPad avec Safari et versions iOS/iPadOS prises en charge.
- Samsung et autres téléphones/tablettes Android avec un navigateur compatible.
- Ordinateurs Windows (Dell, Toshiba, etc.) et macOS via un navigateur récent.

## Version web
Quand GitHub Pages sert ce dossier, la version web est accessible à :
https://themercuryjupiterevents.github.io/LAM--V-NEMENTIEL-EVENTS-/mobile-app/

Sur les navigateurs compatibles, les visiteurs pourront ajouter l’application à leur écran d’accueil ou l’installer. Cela ne signifie pas encore qu’elle est publiée sur l’Apple App Store ou Google Play Store.

## Démarrer la version native
Installer une version LTS récente de Node.js, puis depuis ce dossier :

```sh
npm install
npx expo start
```

Pour créer les versions de publication, configurer EAS Build, ajouter le vrai logo et les icônes de LAM, tester sur appareils physiques et respecter les exigences actuelles d’Apple et de Google.

## Obligatoire avant le lancement public
Le formulaire de réservation est encore une démonstration : il ne transmet ni n’enregistre les données. Il faut connecter un backend sécurisé ou un système de réception de demandes approuvé, ajouter une politique de confidentialité et le consentement approprié, confirmer les conditions de dépôt de 70 %, choisir un prestataire de paiement sécurisé si nécessaire et tester toutes les fonctions. Aucun paiement n’est collecté dans ce prototype.

Site officiel : https://themercuryjupiterevents.github.io/LAM--V-NEMENTIEL-EVENTS-/
