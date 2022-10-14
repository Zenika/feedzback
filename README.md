<h1 align="center"> FeedZback </h1>
<p>
  <a href="#" target="_blank">
    <img alt="License: Apache License 2.0" src="https://img.shields.io/badge/License-Apache License 2.0-yellow.svg" />
  </a>
</p>
 You want to ask or send feedbacks to your colleges but you are afraid about negative consequences? Here you go, FeedZback guides you.

### 🏠 [Homepage](https://feedzback.zenika.com)

## Author

👤 **Bnyat AZIZ SHARIF**


## 🤝 Contributing

Feel free to contribute, open [issues](https://github.com/Zenika/feedzback/issues) and add features by opening pull requests.


## Server
 ### Installation
    Make sure you installed npm packages
 ### Environment Variables
    Create `.env` file and put those variables below in it:
    `API_KEY`= your mailgun Api
    `DOMAIN`= your mailgun domain
    `URL_CLIENT` your url client form to set into email template
 
 ### Firebase
    Go to firebase Project console => Project overview => service accounts => Generate new private key
    Create a file firebase-service-key.json and put the service key
    
 ### Run Server
   npm start
 ### Test Server
   npm test
  
## Client
 ### Installation
   Make sure you installed Angular CLI package
   And Concurrently package `npm i concurrently` for starting server and client while e2e test
 ### Environment Variables
   You would replace `serverApi` in environments/environment.ts file in case your server does not run on port 4000
 ### Run client
   ng serve
 ### Run unit tests
  ng test
 ### Run e2e tests
  npm run cypress
   
