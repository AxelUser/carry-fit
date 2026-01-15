import{d as ue,e as de,g as ce,a as $,c as ve}from"./DC30rE5r.js";import{b as fe,k as z,ae as he,V as ee,af as pe,L as y,ag as ge,aa as P,ah as _e,C as re,ai as me,aj as Ee,ak as we,al as Ne,h as g,d as Y,am as Te,K as ke,Y as ae,X as O,a7 as W,H as x,J as Ce,ac as Se,O as V,an as T,ao as se,N as le,ap as q,a5 as Ae,a9 as be,W as Ie,a3 as te,G as xe,aq as oe,ar as Me,as as Re,E as Oe,at as De,I as He,au as ze,p as We,a as Fe,s as Le,c as Be,f as Ve,n as qe,r as ye,m as Ye,av as Ge}from"./D7cORtR5.js";import{s as Pe}from"./B1W9aZ16.js";import{a as B}from"./BROXB3tJ.js";import{B as Xe,p as D,r as Je}from"./BWNwOxCu.js";import{a as ne}from"./cmOkna72.js";function Ke(r,a){return a}function Ue(r,a,s){for(var c=[],p=a.length,o,t=a.length,l=0;l<p;l++){let h=a[l];le(h,()=>{if(o){if(o.pending.delete(h),o.done.add(h),o.pending.size===0){var u=r.outrogroups;G(P(o.done)),u.delete(o),u.size===0&&(r.outrogroups=null)}}else t-=1},!1)}if(t===0){var i=c.length===0&&s!==null;if(i){var d=s,n=d.parentNode;be(n),n.append(d),r.items.clear()}G(a,!i)}else o={pending:new Set(a),done:new Set},(r.outrogroups??(r.outrogroups=new Set)).add(o)}function G(r,a=!0){for(var s=0;s<r.length;s++)Ie(r[s],a)}var ie;function Qe(r,a,s,c,p,o=null){var t=r,l=new Map,i=(a&oe)!==0;if(i){var d=r;t=g?O(te(d)):d.appendChild(V())}g&&Y();var n=null,h=he(()=>{var f=s();return _e(f)?f:f==null?[]:P(f)}),u,v=!0;function w(){e.fallback=n,Ze(e,u,t,a,c),n!==null&&(u.length===0?(n.f&T)===0?se(n):(n.f^=T,H(n,null,t)):le(n,()=>{n=null}))}var k=fe(()=>{u=z(h);var f=u.length;let C=!1;if(g){var A=Te(t)===ke;A!==(f===0)&&(t=ae(),O(t),W(!1),C=!0)}for(var E=new Set,b=pe,M=ge(),_=0;_<f;_+=1){g&&x.nodeType===Ce&&x.data===Se&&(t=x,C=!0,W(!1));var I=u[_],R=c(I,_),m=v?null:l.get(R);m?(m.v&&ee(m.v,I),m.i&&ee(m.i,_),M&&b.skipped_effects.delete(m.e)):(m=je(l,v?t:ie??(ie=V()),I,R,_,p,a,s),v||(m.e.f|=T),l.set(R,m)),E.add(R)}if(f===0&&o&&!n&&(v?n=y(()=>o(t)):(n=y(()=>o(ie??(ie=V()))),n.f|=T)),g&&f>0&&O(ae()),!v)if(M){for(const[F,L]of l)E.has(F)||b.skipped_effects.add(L.e);b.oncommit(w),b.ondiscard(()=>{})}else w();C&&W(!0),z(h)}),e={effect:k,items:l,outrogroups:null,fallback:n};v=!1,g&&(t=x)}function Ze(r,a,s,c,p){var m,F,L,X,J,K,U,Q,Z;var o=(c&Me)!==0,t=a.length,l=r.items,i=r.effect.first,d,n=null,h,u=[],v=[],w,k,e,f;if(o)for(f=0;f<t;f+=1)w=a[f],k=p(w,f),e=l.get(k).e,(e.f&T)===0&&((F=(m=e.nodes)==null?void 0:m.a)==null||F.measure(),(h??(h=new Set)).add(e));for(f=0;f<t;f+=1){if(w=a[f],k=p(w,f),e=l.get(k).e,r.outrogroups!==null)for(const N of r.outrogroups)N.pending.delete(e),N.done.delete(e);if((e.f&T)!==0)if(e.f^=T,e===i)H(e,null,s);else{var C=n?n.next:i;e===r.effect.last&&(r.effect.last=e.prev),e.prev&&(e.prev.next=e.next),e.next&&(e.next.prev=e.prev),S(r,n,e),S(r,e,C),H(e,C,s),n=e,u=[],v=[],i=n.next;continue}if((e.f&q)!==0&&(se(e),o&&((X=(L=e.nodes)==null?void 0:L.a)==null||X.unfix(),(h??(h=new Set)).delete(e))),e!==i){if(d!==void 0&&d.has(e)){if(u.length<v.length){var A=v[0],E;n=A.prev;var b=u[0],M=u[u.length-1];for(E=0;E<u.length;E+=1)H(u[E],A,s);for(E=0;E<v.length;E+=1)d.delete(v[E]);S(r,b.prev,M.next),S(r,n,b),S(r,M,A),i=A,n=M,f-=1,u=[],v=[]}else d.delete(e),H(e,i,s),S(r,e.prev,e.next),S(r,e,n===null?r.effect.first:n.next),S(r,n,e),n=e;continue}for(u=[],v=[];i!==null&&i!==e;)(d??(d=new Set)).add(i),v.push(i),i=i.next;if(i===null)continue}(e.f&T)===0&&u.push(e),n=e,i=e.next}if(r.outrogroups!==null){for(const N of r.outrogroups)N.pending.size===0&&(G(P(N.done)),(J=r.outrogroups)==null||J.delete(N));r.outrogroups.size===0&&(r.outrogroups=null)}if(i!==null||d!==void 0){var _=[];if(d!==void 0)for(e of d)(e.f&q)===0&&_.push(e);for(;i!==null;)(i.f&q)===0&&i!==r.fallback&&_.push(i),i=i.next;var I=_.length;if(I>0){var R=(c&oe)!==0&&t===0?s:null;if(o){for(f=0;f<I;f+=1)(U=(K=_[f].nodes)==null?void 0:K.a)==null||U.measure();for(f=0;f<I;f+=1)(Z=(Q=_[f].nodes)==null?void 0:Q.a)==null||Z.fix()}Ue(r,_,R)}}o&&xe(()=>{var N,j;if(h!==void 0)for(e of h)(j=(N=e.nodes)==null?void 0:N.a)==null||j.apply()})}function je(r,a,s,c,p,o,t,l){var i=(t&we)!==0?(t&Ne)===0?me(s,!1,!1):re(s):null,d=(t&Ee)!==0?re(p):null;return{v:i,i:d,e:y(()=>(o(a,i??s,d??p,l),()=>{r.delete(c)}))}}function H(r,a,s){if(r.nodes)for(var c=r.nodes.start,p=r.nodes.end,o=a&&(a.f&T)===0?a.nodes.start:s;c!==null;){var t=Ae(c);if(o.before(c),c===p)return;c=t}}function S(r,a,s){a===null?r.effect.first=s:a.next=s,s===null?r.effect.last=a:s.prev=a}function $e(r,a,s,c,p,o){let t=g;g&&Y();var l=null;g&&x.nodeType===Re&&(l=x,Y());var i=g?x:r,d=new Xe(i,!1);fe(()=>{const n=a()||null;var h=s||n==="svg"?De:null;if(n===null){d.ensure(null,null),B(!0);return}return d.ensure(n,u=>{if(n){if(l=g?l:h?document.createElementNS(h,n):document.createElement(n),ue(l,l),c){g&&de(n)&&l.append(document.createComment(""));var v=g?te(l):l.appendChild(V());g&&(v===null?W(!1):O(v)),c(l,v)}He.nodes.end=l,u.before(l)}g&&O(u)}),B(!0),()=>{n&&B(!1)}},Oe),ze(()=>{B(!0)}),t&&(W(!0),O(i))}/**
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
 */const er={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};var rr=ce("<svg><!><!></svg>");function tr(r,a){We(a,!0);const s=D(a,"color",3,"currentColor"),c=D(a,"size",3,24),p=D(a,"strokeWidth",3,2),o=D(a,"absoluteStrokeWidth",3,!1),t=D(a,"iconNode",19,()=>[]),l=Je(a,["$$slots","$$events","$$legacy","name","color","size","strokeWidth","absoluteStrokeWidth","iconNode","children"]);var i=rr();ne(i,h=>({...er,...l,width:c(),height:c(),stroke:s(),"stroke-width":h,class:["lucide-icon lucide",a.name&&`lucide-${a.name}`,a.class]}),[()=>o()?Number(p())*24/Number(c()):p()]);var d=Be(i);Qe(d,17,t,Ke,(h,u)=>{var v=Ye(()=>Ge(z(u),2));let w=()=>z(v)[0],k=()=>z(v)[1];var e=ve(),f=Ve(e);$e(f,w,!0,(C,A)=>{ne(C,()=>({...k()}))}),$(h,e)});var n=Le(d);Pe(n,()=>a.children??qe),ye(i),$(r,i),Fe()}export{tr as I,$e as a,Qe as e,Ke as i};
