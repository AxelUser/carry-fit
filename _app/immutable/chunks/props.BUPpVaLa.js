import{S as g,I as ee,J as re,K as y,L as ne,M as w,N as I,U as v,j as h,D as q,O as se,P as ie,v as te,w as fe,z as j,H as ae,E as ue,Q as le,R as ce,G as de,V as Y,W as B,x as M,X as U,A as oe,Y as _e,Z as ve,h as C,_ as pe,$ as be,a0 as W,n as G,a1 as he,a2 as we,a3 as X,a4 as Pe,a5 as ye,a6 as ge,a7 as H,a8 as xe,q as Re,a9 as Ee,aa as Oe,ab as k,l as Z,ac as Ie,ad as Se,ae as Ae,af as $,ag as D}from"./runtime.ChxeX2RE.js";import{s as Te}from"./index-client.C4Tc_z4F.js";function O(e,r=null,t){if(typeof e!="object"||e===null||g in e)return e;const s=ie(e);if(s!==ee&&s!==re)return e;var i=new Map,l=te(e),p=y(0);l&&i.set("length",y(e.length));var P;return new Proxy(e,{defineProperty(c,n,f){(!("value"in f)||f.configurable===!1||f.enumerable===!1||f.writable===!1)&&ne();var u=i.get(n);return u===void 0?(u=y(f.value),i.set(n,u)):w(u,O(f.value,P)),!0},deleteProperty(c,n){var f=i.get(n);if(f===void 0)n in c&&i.set(n,y(v));else{if(l&&typeof n=="string"){var u=i.get("length"),a=Number(n);Number.isInteger(a)&&a<u.v&&w(u,a)}w(f,v),z(p)}return!0},get(c,n,f){var _;if(n===g)return e;var u=i.get(n),a=n in c;if(u===void 0&&(!a||(_=I(c,n))!=null&&_.writable)&&(u=y(O(a?c[n]:v,P)),i.set(n,u)),u!==void 0){var d=h(u);return d===v?void 0:d}return Reflect.get(c,n,f)},getOwnPropertyDescriptor(c,n){var f=Reflect.getOwnPropertyDescriptor(c,n);if(f&&"value"in f){var u=i.get(n);u&&(f.value=h(u))}else if(f===void 0){var a=i.get(n),d=a==null?void 0:a.v;if(a!==void 0&&d!==v)return{enumerable:!0,configurable:!0,value:d,writable:!0}}return f},has(c,n){var d;if(n===g)return!0;var f=i.get(n),u=f!==void 0&&f.v!==v||Reflect.has(c,n);if(f!==void 0||q!==null&&(!u||(d=I(c,n))!=null&&d.writable)){f===void 0&&(f=y(u?O(c[n],P):v),i.set(n,f));var a=h(f);if(a===v)return!1}return u},set(c,n,f,u){var R;var a=i.get(n),d=n in c;if(l&&n==="length")for(var _=f;_<a.v;_+=1){var x=i.get(_+"");x!==void 0?w(x,v):_ in c&&(x=y(v),i.set(_+"",x))}a===void 0?(!d||(R=I(c,n))!=null&&R.writable)&&(a=y(void 0),w(a,O(f,P)),i.set(n,a)):(d=a.v!==v,w(a,O(f,P)));var b=Reflect.getOwnPropertyDescriptor(c,n);if(b!=null&&b.set&&b.set.call(u,f),!d){if(l&&typeof n=="string"){var S=i.get("length"),A=Number(n);Number.isInteger(A)&&A>=S.v&&w(S,A+1)}z(p)}return!0},ownKeys(c){h(p);var n=Reflect.ownKeys(c).filter(a=>{var d=i.get(a);return d===void 0||d.v!==v});for(var[f,u]of i)u.v!==v&&!(f in c)&&n.push(f);return n},setPrototypeOf(){se()}})}function z(e,r=1){w(e,e.v+r)}function V(e){return e!==null&&typeof e=="object"&&g in e?e[g]:e}function Ce(e,r){return Object.is(V(e),V(r))}function Fe(e,r,t=!1){j&&ae();var s=e,i=null,l=null,p=v,P=t?ue:0,c=!1;const n=(u,a=!0)=>{c=!0,f(a,u)},f=(u,a)=>{if(p===(p=u))return;let d=!1;if(j){const _=s.data===le;!!p===_&&(s=ce(),de(s),Y(!1),d=!0)}p?(i?B(i):a&&(i=M(()=>a(s))),l&&U(l,()=>{l=null})):(l?B(l):a&&(l=M(()=>a(s))),i&&U(i,()=>{i=null})),d&&Y(!0)};fe(()=>{c=!1,r(n),c||f(null,null)},P),j&&(s=oe)}function J(e,r){return e===r||(e==null?void 0:e[g])===r}function Ye(e={},r,t,s){return _e(()=>{var i,l;return ve(()=>{i=l,l=[],C(()=>{e!==t(...l)&&(r(e,...l),i&&J(t(...i),e)&&r(null,...i))})}),()=>{pe(()=>{l&&J(t(...l),e)&&r(null,...l)})}}),e}let m=!1;function Be(e,r,t){const s=t[r]??(t[r]={store:null,source:W(void 0),unsubscribe:G});if(s.store!==e)if(s.unsubscribe(),s.store=e??null,e==null)s.source.v=void 0,s.unsubscribe=G;else{var i=!0;s.unsubscribe=Te(e,l=>{i?s.source.v=l:w(s.source,l)}),i=!1}return h(s.source)}function Me(){const e={};return be(()=>{for(var r in e)e[r].unsubscribe()}),e}function De(e){var r=m;try{return m=!1,[e(),m]}finally{m=r}}const Ne={get(e,r){if(!e.exclude.includes(r))return e.props[r]},set(e,r){return!1},getOwnPropertyDescriptor(e,r){if(!e.exclude.includes(r)&&r in e.props)return{enumerable:!0,configurable:!0,value:e.props[r]}},has(e,r){return e.exclude.includes(r)?!1:r in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(r=>!e.exclude.includes(r))}};function Ue(e,r,t){return new Proxy({props:e,exclude:r},Ne)}const me={get(e,r){if(!e.exclude.includes(r))return h(e.version),r in e.special?e.special[r]():e.props[r]},set(e,r,t){return r in e.special||(e.special[r]=Ke({get[r](){return e.props[r]}},r,X)),e.special[r](t),$(e.version),!0},getOwnPropertyDescriptor(e,r){if(!e.exclude.includes(r)&&r in e.props)return{enumerable:!0,configurable:!0,value:e.props[r]}},deleteProperty(e,r){return e.exclude.includes(r)||(e.exclude.push(r),$(e.version)),!0},has(e,r){return e.exclude.includes(r)?!1:r in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(r=>!e.exclude.includes(r))}};function Ge(e,r){return new Proxy({props:e,exclude:r,special:{},version:y(0)},me)}const Le={get(e,r){let t=e.props.length;for(;t--;){let s=e.props[t];if(D(s)&&(s=s()),typeof s=="object"&&s!==null&&r in s)return s[r]}},set(e,r,t){let s=e.props.length;for(;s--;){let i=e.props[s];D(i)&&(i=i());const l=I(i,r);if(l&&l.set)return l.set(t),!0}return!1},getOwnPropertyDescriptor(e,r){let t=e.props.length;for(;t--;){let s=e.props[t];if(D(s)&&(s=s()),typeof s=="object"&&s!==null&&r in s){const i=I(s,r);return i&&!i.configurable&&(i.configurable=!0),i}}},has(e,r){if(r===g||r===k)return!1;for(let t of e.props)if(D(t)&&(t=t()),t!=null&&r in t)return!0;return!1},ownKeys(e){const r=[];for(let t of e.props){D(t)&&(t=t());for(const s in t)r.includes(s)||r.push(s)}return r}};function He(...e){return new Proxy({props:e},Le)}function Q(e){for(var r=q,t=q;r!==null&&!(r.f&(ye|ge));)r=r.parent;try{return H(r),e()}finally{H(t)}}function Ke(e,r,t,s){var F;var i=(t&xe)!==0,l=!Re||(t&Ee)!==0,p=(t&Oe)!==0,P=(t&Se)!==0,c=!1,n;p?[n,c]=De(()=>e[r]):n=e[r];var f=g in e||k in e,u=((F=I(e,r))==null?void 0:F.set)??(f&&p&&r in e?o=>e[r]=o:void 0),a=s,d=!0,_=!1,x=()=>(_=!0,d&&(d=!1,P?a=C(s):a=s),a);n===void 0&&s!==void 0&&(u&&l&&he(),n=x(),u&&u(n));var b;if(l)b=()=>{var o=e[r];return o===void 0?x():(d=!0,_=!1,o)};else{var S=Q(()=>(i?Z:Ie)(()=>e[r]));S.f|=we,b=()=>{var o=h(S);return o!==void 0&&(a=void 0),o===void 0?a:o}}if(!(t&X))return b;if(u){var A=e.$$legacy;return function(o,E){return arguments.length>0?((!l||!E||A||c)&&u(E?b():o),o):b()}}var R=!1,L=!1,N=W(n),T=Q(()=>Z(()=>{var o=b(),E=h(N);return R?(R=!1,L=!0,E):(L=!1,N.v=o)}));return i||(T.equals=Pe),function(o,E){if(Ae!==null&&(R=L,b(),h(N)),arguments.length>0){const K=E?h(T):l&&p?O(o):o;return T.equals(K)||(R=!0,w(N,K),_&&a!==void 0&&(a=K),C(()=>h(T))),o}return h(T)}}export{O as a,Ye as b,Ce as c,Be as d,He as e,Fe as i,Ge as l,Ke as p,Ue as r,Me as s};
