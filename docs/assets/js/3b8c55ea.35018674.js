"use strict";(self.webpackChunkfeedzback_docs=self.webpackChunkfeedzback_docs||[]).push([[803],{3668:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>a,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>c,toc:()=>r});var l=s(4848),t=s(8453);const i={},o="Installation",c={id:"installation",title:"Installation",description:"Permissions",source:"@site/docs/installation.md",sourceDirName:".",slug:"/installation",permalink:"/feedzback/docs/installation",draft:!1,unlisted:!1,editUrl:"https://github.com/Zenika/feedzback/tree/main/docs-source/docs/installation.md",tags:[],version:"current",frontMatter:{},sidebar:"default",previous:{title:"Technical stack",permalink:"/feedzback/docs/technical-stack"},next:{title:"Request feedback",permalink:"/feedzback/docs/business-cases/request-feedback"}},a={},r=[{value:"Permissions",id:"permissions",level:2},{value:"Server",id:"server",level:2},{value:"Configuration",id:"configuration",level:3},{value:"Installation",id:"installation-1",level:3},{value:"Client",id:"client",level:2},{value:"Installation",id:"installation-2",level:3}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.h1,{id:"installation",children:"Installation"}),"\n",(0,l.jsx)(n.h2,{id:"permissions",children:"Permissions"}),"\n",(0,l.jsxs)(n.p,{children:["To configure and run the application locally, you need access to the Firebase project ",(0,l.jsx)(n.a,{href:"https://console.firebase.google.com/project/feedzback-v2-dev",children:"feedzback-v2-dev"}),"."]}),"\n",(0,l.jsxs)(n.p,{children:["Once you have gained access, you will also be able to access the ",(0,l.jsx)(n.a,{href:"https://console.cloud.google.com/?project=feedzback-v2-dev",children:"Google Cloud console"}),"."]}),"\n",(0,l.jsx)(n.admonition,{type:"note",children:(0,l.jsxs)(n.p,{children:["If you don't have permission, please contact ",(0,l.jsx)(n.strong,{children:"DSI"}),"."]})}),"\n",(0,l.jsx)(n.h2,{id:"server",children:"Server"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:["Open your IDE in ",(0,l.jsx)(n.code,{children:"./server"})," directory"]}),"\n"]}),"\n",(0,l.jsx)(n.h3,{id:"configuration",children:"Configuration"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:["Create a ",(0,l.jsx)(n.code,{children:".env"})," file with the following environment variables:"]}),"\n"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"SERVER_PORT=3000\n\nCLIENT_URL=http://localhost:4200\n\nFIREBASE_PROJECT_ID=feedzback-v2-dev\nFIREBASE_PRIVATE_KEY=<SECRET_VALUE>\nFIREBASE_CLIENT_EMAIL=<SECRET_VALUE>\n\nMAILGUN_USERNAME=<SECRET_VALUE>\nMAILGUN_KEY=<SECRET_VALUE>\nMAILGUN_URL=<SECRET_VALUE>\nMAILGUN_DOMAIN=<SECRET_VALUE>\n\nCRYPTO_SECRET_IV=feedzback\nCRYPTO_SECRET_KEY=feedzback\n"})}),"\n",(0,l.jsxs)(n.p,{children:["You can retrieve these secret values from the ",(0,l.jsx)(n.a,{href:"https://console.cloud.google.com/run/deploy/europe-west1/feedzback-server?project=feedzback-v2-dev",children:"Google Cloud Run console"}),' (tab "Variables and Secrets"):']}),"\n",(0,l.jsx)(n.h3,{id:"installation-1",children:"Installation"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Run the following commands:"}),"\n"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"npm install\nnpm run start:dev\n"})}),"\n",(0,l.jsx)(n.h2,{id:"client",children:"Client"}),"\n",(0,l.jsx)(n.h3,{id:"installation-2",children:"Installation"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:["\n",(0,l.jsxs)(n.p,{children:["Open your IDE in ",(0,l.jsx)(n.code,{children:"./client"})," directory"]}),"\n"]}),"\n",(0,l.jsxs)(n.li,{children:["\n",(0,l.jsx)(n.p,{children:"Run the following commands:"}),"\n"]}),"\n"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"npm install\nnpm start\n"})}),"\n",(0,l.jsxs)(n.p,{children:["Finally, visit the URL ",(0,l.jsx)(n.a,{href:"http://localhost:4200",children:"http://localhost:4200"})," and enjoy FeedZback!"]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(d,{...e})}):d(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>o,x:()=>c});var l=s(6540);const t={},i=l.createContext(t);function o(e){const n=l.useContext(i);return l.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),l.createElement(i.Provider,{value:n},e.children)}}}]);