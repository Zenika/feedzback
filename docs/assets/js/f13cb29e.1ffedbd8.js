"use strict";(self.webpackChunkfeedzback_docs=self.webpackChunkfeedzback_docs||[]).push([[2748],{7018:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>c,default:()=>h,frontMatter:()=>a,metadata:()=>i,toc:()=>l});const i=JSON.parse('{"id":"technical-guides/e2e-testing","title":"E2E testing","description":"E2E tests are performed using Playwright.","source":"@site/docs/technical-guides/e2e-testing.md","sourceDirName":"technical-guides","slug":"/technical-guides/e2e-testing","permalink":"/feedzback/docs/technical-guides/e2e-testing","draft":false,"unlisted":false,"editUrl":"https://github.com/Zenika/feedzback/tree/main/docs-source/docs/technical-guides/e2e-testing.md","tags":[],"version":"current","frontMatter":{},"sidebar":"default","previous":{"title":"Swagger","permalink":"/feedzback/docs/technical-guides/server/swagger"},"next":{"title":"Quick start","permalink":"/feedzback/docs/ci-cd/quick-start"}}');var r=n(4848),s=n(8453);const a={},c="E2E testing",o={},l=[{value:"NPM scripts",id:"npm-scripts",level:2},{value:"Playwright configuration",id:"playwright-configuration",level:2}];function d(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"e2e-testing",children:"E2E testing"})}),"\n",(0,r.jsxs)(t.p,{children:["E2E tests are performed using ",(0,r.jsx)(t.a,{href:"https://playwright.dev/",children:"Playwright"}),"."]}),"\n",(0,r.jsx)(t.h2,{id:"npm-scripts",children:"NPM scripts"}),"\n",(0,r.jsxs)(t.p,{children:["To run the tests, open a terminal in ",(0,r.jsx)(t.code,{children:"./client"})," directory and run the following command:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"npm run e2e:test\n"})}),"\n",(0,r.jsxs)(t.p,{children:["All scripts related to E2E tests start with ",(0,r.jsx)(t.code,{children:'"e2e:*"'}),":"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-json",metastring:'title="./client/package.json"',children:'{\n  "scripts": {\n    "e2e:test": "playwright test",\n    "e2e:report": "playwright show-report",\n    "e2e:ui": "playwright test --ui",\n    "e2e:codegen": "playwright codegen"\n  }\n}\n'})}),"\n",(0,r.jsx)(t.h2,{id:"playwright-configuration",children:"Playwright configuration"}),"\n",(0,r.jsx)(t.p,{children:"Here's part of the Playwright configuration:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="./client/playwright.config.ts"',children:"import { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  // Tests are located in the following directory\n  testDir: './e2e',\n\n  // Run your local dev server before starting the tests\n  webServer: {\n    command: 'npm run stack:e2e',\n    port: 4200,\n    reuseExistingServer: !process.env['CI'],\n  },\n});\n"})}),"\n",(0,r.jsxs)(t.p,{children:["Before starting the tests, Playwright executes the command ",(0,r.jsx)(t.code,{children:"npm run stack:e2e"})," and waits for the application to be available on port ",(0,r.jsx)(t.code,{children:"4200"}),".\nDue to the ",(0,r.jsx)(t.code,{children:"reuseExistingServer"})," option, the command will not be executed if the application is already available."]}),"\n",(0,r.jsxs)(t.p,{children:["Therefore, you can run the command ",(0,r.jsx)(t.code,{children:"npm run stack:e2e"})," in one terminal, waits for the application to be available on port ",(0,r.jsx)(t.code,{children:"4200"}),", and then run the command ",(0,r.jsx)(t.code,{children:"npm run e2e:test"})," in another terminal.\nIn this case, Playwright will immediately start the tests."]}),"\n",(0,r.jsx)(t.admonition,{type:"warning",children:(0,r.jsxs)(t.p,{children:["At the end of the tests, Playwright may not stop the ",(0,r.jsx)(t.code,{children:"webServer"})," properly.\nIf this happens, look for a process named ",(0,r.jsx)(t.code,{children:"java"})," and kill it manually."]})}),"\n",(0,r.jsx)(t.admonition,{type:"tip",children:(0,r.jsxs)(t.p,{children:["To avoid this problem, it's best to run the command ",(0,r.jsx)(t.code,{children:"npm run stack:e2e"})," in a separate terminal before testing with the command ",(0,r.jsx)(t.code,{children:"npm run e2e:test"}),", as explained above."]})})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>a,x:()=>c});var i=n(6540);const r={},s=i.createContext(r);function a(e){const t=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),i.createElement(s.Provider,{value:t},e.children)}}}]);