"use strict";(self.webpackChunkfeedzback_docs=self.webpackChunkfeedzback_docs||[]).push([[249],{5856:(e,t,n)=>{n.d(t,{A:()=>F});var a=n(6540),r=n(4164),s=n(4096),l=n(4848);function o(e){let{children:t,className:n}=e;return(0,l.jsx)("article",{className:n,children:t})}var i=n(8774);const c={title:"title_f1Hy"};function d(e){let{className:t}=e;const{metadata:n,isBlogPostPage:a}=(0,s.e7)(),{permalink:o,title:d}=n,u=a?"h1":"h2";return(0,l.jsx)(u,{className:(0,r.A)(c.title,t),children:a?d:(0,l.jsx)(i.A,{to:o,children:d})})}var u=n(1312),m=n(4586);const h=["zero","one","two","few","many","other"];function g(e){return h.filter((t=>e.includes(t)))}const f={locale:"en",pluralForms:g(["one","other"]),select:e=>1===e?"one":"other"};function x(){const{i18n:{currentLocale:e}}=(0,m.A)();return(0,a.useMemo)((()=>{try{return function(e){const t=new Intl.PluralRules(e);return{locale:e,pluralForms:g(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".\nDocusaurus will fallback to the default (English) implementation.\nError: ${t.message}\n`),f}}),[e])}function p(){const e=x();return{selectMessage:(t,n)=>function(e,t,n){const a=e.split("|");if(1===a.length)return a[0];a.length>n.pluralForms.length&&console.error(`For locale=${n.locale}, a maximum of ${n.pluralForms.length} plural forms are expected (${n.pluralForms.join(",")}), but the message contains ${a.length}: ${e}`);const r=n.select(t),s=n.pluralForms.indexOf(r);return a[Math.min(s,a.length-1)]}(n,t,e)}}var v=n(6266);const j={container:"container_mt6G"};function b(e){let{readingTime:t}=e;const n=function(){const{selectMessage:e}=p();return t=>{const n=Math.ceil(t);return e(n,(0,u.T)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:n}))}}();return(0,l.jsx)(l.Fragment,{children:n(t)})}function A(e){let{date:t,formattedDate:n}=e;return(0,l.jsx)("time",{dateTime:t,children:n})}function N(){return(0,l.jsx)(l.Fragment,{children:" \xb7 "})}function L(e){let{className:t}=e;const{metadata:n}=(0,s.e7)(),{date:a,readingTime:o}=n,i=(0,v.i)({day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});return(0,l.jsxs)("div",{className:(0,r.A)(j.container,"margin-vert--md",t),children:[(0,l.jsx)(A,{date:a,formattedDate:(c=a,i.format(new Date(c)))}),void 0!==o&&(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(N,{}),(0,l.jsx)(b,{readingTime:o})]})]});var c}var y=n(6913);const C={authorCol:"authorCol_Hf19",imageOnlyAuthorRow:"imageOnlyAuthorRow_pa_O",imageOnlyAuthorCol:"imageOnlyAuthorCol_G86a"};function _(e){let{className:t}=e;const{metadata:{authors:n},assets:a}=(0,s.e7)();if(0===n.length)return null;const o=n.every((e=>{let{name:t}=e;return!t})),i=1===n.length;return(0,l.jsx)("div",{className:(0,r.A)("margin-top--md margin-bottom--sm",o?C.imageOnlyAuthorRow:"row",t),children:n.map(((e,t)=>(0,l.jsx)("div",{className:(0,r.A)(!o&&(i?"col col--12":"col col--6"),o?C.imageOnlyAuthorCol:C.authorCol),children:(0,l.jsx)(y.A,{author:{...e,imageURL:a.authorsImageUrls[t]??e.imageURL}})},t)))})}function k(){return(0,l.jsxs)("header",{children:[(0,l.jsx)(d,{}),(0,l.jsx)(L,{}),(0,l.jsx)(_,{})]})}var w=n(440),H=n(5533);function T(e){let{children:t,className:n}=e;const{isBlogPostPage:a}=(0,s.e7)();return(0,l.jsx)("div",{id:a?w.LU:void 0,className:(0,r.A)("markdown",n),children:(0,l.jsx)(H.A,{children:t})})}var O=n(7559),P=n(4336),I=n(8046);function M(){return(0,l.jsx)("b",{children:(0,l.jsx)(u.A,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts",children:"Read more"})})}function B(e){const{blogPostTitle:t,...n}=e;return(0,l.jsx)(i.A,{"aria-label":(0,u.T)({message:"Read more about {title}",id:"theme.blog.post.readMoreLabel",description:"The ARIA label for the link to full blog posts from excerpts"},{title:t}),...n,children:(0,l.jsx)(M,{})})}function R(){const{metadata:e,isBlogPostPage:t}=(0,s.e7)(),{tags:n,title:a,editUrl:o,hasTruncateMarker:i,lastUpdatedBy:c,lastUpdatedAt:d}=e,u=!t&&i,m=n.length>0;if(!(m||u||o))return null;if(t){const e=!!(o||d||c);return(0,l.jsxs)("footer",{className:"docusaurus-mt-lg",children:[m&&(0,l.jsx)("div",{className:(0,r.A)("row","margin-top--sm",O.G.blog.blogFooterEditMetaRow),children:(0,l.jsx)("div",{className:"col",children:(0,l.jsx)(I.A,{tags:n})})}),e&&(0,l.jsx)(P.A,{className:(0,r.A)("margin-top--sm",O.G.blog.blogFooterEditMetaRow),editUrl:o,lastUpdatedAt:d,lastUpdatedBy:c})]})}return(0,l.jsxs)("footer",{className:"row docusaurus-mt-lg",children:[m&&(0,l.jsx)("div",{className:(0,r.A)("col",{"col--9":u}),children:(0,l.jsx)(I.A,{tags:n})}),u&&(0,l.jsx)("div",{className:(0,r.A)("col text--right",{"col--3":m}),children:(0,l.jsx)(B,{blogPostTitle:a,to:e.permalink})})]})}function F(e){let{children:t,className:n}=e;const a=function(){const{isBlogPostPage:e}=(0,s.e7)();return e?void 0:"margin-bottom--xl"}();return(0,l.jsxs)(o,{className:(0,r.A)(a,n),children:[(0,l.jsx)(k,{}),(0,l.jsx)(T,{children:t}),(0,l.jsx)(R,{})]})}},3858:(e,t,n)=>{n.r(t),n.d(t,{default:()=>j});n(6540);var a=n(4164),r=n(1213),s=n(7559),l=n(4096),o=n(8027),i=n(5856),c=n(1312),d=n(9022),u=n(4848);function m(e){const{nextItem:t,prevItem:n}=e;return(0,u.jsxs)("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,c.T)({id:"theme.blog.post.paginator.navAriaLabel",message:"Blog post page navigation",description:"The ARIA label for the blog posts pagination"}),children:[n&&(0,u.jsx)(d.A,{...n,subLabel:(0,u.jsx)(c.A,{id:"theme.blog.post.paginator.newerPost",description:"The blog post button label to navigate to the newer/previous post",children:"Newer post"})}),t&&(0,u.jsx)(d.A,{...t,subLabel:(0,u.jsx)(c.A,{id:"theme.blog.post.paginator.olderPost",description:"The blog post button label to navigate to the older/next post",children:"Older post"}),isNext:!0})]})}function h(){const{assets:e,metadata:t}=(0,l.e7)(),{title:n,description:a,date:s,tags:o,authors:i,frontMatter:c}=t,{keywords:d}=c,m=e.image??c.image;return(0,u.jsxs)(r.be,{title:n,description:a,keywords:d,image:m,children:[(0,u.jsx)("meta",{property:"og:type",content:"article"}),(0,u.jsx)("meta",{property:"article:published_time",content:s}),i.some((e=>e.url))&&(0,u.jsx)("meta",{property:"article:author",content:i.map((e=>e.url)).filter(Boolean).join(",")}),o.length>0&&(0,u.jsx)("meta",{property:"article:tag",content:o.map((e=>e.label)).join(",")})]})}var g=n(5260);function f(){const e=(0,l.J_)();return(0,u.jsx)(g.A,{children:(0,u.jsx)("script",{type:"application/ld+json",children:JSON.stringify(e)})})}var x=n(7763),p=n(6896);function v(e){let{sidebar:t,children:n}=e;const{metadata:a,toc:r}=(0,l.e7)(),{nextItem:s,prevItem:c,frontMatter:d}=a,{hide_table_of_contents:h,toc_min_heading_level:g,toc_max_heading_level:f}=d;return(0,u.jsxs)(o.A,{sidebar:t,toc:!h&&r.length>0?(0,u.jsx)(x.A,{toc:r,minHeadingLevel:g,maxHeadingLevel:f}):void 0,children:[(0,u.jsx)(p.A,{metadata:a}),(0,u.jsx)(i.A,{children:n}),(s||c)&&(0,u.jsx)(m,{nextItem:s,prevItem:c})]})}function j(e){const t=e.content;return(0,u.jsx)(l.in,{content:e.content,isBlogPostPage:!0,children:(0,u.jsxs)(r.e3,{className:(0,a.A)(s.G.wrapper.blogPages,s.G.page.blogPostPage),children:[(0,u.jsx)(h,{}),(0,u.jsx)(f,{}),(0,u.jsx)(v,{sidebar:e.sidebar,children:(0,u.jsx)(t,{})})]})})}},6896:(e,t,n)=>{n.d(t,{A:()=>p});n(6540);var a=n(4164),r=n(1312),s=n(5260),l=n(4848);function o(){return(0,l.jsx)(r.A,{id:"theme.contentVisibility.unlistedBanner.title",description:"The unlisted content banner title",children:"Unlisted page"})}function i(){return(0,l.jsx)(r.A,{id:"theme.contentVisibility.unlistedBanner.message",description:"The unlisted content banner message",children:"This page is unlisted. Search engines will not index it, and only users having a direct link can access it."})}function c(){return(0,l.jsx)(s.A,{children:(0,l.jsx)("meta",{name:"robots",content:"noindex, nofollow"})})}function d(){return(0,l.jsx)(r.A,{id:"theme.contentVisibility.draftBanner.title",description:"The draft content banner title",children:"Draft page"})}function u(){return(0,l.jsx)(r.A,{id:"theme.contentVisibility.draftBanner.message",description:"The draft content banner message",children:"This page is a draft. It will only be visible in dev and be excluded from the production build."})}var m=n(7559),h=n(7293);function g(e){let{className:t}=e;return(0,l.jsx)(h.A,{type:"caution",title:(0,l.jsx)(d,{}),className:(0,a.A)(t,m.G.common.draftBanner),children:(0,l.jsx)(u,{})})}function f(e){let{className:t}=e;return(0,l.jsx)(h.A,{type:"caution",title:(0,l.jsx)(o,{}),className:(0,a.A)(t,m.G.common.unlistedBanner),children:(0,l.jsx)(i,{})})}function x(e){return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(c,{}),(0,l.jsx)(f,{...e})]})}function p(e){let{metadata:t}=e;const{unlisted:n,frontMatter:a}=t;return(0,l.jsxs)(l.Fragment,{children:[(n||a.unlisted)&&(0,l.jsx)(x,{}),a.draft&&(0,l.jsx)(g,{})]})}},7763:(e,t,n)=>{n.d(t,{A:()=>c});n(6540);var a=n(4164),r=n(5195);const s={tableOfContents:"tableOfContents_bqdL",docItemContainer:"docItemContainer_F8PC"};var l=n(4848);const o="table-of-contents__link toc-highlight",i="table-of-contents__link--active";function c(e){let{className:t,...n}=e;return(0,l.jsx)("div",{className:(0,a.A)(s.tableOfContents,"thin-scrollbar",t),children:(0,l.jsx)(r.A,{...n,linkClassName:o,linkActiveClassName:i})})}},5195:(e,t,n)=>{n.d(t,{A:()=>f});var a=n(6540),r=n(6342);function s(e){const t=e.map((e=>({...e,parentIndex:-1,children:[]}))),n=Array(7).fill(-1);t.forEach(((e,t)=>{const a=n.slice(2,e.level);e.parentIndex=Math.max(...a),n[e.level]=t}));const a=[];return t.forEach((e=>{const{parentIndex:n,...r}=e;n>=0?t[n].children.push(r):a.push(r)})),a}function l(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:a}=e;return t.flatMap((e=>{const t=l({toc:e.children,minHeadingLevel:n,maxHeadingLevel:a});return function(e){return e.level>=n&&e.level<=a}(e)?[{...e,children:t}]:t}))}function o(e){const t=e.getBoundingClientRect();return t.top===t.bottom?o(e.parentNode):t}function i(e,t){let{anchorTopOffset:n}=t;const a=e.find((e=>o(e).top>=n));if(a){return function(e){return e.top>0&&e.bottom<window.innerHeight/2}(o(a))?a:e[e.indexOf(a)-1]??null}return e[e.length-1]??null}function c(){const e=(0,a.useRef)(0),{navbar:{hideOnScroll:t}}=(0,r.p)();return(0,a.useEffect)((()=>{e.current=t?0:document.querySelector(".navbar").clientHeight}),[t]),e}function d(e){const t=(0,a.useRef)(void 0),n=c();(0,a.useEffect)((()=>{if(!e)return()=>{};const{linkClassName:a,linkActiveClassName:r,minHeadingLevel:s,maxHeadingLevel:l}=e;function o(){const e=function(e){return Array.from(document.getElementsByClassName(e))}(a),o=function(e){let{minHeadingLevel:t,maxHeadingLevel:n}=e;const a=[];for(let r=t;r<=n;r+=1)a.push(`h${r}.anchor`);return Array.from(document.querySelectorAll(a.join()))}({minHeadingLevel:s,maxHeadingLevel:l}),c=i(o,{anchorTopOffset:n.current}),d=e.find((e=>c&&c.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)));e.forEach((e=>{!function(e,n){n?(t.current&&t.current!==e&&t.current.classList.remove(r),e.classList.add(r),t.current=e):e.classList.remove(r)}(e,e===d)}))}return document.addEventListener("scroll",o),document.addEventListener("resize",o),o(),()=>{document.removeEventListener("scroll",o),document.removeEventListener("resize",o)}}),[e,n])}var u=n(8774),m=n(4848);function h(e){let{toc:t,className:n,linkClassName:a,isChild:r}=e;return t.length?(0,m.jsx)("ul",{className:r?void 0:n,children:t.map((e=>(0,m.jsxs)("li",{children:[(0,m.jsx)(u.A,{to:`#${e.id}`,className:a??void 0,dangerouslySetInnerHTML:{__html:e.value}}),(0,m.jsx)(h,{isChild:!0,toc:e.children,className:n,linkClassName:a})]},e.id)))}):null}const g=a.memo(h);function f(e){let{toc:t,className:n="table-of-contents table-of-contents__left-border",linkClassName:o="table-of-contents__link",linkActiveClassName:i,minHeadingLevel:c,maxHeadingLevel:u,...h}=e;const f=(0,r.p)(),x=c??f.tableOfContents.minHeadingLevel,p=u??f.tableOfContents.maxHeadingLevel,v=function(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:r}=e;return(0,a.useMemo)((()=>l({toc:s(t),minHeadingLevel:n,maxHeadingLevel:r})),[t,n,r])}({toc:t,minHeadingLevel:x,maxHeadingLevel:p});return d((0,a.useMemo)((()=>{if(o&&i)return{linkClassName:o,linkActiveClassName:i,minHeadingLevel:x,maxHeadingLevel:p}}),[o,i,x,p])),(0,m.jsx)(g,{toc:v,className:n,linkClassName:o,...h})}}}]);