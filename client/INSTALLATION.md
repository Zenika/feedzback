# How to create a firebase project to work with FeedZback?

- Ouvrir https://console.firebase.google.com/

- Cliquer sur "Ajouter un projet" et suivre les instructions

- Une fois dans le nouveau projet, cliquer sur "Authentification"

  - Activer le fournisseur "Google"
    - Customiser si besoin le nom public du projet
    - Sélectionner l'adresse e-mail d'assistance

  - Activer le fournisseur "Anonyme"

## Hosting

- Ouvrir un terminal dans le dossier `./client`

- Dans Firebase, cliquer sur "Hosting" et suivre la procédure
  - Exécuter `npm install -g firebase-tools`
  - Cocher l'option "Afficher également la procédure permettant d'ajouter le SDK Firebase JavaScript à mon application Web"
  - Exécuter `firebase login`
  - Exécuter `firebase init` et sélectionner:
    - Firestore
    - Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys
  - Puis répondre comme suit aux questions:
      - What do you want to use as your public directory? `dist/client/browser`
      - Configure as a single-page app (rewrite all urls to /index.html)? `Yes`
      - Set up automatic builds and deploys with GitHub? `No`
      - File dist/client/browser/index.html already exists. Overwrite? `No`
  - Mettre à jour le fichier `src/environments/environment.development.ts` avec les configuration firebase
