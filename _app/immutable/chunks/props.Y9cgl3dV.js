import{ag as I,ah as k,ai as ee,ab as y,aj as re,B as w,ak as O,al as v,z as h,U as C,am as ne,w as se,Z as ie,b as te,h as q,e as ae,E as fe,_ as ue,$ as le,G as ce,F as j,a1 as U,d as Y,g as M,i as de,an as oe,ao as _e,q as B,a7 as ve,ap as pe,aa as Q,n as z,aq as be,ar as he,as as W,at as we,au as Pe,av as ye,aw as G,ax as ge,o as xe,ay as Re,az as Ee,aA as X,C as Z,aB as Ie,aC as $,aD as D,aE as Oe}from"./runtime.ToCCedUB.js";import{s as Se}from"./utils.B2NYegMP.js";function E(e,r=null,t){if(typeof e!="object"||e===null||I in e)return e;const s=se(e);if(s!==k&&s!==ee)return e;var i=new Map,l=ie(e),p=y(0);l&&i.set("length",y(e.length));var P;return new Proxy(e,{defineProperty(c,n,a){(!("value"in a)||a.configurable===!1||a.enumerable===!1||a.writable===!1)&&re();var u=i.get(n);return u===void 0?(u=y(a.value),i.set(n,u)):w(u,E(a.value,P)),!0},deleteProperty(c,n){var a=i.get(n);if(a===void 0)n in c&&i.set(n,y(v));else{if(l&&typeof n=="string"){var u=i.get("length"),f=Number(n);Number.isInteger(f)&&f<u.v&&w(u,f)}w(a,v),H(p)}return!0},get(c,n,a){var _;if(n===I)return e;var u=i.get(n),f=n in c;if(u===void 0&&(!f||(_=O(c,n))!=null&&_.writable)&&(u=y(E(f?c[n]:v,P)),i.set(n,u)),u!==void 0){var d=h(u);return d===v?void 0:d}return Reflect.get(c,n,a)},getOwnPropertyDescriptor(c,n){var a=Reflect.getOwnPropertyDescriptor(c,n);if(a&&"value"in a){var u=i.get(n);u&&(a.value=h(u))}else if(a===void 0){var f=i.get(n),d=f==null?void 0:f.v;if(f!==void 0&&d!==v)return{enumerable:!0,configurable:!0,value:d,writable:!0}}return a},has(c,n){var d;if(n===I)return!0;var a=i.get(n),u=a!==void 0&&a.v!==v||Reflect.has(c,n);if(a!==void 0||C!==null&&(!u||(d=O(c,n))!=null&&d.writable)){a===void 0&&(a=y(u?E(c[n],P):v),i.set(n,a));var f=h(a);if(f===v)return!1}return u},set(c,n,a,u){var x;var f=i.get(n),d=n in c;if(l&&n==="length")for(var _=a;_<f.v;_+=1){var g=i.get(_+"");g!==void 0?w(g,v):_ in c&&(g=y(v),i.set(_+"",g))}f===void 0?(!d||(x=O(c,n))!=null&&x.writable)&&(f=y(void 0),w(f,E(a,P)),i.set(n,f)):(d=f.v!==v,w(f,E(a,P)));var b=Reflect.getOwnPropertyDescriptor(c,n);if(b!=null&&b.set&&b.set.call(u,a),!d){if(l&&typeof n=="string"){var S=i.get("length"),A=Number(n);Number.isInteger(A)&&A>=S.v&&w(S,A+1)}H(p)}return!0},ownKeys(c){h(p);var n=Reflect.ownKeys(c).filter(f=>{var d=i.get(f);return d===void 0||d.v!==v});for(var[a,u]of i)u.v!==v&&!(a in c)&&n.push(a);return n},setPrototypeOf(){ne()}})}function H(e,r=1){w(e,e.v+r)}function Ce(e,r,t=!1){q&&ae();var s=e,i=null,l=null,p=v,P=t?fe:0,c=!1;const n=(u,f=!0)=>{c=!0,a(f,u)},a=(u,f)=>{if(p===(p=u))return;let d=!1;if(q){const _=s.data===ue;!!p===_&&(s=le(),ce(s),j(!1),d=!0)}p?(i?U(i):f&&(i=Y(()=>f(s))),l&&M(l,()=>{l=null})):(l?U(l):f&&(l=Y(()=>f(s))),i&&M(i,()=>{i=null})),d&&j(!0)};te(()=>{c=!1,r(n),c||a(null,null)},P),q&&(s=de)}function V(e,r){return e===r||(e==null?void 0:e[I])===r}function Be(e={},r,t,s){return oe(()=>{var i,l;return _e(()=>{i=l,l=[],B(()=>{e!==t(...l)&&(r(e,...l),i&&V(t(...i),e)&&r(null,...i))})}),()=>{ve(()=>{l&&V(t(...l),e)&&r(null,...l)})}}),e}let m=!1;function Fe(e,r,t){const s=t[r]??(t[r]={store:null,source:Q(void 0),unsubscribe:z});if(s.store!==e)if(s.unsubscribe(),s.store=e??null,e==null)s.source.v=void 0,s.unsubscribe=z;else{var i=!0;s.unsubscribe=Se(e,l=>{i?s.source.v=l:w(s.source,l)}),i=!1}return h(s.source)}function Ke(){const e={};return pe(()=>{for(var r in e)e[r].unsubscribe()}),e}function Ae(e){var r=m;try{return m=!1,[e(),m]}finally{m=r}}const Te={get(e,r){if(!e.exclude.includes(r))return e.props[r]},set(e,r){return!1},getOwnPropertyDescriptor(e,r){if(!e.exclude.includes(r)&&r in e.props)return{enumerable:!0,configurable:!0,value:e.props[r]}},has(e,r){return e.exclude.includes(r)?!1:r in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(r=>!e.exclude.includes(r))}};function je(e,r,t){return new Proxy({props:e,exclude:r},Te)}const De={get(e,r){if(!e.exclude.includes(r))return h(e.version),r in e.special?e.special[r]():e.props[r]},set(e,r,t){return r in e.special||(e.special[r]=Ne({get[r](){return e.props[r]}},r,W)),e.special[r](t),$(e.version),!0},getOwnPropertyDescriptor(e,r){if(!e.exclude.includes(r)&&r in e.props)return{enumerable:!0,configurable:!0,value:e.props[r]}},deleteProperty(e,r){return e.exclude.includes(r)||(e.exclude.push(r),$(e.version)),!0},has(e,r){return e.exclude.includes(r)?!1:r in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(r=>!e.exclude.includes(r))}};function Ue(e,r){return new Proxy({props:e,exclude:r,special:{},version:y(0)},De)}const me={get(e,r){let t=e.props.length;for(;t--;){let s=e.props[t];if(D(s)&&(s=s()),typeof s=="object"&&s!==null&&r in s)return s[r]}},set(e,r,t){let s=e.props.length;for(;s--;){let i=e.props[s];D(i)&&(i=i());const l=O(i,r);if(l&&l.set)return l.set(t),!0}return!1},getOwnPropertyDescriptor(e,r){let t=e.props.length;for(;t--;){let s=e.props[t];if(D(s)&&(s=s()),typeof s=="object"&&s!==null&&r in s){const i=O(s,r);return i&&!i.configurable&&(i.configurable=!0),i}}},has(e,r){if(r===I||r===X)return!1;for(let t of e.props)if(D(t)&&(t=t()),t!=null&&r in t)return!0;return!1},ownKeys(e){const r=[];for(let t of e.props){D(t)&&(t=t());for(const s in t)r.includes(s)||r.push(s)}return r}};function Ye(...e){return new Proxy({props:e},me)}function J(e){for(var r=C,t=C;r!==null&&!(r.f&(Pe|ye));)r=r.parent;try{return G(r),e()}finally{G(t)}}function Ne(e,r,t,s){var K;var i=(t&ge)!==0,l=!xe||(t&Re)!==0,p=(t&Ee)!==0,P=(t&Oe)!==0,c=!1,n;p?[n,c]=Ae(()=>e[r]):n=e[r];var a=I in e||X in e,u=((K=O(e,r))==null?void 0:K.set)??(a&&p&&r in e?o=>e[r]=o:void 0),f=s,d=!0,_=!1,g=()=>(_=!0,d&&(d=!1,P?f=B(s):f=s),f);n===void 0&&s!==void 0&&(u&&l&&be(),n=g(),u&&u(n));var b;if(l)b=()=>{var o=e[r];return o===void 0?g():(d=!0,_=!1,o)};else{var S=J(()=>(i?Z:Ie)(()=>e[r]));S.f|=he,b=()=>{var o=h(S);return o!==void 0&&(f=void 0),o===void 0?f:o}}if(!(t&W))return b;if(u){var A=e.$$legacy;return function(o,R){return arguments.length>0?((!l||!R||A||c)&&u(R?b():o),o):b()}}var x=!1,F=!1,N=Q(n),T=J(()=>Z(()=>{var o=b(),R=h(N);return x?(x=!1,F=!0,R):(F=!1,N.v=o)}));return i||(T.equals=we),function(o,R){if(arguments.length>0){const L=R?h(T):l&&p?E(o):o;return T.equals(L)||(x=!0,w(N,L),_&&f!==void 0&&(f=L),B(()=>h(T))),o}return h(T)}}export{E as a,Be as b,Ke as c,Fe as d,Ce as i,Ue as l,Ne as p,je as r,Ye as s};
