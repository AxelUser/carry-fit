import{b as G,g as F,ag as ve,W as ae,ah as ce,M as P,ai as pe,ac as J,aj as ge,D as ne,ak as he,al as me,am as _e,an as Ee,h,d as V,ao as we,L as Ne,Z as ie,Y as k,a9 as D,I as b,K as te,ae as Te,P as z,ap as T,aq as oe,O as ue,ar as q,a7 as Y,ab as Ce,X as Ae,a5 as K,H as Se,as as de,at as be,au as ke,E as Ie,av as xe,J as Me,aw as De,ax as Re,p as ye,a as He,s as Oe,c as Fe,f as ze,o as We,r as Le,u as Be,ay as qe}from"./B2PnC1D7.js";import{d as Pe,e as Ve,g as Ye,a as fe,c as Xe}from"./DUudJK6u.js";import{s as Ge}from"./BoL_lct1.js";import{a as B}from"./B3LFz6sM.js";import{B as Je,p as H,r as Ke}from"./HNJnxMU0.js";import{a as se}from"./ICG54a53.js";function Ue(r,a){return a}function Ze(r,a,f){for(var u=[],p=a.length,s,t=a.length,o=0;o<p;o++){let g=a[o];ue(g,()=>{if(s){if(s.pending.delete(g),s.done.add(g),s.pending.size===0){var d=r.outrogroups;X(J(s.done)),d.delete(s),d.size===0&&(r.outrogroups=null)}}else t-=1},!1)}if(t===0){var i=u.length===0&&f!==null;if(i){var v=f,n=v.parentNode;Ce(n),n.append(v),r.items.clear()}X(a,!i)}else s={pending:new Set(a),done:new Set},(r.outrogroups??(r.outrogroups=new Set)).add(s)}function X(r,a=!0){for(var f=0;f<r.length;f++)Ae(r[f],a)}var le;function Qe(r,a,f,u,p,s=null){var t=r,o=new Map,i=(a&de)!==0;if(i){var v=r;t=h?k(K(v)):v.appendChild(z())}h&&V();var n=null,g=ve(()=>{var l=f();return ge(l)?l:l==null?[]:J(l)}),d,c=!0;function w(){e.fallback=n,je(e,d,t,a,u),n!==null&&(d.length===0?(n.f&T)===0?oe(n):(n.f^=T,O(n,null,t)):ue(n,()=>{n=null}))}var C=G(()=>{d=F(g);var l=d.length;let A=!1;if(h){var I=we(t)===Ne;I!==(l===0)&&(t=ie(),k(t),D(!1),A=!0)}for(var E=new Set,x=ce,R=pe(),m=0;m<l;m+=1){h&&b.nodeType===te&&b.data===Te&&(t=b,A=!0,D(!1));var M=d[m],y=u(M,m),_=c?null:o.get(y);_?(_.v&&ae(_.v,M),_.i&&ae(_.i,m),R&&x.skipped_effects.delete(_.e)):(_=$e(o,c?t:le??(le=z()),M,y,m,p,a,f),c||(_.e.f|=T),o.set(y,_)),E.add(y)}if(l===0&&s&&!n&&(c?n=P(()=>s(t)):(n=P(()=>s(le??(le=z()))),n.f|=T)),h&&l>0&&k(ie()),!c)if(R){for(const[W,L]of o)E.has(W)||x.skipped_effects.add(L.e);x.oncommit(w),x.ondiscard(()=>{})}else w();A&&D(!0),F(g)}),e={effect:C,items:o,outrogroups:null,fallback:n};c=!1,h&&(t=b)}function je(r,a,f,u,p){var _,W,L,U,Z,Q,j,$,ee;var s=(u&be)!==0,t=a.length,o=r.items,i=r.effect.first,v,n=null,g,d=[],c=[],w,C,e,l;if(s)for(l=0;l<t;l+=1)w=a[l],C=p(w,l),e=o.get(C).e,(e.f&T)===0&&((W=(_=e.nodes)==null?void 0:_.a)==null||W.measure(),(g??(g=new Set)).add(e));for(l=0;l<t;l+=1){if(w=a[l],C=p(w,l),e=o.get(C).e,r.outrogroups!==null)for(const N of r.outrogroups)N.pending.delete(e),N.done.delete(e);if((e.f&T)!==0)if(e.f^=T,e===i)O(e,null,f);else{var A=n?n.next:i;e===r.effect.last&&(r.effect.last=e.prev),e.prev&&(e.prev.next=e.next),e.next&&(e.next.prev=e.prev),S(r,n,e),S(r,e,A),O(e,A,f),n=e,d=[],c=[],i=n.next;continue}if((e.f&q)!==0&&(oe(e),s&&((U=(L=e.nodes)==null?void 0:L.a)==null||U.unfix(),(g??(g=new Set)).delete(e))),e!==i){if(v!==void 0&&v.has(e)){if(d.length<c.length){var I=c[0],E;n=I.prev;var x=d[0],R=d[d.length-1];for(E=0;E<d.length;E+=1)O(d[E],I,f);for(E=0;E<c.length;E+=1)v.delete(c[E]);S(r,x.prev,R.next),S(r,n,x),S(r,R,I),i=I,n=R,l-=1,d=[],c=[]}else v.delete(e),O(e,i,f),S(r,e.prev,e.next),S(r,e,n===null?r.effect.first:n.next),S(r,n,e),n=e;continue}for(d=[],c=[];i!==null&&i!==e;)(v??(v=new Set)).add(i),c.push(i),i=i.next;if(i===null)continue}(e.f&T)===0&&d.push(e),n=e,i=e.next}if(r.outrogroups!==null){for(const N of r.outrogroups)N.pending.size===0&&(X(J(N.done)),(Z=r.outrogroups)==null||Z.delete(N));r.outrogroups.size===0&&(r.outrogroups=null)}if(i!==null||v!==void 0){var m=[];if(v!==void 0)for(e of v)(e.f&q)===0&&m.push(e);for(;i!==null;)(i.f&q)===0&&i!==r.fallback&&m.push(i),i=i.next;var M=m.length;if(M>0){var y=(u&de)!==0&&t===0?f:null;if(s){for(l=0;l<M;l+=1)(j=(Q=m[l].nodes)==null?void 0:Q.a)==null||j.measure();for(l=0;l<M;l+=1)(ee=($=m[l].nodes)==null?void 0:$.a)==null||ee.fix()}Ze(r,m,y)}}s&&Se(()=>{var N,re;if(g!==void 0)for(e of g)(re=(N=e.nodes)==null?void 0:N.a)==null||re.apply()})}function $e(r,a,f,u,p,s,t,o){var i=(t&_e)!==0?(t&Ee)===0?he(f,!1,!1):ne(f):null,v=(t&me)!==0?ne(p):null;return{v:i,i:v,e:P(()=>(s(a,i??f,v??p,o),()=>{r.delete(u)}))}}function O(r,a,f){if(r.nodes)for(var u=r.nodes.start,p=r.nodes.end,s=a&&(a.f&T)===0?a.nodes.start:f;u!==null;){var t=Y(u);if(s.before(u),u===p)return;u=t}}function S(r,a,f){a===null?r.effect.first=f:a.next=f,f===null?r.effect.last=a:f.prev=a}function er(r,a,f,u,p,s){let t=h;h&&V();var o=null;h&&b.nodeType===ke&&(o=b,V());var i=h?b:r,v=new Je(i,!1);G(()=>{const n=a()||null;var g=f||n==="svg"?xe:null;if(n===null){v.ensure(null,null),B(!0);return}return v.ensure(n,d=>{if(n){if(o=h?o:g?document.createElementNS(g,n):document.createElement(n),Pe(o,o),u){h&&Ve(n)&&o.append(document.createComment(""));var c=h?K(o):o.appendChild(z());h&&(c===null?D(!1):k(c)),u(o,c)}Me.nodes.end=o,d.before(o)}h&&k(d)}),B(!0),()=>{n&&B(!1)}},Ie),De(()=>{B(!0)}),t&&(D(!0),k(i))}function or(r,a){let f=null,u=h;var p;if(h){f=b;for(var s=K(document.head);s!==null&&(s.nodeType!==te||s.data!==r);)s=Y(s);if(s===null)D(!1);else{var t=Y(s);s.remove(),k(t)}}h||(p=document.head.appendChild(z()));try{G(()=>a(p),Re)}finally{u&&(D(!0),k(f))}}/**
 * @license @lucide/svelte v0.561.0 - ISC
 *
 * ISC License
 * 
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 * ---
 * 
 * The MIT License (MIT) (for portions derived from Feather)
 * 
 * Copyright (c) 2013-2023 Cole Bemis
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */const rr={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};var ar=Ye("<svg><!><!></svg>");function ur(r,a){ye(a,!0);const f=H(a,"color",3,"currentColor"),u=H(a,"size",3,24),p=H(a,"strokeWidth",3,2),s=H(a,"absoluteStrokeWidth",3,!1),t=H(a,"iconNode",19,()=>[]),o=Ke(a,["$$slots","$$events","$$legacy","name","color","size","strokeWidth","absoluteStrokeWidth","iconNode","children"]);var i=ar();se(i,g=>({...rr,...o,width:u(),height:u(),stroke:f(),"stroke-width":g,class:["lucide-icon lucide",a.name&&`lucide-${a.name}`,a.class]}),[()=>s()?Number(p())*24/Number(u()):p()]);var v=Fe(i);Qe(v,17,t,Ue,(g,d)=>{var c=Be(()=>qe(F(d),2));let w=()=>F(c)[0],C=()=>F(c)[1];var e=Xe(),l=ze(e);er(l,w,!0,(A,I)=>{se(A,()=>({...C()}))}),fe(g,e)});var n=Oe(v);Ge(n,()=>a.children??We),Le(i),fe(r,i),He()}export{ur as I,er as a,Qe as e,or as h,Ue as i};
