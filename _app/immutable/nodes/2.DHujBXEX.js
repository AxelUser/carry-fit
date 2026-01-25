import{c as N,a as c,f as g}from"../chunks/DUudJK6u.js";import{p as k,a as B,f as h,o as P,t as y,c as r,s as v,g as A,u as C,n as D,r as e}from"../chunks/B2PnC1D7.js";import{s as w}from"../chunks/B3LFz6sM.js";import{s as S,B as F}from"../chunks/D6IVid1e.js";import{s as H,r as M,i as j}from"../chunks/HNJnxMU0.js";import{l as q,b as z}from"../chunks/DIr49d-k.js";import{p as o}from"../chunks/BaRHWX8z.js";import{S as E}from"../chunks/BqyMY2BI.js";import{I as G}from"../chunks/DVpTOSyH.js";function J(f,a){k(a,!0);/**
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
 */let i=M(a,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"m12 19-7-7 7-7"}],["path",{d:"M19 12H5"}]];G(f,H({name:"arrow-left"},()=>i,{get iconNode(){return n},children:(d,u)=>{var s=N(),l=h(s);S(l,()=>a.children??P),c(d,s)},$$slots:{default:!0}})),B()}var K=g("<!> <span>Back to CarryFit</span>",1),O=g('<p class="text-foreground text-sm"> </p>'),Q=g('<!> <div class="min-h-screen px-2 py-8 sm:px-4"><div class="mx-auto max-w-3xl"><!> <div class="ring-primary rounded-xl p-6 shadow-xl ring-1"><h1 class="text-primary mb-8 bg-clip-text pb-1 text-3xl font-bold sm:text-4xl"> </h1> <div class="max-w-none space-y-8"><!> <!></div></div></div></div>',1);function rt(f,a){k(a,!0);var i=Q(),n=h(i);{let t=C(()=>`${z}${o.url.pathname}`);E(n,{get title(){return o.data.title},get url(){return A(t)}})}var d=v(n,2),u=r(d),s=r(u);F(s,{get href(){return q.home},variant:"default",class:"mb-4",children:(t,p)=>{var m=K(),x=h(m);J(x,{class:"h-4 w-4"}),D(2),c(t,m)},$$slots:{default:!0}});var l=v(s,2),_=r(l),U=r(_,!0);e(_);var $=v(_,2),b=r($);{var I=t=>{var p=O(),m=r(p);e(p),y(x=>w(m,`Last updated: ${x??""}`),[()=>o.data.lastUpdated.toLocaleDateString()]),c(t,p)};j(b,t=>{o.data.lastUpdated&&t(I)})}var L=v(b,2);S(L,()=>a.children),e($),e(l),e(u),e(d),y(()=>w(U,o.data.title)),c(f,i),B()}export{rt as component};
