"use strict";(self.webpackChunkfeedzback_docs=self.webpackChunkfeedzback_docs||[]).push([[906],{1868:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>h,frontMatter:()=>o,metadata:()=>s,toc:()=>l});const s=JSON.parse('{"id":"technical-guides/environments/local","title":"Local","description":"As explained in the installation guide, you can run the client and server apps locally, for development purposes.","source":"@site/docs/technical-guides/environments/local.md","sourceDirName":"technical-guides/environments","slug":"/technical-guides/environments/local","permalink":"/feedzback/docs/technical-guides/environments/local","draft":false,"unlisted":false,"editUrl":"https://github.com/Zenika/feedzback/tree/main/docs-source/docs/technical-guides/environments/local.md","tags":[],"version":"current","frontMatter":{"title":"Local"},"sidebar":"default","previous":{"title":"Overview","permalink":"/feedzback/docs/technical-guides/environments/overview"},"next":{"title":"Firebase Hosting","permalink":"/feedzback/docs/technical-guides/client/firebase-hosting"}}');var r=t(4848),i=t(8453);const o={title:"Local"},a="Local dev environment",c={},l=[{value:"<code>*:emulators</code> scripts",id:"emulators-scripts",level:2},{value:"<code>*:e2e</code> scripts",id:"e2e-scripts",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"local-dev-environment",children:"Local dev environment"})}),"\n",(0,r.jsxs)(n.p,{children:["As explained in the ",(0,r.jsx)(n.a,{href:"/docs/installation",children:"installation guide"}),", you can run the ",(0,r.jsx)(n.em,{children:"client"})," and ",(0,r.jsx)(n.em,{children:"server"})," apps locally, for development purposes.\nBut you are still connecting to the remote ",(0,r.jsx)(n.code,{children:"feedzback-v2-dev"})," Firebase project for Authentication and Firestore services."]}),"\n",(0,r.jsxs)(n.p,{children:["The good news is that you can run the entire stack locally, using the ",(0,r.jsx)(n.a,{href:"https://firebase.google.com/docs/emulator-suite",children:"Firebase emulator suite"}),"!"]}),"\n",(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsx)(n.p,{children:"When using the Firebase emulator, the Google Auth provider is no longer available.\nOnly the Email/Password provider is enabled."})}),"\n",(0,r.jsxs)(n.h2,{id:"emulators-scripts",children:[(0,r.jsx)(n.code,{children:"*:emulators"})," scripts"]}),"\n",(0,r.jsxs)(n.p,{children:["In this execution context, the ",(0,r.jsx)(n.em,{children:"client"})," and ",(0,r.jsx)(n.em,{children:"server"}),' apps are running in "dev" mode (with hot-reloading).']}),"\n",(0,r.jsxs)(n.p,{children:["Only the Firebase ",(0,r.jsx)(n.em,{children:"Auth"})," and ",(0,r.jsx)(n.em,{children:"Firestore"})," emulators are started. The ",(0,r.jsx)(n.em,{children:"Hosting"})," emulator is not used in this context."]}),"\n",(0,r.jsx)(n.p,{children:"Here are the NPM scripts for this execution context:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",metastring:'title="/client/package.json"',children:'{\n  "scripts": {\n    "start:emulators": "ng serve -c development-emulators",\n    "firebase:emulators": "firebase emulators:start --only auth:dev,firestore:dev --import ./firebase-emulators-data",\n    "server:emulators": "npm --prefix ../server run start:emulators",\n\n    // To launch the stack with a single command:\n    "emulators": "concurrently \\"npm run firebase:emulators\\" \\"npm run server:emulators\\" \\"npm run start:emulators\\""\n  }\n}\n'})}),"\n",(0,r.jsxs)(n.h2,{id:"e2e-scripts",children:[(0,r.jsx)(n.code,{children:"*:e2e"})," scripts"]}),"\n",(0,r.jsxs)(n.p,{children:["In this execution context, the ",(0,r.jsx)(n.em,{children:"client"})," and ",(0,r.jsx)(n.em,{children:"server"}),' apps are running in "build" mode (no hot-reloading).']}),"\n",(0,r.jsxs)(n.p,{children:["This time, not only are the Firebase ",(0,r.jsx)(n.em,{children:"Auth"})," and ",(0,r.jsx)(n.em,{children:"Firestore"})," emulators started, but so is the ",(0,r.jsx)(n.em,{children:"Hosting"})," emulator that serves the client application."]}),"\n",(0,r.jsx)(n.p,{children:"This environment is the closest to the production environment (with the exception of the authentication method) and is therefore ideal for e2e testing."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",metastring:'title="/client/package.json"',children:'{\n  "scripts": {\n    "firebase:e2e": "firebase emulators:start --only auth:dev,firestore:dev,hosting:dev --import ./firebase-emulators-data",\n    "server:e2e": "npm --prefix ../server run start:e2e",\n\n    // To launch the stack with a single command:\n    "pree2e": "npm run build:e2e",\n    "e2e": "concurrently \\"npm run firebase:e2e\\" \\"npm run server:e2e\\""\n  }\n}\n'})})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>a});var s=t(6540);const r={},i=s.createContext(r);function o(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);