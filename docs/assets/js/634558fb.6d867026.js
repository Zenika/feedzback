"use strict";(self.webpackChunkfeedzback_docs=self.webpackChunkfeedzback_docs||[]).push([[2172],{2252:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>a,contentTitle:()=>r,default:()=>h,frontMatter:()=>d,metadata:()=>t,toc:()=>l});const t=JSON.parse('{"id":"business-cases/reply-to-feedback-request","title":"Reply to feedback request","description":"User story","source":"@site/docs/business-cases/reply-to-feedback-request.md","sourceDirName":"business-cases","slug":"/business-cases/reply-to-feedback-request","permalink":"/feedzback/docs/business-cases/reply-to-feedback-request","draft":false,"unlisted":false,"editUrl":"https://github.com/Zenika/feedzback/tree/main/docs-source/docs/business-cases/reply-to-feedback-request.md","tags":[],"version":"current","frontMatter":{},"sidebar":"default","previous":{"title":"Request feedback","permalink":"/feedzback/docs/business-cases/request-feedback"},"next":{"title":"Give spontaneous feedback","permalink":"/feedzback/docs/business-cases/give-spontaneous-feedback"}}');var i=n(4848),c=n(8453);const d={},r="Reply to feedback request",a={},l=[{value:"User story",id:"user-story",level:2},{value:"Technical specifications",id:"technical-specifications",level:2},{value:"Links",id:"links",level:2}];function o(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,c.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.header,{children:(0,i.jsx)(s.h1,{id:"reply-to-feedback-request",children:"Reply to feedback request"})}),"\n",(0,i.jsx)(s.h2,{id:"user-story",children:"User story"}),"\n",(0,i.jsx)(s.p,{children:"As I have received a feedback request, I would like to be able to reply to this request.\nIf I can't complete my feedback in one go, I'd like to be able to save it as a draft and continue later."}),"\n",(0,i.jsx)(s.h2,{id:"technical-specifications",children:"Technical specifications"}),"\n",(0,i.jsxs)(s.p,{children:["Be sure to read ",(0,i.jsx)(s.a,{href:"./request-feedback",children:"Request feedback"})," first.\nTo learn more about draft, read the ",(0,i.jsx)(s.a,{href:"./feedback-draft",children:"Feedback draft"})," documentation."]}),"\n",(0,i.jsxs)(s.p,{children:["To reply to a feedback request, the ",(0,i.jsx)(s.code,{children:"giverEmail"})," must visit the following page, based on its secret ",(0,i.jsx)(s.code,{children:"tokenId"}),":"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-txt",children:"/give-requested/token/<tokenId>\n"})}),"\n",(0,i.jsxs)(s.p,{children:["As the ",(0,i.jsx)(s.code,{children:"giverEmail"})," may be external to the Zenika organisation, access to this page does not require user authentification.\nInstead, the ",(0,i.jsx)(s.code,{children:"tokenId"})," acts as an access token."]}),"\n",(0,i.jsxs)(s.p,{children:["On client side, the ",(0,i.jsx)(s.a,{href:"https://github.com/Zenika/feedzback/blob/main/client/src/app/give-feedback/give-requested-feedback/give-requested-feedback.guard.ts",children:(0,i.jsx)(s.code,{children:"giveRequestedFeedbackGuard"})})," guard ensures that the ",(0,i.jsx)(s.code,{children:"tokenId"})," is valid.\nIf the ",(0,i.jsx)(s.code,{children:"giverEmail"})," is already authenticated, it remains authenticated.\nOtherwise, he is silently authenticated as an anonymous user (in other words, a session is created for him)."]}),"\n",(0,i.jsxs)(s.p,{children:["On server side, the ",(0,i.jsx)(s.a,{href:"https://github.com/Zenika/feedzback/blob/main/server/src/feedback/feedback.controller.ts",children:(0,i.jsx)(s.code,{children:"FeedbackController.checkRequest"})})," method returns the feedback request details and possibly a previously saved draft."]}),"\n",(0,i.jsx)(s.p,{children:"Once the feedback is complete, 2 or 3 Firestore documents are affected:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["In the ",(0,i.jsx)(s.code,{children:"feedback"})," collection, the document with ID ",(0,i.jsx)(s.code,{children:"feedbackId"})," is updated:"]}),"\n"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-ts",children:"const feedback: Feedback = {\n  giverEmail: 'gimini@zenika.com',\n  receiverEmail: 'pinocchio@zenika.com',\n\n  // -----------------------------------------------------\n  // Added fields (in reality, the contents are encrypted)\n  positive: 'You did great...', // required\n  negative: 'Youd should improve...', // required\n  comment: '', // optional\n  // -----------------------------------------------------\n\n  message: 'Hi Gimini, give me some feedback please.',\n  shared: true,\n  requested: true,\n  status: 'done', // Updated field\n  createdAt: 1711403799463,\n  updatedAt: 1711712182618, // Updated field\n  archived: 0,\n};\n"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:["In the ",(0,i.jsx)(s.code,{children:"feedbackRequestToken"})," collection, the document with ID ",(0,i.jsx)(s.code,{children:"tokenId"})," is deleted."]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:["In the ",(0,i.jsx)(s.code,{children:"feedbackDraft"})," collection, the draft, if it exists, is deleted."]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(s.p,{children:["Finally, an email is sent to the ",(0,i.jsx)(s.code,{children:"receiverEmail"})," inviting them to consult the feedback they have just received."]}),"\n",(0,i.jsx)(s.h2,{id:"links",children:"Links"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Client"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:(0,i.jsx)(s.a,{href:"https://github.com/Zenika/feedzback/blob/main/client/src/app/give-feedback/give-requested-feedback/give-requested-feedback.guard.ts",children:(0,i.jsx)(s.code,{children:"giveRequestedFeedbackGuard"})})}),"\n",(0,i.jsx)(s.li,{children:(0,i.jsx)(s.a,{href:"https://github.com/Zenika/feedzback/blob/main/client/src/app/give-feedback/give-requested-feedback/give-requested-feedback.component.ts",children:(0,i.jsx)(s.code,{children:"GiveRequestedFeedbackComponent"})})}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Server"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.a,{href:"https://github.com/Zenika/feedzback/blob/main/server/src/feedback/feedback.controller.ts",children:(0,i.jsx)(s.code,{children:"FeedbackController"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:(0,i.jsx)(s.code,{children:"checkRequest"})}),"\n",(0,i.jsx)(s.li,{children:(0,i.jsx)(s.code,{children:"giveRequested"})}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,c.R)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(o,{...e})}):o(e)}},8453:(e,s,n)=>{n.d(s,{R:()=>d,x:()=>r});var t=n(6540);const i={},c=t.createContext(i);function d(e){const s=t.useContext(c);return t.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function r(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:d(e.components),t.createElement(c.Provider,{value:s},e.children)}}}]);