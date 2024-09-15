"use strict";(self.webpackChunkfeedzback_docs=self.webpackChunkfeedzback_docs||[]).push([[89],{3631:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>o,contentTitle:()=>a,default:()=>u,frontMatter:()=>i,metadata:()=>r,toc:()=>d});var t=s(4848),c=s(8453);const i={},a="Give spontaneous feedback",r={id:"business-cases/give-spontaneous-feedback",title:"Give spontaneous feedback",description:"User story",source:"@site/docs/business-cases/give-spontaneous-feedback.md",sourceDirName:"business-cases",slug:"/business-cases/give-spontaneous-feedback",permalink:"/feedzback/docs/business-cases/give-spontaneous-feedback",draft:!1,unlisted:!1,editUrl:"https://github.com/Zenika/feedzback/tree/main/docs-source/docs/business-cases/give-spontaneous-feedback.md",tags:[],version:"current",frontMatter:{},sidebar:"default",previous:{title:"Reply to feedback request",permalink:"/feedzback/docs/business-cases/reply-to-feedback-request"},next:{title:"Feedback draft",permalink:"/feedzback/docs/business-cases/feedback-draft"}},o={},d=[{value:"User story",id:"user-story",level:2},{value:"Technical specifications",id:"technical-specifications",level:2},{value:"Links",id:"links",level:2}];function l(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,c.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"give-spontaneous-feedback",children:"Give spontaneous feedback"})}),"\n",(0,t.jsx)(n.h2,{id:"user-story",children:"User story"}),"\n",(0,t.jsx)(n.p,{children:"As an internal member of the Zenika organisation, I'd like to be able to send spontaneous feedback to a colleague I've worked with.\nIf I can't complete my feedback in one go, I'd like to be able to save it as a draft and continue later."}),"\n",(0,t.jsx)(n.h2,{id:"technical-specifications",children:"Technical specifications"}),"\n",(0,t.jsxs)(n.p,{children:["Be sure to read ",(0,t.jsx)(n.a,{href:"./request-feedback",children:"Request feedback"})," and ",(0,t.jsx)(n.a,{href:"./reply-to-feedback-request",children:"Reply to feedback request"})," first.\nTo learn more about draft, read the ",(0,t.jsx)(n.a,{href:"./feedback-draft",children:"Feedback draft"})," documentation."]}),"\n",(0,t.jsx)(n.p,{children:"This workflow is much simpler than the feedback request workflow."}),"\n",(0,t.jsx)(n.p,{children:"The requester must be authenticated."}),"\n",(0,t.jsx)(n.p,{children:"Once the feedback is complete, only 1 Firestore document is added:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const feedback: Feedback = {\n  giverEmail: 'gimini@zenika.com',\n  receiverEmail: 'pinocchio@zenika.com',\n\n  // --------------------------------------\n  // In reality, the contents are encrypted\n  positive: 'You did great...',\n  negative: 'Youd should improve...',\n  comment: 'See you...',\n  // --------------------------------------\n\n  message: '',\n  shared: true,\n  requested: false, // Meaning it's a spontaneous feedback\n  status: 'done',\n  createdAt: 1711403799463,\n  updatedAt: 1711712182618,\n  archived: 0,\n};\n"})}),"\n",(0,t.jsxs)(n.p,{children:["An email is sent to the ",(0,t.jsx)(n.code,{children:"receiverEmail"})," inviting them to consult the feedback they have just received."]}),"\n",(0,t.jsx)(n.h2,{id:"links",children:"Links"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Client"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://github.com/Zenika/feedzback/blob/main/client/src/app/give-feedback/give-feedback/give-feedback.component.ts",children:(0,t.jsx)(n.code,{children:"GiveFeedbackComponent"})})}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Server"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.a,{href:"https://github.com/Zenika/feedzback/blob/main/server/src/feedback/feedback.controller.ts",children:(0,t.jsx)(n.code,{children:"FeedbackController"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.code,{children:"give"})}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]})]})}function u(e={}){const{wrapper:n}={...(0,c.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>a,x:()=>r});var t=s(6540);const c={},i=t.createContext(c);function a(e){const n=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:a(e.components),t.createElement(i.Provider,{value:n},e.children)}}}]);