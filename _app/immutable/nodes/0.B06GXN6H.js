import{l as $,q as fe,g as U,a as n,t as y,h as G,s as ue}from"../chunks/disclose-version.DueCaafF.js";import{b as he,h as Q,e as Z,d as ge,i as ee,D as _e,P as be,N as ye,G as xe,K as pe,a5 as ke,p as H,f as N,a as L,t as A,s as k,aL as j,aM as we,z as R,aN as Se,X as I,B as J,c as f,n as le,r as u,u as Ce,A as ie,y as ne,aO as Ne}from"../chunks/runtime.ToCCedUB.js";import{b as Te,s as Me}from"../chunks/render.B-1rXh4j.js";import{p as v,i as O,c as Ke,d as te,b as We,r as je,a as de}from"../chunks/props.Y9cgl3dV.js";import{s as ce,c as Ie,B as Oe}from"../chunks/button.CrHTrI4Y.js";import{s as Pe,d as Ee,a as He,b as Le,c as ae,e as ze,i as De,f as Re,m as re,t as se,g as Ue,h as Ae,j as Be,l as qe,k as Fe,C as Ge,n as Xe,o as Je,L as Ve,T as Ye}from"../chunks/card-content.DN9eHcjK.js";import{i as V}from"../chunks/legacy.CXXuzs00.js";import{o as $e}from"../chunks/index-client.CTbue5I9.js";import{s as me,a as Qe}from"../chunks/attributes.CDQaUllC.js";import{c as Ze,m as ve}from"../chunks/local-store.svelte.B6lejr5t.js";import{c as X}from"../chunks/svelte-component.C7hPjp2w.js";function et(h,e,o,g,l){var d=h,r="",i;he(()=>{if(r===(r=e()??"")){Q&&Z();return}i!==void 0&&(ke(i),i=void 0),r!==""&&(i=ge(()=>{if(Q){ee.data;for(var s=Z(),c=s;s!==null&&(s.nodeType!==8||s.data!=="");)c=s,s=_e(s);if(s===null)throw be(),ye;$(ee,c),d=xe(s);return}var t=r+"",a=fe(t);$(pe(a),a.lastChild),d.before(a)}))})}const tt=!0,Mt=Object.freeze(Object.defineProperty({__proto__:null,prerender:tt},Symbol.toStringTag,{value:"Module"}));var at=y('<meta name="theme-color">');function rt(h,e){H(e,!1);let o=v(e,"themeColors",24,()=>{});V();var g=U(),l=N(g);{var d=r=>{var i=at();A(()=>me(i,"content",o().dark)),n(r,i)};O(l,r=>{o()&&r(d)})}n(h,g),L()}var st=y('<meta name="theme-color">'),ot=y("<!> <!>",1);function lt(h,e){H(e,!1);let o=v(e,"trueNonce",8,""),g=v(e,"initConfig",8),l=v(e,"themeColors",24,()=>{});V(),Te(d=>{var r=ot(),i=N(r);{var s=t=>{var a=st();A(()=>me(a,"content",l().dark)),n(t,a)};O(i,t=>{l()&&t(s)})}var c=k(i,2);et(c,()=>`<script${o()?` nonce=${o()}`:""}>(`+Pe.toString()+")("+JSON.stringify(g())+");<\/script>",!1,!1),n(d,r)}),L()}function it(h,e){H(e,!1);const o=Ke(),g=()=>te(re,"$modeStorageKeyStore",o),l=()=>te(se,"$themeStorageKeyStore",o),d=Se();let r=v(e,"track",8,!0),i=v(e,"defaultMode",8,"system"),s=v(e,"themeColors",24,()=>{}),c=v(e,"disableTransitions",8,!0),t=v(e,"darkClassNames",24,()=>["dark"]),a=v(e,"lightClassNames",24,()=>[]),_=v(e,"defaultTheme",8,""),T=v(e,"nonce",8,""),x=v(e,"themeStorageKey",8,"mode-watcher-theme"),w=v(e,"modeStorageKey",8,"mode-watcher-mode"),z=v(e,"disableHeadScriptInjection",8,!1);$e(()=>{const m=He.subscribe(()=>{}),C=Le.subscribe(()=>{});ae.tracking(r()),ae.query();const K=localStorage.getItem(g());ze(De(K)?K:i());const b=localStorage.getItem(l());return Re(b||_()),()=>{m(),C()}});const P=Ee({defaultMode:i(),themeColors:s(),darkClassNames:t(),lightClassNames:a(),defaultTheme:_(),modeStorageKey:w(),themeStorageKey:x()});j(()=>I(c()),()=>{Ue.set(c())}),j(()=>I(s()),()=>{Ae.set(s())}),j(()=>I(t()),()=>{Be.set(t())}),j(()=>I(a()),()=>{qe.set(a())}),j(()=>I(w()),()=>{re.set(w())}),j(()=>I(x()),()=>{se.set(x())}),j(()=>I(T()),()=>{J(d,typeof window>"u"?T():"")}),we(),V();var S=U(),E=N(S);{var M=m=>{rt(m,{get themeColors(){return s()}})},p=m=>{lt(m,{get trueNonce(){return R(d)},initConfig:P,get themeColors(){return s()}})};O(E,m=>{z()?m(M):m(p,!1)})}n(h,S),L()}var nt=y("<div><!></div>");function dt(h,e){H(e,!0);let o=v(e,"ref",15,null),g=je(e,["$$slots","$$events","$$legacy","ref","class","children"]);var l=nt();let d;var r=f(l);ce(r,()=>e.children??le),u(l),We(l,i=>o(i),()=>o()),A(()=>d=Qe(l,d,{class:Ie("flex items-center p-4 pt-0 sm:p-6 sm:pt-0",e.class),...g})),n(h,l),L()}const B=Ze("easter-eggs",{ultraWide:!0}),oe={get ultraWide(){return B.isLoaded&&B.value.ultraWide},set ultraWide(h){B.value={...B.value,ultraWide:h}}};var ct=y('<div class="text-sm font-medium"><!></div>'),mt=y("<!> <!>",1),vt=y('<div style="min-width: 180px"><!></div>'),ft=y('<div class="fixed hidden 3xl:block"><!> <!></div>');function ut(h,e){H(e,!0);const o=(c,t=le)=>{var a=vt(),_=f(a);X(_,()=>Xe,(T,x)=>{x(T,{children:(w,z)=>{var P=mt(),S=N(P);X(S,()=>Ge,(p,m)=>{m(p,{children:(C,K)=>{var b=ct(),q=f(b);{var Y=W=>{var D=G("👉 Hey, psst... look at the other side of your fancy monitor!");n(W,D)},F=W=>{var D=G(`Nice ultrawide you got there! I would show you more but my markup skills only cover half
						the screen...`);n(W,D)};O(q,W=>{t()==="left"?W(Y):W(F,!1)})}u(b),n(C,b)},$$slots:{default:!0}})});var E=k(S,2);{var M=p=>{var m=U(),C=N(m);X(C,()=>dt,(K,b)=>{b(K,{class:"flex justify-center",children:(q,Y)=>{Oe(q,{size:"lg",onclick:d,variant:"default",children:(F,W)=>{ne();var D=G("Don't bother me anymore!");n(F,D)},$$slots:{default:!0}})},$$slots:{default:!0}})}),n(p,m)};O(E,p=>{t()==="right"&&p(M)})}n(w,P)},$$slots:{default:!0}})}),u(a),A(()=>Je(a,`fixed top-1/2 -translate-y-1/2 ${g[t()]??""} max-w-[350px]`)),n(c,a)},g={left:"left-8",right:"right-8"};let l=ie(0);function d(){oe.ultraWide=!1}Ce(()=>{R(l)>3440&&ve.easterEggShown("ultra-wide")});var r=U(),i=N(r);{var s=c=>{var t=ft(),a=f(t);o(a,()=>"left");var _=k(a,2);o(_,()=>"right"),u(t),n(c,t)};O(i,c=>{oe.ultraWide&&c(s)})}Fe("innerWidth",c=>J(l,de(c))),n(h,r),L()}var ht=y(`<div class="min-h-screen px-2 py-8 sm:px-4"><div class="min-h-scree"><div class="mx-auto md:container"><div class="mb-12 py-2 text-center"><h1 class="mb-3 font-extrabold"><span class="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-4xl text-transparent sm:text-6xl">CarryFit</span> <span class="ml-0 inline-flex translate-y-2"><!></span></h1></div> <div class="mx-auto max-w-2xl rounded-xl p-8 shadow-xl ring-1 ring-sky-100"><div class="mb-6 flex items-start gap-4"><div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100"><!></div> <div><h2 class="mb-2 text-xl font-semibold text-red-900">Oops! Our code took an unexpected vacation 🏖️</h2> <p class="mb-4 text-red-600"> </p></div></div> <div class="rounded-lg border border-sky-100 bg-sky-50 p-6"><h3 class="mb-3 font-medium text-sky-900">Want to help catch this bug? Here's how:</h3> <ul class="ml-2 space-y-2 text-sm text-sky-800"><li>• File a bug report on <a href="https://github.com/AxelUser/carry-fit" class="text-blue-600 hover:text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a> (our bug collection gallery)</li> <li>• Send a friendly email to <a href="mailto:alexey.maltsev.work@gmail.com" class="text-blue-600 hover:text-blue-800 hover:underline">alexey.maltsev.work@gmail.com</a></li> <li>• Tweet at me on <a href="https://x.com/axel_user" class="text-blue-600 hover:text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">X (Twitter)</a> - I promise I don't byte! 🤓</li></ul></div></div></div></div></div>`),gt=y("<!> <!> <!>",1);function Kt(h,e){H(e,!0);let o=ie(null);function g(t){t instanceof ErrorEvent&&J(o,de(t.error)),ve.errorOccurred(R(o))}var l=gt();ue("error",Ne,g);var d=N(l);ut(d,{});var r=k(d,2);it(r,{});var i=k(r,2);{var s=t=>{var a=ht(),_=f(a),T=f(_),x=f(T),w=f(x),z=k(f(w),2),P=f(z);Ve(P,{class:"h-12 w-12 sm:h-16 sm:w-16"}),u(z),u(w),u(x);var S=k(x,2),E=f(S),M=f(E),p=f(M);Ye(p,{class:"h-6 w-6 text-red-600"}),u(M);var m=k(M,2),C=k(f(m),2),K=f(C,!0);u(C),u(m),u(E),ne(2),u(S),u(T),u(_),u(a),A(()=>{var b;return Me(K,((b=R(o))==null?void 0:b.message)||"Looks like our pixels got a bit tangled. Don't worry, they're just having a bad hair day!")}),n(t,a)},c=t=>{var a=U(),_=N(a);ce(_,()=>e.children),n(t,a)};O(i,t=>{R(o)?t(s):t(c,!1)})}n(h,l),L()}export{Kt as component,Mt as universal};
