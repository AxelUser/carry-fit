import{c as _e,q as he,a as Z,p as me,l as ge}from"./disclose-version.TB2BspDb.js";import{i as pe}from"./legacy.DkVKZbnn.js";import{h as w,e as D,b as re,X as Ee,C as ie,Y as we,Z as J,x as S,w as R,i as C,_ as M,$ as B,d as L,g as le,G as z,a0 as K,a1 as be,B as ke,a2 as Ae,a3 as se,o as fe,F as oe,y as Ne,a4 as xe,a5 as Ce,a6 as q,a7 as F,a8 as Te,a9 as Q,aa as ue,ab as Ie,ac as Se,q as Re,E as ye,ad as de,p as He,s as Me,t as j,a as De,c as We,f as Oe,r as ze,N as $}from"./runtime.D1885tZe.js";import{a as ee}from"./render.CIVVyzBD.js";import{a as ae}from"./attributes.EX2l8yq0.js";import{l as te,p as T}from"./props.DA3ILugu.js";function Be(l,e){return e}function Le(l,e,a,s){for(var d=[],f=e.length,i=0;i<f;i++)be(e[i].e,d,!0);var _=f>0&&d.length===0&&a!==null;if(_){var g=a.parentNode;ke(g),g.append(a),s.clear(),x(l,e[0].prev,e[f-1].next)}Ae(d,()=>{for(var v=0;v<f;v++){var c=e[v];_||(s.delete(c.k),x(l,c.prev,c.next)),se(c.e,!_)}})}function qe(l,e,a,s,d,f=null){var i=l,_={flags:e,items:new Map,first:null},g=(e&ue)!==0;if(g){var v=l;i=w?S(fe(v)):v.appendChild(oe())}w&&D();var c=null,h=!1;re(()=>{var m=a(),t=Ee(m)?m:m==null?[]:ie(m),r=t.length;if(h&&r===0)return;h=r===0;let o=!1;if(w){var k=i.data===we;k!==(r===0)&&(i=J(),S(i),R(!1),o=!0)}if(w){for(var p=null,E,b=0;b<r;b++){if(C.nodeType===8&&C.data===Ne){i=C,o=!0,R(!1);break}var A=t[b],n=s(A,b);E=ve(C,_,p,null,A,n,b,d,e),_.items.set(n,E),p=E}r>0&&S(J())}if(!w){var u=xe;Fe(t,_,i,d,e,(u.f&M)!==0,s)}f!==null&&(r===0?c?B(c):c=L(()=>f(i)):c!==null&&le(c,()=>{c=null})),o&&R(!0),a()}),w&&(i=C)}function Fe(l,e,a,s,d,f,i,_){var V,Y,G,U;var g=(d&Ie)!==0,v=(d&(q|F))!==0,c=l.length,h=e.items,m=e.first,t=m,r,o=null,k,p=[],E=[],b,A,n,u;if(g)for(u=0;u<c;u+=1)b=l[u],A=i(b,u),n=h.get(A),n!==void 0&&((V=n.a)==null||V.measure(),(k??(k=new Set)).add(n));for(u=0;u<c;u+=1){if(b=l[u],A=i(b,u),n=h.get(A),n===void 0){var y=t?t.e.nodes_start:a;o=ve(y,e,o,o===null?e.first:o.next,b,A,u,s,d),h.set(A,o),p=[],E=[],t=o.next;continue}if(v&&Pe(n,b,u,d),n.e.f&M&&(B(n.e),g&&((Y=n.a)==null||Y.unfix(),(k??(k=new Set)).delete(n))),n!==t){if(r!==void 0&&r.has(n)){if(p.length<E.length){var H=E[0],N;o=H.prev;var P=p[0],W=p[p.length-1];for(N=0;N<p.length;N+=1)ne(p[N],H,a);for(N=0;N<E.length;N+=1)r.delete(E[N]);x(e,P.prev,W.next),x(e,o,P),x(e,W,H),t=H,o=W,u-=1,p=[],E=[]}else r.delete(n),ne(n,t,a),x(e,n.prev,n.next),x(e,n,o===null?e.first:o.next),x(e,o,n),o=n;continue}for(p=[],E=[];t!==null&&t.k!==A;)(f||!(t.e.f&M))&&(r??(r=new Set)).add(t),E.push(t),t=t.next;if(t===null)continue;n=t}p.push(n),o=n,t=n.next}if(t!==null||r!==void 0){for(var I=r===void 0?[]:ie(r);t!==null;)(f||!(t.e.f&M))&&I.push(t),t=t.next;var O=I.length;if(O>0){var ce=d&ue&&c===0?a:null;if(g){for(u=0;u<O;u+=1)(G=I[u].a)==null||G.measure();for(u=0;u<O;u+=1)(U=I[u].a)==null||U.fix()}Le(e,I,ce,h)}}g&&Ce(()=>{var X;if(k!==void 0)for(n of k)(X=n.a)==null||X.apply()}),z.first=e.first&&e.first.e,z.last=o&&o.e}function Pe(l,e,a,s){s&q&&K(l.v,e),s&F?K(l.i,a):l.i=a}function ve(l,e,a,s,d,f,i,_,g,v){var c=(g&q)!==0,h=(g&Se)===0,m=c?h?Te(d):Q(d):d,t=g&F?Q(i):i,r={i:t,v:m,k:f,a:null,e:null,prev:a,next:s};try{return r.e=L(()=>_(l,m,t),w),r.e.prev=a&&a.e,r.e.next=s&&s.e,a===null?e.first=r:(a.next=r,a.e.next=r.e),s!==null&&(s.prev=r,s.e.prev=r.e),r}finally{}}function ne(l,e,a){for(var s=l.next?l.next.e.nodes_start:a,d=e?e.e.nodes_start:a,f=l.e.nodes_start;f!==s;){var i=Re(f);d.before(f),f=i}}function x(l,e,a){e===null?l.first=a:(e.next=a,e.e.next=a&&a.e),a!==null&&(a.prev=e,a.e.prev=e&&e.e)}function Ve(l,e,a,s,d){var _;w&&D();var f=(_=e.$$slots)==null?void 0:_[a],i=!1;f===!0&&(f=e[a==="default"?"children":a],i=!0),f===void 0||f(l,i?()=>s:s)}function Ye(l,e,a,s,d,f){let i=w;w&&D();var _,g,v=null;w&&C.nodeType===1&&(v=C,D());var c=w?C:l,h;re(()=>{const m=e()||null;var t=de;m!==_&&(h&&(m===null?le(h,()=>{h=null,g=null}):m===g?B(h):(se(h),ee(!1))),m&&m!==g&&(h=L(()=>{if(v=w?v:document.createElementNS(t,m),_e(v,v),s){w&&he(m)&&v.append(document.createComment(""));var r=w?fe(v):v.appendChild(oe());w&&(r===null?R(!1):S(r)),s(v,r)}z.nodes_end=v,c.before(v)})),_=m,_&&(g=_),ee(!0))},ye),i&&(R(!0),S(c))}/**
 * @license lucide-svelte v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ge={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};var Ue=me("<svg><!><!></svg>");function $e(l,e){const a=te(e,["children","$$slots","$$events","$$legacy"]),s=te(a,["name","color","size","strokeWidth","absoluteStrokeWidth","iconNode"]);He(e,!1);let d=T(e,"name",8,void 0),f=T(e,"color",8,"currentColor"),i=T(e,"size",8,24),_=T(e,"strokeWidth",8,2),g=T(e,"absoluteStrokeWidth",8,!1),v=T(e,"iconNode",24,()=>[]);const c=(...o)=>o.filter((k,p,E)=>!!k&&E.indexOf(k)===p).join(" ");pe();var h=Ue();let m;var t=We(h);qe(t,1,v,Be,(o,k)=>{let p=()=>$(k)[0],E=()=>$(k)[1];var b=ge(),A=Oe(b);Ye(A,p,!0,(n,u)=>{let y;j(()=>y=ae(n,y,{...E()},void 0,n.namespaceURI===de,n.nodeName.includes("-")))}),Z(o,b)});var r=Me(t);Ve(r,e,"default",{}),ze(h),j(()=>m=ae(h,m,{...Ge,...s,width:i(),height:i(),stroke:f(),"stroke-width":g()?Number(_())*24/Number(i()):_(),class:c("lucide-icon","lucide",d()?`lucide-${d()}`:"",a.class)},void 0,!0)),Z(l,h),De()}export{$e as I,qe as e,Be as i,Ve as s};
