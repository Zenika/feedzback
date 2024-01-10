# Enable localization

## firebase.json

```json
{
  "hosting": [
    {
      "target": "staging",
      "public": "dist/client/browser",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "/fr/**",
          "destination": "/fr/index.html"
        },
        {
          "source": "/en/**",
          "destination": "/en/index.html"
        }
      ]
    },
    {
      "target": "production",
      "public": "dist/client/browser",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "/fr/**",
          "destination": "/fr/index.html"
        },
        {
          "source": "/en/**",
          "destination": "/en/index.html"
        }
      ]
    }
  ]
}
```

## package.json

```json
{
  "scripts": {
    "build:staging": "ng build --configuration staging && npm run post-build",
    "build:production": "ng build --configuration production && npm run post-build",
    "post-build": "cp src/404.html dist/client/browser/404.html",
  }
}
```

## angular.json

```json
{
  "projects": {
    "client": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "localize": true
          }
        }
      }
    }
  }
}
```
