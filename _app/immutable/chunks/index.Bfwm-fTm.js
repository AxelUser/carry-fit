import{n as f,r as w,s as q}from"./runtime.DiJPDe4L.js";import{s as _}from"./index-client.luKP_3At.js";const a=[];function x(s,t){return{subscribe:z(s,t).subscribe}}function z(s,t=f){let r=null;const o=new Set;function i(n){if(q(s,n)&&(s=n,r)){const u=!a.length;for(const e of o)e[1](),a.push(e,s);if(u){for(let e=0;e<a.length;e+=2)a[e][0](a[e+1]);a.length=0}}}function l(n){i(n(s))}function b(n,u=f){const e=[n,u];return o.add(e),o.size===1&&(r=t(i,l)||f),n(s),()=>{o.delete(e),o.size===0&&r&&(r(),r=null)}}return{set:i,update:l,subscribe:b}}function B(s,t,r){const o=!Array.isArray(s),i=o?[s]:s;if(!i.every(Boolean))throw new Error("derived() expects stores as input, got a falsy value");const l=t.length<2;return x(r,(b,n)=>{let u=!1;const e=[];let p=0,d=f;const y=()=>{if(p)return;d();const c=t(o?e[0]:e,b,n);l?b(c):d=typeof c=="function"?c:f},h=i.map((c,g)=>_(c,m=>{e[g]=m,p&=~(1<<g),u&&y()},()=>{p|=1<<g}));return u=!0,y(),function(){w(h),d(),u=!1}})}function E(s){let t;return _(s,r=>t=r)(),t}export{B as d,E as g,x as r,z as w};
