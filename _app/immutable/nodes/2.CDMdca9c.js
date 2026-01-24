import{c as N,a as p,f as _}from"../chunks/DC30rE5r.js";import{p as y,a as w,f as k,n as P,t as $,c as r,j as U,s as x,r as s}from"../chunks/D7cORtR5.js";import{s as b}from"../chunks/BROXB3tJ.js";import{s as B,B as j}from"../chunks/B1W9aZ16.js";import{s as A,r as C,i as D}from"../chunks/BWNwOxCu.js";import{l as F}from"../chunks/BzcROYLl.js";import{p as u}from"../chunks/Da_r-QN4.js";import{I as H}from"../chunks/BJ5jKjWc.js";function M(m,a){y(a,!0);/**
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
 */let e=C(a,["$$slots","$$events","$$legacy"]);const i=[["path",{d:"m12 19-7-7 7-7"}],["path",{d:"M19 12H5"}]];H(m,A({name:"arrow-left"},()=>e,{get iconNode(){return i},children:(n,v)=>{var t=N(),c=k(t);B(c,()=>a.children??P),p(n,t)},$$slots:{default:!0}})),w()}var S=_("<!> <span>Back to CarryFit</span>",1),q=_('<p class="text-foreground text-sm"> </p>'),z=_('<div class="min-h-screen px-2 py-8 sm:px-4"><div class="mx-auto max-w-3xl"><!> <div class="ring-primary rounded-xl p-6 shadow-xl ring-1"><h1 class="text-primary mb-8 bg-clip-text pb-1 text-3xl font-bold sm:text-4xl"> </h1> <div class="max-w-none space-y-8"><!> <!></div></div></div></div>');function V(m,a){y(a,!0);var e=z(),i=r(e),n=r(i);j(n,{get href(){return F.home},variant:"default",class:"mb-4",children:(o,d)=>{var l=S(),f=k(l);M(f,{class:"h-4 w-4"}),U(2),p(o,l)},$$slots:{default:!0}});var v=x(n,2),t=r(v),c=r(t,!0);s(t);var h=x(t,2),g=r(h);{var I=o=>{var d=q(),l=r(d);s(d),$(f=>b(l,`Last updated: ${f??""}`),[()=>u.data.lastUpdated.toLocaleDateString()]),p(o,d)};D(g,o=>{u.data.lastUpdated&&o(I)})}var L=x(g,2);B(L,()=>a.children),s(h),s(v),s(i),s(e),$(()=>b(c,u.data.title)),p(m,e),w()}export{V as component};
