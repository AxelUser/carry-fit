import{h as _,f as G,t as p,p as E,n as L,a as V,c as I,r as q}from"./runtime.ToCCedUB.js";import{u as H,w as K,g as Q,a as g,p as j,t as z}from"./disclose-version.DueCaafF.js";import{g as v,d as A,w as u}from"./index.ESPmXIYf.js";import"./legacy.CXXuzs00.js";import{I as U,s as J}from"./Icon.D90UMF7M.js";import{l as O,s as R,r as w,p as x,b as $}from"./props.Y9cgl3dV.js";import{a as y}from"./attributes.CDQaUllC.js";import{s as N,c as C}from"./button.CrHTrI4Y.js";function _e(e,t){var s=e.__className,n=W(t);_&&e.className===n?e.__className=n:(s!==n||_&&e.className!==n)&&(t==null?e.removeAttribute("class"):e.className=n,e.__className=n)}function W(e){return e??""}function Te(e,t){H(window,["resize"],()=>K(()=>t(window[e])))}let T,S;function P(e){if(typeof document>"u")return;clearTimeout(T),clearTimeout(S);const t=document.createElement("style"),s=document.createTextNode(`* {
     -webkit-transition: none !important;
     -moz-transition: none !important;
     -o-transition: none !important;
     -ms-transition: none !important;
     transition: none !important;
  }`);t.appendChild(s);const n=()=>document.head.appendChild(t),o=()=>document.head.removeChild(t);if(typeof window.getComputedStyle<"u"){n(),e(),window.getComputedStyle(t).opacity,o();return}if(typeof window.requestAnimationFrame<"u"){n(),e(),window.requestAnimationFrame(o);return}n(),T=window.setTimeout(()=>{e(),S=window.setTimeout(o,120)},120)}function M(e){return e.filter(t=>t.length>0)}const D={getItem:e=>null,setItem:(e,t)=>{}},f=typeof document<"u",X=["dark","light","system"],Y=u("mode-watcher-mode"),Z=u("mode-watcher-theme"),b=re(),ee=ie(),te=u(void 0),B=ae(),F=u(!0),ne=u([]),se=u([]),oe=ce(),Se=le();function re(){const e="system",t=f?localStorage:D,s=t.getItem(o());let n=k(s)?s:e;function o(){return v(Y)}const{subscribe:i,set:a}=u(n,()=>{if(!f)return;const c=l=>{if(l.key!==o())return;const m=l.newValue;k(m)?a(n=m):a(n=e)};return addEventListener("storage",c),()=>removeEventListener("storage",c)});function r(c){a(n=c),t.setItem(o(),n)}return{subscribe:i,set:r}}function ae(){const e=f?localStorage:D,t=e.getItem(n());let s=t??"";function n(){return v(Z)}const{subscribe:o,set:i}=u(s,()=>{if(!f)return;const r=c=>{if(c.key!==n())return;const l=c.newValue;i(l===null?s="":s=l)};return addEventListener("storage",r),()=>removeEventListener("storage",r)});function a(r){i(s=r),e.setItem(n(),s)}return{subscribe:o,set:a}}function ie(){let t=!0;const{subscribe:s,set:n}=u(void 0,()=>{if(!f)return;const a=c=>{t&&n(c.matches?"light":"dark")},r=window.matchMedia("(prefers-color-scheme: light)");return r.addEventListener("change",a),()=>r.removeEventListener("change",a)});function o(){if(!f)return;const a=window.matchMedia("(prefers-color-scheme: light)");n(a.matches?"light":"dark")}function i(a){t=a}return{subscribe:s,query:o,tracking:i}}function ce(){const{subscribe:e}=A([b,ee,te,F,ne,se],([t,s,n,o,i,a])=>{if(!f)return;const r=t==="system"?s:t,c=M(i),l=M(a);function m(){const d=document.documentElement,h=document.querySelector('meta[name="theme-color"]');r==="light"?(c.length&&d.classList.remove(...c),l.length&&d.classList.add(...l),d.style.colorScheme="light",h&&n&&h.setAttribute("content",n.light)):(l.length&&d.classList.remove(...l),c.length&&d.classList.add(...c),d.style.colorScheme="dark",h&&n&&h.setAttribute("content",n.dark))}return o?P(m):m(),r});return{subscribe:e}}function le(){const{subscribe:e}=A([B,F],([t,s])=>{if(!f)return;function n(){document.documentElement.setAttribute("data-theme",t)}return s?P(n):n(),t});return{subscribe:e}}function k(e){return typeof e!="string"?!1:X.includes(e)}function Me(){b.set(v(oe)==="dark"?"light":"dark")}function ke(e){b.set(e)}function Ee(e){B.set(e)}function Le(e){return e}function Ve({defaultMode:e="system",themeColors:t,darkClassNames:s=["dark"],lightClassNames:n=[],defaultTheme:o="",modeStorageKey:i="mode-watcher-mode",themeStorageKey:a="mode-watcher-theme"}){const r=document.documentElement,c=localStorage.getItem(i)||e,l=localStorage.getItem(a)||o,m=c==="light"||c==="system"&&window.matchMedia("(prefers-color-scheme: light)").matches;if(m?(s.length&&r.classList.remove(...s),n.length&&r.classList.add(...n)):(n.length&&r.classList.remove(...n),s.length&&r.classList.add(...s)),r.style.colorScheme=m?"light":"dark",t){const d=document.querySelector('meta[name="theme-color"]');d&&d.setAttribute("content",c==="light"?t.light:t.dark)}l&&(r.setAttribute("data-theme",l),localStorage.setItem(a,l)),localStorage.setItem(i,c)}function Ie(e,t){const s=O(t,["children","$$slots","$$events","$$legacy"]);U(e,R({name:"triangle-alert"},()=>s,{iconNode:[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"}],["path",{d:"M12 9v4"}],["path",{d:"M12 17h.01"}]],children:(o,i)=>{var a=Q(),r=G(a);J(r,t,"default",{}),g(o,a)},$$slots:{default:!0}}))}var de=j('<svg><defs><linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color: rgb(29, 78, 216)"></stop><stop offset="100%" style="stop-color: rgb(14, 165, 233)"></stop></linearGradient></defs><path fill="url(#icon-gradient)" d="m17.3 20.25l3.55-3.55l-.75-.75l-2.8 2.8l-1.4-1.4l-.75.75zM9 19V9H8v10zm2.7 2H8q-.825 0-1.412-.587T6 19V9q0-.825.588-1.412T8 7h6V4q-.825 0-1.412-.587T12 2h4v9.3q-.6.2-1.037.4t-.963.55V9h-3v10h.1q.075.6.225 1.05t.375.95m6.3-8q2.075 0 3.538 1.463T23 18t-1.463 3.538T18 23t-3.537-1.463T13 18t1.463-3.537T18 13m-9 6V9zm2 0V9z"></path></svg>');function qe(e,t){let s=w(t,["$$slots","$$events","$$legacy"]);var n=de();let o;p(()=>o=y(n,o,{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",...s},void 0,!0)),g(e,n)}var ue=z("<div><!></div>");function ze(e,t){E(t,!0);let s=x(t,"ref",15,null),n=w(t,["$$slots","$$events","$$legacy","ref","class","children"]);var o=ue();let i;var a=I(o);N(a,()=>t.children??L),q(o),$(o,r=>s(r),()=>s()),p(()=>i=y(o,i,{class:C("bg-card text-card-foreground rounded-lg border shadow-sm",t.class),...n})),g(e,o),V()}var me=z("<div><!></div>");function Ae(e,t){E(t,!0);let s=x(t,"ref",15,null),n=w(t,["$$slots","$$events","$$legacy","ref","class","children"]);var o=me();let i;var a=I(o);N(a,()=>t.children??L),q(o),$(o,r=>s(r),()=>s()),p(()=>i=y(o,i,{class:C("p-4 sm:p-6",t.class),...n})),g(e,o),V()}export{Ae as C,qe as L,Ie as T,oe as a,Se as b,ee as c,Le as d,ke as e,Ee as f,F as g,te as h,k as i,ne as j,Te as k,se as l,Y as m,ze as n,_e as o,Me as p,Ve as s,Z as t};
