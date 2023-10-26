# WARNING

A date (26 octobre 2023), la dernière version du package `@apollo/client` est `3.8.6`.

Ce package est une peerDependency de `apollo-angular`.

Or en version `3.8.6`, le build est cassé (erreur obscure dans la console sur un fichier .d.ts d'Apollo...)

Pour cette raison, j'ai installé en dur la version précédente `3.8.5` et tout fonctionne.
Donc dans le package.json il y a la ligne suivante sans `~` ou `^` :

```json
{
  "name": "client",
  "peerDependencies": {
    "@apollo/client": "3.8.5"
  }
}
```
