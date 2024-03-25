"use strict";(self.webpackChunkfeedzback_docs=self.webpackChunkfeedzback_docs||[]).push([[137],{9459:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>s,metadata:()=>d,toc:()=>o});var t=i(4848),c=i(8453);const s={},r="Quick start",d={id:"ci-cd/quick-start",title:"Quick start",description:"This repository includes a fully integrated CI/CD script that works with CircleCI (see .circleci/config.yml).",source:"@site/docs/ci-cd/quick-start.md",sourceDirName:"ci-cd",slug:"/ci-cd/quick-start",permalink:"/feedzback/docs/ci-cd/quick-start",draft:!1,unlisted:!1,editUrl:"https://github.com/Zenika/feedzback/tree/main/docs-source/docs/ci-cd/quick-start.md",tags:[],version:"current",frontMatter:{},sidebar:"default",previous:{title:"Introduction",permalink:"/feedzback/docs/technical-guides/introduction"},next:{title:"CircleCI",permalink:"/feedzback/docs/ci-cd/circle-ci"}},l={},o=[{value:"On every push to any branch",id:"on-every-push-to-any-branch",level:2},{value:"Dev deployment",id:"dev-deployment",level:2},{value:"Staging deployment",id:"staging-deployment",level:2},{value:"Production deployment",id:"production-deployment",level:2}];function a(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",ul:"ul",...(0,c.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"quick-start",children:"Quick start"}),"\n",(0,t.jsxs)(n.p,{children:["This repository includes a fully integrated CI/CD script that works with CircleCI (see ",(0,t.jsx)(n.code,{children:".circleci/config.yml"}),")."]}),"\n",(0,t.jsx)(n.h2,{id:"on-every-push-to-any-branch",children:"On every push to any branch"}),"\n",(0,t.jsx)(n.p,{children:"The CI is configured to check that:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\u2705 ",(0,t.jsx)(n.code,{children:"npm ci"})," works properly"]}),"\n",(0,t.jsx)(n.li,{children:"\u2705 tests are all passing"}),"\n",(0,t.jsx)(n.li,{children:"\u2705 linting has been applied"}),"\n",(0,t.jsx)(n.li,{children:"\u2705 the server and clients build properly"}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"dev-deployment",children:"Dev deployment"}),"\n",(0,t.jsxs)(n.p,{children:["Tagging a revision ",(0,t.jsx)(n.code,{children:"dev-X.Y.Z"})," where ",(0,t.jsx)(n.code,{children:"X"}),", ",(0,t.jsx)(n.code,{children:"Y"}),", and ",(0,t.jsx)(n.code,{children:"Z"})," are integers, the full stack is then deployed to dev:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Server on Google cloud run: ",(0,t.jsx)(n.a,{href:"https://server.dev.feedzback.znk.io/health",children:"dev server health check"})]}),"\n",(0,t.jsxs)(n.li,{children:["Client on Firebase hosting: ",(0,t.jsx)(n.a,{href:"https://dev.feedzback.znk.io",children:"dev client app"})]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"staging-deployment",children:"Staging deployment"}),"\n",(0,t.jsxs)(n.p,{children:["Tagging a revision ",(0,t.jsx)(n.code,{children:"staging-X.Y.Z"})," where ",(0,t.jsx)(n.code,{children:"X"}),", ",(0,t.jsx)(n.code,{children:"Y"}),", and ",(0,t.jsx)(n.code,{children:"Z"})," are integers, the full stack is then deployed to staging:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Server on Google cloud run: ",(0,t.jsx)(n.a,{href:"https://server.staging.feedzback.znk.io/health",children:"staging server health check"})]}),"\n",(0,t.jsxs)(n.li,{children:["Client on Firebase hosting: ",(0,t.jsx)(n.a,{href:"https://staging.feedzback.znk.io",children:"staging client app"})]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["The full stack is also deployed in staging when a commit is pushed on the ",(0,t.jsx)(n.code,{children:"main"})," branch (typically when a pull request is merged)."]}),"\n",(0,t.jsx)(n.h2,{id:"production-deployment",children:"Production deployment"}),"\n",(0,t.jsxs)(n.p,{children:["On creating a release on ",(0,t.jsx)(n.a,{href:"https://github.com/Zenika/feedzback/releases",children:"Github"})," and tagging a revision ",(0,t.jsx)(n.code,{children:"vX.Y.Z"})," where ",(0,t.jsx)(n.code,{children:"X"}),", ",(0,t.jsx)(n.code,{children:"Y"}),", and ",(0,t.jsx)(n.code,{children:"Z"})," are integers), the full stack is then deployed to production:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Server on Google cloud run: ",(0,t.jsx)(n.a,{href:"https://server.feedzback.znk.io/health",children:"production server health check"})]}),"\n",(0,t.jsxs)(n.li,{children:["Client on Firebase hosting: ",(0,t.jsx)(n.a,{href:"https://feedzback.znk.io",children:"production client app"})]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,c.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>r,x:()=>d});var t=i(6540);const c={},s=t.createContext(c);function r(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:r(e.components),t.createElement(s.Provider,{value:n},e.children)}}}]);