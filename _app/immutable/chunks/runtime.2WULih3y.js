var Bn=Array.isArray,Un=Array.from,Vn=Object.defineProperty,yt=Object.getOwnPropertyDescriptor,sn=Object.getOwnPropertyDescriptors,Gn=Object.prototype,Kn=Array.prototype,ln=Object.getPrototypeOf;function $n(t){return typeof t=="function"}const Zn=()=>{};function zn(t){return t()}function gt(t){for(var n=0;n<t.length;n++)t[n]()}const E=2,At=4,U=8,it=16,g=32,W=64,rt=128,N=256,$=512,h=1024,x=2048,P=4096,q=8192,F=16384,an=32768,xt=65536,un=1<<17,on=1<<19,It=1<<20,Et=Symbol("$state"),Jn=Symbol("legacy props"),Qn=Symbol("");function Rt(t){return t===this.v}function fn(t,n){return t!=t?n==n:t!==n||t!==null&&typeof t=="object"||typeof t=="function"}function St(t){return!fn(t,this.v)}function _n(t){throw new Error("https://svelte.dev/e/effect_in_teardown")}function cn(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function vn(t){throw new Error("https://svelte.dev/e/effect_orphan")}function pn(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function Wn(){throw new Error("https://svelte.dev/e/hydration_failed")}function Xn(t){throw new Error("https://svelte.dev/e/props_invalid_value")}function tr(){throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function nr(){throw new Error("https://svelte.dev/e/state_prototype_fixed")}function hn(){throw new Error("https://svelte.dev/e/state_unsafe_local_read")}function dn(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}let X=!1;function rr(){X=!0}const er=1,sr=2,lr=16,ar=1,ur=2,or=4,ir=8,fr=16,_r=1,cr=2,vr=4,pr=1,hr=2,yn="[",En="[!",wn="]",kt={},dr=Symbol();function ft(t,n){var r={f:0,v:t,reactions:null,equals:Rt,version:0};return r}function yr(t){return Ot(ft(t))}function Tn(t,n=!1){var e;const r=ft(t);return n||(r.equals=St),X&&o!==null&&o.l!==null&&((e=o.l).s??(e.s=[])).push(r),r}function Er(t,n=!1){return Ot(Tn(t,n))}function Ot(t){return i!==null&&i.f&E&&(m===null?Cn([t]):m.push(t)),t}function Nt(t,n){return i!==null&&pt()&&i.f&(E|it)&&(m===null||!m.includes(t))&&dn(),et(t,n)}function et(t,n){return t.equals(n)||(t.v=n,t.version=Jt(),Dt(t,x),pt()&&u!==null&&u.f&h&&!(u.f&g)&&(v!==null&&v.includes(t)?(T(u,x),nt(u)):A===null?bn([t]):A.push(t))),n}function Dt(t,n){var r=t.reactions;if(r!==null)for(var e=pt(),s=r.length,l=0;l<s;l++){var a=r[l],f=a.f;f&x||!e&&a===u||(T(a,n),f&(h|N)&&(f&E?Dt(a,P):nt(a)))}}function Ct(t){console.warn("https://svelte.dev/e/hydration_mismatch")}let k=!1;function wr(t){k=t}let w;function Y(t){if(t===null)throw Ct(),kt;return w=t}function Tr(){return Y(D(w))}function mr(t){if(k){if(D(w)!==null)throw Ct(),kt;w=t}}function gr(t=1){if(k){for(var n=t,r=w;n--;)r=D(r);w=r}}function Ar(){for(var t=0,n=w;;){if(n.nodeType===8){var r=n.data;if(r===wn){if(t===0)return n;t-=1}else(r===yn||r===En)&&(t+=1)}var e=D(n);n.remove(),n=e}}var wt,bt,qt;function xr(){if(wt===void 0){wt=window;var t=Element.prototype,n=Node.prototype;bt=yt(n,"firstChild").get,qt=yt(n,"nextSibling").get,t.__click=void 0,t.__className="",t.__attributes=null,t.__styles=null,t.__e=void 0,Text.prototype.__t=void 0}}function st(t=""){return document.createTextNode(t)}function lt(t){return bt.call(t)}function D(t){return qt.call(t)}function Ir(t,n){if(!k)return lt(t);var r=lt(w);if(r===null)r=w.appendChild(st());else if(n&&r.nodeType!==3){var e=st();return r==null||r.before(e),Y(e),e}return Y(r),r}function Rr(t,n){if(!k){var r=lt(t);return r instanceof Comment&&r.data===""?D(r):r}return w}function Sr(t,n=1,r=!1){let e=k?w:t;for(var s;n--;)s=e,e=D(e);if(!k)return e;var l=e==null?void 0:e.nodeType;if(r&&l!==3){var a=st();return e===null?s==null||s.after(a):e.before(a),Y(a),a}return Y(e),e}function kr(t){t.textContent=""}function mn(t){var n=E|x;u===null?n|=N:u.f|=It;var r=i!==null&&i.f&E?i:null;const e={children:null,ctx:o,deps:null,equals:Rt,f:n,fn:t,reactions:null,v:null,version:0,parent:r??u};return r!==null&&(r.children??(r.children=[])).push(e),e}function Or(t){const n=mn(t);return n.equals=St,n}function Pt(t){var n=t.children;if(n!==null){t.children=null;for(var r=0;r<n.length;r+=1){var e=n[r];e.f&E?_t(e):O(e)}}}function gn(t){for(var n=t.parent;n!==null;){if(!(n.f&E))return n;n=n.parent}return null}function Ft(t){var n,r=u;Q(gn(t));try{Pt(t),n=Qt(t)}finally{Q(r)}return n}function Lt(t){var n=Ft(t),r=(S||t.f&N)&&t.deps!==null?P:h;T(t,r),t.equals(n)||(t.v=n,t.version=Jt())}function _t(t){Pt(t),B(t,0),T(t,F),t.v=t.children=t.deps=t.ctx=t.reactions=null}function Mt(t){u===null&&i===null&&vn(),i!==null&&i.f&N&&cn(),vt&&_n()}function An(t,n){var r=n.last;r===null?n.last=n.first=t:(r.next=t,t.prev=r,n.last=t)}function L(t,n,r,e=!0){var s=(t&W)!==0,l=u,a={ctx:o,deps:null,deriveds:null,nodes_start:null,nodes_end:null,f:t|x,first:null,fn:n,last:null,next:null,parent:s?null:l,prev:null,teardown:null,transitions:null,version:0};if(r){var f=C;try{Tt(!0),V(a),a.f|=an}catch(_){throw O(a),_}finally{Tt(f)}}else n!==null&&nt(a);var p=r&&a.deps===null&&a.first===null&&a.nodes_start===null&&a.teardown===null&&(a.f&It)===0;if(!p&&!s&&e&&(l!==null&&An(a,l),i!==null&&i.f&E)){var d=i;(d.children??(d.children=[])).push(a)}return a}function Nr(t){const n=L(U,null,!1);return T(n,h),n.teardown=t,n}function Dr(t){Mt();var n=u!==null&&(u.f&g)!==0&&o!==null&&!o.m;if(n){var r=o;(r.e??(r.e=[])).push({fn:t,effect:u,reaction:i})}else{var e=Yt(t);return e}}function Cr(t){return Mt(),ct(t)}function br(t){const n=L(W,t,!0);return(r={})=>new Promise(e=>{r.outro?Rn(n,()=>{O(n),e(void 0)}):(O(n),e(void 0))})}function Yt(t){return L(At,t,!1)}function qr(t,n){var r=o,e={effect:null,ran:!1};r.l.r1.push(e),e.effect=ct(()=>{t(),!e.ran&&(e.ran=!0,Nt(r.l.r2,!0),ht(n))})}function Pr(){var t=o;ct(()=>{if(rn(t.l.r2)){for(var n of t.l.r1){var r=n.effect;r.f&h&&T(r,P),M(r)&&V(r),n.ran=!1}t.l.r2.v=!1}})}function ct(t){return L(U,t,!0)}function Fr(t){return xn(t)}function xn(t,n=0){return L(U|it|n,t,!0)}function Lr(t,n=!0){return L(U|g,t,!0,n)}function Ht(t){var n=t.teardown;if(n!==null){const r=vt,e=i;mt(!0),J(null);try{n.call(null)}finally{mt(r),J(e)}}}function jt(t){var n=t.deriveds;if(n!==null){t.deriveds=null;for(var r=0;r<n.length;r+=1)_t(n[r])}}function Bt(t,n=!1){var r=t.first;for(t.first=t.last=null;r!==null;){var e=r.next;O(r,n),r=e}}function In(t){for(var n=t.first;n!==null;){var r=n.next;n.f&g||O(n),n=r}}function O(t,n=!0){var r=!1;if((n||t.f&on)&&t.nodes_start!==null){for(var e=t.nodes_start,s=t.nodes_end;e!==null;){var l=e===s?null:D(e);e.remove(),e=l}r=!0}Bt(t,n&&!r),jt(t),B(t,0),T(t,F);var a=t.transitions;if(a!==null)for(const p of a)p.stop();Ht(t);var f=t.parent;f!==null&&f.first!==null&&Ut(t),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes_start=t.nodes_end=null}function Ut(t){var n=t.parent,r=t.prev,e=t.next;r!==null&&(r.next=e),e!==null&&(e.prev=r),n!==null&&(n.first===t&&(n.first=e),n.last===t&&(n.last=r))}function Rn(t,n){var r=[];Vt(t,r,!0),Sn(r,()=>{O(t),n&&n()})}function Sn(t,n){var r=t.length;if(r>0){var e=()=>--r||n();for(var s of t)s.out(e)}else n()}function Vt(t,n,r){if(!(t.f&q)){if(t.f^=q,t.transitions!==null)for(const a of t.transitions)(a.is_global||r)&&n.push(a);for(var e=t.first;e!==null;){var s=e.next,l=(e.f&xt)!==0||(e.f&g)!==0;Vt(e,n,l?r:!1),e=s}}}function Mr(t){Gt(t,!0)}function Gt(t,n){if(t.f&q){M(t)&&V(t),t.f^=q;for(var r=t.first;r!==null;){var e=r.next,s=(r.f&xt)!==0||(r.f&g)!==0;Gt(r,s?n:!1),r=e}if(t.transitions!==null)for(const l of t.transitions)(l.is_global||n)&&l.in()}}const kn=typeof requestIdleCallback>"u"?t=>setTimeout(t,1):requestIdleCallback;let Z=!1,z=!1,at=[],ut=[];function Kt(){Z=!1;const t=at.slice();at=[],gt(t)}function $t(){z=!1;const t=ut.slice();ut=[],gt(t)}function Yr(t){Z||(Z=!0,queueMicrotask(Kt)),at.push(t)}function Hr(t){z||(z=!0,kn($t)),ut.push(t)}function On(){Z&&Kt(),z&&$t()}function Nn(t){throw new Error("https://svelte.dev/e/lifecycle_outside_component")}const Zt=0,Dn=1;let G=!1,K=Zt,H=!1,j=null,C=!1,vt=!1;function Tt(t){C=t}function mt(t){vt=t}let R=[],b=0;let i=null;function J(t){i=t}let u=null;function Q(t){u=t}let m=null;function Cn(t){m=t}let v=null,y=0,A=null;function bn(t){A=t}let zt=1,S=!1,I=null,o=null;function Jt(){return++zt}function pt(){return!X||o!==null&&o.l===null}function M(t){var a,f;var n=t.f;if(n&x)return!0;if(n&P){var r=t.deps,e=(n&N)!==0;if(r!==null){var s;if(n&$){for(s=0;s<r.length;s++)((a=r[s]).reactions??(a.reactions=[])).push(t);t.f^=$}for(s=0;s<r.length;s++){var l=r[s];if(M(l)&&Lt(l),e&&u!==null&&!S&&!((f=l==null?void 0:l.reactions)!=null&&f.includes(t))&&(l.reactions??(l.reactions=[])).push(t),l.version>t.version)return!0}}(!e||u!==null&&!S)&&T(t,h)}return!1}function qn(t,n){for(var r=n;r!==null;){if(r.f&rt)try{r.fn(t);return}catch{r.f^=rt}r=r.parent}throw G=!1,t}function Pn(t){return(t.f&F)===0&&(t.parent===null||(t.parent.f&rt)===0)}function tt(t,n,r,e){if(G){if(r===null&&(G=!1),Pn(n))throw t;return}r!==null&&(G=!0);{qn(t,n);return}}function Qt(t){var dt;var n=v,r=y,e=A,s=i,l=S,a=m,f=o,p=t.f;v=null,y=0,A=null,i=p&(g|W)?null:t,S=!C&&(p&N)!==0,m=null,o=t.ctx;try{var d=(0,t.fn)(),_=t.deps;if(v!==null){var c;if(B(t,y),_!==null&&y>0)for(_.length=y+v.length,c=0;c<v.length;c++)_[y+c]=v[c];else t.deps=_=v;if(!S)for(c=y;c<_.length;c++)((dt=_[c]).reactions??(dt.reactions=[])).push(t)}else _!==null&&y<_.length&&(B(t,y),_.length=y);return d}finally{v=n,y=r,A=e,i=s,S=l,m=a,o=f}}function Fn(t,n){let r=n.reactions;if(r!==null){var e=r.indexOf(t);if(e!==-1){var s=r.length-1;s===0?r=n.reactions=null:(r[e]=r[s],r.pop())}}r===null&&n.f&E&&(v===null||!v.includes(n))&&(T(n,P),n.f&(N|$)||(n.f^=$),B(n,0))}function B(t,n){var r=t.deps;if(r!==null)for(var e=n;e<r.length;e++)Fn(t,r[e])}function V(t){var n=t.f;if(!(n&F)){T(t,h);var r=u,e=o;u=t;try{n&it?In(t):Bt(t),jt(t),Ht(t);var s=Qt(t);t.teardown=typeof s=="function"?s:null,t.version=zt}catch(l){tt(l,t,r,e||t.ctx)}finally{u=r}}}function Wt(){if(b>1e3){b=0;try{pn()}catch(t){if(j!==null)tt(t,j,null);else throw t}}b++}function Xt(t){var n=t.length;if(n!==0){Wt();var r=C;C=!0;try{for(var e=0;e<n;e++){var s=t[e];s.f&h||(s.f^=h);var l=[];tn(s,l),Ln(l)}}finally{C=r}}}function Ln(t){var n=t.length;if(n!==0)for(var r=0;r<n;r++){var e=t[r];if(!(e.f&(F|q)))try{M(e)&&(V(e),e.deps===null&&e.first===null&&e.nodes_start===null&&(e.teardown===null?Ut(e):e.fn=null))}catch(s){tt(s,e,null,e.ctx)}}}function Mn(){if(H=!1,b>1001)return;const t=R;R=[],Xt(t),H||(b=0,j=null)}function nt(t){K===Zt&&(H||(H=!0,queueMicrotask(Mn))),j=t;for(var n=t;n.parent!==null;){n=n.parent;var r=n.f;if(r&(W|g)){if(!(r&h))return;n.f^=h}}R.push(n)}function tn(t,n){var r=t.first,e=[];t:for(;r!==null;){var s=r.f,l=(s&g)!==0,a=l&&(s&h)!==0,f=r.next;if(!a&&!(s&q))if(s&U){if(l)r.f^=h;else try{M(r)&&V(r)}catch(c){tt(c,r,null,r.ctx)}var p=r.first;if(p!==null){r=p;continue}}else s&At&&e.push(r);if(f===null){let c=r.parent;for(;c!==null;){if(t===c)break t;var d=c.next;if(d!==null){r=d;continue t}c=c.parent}}r=f}for(var _=0;_<e.length;_++)p=e[_],n.push(p),tn(p,n)}function nn(t){var n=K,r=R;try{Wt();const s=[];K=Dn,R=s,H=!1,Xt(r);var e=t==null?void 0:t();return On(),(R.length>0||s.length>0)&&nn(),b=0,j=null,e}finally{K=n,R=r}}async function jr(){await Promise.resolve(),nn()}function rn(t){var _;var n=t.f,r=(n&E)!==0;if(r&&n&F){var e=Ft(t);return _t(t),e}if(I!==null&&I.add(t),i!==null){m!==null&&m.includes(t)&&hn();var s=i.deps;v===null&&s!==null&&s[y]===t?y++:v===null?v=[t]:v.push(t),A!==null&&u!==null&&u.f&h&&!(u.f&g)&&A.includes(t)&&(T(u,x),nt(u))}else if(r&&t.deps===null)for(var l=t,a=l.parent,f=l;a!==null;)if(a.f&E){var p=a;f=p,a=p.parent}else{var d=a;(_=d.deriveds)!=null&&_.includes(f)||(d.deriveds??(d.deriveds=[])).push(f);break}return r&&(l=t,M(l)&&Lt(l)),t.v}function Yn(t){var n=I;I=new Set;var r=I,e;try{if(ht(t),n!==null)for(e of I)n.add(e)}finally{I=n}return r}function Br(t){var n=Yn(()=>ht(t));for(var r of n)if(r.f&un)for(const e of r.deps||[])e.f&E||et(e,e.v);else et(r,r.v)}function ht(t){const n=i;try{return i=null,t()}finally{i=n}}const Hn=~(x|P|h);function T(t,n){t.f=t.f&Hn|n}function Ur(t){return en().get(t)}function Vr(t,n){return en().set(t,n),n}function en(t){return o===null&&Nn(),o.c??(o.c=new Map(jn(o)||void 0))}function jn(t){let n=t.p;for(;n!==null;){const r=n.c;if(r!==null)return r;n=n.p}return null}function Gr(t,n=1){var r=rn(t),e=n===1?r++:r--;return Nt(t,r),e}function Kr(t,n=!1,r){o={p:o,c:null,e:null,m:!1,s:t,x:null,l:null},X&&!n&&(o.l={s:null,u:null,r1:[],r2:ft(!1)})}function $r(t){const n=o;if(n!==null){const a=n.e;if(a!==null){var r=u,e=i;n.e=null;try{for(var s=0;s<a.length;s++){var l=a[s];Q(l.effect),J(l.reaction),Yt(l.fn)}}finally{Q(r),J(e)}}o=n.p,n.m=!0}return{}}function Zr(t){if(!(typeof t!="object"||!t||t instanceof EventTarget)){if(Et in t)ot(t);else if(!Array.isArray(t))for(let n in t){const r=t[n];typeof r=="object"&&r&&Et in r&&ot(r)}}}function ot(t,n=new Set){if(typeof t=="object"&&t!==null&&!(t instanceof EventTarget)&&!n.has(t)){n.add(t),t instanceof Date&&t.getTime();for(let e in t)try{ot(t[e],n)}catch{}const r=ln(t);if(r!==Object.prototype&&r!==Array.prototype&&r!==Map.prototype&&r!==Set.prototype&&r!==Date.prototype){const e=sn(r);for(let s in e){const l=e[s].get;if(l)try{l.call(t)}catch{}}}}}export{Nr as $,w as A,st as B,lt as C,u as D,xt as E,hr as F,Tr as G,Y as H,Gn as I,Kn as J,ft as K,tr as L,Nt as M,yt as N,nr as O,ln as P,En as Q,Ar as R,Et as S,pr as T,dr as U,wr as V,Mr as W,Rn as X,Yt as Y,ct as Z,Yr as _,$r as a,Tn as a0,Xn as a1,un as a2,or as a3,St as a4,Gr as a5,g as a6,W as a7,Q as a8,ar as a9,Sn as aA,sr as aB,er as aC,lr as aD,Hr as aE,Qn as aF,sn as aG,it as aH,an as aI,_r as aJ,cr as aK,vr as aL,pt as aM,Vr as aN,Ur as aO,qr as aP,Pr as aQ,Er as aR,Br as aS,gr as aT,ur as aa,ir as ab,Jn as ac,Or as ad,fr as ae,I as af,$n as ag,J as ah,i as ai,Vn as aj,xr as ak,yn as al,D as am,kt as an,wn as ao,Ct as ap,Wn as aq,kr as ar,Un as as,br as at,nn as au,jr as av,yr as aw,q as ax,et as ay,Vt as az,mr as b,Ir as c,Sr as d,Dr as e,Rr as f,o as g,ht as h,zn as i,rn as j,Zr as k,mn as l,rr as m,Zn as n,Nn as o,Kr as p,X as q,gt as r,fn as s,Fr as t,Cr as u,Bn as v,xn as w,Lr as x,O as y,k as z};
