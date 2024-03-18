"use strict";(self.webpackChunkfeedzback_docs=self.webpackChunkfeedzback_docs||[]).push([[102],{578:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>r,contentTitle:()=>s,default:()=>h,frontMatter:()=>o,metadata:()=>d,toc:()=>t});var c=n(4848),l=n(8453);const o={},s="CircleCI",d={id:"ci-cd/circle-ci",title:"CircleCI",description:"Pre-requisites",source:"@site/docs/ci-cd/circle-ci.md",sourceDirName:"ci-cd",slug:"/ci-cd/circle-ci",permalink:"/feedzback/docs/ci-cd/circle-ci",draft:!1,unlisted:!1,editUrl:"https://github.com/Zenika/feedzback/tree/main/docusaurus/docs/ci-cd/circle-ci.md",tags:[],version:"current",frontMatter:{},sidebar:"default",previous:{title:"Quick start",permalink:"/feedzback/docs/ci-cd/quick-start"},next:{title:"Usage analytics",permalink:"/feedzback/docs/ci-cd/usage-analytics"}},r={},t=[{value:"Pre-requisites",id:"pre-requisites",level:2},{value:"Firebase &amp; co",id:"firebase--co",level:3},{value:"GCP APIs to enable",id:"gcp-apis-to-enable",level:3},{value:"Service account setup",id:"service-account-setup",level:3},{value:"Google artifact repository",id:"google-artifact-repository",level:3},{value:"Domain mapping",id:"domain-mapping",level:3},{value:"IAM",id:"iam",level:3},{value:"Environment variables",id:"environment-variables",level:2},{value:"Google Cloud Platform",id:"google-cloud-platform",level:3},{value:"<code>GCLOUD_SERVICE_KEY</code>",id:"gcloud_service_key",level:4},{value:"<code>GOOGLE_COMPUTE_ZONE</code>",id:"google_compute_zone",level:4},{value:"<code>GOOGLE_PROJECT_ID</code>",id:"google_project_id",level:4},{value:"Firebase",id:"firebase",level:3},{value:"<code>FIREBASE_TOKEN</code>",id:"firebase_token",level:4},{value:"<code>FIREBASE_PROJECT_ID</code>",id:"firebase_project_id",level:4},{value:"<code>FIREBASE_CLIENT_EMAIL</code>",id:"firebase_client_email",level:4},{value:"<code>FIREBASE_PRIVATE_KEY</code>",id:"firebase_private_key",level:4},{value:"Mailgun",id:"mailgun",level:3},{value:"<code>MAILGUN_URL</code>",id:"mailgun_url",level:4},{value:"<code>MAILGUN_USERNAME</code>",id:"mailgun_username",level:4},{value:"<code>MAILGUN_KEY</code>",id:"mailgun_key",level:4},{value:"<code>MAILGUN_DOMAIN</code>",id:"mailgun_domain",level:4},{value:"Crypto",id:"crypto",level:3},{value:"<code>CRYPTO_SECRET_KEY</code> &amp; <code>CRYPTO_SECRET_IV</code>",id:"crypto_secret_key--crypto_secret_iv",level:4},{value:"Node",id:"node",level:3},{value:"<code>NODE_ENV</code>",id:"node_env",level:4},{value:"App",id:"app",level:3},{value:"<code>SERVER_PORT</code>",id:"server_port",level:4},{value:"<code>CLIENT_URL</code>",id:"client_url",level:4},{value:"Usage analytics",id:"usage-analytics",level:2},{value:"Links",id:"links",level:2},{value:"Development \ud83d\udea7",id:"development-",level:3},{value:"Staging \ud83d\ude80",id:"staging-",level:3},{value:"Production \ud83c\udfac",id:"production-",level:3}];function a(e){const i={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...(0,l.R)(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i.h1,{id:"circleci",children:"CircleCI"}),"\n",(0,c.jsx)(i.h2,{id:"pre-requisites",children:"Pre-requisites"}),"\n",(0,c.jsx)(i.h3,{id:"firebase--co",children:"Firebase & co"}),"\n",(0,c.jsxs)(i.ul,{children:["\n",(0,c.jsx)(i.li,{children:"The Firebase project must be created"}),"\n",(0,c.jsx)(i.li,{children:"A Firestore database must be defined in the project"}),"\n"]}),"\n",(0,c.jsx)(i.h3,{id:"gcp-apis-to-enable",children:"GCP APIs to enable"}),"\n",(0,c.jsx)(i.p,{children:"The following APIs must be enabled on the linked GCP Project (which is automatically created when you create a Firebase project):"}),"\n",(0,c.jsxs)(i.ul,{children:["\n",(0,c.jsx)(i.li,{children:(0,c.jsx)(i.a,{href:"https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com",children:"Cloud Build API"})}),"\n",(0,c.jsx)(i.li,{children:(0,c.jsx)(i.a,{href:"https://console.cloud.google.com/apis/library/run.googleapis.com",children:"Cloud Run API"})}),"\n"]}),"\n",(0,c.jsx)(i.h3,{id:"service-account-setup",children:"Service account setup"}),"\n",(0,c.jsxs)(i.p,{children:["A specific service account to build and deploy needs to exist on the project (used ",(0,c.jsx)(i.a,{href:"#gcloud_service_key",children:"here"}),")."]}),"\n",(0,c.jsx)(i.h3,{id:"google-artifact-repository",children:"Google artifact repository"}),"\n",(0,c.jsxs)(i.p,{children:["The GCP Project needs to have a Docker ",(0,c.jsx)(i.a,{href:"https://console.cloud.google.com/artifacts",children:"Google Artifact Repository"})," created named ",(0,c.jsx)(i.code,{children:"builds"})," for the CI to work properly."]}),"\n",(0,c.jsx)(i.h3,{id:"domain-mapping",children:"Domain mapping"}),"\n",(0,c.jsxs)(i.p,{children:["This can be done after a first deployment: through ",(0,c.jsx)(i.a,{href:"https://console.cloud.google.com/run/domains",children:"Domain mappings in GCP"})," (for the server), and Firebase console (for the client)."]}),"\n",(0,c.jsx)(i.h3,{id:"iam",children:"IAM"}),"\n",(0,c.jsx)(i.p,{children:"It requires a few privileges as well:"}),"\n",(0,c.jsxs)(i.ul,{children:["\n",(0,c.jsx)(i.li,{children:"Artifact Registry Writer"}),"\n",(0,c.jsx)(i.li,{children:"Cloud Build Service Account"}),"\n",(0,c.jsx)(i.li,{children:"Cloud Run Admin"}),"\n",(0,c.jsx)(i.li,{children:"Firebase Hosting Admin"}),"\n",(0,c.jsx)(i.li,{children:"Project Editor (aka Basic > Editor)"}),"\n"]}),"\n",(0,c.jsx)(i.h2,{id:"environment-variables",children:"Environment variables"}),"\n",(0,c.jsx)(i.p,{children:"Environment variables are provided by a CircleCI Context (feedzback-dev for dev, feedzback-staging for staging, feedzback-production for production)."}),"\n",(0,c.jsx)(i.h3,{id:"google-cloud-platform",children:"Google Cloud Platform"}),"\n",(0,c.jsx)(i.p,{children:"These settings are used to build and deploy the server on the GCP Project as a Google Cloud Run managed service."}),"\n",(0,c.jsx)(i.h4,{id:"gcloud_service_key",children:(0,c.jsx)(i.code,{children:"GCLOUD_SERVICE_KEY"})}),"\n",(0,c.jsxs)(i.p,{children:["Full JSON service key linked to the Service Account allowed to build and run the server on the GCP Project.\nIt is also used as the main authentication method for the Firebase CLI during client deployment as ",(0,c.jsx)(i.a,{href:"#firebase_token",children:"FIREBASE_TOKEN"})," usage will be decomissioned in the next major version."]}),"\n",(0,c.jsx)(i.h4,{id:"google_compute_zone",children:(0,c.jsx)(i.code,{children:"GOOGLE_COMPUTE_ZONE"})}),"\n",(0,c.jsx)(i.p,{children:"Default compute zone to use (europe-west1 usually)."}),"\n",(0,c.jsx)(i.h4,{id:"google_project_id",children:(0,c.jsx)(i.code,{children:"GOOGLE_PROJECT_ID"})}),"\n",(0,c.jsx)(i.p,{children:"Self-reference to the Project (used by the CircleCI orb to properly handle resources)."}),"\n",(0,c.jsx)(i.h3,{id:"firebase",children:"Firebase"}),"\n",(0,c.jsx)(i.h4,{id:"firebase_token",children:(0,c.jsx)(i.code,{children:"FIREBASE_TOKEN"})}),"\n",(0,c.jsxs)(i.p,{children:["Token used only by CI to connect to Firebase and deploy the client. Was generated following this ",(0,c.jsx)(i.a,{href:"https://firebase.google.com/docs/cli?authuser=0#cli-ci-systems",children:"documentation"})]}),"\n",(0,c.jsx)(i.h4,{id:"firebase_project_id",children:(0,c.jsx)(i.code,{children:"FIREBASE_PROJECT_ID"})}),"\n",(0,c.jsx)(i.p,{children:"Identifier of the Firebase project."}),"\n",(0,c.jsx)(i.h4,{id:"firebase_client_email",children:(0,c.jsx)(i.code,{children:"FIREBASE_CLIENT_EMAIL"})}),"\n",(0,c.jsx)(i.p,{children:"Identifier used to authenticate against the Firebase stack. Found in the Firebase console."}),"\n",(0,c.jsx)(i.h4,{id:"firebase_private_key",children:(0,c.jsx)(i.code,{children:"FIREBASE_PRIVATE_KEY"})}),"\n",(0,c.jsx)(i.p,{children:"A Service Account must be defined with the proper key. The private key used in the FIREBASE_PRIVATE_KEY environment variable needs to be base64 encoded."}),"\n",(0,c.jsxs)(i.ul,{children:["\n",(0,c.jsx)(i.li,{children:"Using bash:"}),"\n"]}),"\n",(0,c.jsx)(i.pre,{children:(0,c.jsx)(i.code,{className:"language-bash",children:'echo "content_of_private_key_field_in_json_key" | base64\n'})}),"\n",(0,c.jsxs)(i.ul,{children:["\n",(0,c.jsx)(i.li,{children:"Using Node.js:"}),"\n"]}),"\n",(0,c.jsx)(i.pre,{children:(0,c.jsx)(i.code,{className:"language-js",children:"Buffer.from('content_of_private_key_field_in_json_key').toString('base64');\n"})}),"\n",(0,c.jsx)(i.h3,{id:"mailgun",children:"Mailgun"}),"\n",(0,c.jsxs)(i.p,{children:["These are injected in the Cloud Run container in order to properly use Mailgun to send emails and notifications.\nOn dev and staging, a sandbox account is used that redirects any sent email to ",(0,c.jsx)(i.a,{href:"mailto:feedzback@zenika.com",children:"feedzback@zenika.com"}),"."]}),"\n",(0,c.jsx)(i.h4,{id:"mailgun_url",children:(0,c.jsx)(i.code,{children:"MAILGUN_URL"})}),"\n",(0,c.jsx)(i.p,{children:"The mailgun endpoint to use to connect to mailgun sending server."}),"\n",(0,c.jsxs)(i.ul,{children:["\n",(0,c.jsxs)(i.li,{children:["for sandbox mailgun account: ",(0,c.jsx)(i.code,{children:"https://api.mailgun.net"})]}),"\n",(0,c.jsxs)(i.li,{children:["for production account (which is in EU): ",(0,c.jsx)(i.code,{children:"https://api.eu.mailgun.net"})]}),"\n"]}),"\n",(0,c.jsx)(i.h4,{id:"mailgun_username",children:(0,c.jsx)(i.code,{children:"MAILGUN_USERNAME"})}),"\n",(0,c.jsx)(i.p,{children:"The Mailgun API username (needs to match the domain of the key)."}),"\n",(0,c.jsx)(i.h4,{id:"mailgun_key",children:(0,c.jsx)(i.code,{children:"MAILGUN_KEY"})}),"\n",(0,c.jsx)(i.p,{children:"An API secret defined on the mailgun platform that allows to send email."}),"\n",(0,c.jsx)(i.h4,{id:"mailgun_domain",children:(0,c.jsx)(i.code,{children:"MAILGUN_DOMAIN"})}),"\n",(0,c.jsxs)(i.p,{children:["The domain associated with the account.\nUse the sandbox username as the domain (",(0,c.jsx)(i.code,{children:"sandbox8d21179029774bb29c92557ea6ab0d88.mailgun.org"}),").\nIn production should be ",(0,c.jsx)(i.code,{children:"feedzback.znk.io"}),"."]}),"\n",(0,c.jsx)(i.h3,{id:"crypto",children:"Crypto"}),"\n",(0,c.jsxs)(i.h4,{id:"crypto_secret_key--crypto_secret_iv",children:[(0,c.jsx)(i.code,{children:"CRYPTO_SECRET_KEY"})," & ",(0,c.jsx)(i.code,{children:"CRYPTO_SECRET_IV"})]}),"\n",(0,c.jsx)(i.p,{children:"Used to encrypt/decrypt sensitives data in the Firestore database."}),"\n",(0,c.jsxs)(i.p,{children:["In dev and staging set their values to: ",(0,c.jsx)(i.code,{children:"feedzback"}),"."]}),"\n",(0,c.jsx)(i.h3,{id:"node",children:"Node"}),"\n",(0,c.jsx)(i.h4,{id:"node_env",children:(0,c.jsx)(i.code,{children:"NODE_ENV"})}),"\n",(0,c.jsxs)(i.p,{children:["Should be ",(0,c.jsx)(i.code,{children:"production"})," for production environment, otherwise all mails will be sent to ",(0,c.jsx)(i.code,{children:"feedzback@zenika.com"}),"."]}),"\n",(0,c.jsx)(i.h3,{id:"app",children:"App"}),"\n",(0,c.jsx)(i.h4,{id:"server_port",children:(0,c.jsx)(i.code,{children:"SERVER_PORT"})}),"\n",(0,c.jsx)(i.p,{children:"The port on which the server is listening."}),"\n",(0,c.jsx)(i.h4,{id:"client_url",children:(0,c.jsx)(i.code,{children:"CLIENT_URL"})}),"\n",(0,c.jsx)(i.p,{children:"This helps the server compose URLs to include in emails."}),"\n",(0,c.jsx)(i.h2,{id:"usage-analytics",children:"Usage analytics"}),"\n",(0,c.jsxs)(i.p,{children:["Usage analytics can be set up using ",(0,c.jsx)(i.a,{href:"/docs/ci-cd/usage-analytics",children:"these instructions"})]}),"\n",(0,c.jsx)(i.h2,{id:"links",children:"Links"}),"\n",(0,c.jsx)(i.h3,{id:"development-",children:"Development \ud83d\udea7"}),"\n",(0,c.jsxs)(i.ul,{children:["\n",(0,c.jsx)(i.li,{children:(0,c.jsx)(i.a,{href:"https://console.firebase.google.com/project/feedzback-v2-dev",children:"Firebase console"})}),"\n",(0,c.jsx)(i.li,{children:(0,c.jsx)(i.a,{href:"https://console.cloud.google.com/home/dashboard?hl=en&project=feedzback-v2-dev",children:"GCP console"})}),"\n",(0,c.jsx)(i.li,{children:(0,c.jsx)(i.a,{href:"https://app.circleci.com/settings/organization/github/Zenika/contexts/686ad410-3bba-4c59-a904-da3fe737eaa3?return-to=%2F",children:"CircleCI context"})}),"\n"]}),"\n",(0,c.jsx)(i.h3,{id:"staging-",children:"Staging \ud83d\ude80"}),"\n",(0,c.jsxs)(i.ul,{children:["\n",(0,c.jsx)(i.li,{children:(0,c.jsx)(i.a,{href:"https://console.firebase.google.com/project/feedzback-v2-staging",children:"Firebase console"})}),"\n",(0,c.jsx)(i.li,{children:(0,c.jsx)(i.a,{href:"https://console.cloud.google.com/home/dashboard?hl=en&project=feedzback-v2-staging",children:"GCP console"})}),"\n",(0,c.jsx)(i.li,{children:(0,c.jsx)(i.a,{href:"https://app.circleci.com/settings/organization/github/Zenika/contexts/489bddb3-fe2e-465e-91f9-b9ba7a155e0d?return-to=%2F",children:"CircleCI context"})}),"\n"]}),"\n",(0,c.jsx)(i.h3,{id:"production-",children:"Production \ud83c\udfac"}),"\n",(0,c.jsxs)(i.ul,{children:["\n",(0,c.jsx)(i.li,{children:(0,c.jsx)(i.a,{href:"https://console.firebase.google.com/project/feedzback-v2",children:"Firebase console"})}),"\n",(0,c.jsx)(i.li,{children:(0,c.jsx)(i.a,{href:"https://console.cloud.google.com/home/dashboard?hl=en&project=feedzback-v2",children:"GCP console"})}),"\n",(0,c.jsx)(i.li,{children:(0,c.jsx)(i.a,{href:"https://app.circleci.com/settings/organization/github/Zenika/contexts/3b5ca05f-7180-479e-9225-9902e29cde9b?return-to=%2F",children:"CircleCI context"})}),"\n"]})]})}function h(e={}){const{wrapper:i}={...(0,l.R)(),...e.components};return i?(0,c.jsx)(i,{...e,children:(0,c.jsx)(a,{...e})}):a(e)}},8453:(e,i,n)=>{n.d(i,{R:()=>s,x:()=>d});var c=n(6540);const l={},o=c.createContext(l);function s(e){const i=c.useContext(o);return c.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function d(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:s(e.components),c.createElement(o.Provider,{value:i},e.children)}}}]);