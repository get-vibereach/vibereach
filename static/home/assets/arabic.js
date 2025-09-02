var si=Object.defineProperty;var ri=(e,t,n)=>t in e?si(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var E=(e,t,n)=>ri(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();var vn=!1,wn=!1,be=[],yn=-1;function ai(e){ii(e)}function ii(e){be.includes(e)||be.push(e),li()}function oi(e){let t=be.indexOf(e);t!==-1&&t>yn&&be.splice(t,1)}function li(){!wn&&!vn&&(vn=!0,queueMicrotask(ci))}function ci(){vn=!1,wn=!0;for(let e=0;e<be.length;e++)be[e](),yn=e;be.length=0,yn=-1,wn=!1}var Ne,Se,De,xr,_n=!0;function di(e){_n=!1,e(),_n=!0}function ui(e){Ne=e.reactive,De=e.release,Se=t=>e.effect(t,{scheduler:n=>{_n?ai(n):n()}}),xr=e.raw}function Hs(e){Se=e}function pi(e){let t=()=>{};return[s=>{let r=Se(s);return e._x_effects||(e._x_effects=new Set,e._x_runEffects=()=>{e._x_effects.forEach(a=>a())}),e._x_effects.add(r),t=()=>{r!==void 0&&(e._x_effects.delete(r),De(r))},r},()=>{t()}]}function br(e,t){let n=!0,s,r=Se(()=>{let a=e();JSON.stringify(a),n?s=a:queueMicrotask(()=>{t(a,s),s=a}),n=!1});return()=>De(r)}var vr=[],wr=[],yr=[];function fi(e){yr.push(e)}function Fn(e,t){typeof t=="function"?(e._x_cleanups||(e._x_cleanups=[]),e._x_cleanups.push(t)):(t=e,wr.push(t))}function _r(e){vr.push(e)}function kr(e,t,n){e._x_attributeCleanups||(e._x_attributeCleanups={}),e._x_attributeCleanups[t]||(e._x_attributeCleanups[t]=[]),e._x_attributeCleanups[t].push(n)}function Sr(e,t){e._x_attributeCleanups&&Object.entries(e._x_attributeCleanups).forEach(([n,s])=>{(t===void 0||t.includes(n))&&(s.forEach(r=>r()),delete e._x_attributeCleanups[n])})}function mi(e){var t,n;for((t=e._x_effects)==null||t.forEach(oi);(n=e._x_cleanups)!=null&&n.length;)e._x_cleanups.pop()()}var Hn=new MutationObserver(Wn),Un=!1;function qn(){Hn.observe(document,{subtree:!0,childList:!0,attributes:!0,attributeOldValue:!0}),Un=!0}function Er(){hi(),Hn.disconnect(),Un=!1}var qe=[];function hi(){let e=Hn.takeRecords();qe.push(()=>e.length>0&&Wn(e));let t=qe.length;queueMicrotask(()=>{if(qe.length===t)for(;qe.length>0;)qe.shift()()})}function R(e){if(!Un)return e();Er();let t=e();return qn(),t}var Gn=!1,Ct=[];function gi(){Gn=!0}function xi(){Gn=!1,Wn(Ct),Ct=[]}function Wn(e){if(Gn){Ct=Ct.concat(e);return}let t=[],n=new Set,s=new Map,r=new Map;for(let a=0;a<e.length;a++)if(!e[a].target._x_ignoreMutationObserver&&(e[a].type==="childList"&&(e[a].removedNodes.forEach(i=>{i.nodeType===1&&i._x_marker&&n.add(i)}),e[a].addedNodes.forEach(i=>{if(i.nodeType===1){if(n.has(i)){n.delete(i);return}i._x_marker||t.push(i)}})),e[a].type==="attributes")){let i=e[a].target,o=e[a].attributeName,l=e[a].oldValue,c=()=>{s.has(i)||s.set(i,[]),s.get(i).push({name:o,value:i.getAttribute(o)})},u=()=>{r.has(i)||r.set(i,[]),r.get(i).push(o)};i.hasAttribute(o)&&l===null?c():i.hasAttribute(o)?(u(),c()):u()}r.forEach((a,i)=>{Sr(i,a)}),s.forEach((a,i)=>{vr.forEach(o=>o(i,a))});for(let a of n)t.some(i=>i.contains(a))||wr.forEach(i=>i(a));for(let a of t)a.isConnected&&yr.forEach(i=>i(a));t=null,n=null,s=null,r=null}function Tr(e){return it(Me(e))}function at(e,t,n){return e._x_dataStack=[t,...Me(n||e)],()=>{e._x_dataStack=e._x_dataStack.filter(s=>s!==t)}}function Me(e){return e._x_dataStack?e._x_dataStack:typeof ShadowRoot=="function"&&e instanceof ShadowRoot?Me(e.host):e.parentNode?Me(e.parentNode):[]}function it(e){return new Proxy({objects:e},bi)}var bi={ownKeys({objects:e}){return Array.from(new Set(e.flatMap(t=>Object.keys(t))))},has({objects:e},t){return t==Symbol.unscopables?!1:e.some(n=>Object.prototype.hasOwnProperty.call(n,t)||Reflect.has(n,t))},get({objects:e},t,n){return t=="toJSON"?vi:Reflect.get(e.find(s=>Reflect.has(s,t))||{},t,n)},set({objects:e},t,n,s){const r=e.find(i=>Object.prototype.hasOwnProperty.call(i,t))||e[e.length-1],a=Object.getOwnPropertyDescriptor(r,t);return a!=null&&a.set&&(a!=null&&a.get)?a.set.call(s,n)||!0:Reflect.set(r,t,n)}};function vi(){return Reflect.ownKeys(this).reduce((t,n)=>(t[n]=Reflect.get(this,n),t),{})}function Ar(e){let t=s=>typeof s=="object"&&!Array.isArray(s)&&s!==null,n=(s,r="")=>{Object.entries(Object.getOwnPropertyDescriptors(s)).forEach(([a,{value:i,enumerable:o}])=>{if(o===!1||i===void 0||typeof i=="object"&&i!==null&&i.__v_skip)return;let l=r===""?a:`${r}.${a}`;typeof i=="object"&&i!==null&&i._x_interceptor?s[a]=i.initialize(e,l,a):t(i)&&i!==s&&!(i instanceof Element)&&n(i,l)})};return n(e)}function Cr(e,t=()=>{}){let n={initialValue:void 0,_x_interceptor:!0,initialize(s,r,a){return e(this.initialValue,()=>wi(s,r),i=>kn(s,r,i),r,a)}};return t(n),s=>{if(typeof s=="object"&&s!==null&&s._x_interceptor){let r=n.initialize.bind(n);n.initialize=(a,i,o)=>{let l=s.initialize(a,i,o);return n.initialValue=l,r(a,i,o)}}else n.initialValue=s;return n}}function wi(e,t){return t.split(".").reduce((n,s)=>n[s],e)}function kn(e,t,n){if(typeof t=="string"&&(t=t.split(".")),t.length===1)e[t[0]]=n;else{if(t.length===0)throw error;return e[t[0]]||(e[t[0]]={}),kn(e[t[0]],t.slice(1),n)}}var Lr={};function Q(e,t){Lr[e]=t}function Sn(e,t){let n=yi(t);return Object.entries(Lr).forEach(([s,r])=>{Object.defineProperty(e,`$${s}`,{get(){return r(t,n)},enumerable:!1})}),e}function yi(e){let[t,n]=Nr(e),s={interceptor:Cr,...t};return Fn(e,n),s}function _i(e,t,n,...s){try{return n(...s)}catch(r){rt(r,e,t)}}function rt(e,t,n=void 0){e=Object.assign(e??{message:"No error message given."},{el:t,expression:n}),console.warn(`Alpine Expression Error: ${e.message}

${n?'Expression: "'+n+`"

`:""}`,t),setTimeout(()=>{throw e},0)}var St=!0;function Rr(e){let t=St;St=!1;let n=e();return St=t,n}function ve(e,t,n={}){let s;return U(e,t)(r=>s=r,n),s}function U(...e){return Ir(...e)}var Ir=Or;function ki(e){Ir=e}function Or(e,t){let n={};Sn(n,e);let s=[n,...Me(e)],r=typeof t=="function"?Si(s,t):Ti(s,t,e);return _i.bind(null,e,t,r)}function Si(e,t){return(n=()=>{},{scope:s={},params:r=[]}={})=>{let a=t.apply(it([s,...e]),r);Lt(n,a)}}var ln={};function Ei(e,t){if(ln[e])return ln[e];let n=Object.getPrototypeOf(async function(){}).constructor,s=/^[\n\s]*if.*\(.*\)/.test(e.trim())||/^(let|const)\s/.test(e.trim())?`(async()=>{ ${e} })()`:e,a=(()=>{try{let i=new n(["__self","scope"],`with (scope) { __self.result = ${s} }; __self.finished = true; return __self.result;`);return Object.defineProperty(i,"name",{value:`[Alpine] ${e}`}),i}catch(i){return rt(i,t,e),Promise.resolve()}})();return ln[e]=a,a}function Ti(e,t,n){let s=Ei(t,n);return(r=()=>{},{scope:a={},params:i=[]}={})=>{s.result=void 0,s.finished=!1;let o=it([a,...e]);if(typeof s=="function"){let l=s(s,o).catch(c=>rt(c,n,t));s.finished?(Lt(r,s.result,o,i,n),s.result=void 0):l.then(c=>{Lt(r,c,o,i,n)}).catch(c=>rt(c,n,t)).finally(()=>s.result=void 0)}}}function Lt(e,t,n,s,r){if(St&&typeof t=="function"){let a=t.apply(n,s);a instanceof Promise?a.then(i=>Lt(e,i,n,s)).catch(i=>rt(i,r,t)):e(a)}else typeof t=="object"&&t instanceof Promise?t.then(a=>e(a)):e(t)}var Vn="x-";function Be(e=""){return Vn+e}function Ai(e){Vn=e}var Rt={};function M(e,t){return Rt[e]=t,{before(n){if(!Rt[n]){console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);return}const s=xe.indexOf(n);xe.splice(s>=0?s:xe.indexOf("DEFAULT"),0,e)}}}function Ci(e){return Object.keys(Rt).includes(e)}function Yn(e,t,n){if(t=Array.from(t),e._x_virtualDirectives){let a=Object.entries(e._x_virtualDirectives).map(([o,l])=>({name:o,value:l})),i=Mr(a);a=a.map(o=>i.find(l=>l.name===o.name)?{name:`x-bind:${o.name}`,value:`"${o.value}"`}:o),t=t.concat(a)}let s={};return t.map(zr((a,i)=>s[a]=i)).filter(jr).map(Ii(s,n)).sort(Oi).map(a=>Ri(e,a))}function Mr(e){return Array.from(e).map(zr()).filter(t=>!jr(t))}var En=!1,et=new Map,Pr=Symbol();function Li(e){En=!0;let t=Symbol();Pr=t,et.set(t,[]);let n=()=>{for(;et.get(t).length;)et.get(t).shift()();et.delete(t)},s=()=>{En=!1,n()};e(n),s()}function Nr(e){let t=[],n=o=>t.push(o),[s,r]=pi(e);return t.push(r),[{Alpine:ot,effect:s,cleanup:n,evaluateLater:U.bind(U,e),evaluate:ve.bind(ve,e)},()=>t.forEach(o=>o())]}function Ri(e,t){let n=()=>{},s=Rt[t.type]||n,[r,a]=Nr(e);kr(e,t.original,a);let i=()=>{e._x_ignore||e._x_ignoreSelf||(s.inline&&s.inline(e,t,r),s=s.bind(s,e,t,r),En?et.get(Pr).push(s):s())};return i.runCleanups=a,i}var Dr=(e,t)=>({name:n,value:s})=>(n.startsWith(e)&&(n=n.replace(e,t)),{name:n,value:s}),Br=e=>e;function zr(e=()=>{}){return({name:t,value:n})=>{let{name:s,value:r}=$r.reduce((a,i)=>i(a),{name:t,value:n});return s!==t&&e(s,t),{name:s,value:r}}}var $r=[];function Kn(e){$r.push(e)}function jr({name:e}){return Fr().test(e)}var Fr=()=>new RegExp(`^${Vn}([^:^.]+)\\b`);function Ii(e,t){return({name:n,value:s})=>{let r=n.match(Fr()),a=n.match(/:([a-zA-Z0-9\-_:]+)/),i=n.match(/\.[^.\]]+(?=[^\]]*$)/g)||[],o=t||e[n]||n;return{type:r?r[1]:null,value:a?a[1]:null,modifiers:i.map(l=>l.replace(".","")),expression:s,original:o}}}var Tn="DEFAULT",xe=["ignore","ref","data","id","anchor","bind","init","for","model","modelable","transition","show","if",Tn,"teleport"];function Oi(e,t){let n=xe.indexOf(e.type)===-1?Tn:e.type,s=xe.indexOf(t.type)===-1?Tn:t.type;return xe.indexOf(n)-xe.indexOf(s)}function tt(e,t,n={}){e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0,cancelable:!0}))}function _e(e,t){if(typeof ShadowRoot=="function"&&e instanceof ShadowRoot){Array.from(e.children).forEach(r=>_e(r,t));return}let n=!1;if(t(e,()=>n=!0),n)return;let s=e.firstElementChild;for(;s;)_e(s,t),s=s.nextElementSibling}function K(e,...t){console.warn(`Alpine Warning: ${e}`,...t)}var Us=!1;function Mi(){Us&&K("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."),Us=!0,document.body||K("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"),tt(document,"alpine:init"),tt(document,"alpine:initializing"),qn(),fi(t=>de(t,_e)),Fn(t=>$e(t)),_r((t,n)=>{Yn(t,n).forEach(s=>s())});let e=t=>!Nt(t.parentElement,!0);Array.from(document.querySelectorAll(qr().join(","))).filter(e).forEach(t=>{de(t)}),tt(document,"alpine:initialized"),setTimeout(()=>{Bi()})}var Zn=[],Hr=[];function Ur(){return Zn.map(e=>e())}function qr(){return Zn.concat(Hr).map(e=>e())}function Gr(e){Zn.push(e)}function Wr(e){Hr.push(e)}function Nt(e,t=!1){return ze(e,n=>{if((t?qr():Ur()).some(r=>n.matches(r)))return!0})}function ze(e,t){if(e){if(t(e))return e;if(e._x_teleportBack&&(e=e._x_teleportBack),!!e.parentElement)return ze(e.parentElement,t)}}function Pi(e){return Ur().some(t=>e.matches(t))}var Vr=[];function Ni(e){Vr.push(e)}var Di=1;function de(e,t=_e,n=()=>{}){ze(e,s=>s._x_ignore)||Li(()=>{t(e,(s,r)=>{s._x_marker||(n(s,r),Vr.forEach(a=>a(s,r)),Yn(s,s.attributes).forEach(a=>a()),s._x_ignore||(s._x_marker=Di++),s._x_ignore&&r())})})}function $e(e,t=_e){t(e,n=>{mi(n),Sr(n),delete n._x_marker})}function Bi(){[["ui","dialog",["[x-dialog], [x-popover]"]],["anchor","anchor",["[x-anchor]"]],["sort","sort",["[x-sort]"]]].forEach(([t,n,s])=>{Ci(n)||s.some(r=>{if(document.querySelector(r))return K(`found "${r}", but missing ${t} plugin`),!0})})}var An=[],Xn=!1;function Jn(e=()=>{}){return queueMicrotask(()=>{Xn||setTimeout(()=>{Cn()})}),new Promise(t=>{An.push(()=>{e(),t()})})}function Cn(){for(Xn=!1;An.length;)An.shift()()}function zi(){Xn=!0}function Qn(e,t){return Array.isArray(t)?qs(e,t.join(" ")):typeof t=="object"&&t!==null?$i(e,t):typeof t=="function"?Qn(e,t()):qs(e,t)}function qs(e,t){let n=r=>r.split(" ").filter(a=>!e.classList.contains(a)).filter(Boolean),s=r=>(e.classList.add(...r),()=>{e.classList.remove(...r)});return t=t===!0?t="":t||"",s(n(t))}function $i(e,t){let n=o=>o.split(" ").filter(Boolean),s=Object.entries(t).flatMap(([o,l])=>l?n(o):!1).filter(Boolean),r=Object.entries(t).flatMap(([o,l])=>l?!1:n(o)).filter(Boolean),a=[],i=[];return r.forEach(o=>{e.classList.contains(o)&&(e.classList.remove(o),i.push(o))}),s.forEach(o=>{e.classList.contains(o)||(e.classList.add(o),a.push(o))}),()=>{i.forEach(o=>e.classList.add(o)),a.forEach(o=>e.classList.remove(o))}}function Dt(e,t){return typeof t=="object"&&t!==null?ji(e,t):Fi(e,t)}function ji(e,t){let n={};return Object.entries(t).forEach(([s,r])=>{n[s]=e.style[s],s.startsWith("--")||(s=Hi(s)),e.style.setProperty(s,r)}),setTimeout(()=>{e.style.length===0&&e.removeAttribute("style")}),()=>{Dt(e,n)}}function Fi(e,t){let n=e.getAttribute("style",t);return e.setAttribute("style",t),()=>{e.setAttribute("style",n||"")}}function Hi(e){return e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function Ln(e,t=()=>{}){let n=!1;return function(){n?t.apply(this,arguments):(n=!0,e.apply(this,arguments))}}M("transition",(e,{value:t,modifiers:n,expression:s},{evaluate:r})=>{typeof s=="function"&&(s=r(s)),s!==!1&&(!s||typeof s=="boolean"?qi(e,n,t):Ui(e,s,t))});function Ui(e,t,n){Yr(e,Qn,""),{enter:r=>{e._x_transition.enter.during=r},"enter-start":r=>{e._x_transition.enter.start=r},"enter-end":r=>{e._x_transition.enter.end=r},leave:r=>{e._x_transition.leave.during=r},"leave-start":r=>{e._x_transition.leave.start=r},"leave-end":r=>{e._x_transition.leave.end=r}}[n](t)}function qi(e,t,n){Yr(e,Dt);let s=!t.includes("in")&&!t.includes("out")&&!n,r=s||t.includes("in")||["enter"].includes(n),a=s||t.includes("out")||["leave"].includes(n);t.includes("in")&&!s&&(t=t.filter((_,T)=>T<t.indexOf("out"))),t.includes("out")&&!s&&(t=t.filter((_,T)=>T>t.indexOf("out")));let i=!t.includes("opacity")&&!t.includes("scale"),o=i||t.includes("opacity"),l=i||t.includes("scale"),c=o?0:1,u=l?Ge(t,"scale",95)/100:1,m=Ge(t,"delay",0)/1e3,p=Ge(t,"origin","center"),v="opacity, transform",b=Ge(t,"duration",150)/1e3,I=Ge(t,"duration",75)/1e3,x="cubic-bezier(0.4, 0.0, 0.2, 1)";r&&(e._x_transition.enter.during={transformOrigin:p,transitionDelay:`${m}s`,transitionProperty:v,transitionDuration:`${b}s`,transitionTimingFunction:x},e._x_transition.enter.start={opacity:c,transform:`scale(${u})`},e._x_transition.enter.end={opacity:1,transform:"scale(1)"}),a&&(e._x_transition.leave.during={transformOrigin:p,transitionDelay:`${m}s`,transitionProperty:v,transitionDuration:`${I}s`,transitionTimingFunction:x},e._x_transition.leave.start={opacity:1,transform:"scale(1)"},e._x_transition.leave.end={opacity:c,transform:`scale(${u})`})}function Yr(e,t,n={}){e._x_transition||(e._x_transition={enter:{during:n,start:n,end:n},leave:{during:n,start:n,end:n},in(s=()=>{},r=()=>{}){Rn(e,t,{during:this.enter.during,start:this.enter.start,end:this.enter.end},s,r)},out(s=()=>{},r=()=>{}){Rn(e,t,{during:this.leave.during,start:this.leave.start,end:this.leave.end},s,r)}})}window.Element.prototype._x_toggleAndCascadeWithTransitions=function(e,t,n,s){const r=document.visibilityState==="visible"?requestAnimationFrame:setTimeout;let a=()=>r(n);if(t){e._x_transition&&(e._x_transition.enter||e._x_transition.leave)?e._x_transition.enter&&(Object.entries(e._x_transition.enter.during).length||Object.entries(e._x_transition.enter.start).length||Object.entries(e._x_transition.enter.end).length)?e._x_transition.in(n):a():e._x_transition?e._x_transition.in(n):a();return}e._x_hidePromise=e._x_transition?new Promise((i,o)=>{e._x_transition.out(()=>{},()=>i(s)),e._x_transitioning&&e._x_transitioning.beforeCancel(()=>o({isFromCancelledTransition:!0}))}):Promise.resolve(s),queueMicrotask(()=>{let i=Kr(e);i?(i._x_hideChildren||(i._x_hideChildren=[]),i._x_hideChildren.push(e)):r(()=>{let o=l=>{let c=Promise.all([l._x_hidePromise,...(l._x_hideChildren||[]).map(o)]).then(([u])=>u==null?void 0:u());return delete l._x_hidePromise,delete l._x_hideChildren,c};o(e).catch(l=>{if(!l.isFromCancelledTransition)throw l})})})};function Kr(e){let t=e.parentNode;if(t)return t._x_hidePromise?t:Kr(t)}function Rn(e,t,{during:n,start:s,end:r}={},a=()=>{},i=()=>{}){if(e._x_transitioning&&e._x_transitioning.cancel(),Object.keys(n).length===0&&Object.keys(s).length===0&&Object.keys(r).length===0){a(),i();return}let o,l,c;Gi(e,{start(){o=t(e,s)},during(){l=t(e,n)},before:a,end(){o(),c=t(e,r)},after:i,cleanup(){l(),c()}})}function Gi(e,t){let n,s,r,a=Ln(()=>{R(()=>{n=!0,s||t.before(),r||(t.end(),Cn()),t.after(),e.isConnected&&t.cleanup(),delete e._x_transitioning})});e._x_transitioning={beforeCancels:[],beforeCancel(i){this.beforeCancels.push(i)},cancel:Ln(function(){for(;this.beforeCancels.length;)this.beforeCancels.shift()();a()}),finish:a},R(()=>{t.start(),t.during()}),zi(),requestAnimationFrame(()=>{if(n)return;let i=Number(getComputedStyle(e).transitionDuration.replace(/,.*/,"").replace("s",""))*1e3,o=Number(getComputedStyle(e).transitionDelay.replace(/,.*/,"").replace("s",""))*1e3;i===0&&(i=Number(getComputedStyle(e).animationDuration.replace("s",""))*1e3),R(()=>{t.before()}),s=!0,requestAnimationFrame(()=>{n||(R(()=>{t.end()}),Cn(),setTimeout(e._x_transitioning.finish,i+o),r=!0)})})}function Ge(e,t,n){if(e.indexOf(t)===-1)return n;const s=e[e.indexOf(t)+1];if(!s||t==="scale"&&isNaN(s))return n;if(t==="duration"||t==="delay"){let r=s.match(/([0-9]+)ms/);if(r)return r[1]}return t==="origin"&&["top","right","left","center","bottom"].includes(e[e.indexOf(t)+2])?[s,e[e.indexOf(t)+2]].join(" "):s}var pe=!1;function me(e,t=()=>{}){return(...n)=>pe?t(...n):e(...n)}function Wi(e){return(...t)=>pe&&e(...t)}var Zr=[];function Bt(e){Zr.push(e)}function Vi(e,t){Zr.forEach(n=>n(e,t)),pe=!0,Xr(()=>{de(t,(n,s)=>{s(n,()=>{})})}),pe=!1}var In=!1;function Yi(e,t){t._x_dataStack||(t._x_dataStack=e._x_dataStack),pe=!0,In=!0,Xr(()=>{Ki(t)}),pe=!1,In=!1}function Ki(e){let t=!1;de(e,(s,r)=>{_e(s,(a,i)=>{if(t&&Pi(a))return i();t=!0,r(a,i)})})}function Xr(e){let t=Se;Hs((n,s)=>{let r=t(n);return De(r),()=>{}}),e(),Hs(t)}function Jr(e,t,n,s=[]){switch(e._x_bindings||(e._x_bindings=Ne({})),e._x_bindings[t]=n,t=s.includes("camel")?so(t):t,t){case"value":Zi(e,n);break;case"style":Ji(e,n);break;case"class":Xi(e,n);break;case"selected":case"checked":Qi(e,t,n);break;default:Qr(e,t,n);break}}function Zi(e,t){if(na(e))e.attributes.value===void 0&&(e.value=t),window.fromModel&&(typeof t=="boolean"?e.checked=Et(e.value)===t:e.checked=Gs(e.value,t));else if(es(e))Number.isInteger(t)?e.value=t:!Array.isArray(t)&&typeof t!="boolean"&&![null,void 0].includes(t)?e.value=String(t):Array.isArray(t)?e.checked=t.some(n=>Gs(n,e.value)):e.checked=!!t;else if(e.tagName==="SELECT")no(e,t);else{if(e.value===t)return;e.value=t===void 0?"":t}}function Xi(e,t){e._x_undoAddedClasses&&e._x_undoAddedClasses(),e._x_undoAddedClasses=Qn(e,t)}function Ji(e,t){e._x_undoAddedStyles&&e._x_undoAddedStyles(),e._x_undoAddedStyles=Dt(e,t)}function Qi(e,t,n){Qr(e,t,n),to(e,t,n)}function Qr(e,t,n){[null,void 0,!1].includes(n)&&ao(t)?e.removeAttribute(t):(ea(t)&&(n=t),eo(e,t,n))}function eo(e,t,n){e.getAttribute(t)!=n&&e.setAttribute(t,n)}function to(e,t,n){e[t]!==n&&(e[t]=n)}function no(e,t){const n=[].concat(t).map(s=>s+"");Array.from(e.options).forEach(s=>{s.selected=n.includes(s.value)})}function so(e){return e.toLowerCase().replace(/-(\w)/g,(t,n)=>n.toUpperCase())}function Gs(e,t){return e==t}function Et(e){return[1,"1","true","on","yes",!0].includes(e)?!0:[0,"0","false","off","no",!1].includes(e)?!1:e?!!e:null}var ro=new Set(["allowfullscreen","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","inert","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected","shadowrootclonable","shadowrootdelegatesfocus","shadowrootserializable"]);function ea(e){return ro.has(e)}function ao(e){return!["aria-pressed","aria-checked","aria-expanded","aria-selected"].includes(e)}function io(e,t,n){return e._x_bindings&&e._x_bindings[t]!==void 0?e._x_bindings[t]:ta(e,t,n)}function oo(e,t,n,s=!0){if(e._x_bindings&&e._x_bindings[t]!==void 0)return e._x_bindings[t];if(e._x_inlineBindings&&e._x_inlineBindings[t]!==void 0){let r=e._x_inlineBindings[t];return r.extract=s,Rr(()=>ve(e,r.expression))}return ta(e,t,n)}function ta(e,t,n){let s=e.getAttribute(t);return s===null?typeof n=="function"?n():n:s===""?!0:ea(t)?!![t,"true"].includes(s):s}function es(e){return e.type==="checkbox"||e.localName==="ui-checkbox"||e.localName==="ui-switch"}function na(e){return e.type==="radio"||e.localName==="ui-radio"}function sa(e,t){var n;return function(){var s=this,r=arguments,a=function(){n=null,e.apply(s,r)};clearTimeout(n),n=setTimeout(a,t)}}function ra(e,t){let n;return function(){let s=this,r=arguments;n||(e.apply(s,r),n=!0,setTimeout(()=>n=!1,t))}}function aa({get:e,set:t},{get:n,set:s}){let r=!0,a,i=Se(()=>{let o=e(),l=n();if(r)s(cn(o)),r=!1;else{let c=JSON.stringify(o),u=JSON.stringify(l);c!==a?s(cn(o)):c!==u&&t(cn(l))}a=JSON.stringify(e()),JSON.stringify(n())});return()=>{De(i)}}function cn(e){return typeof e=="object"?JSON.parse(JSON.stringify(e)):e}function lo(e){(Array.isArray(e)?e:[e]).forEach(n=>n(ot))}var ge={},Ws=!1;function co(e,t){if(Ws||(ge=Ne(ge),Ws=!0),t===void 0)return ge[e];ge[e]=t,Ar(ge[e]),typeof t=="object"&&t!==null&&t.hasOwnProperty("init")&&typeof t.init=="function"&&ge[e].init()}function uo(){return ge}var ia={};function po(e,t){let n=typeof t!="function"?()=>t:t;return e instanceof Element?oa(e,n()):(ia[e]=n,()=>{})}function fo(e){return Object.entries(ia).forEach(([t,n])=>{Object.defineProperty(e,t,{get(){return(...s)=>n(...s)}})}),e}function oa(e,t,n){let s=[];for(;s.length;)s.pop()();let r=Object.entries(t).map(([i,o])=>({name:i,value:o})),a=Mr(r);return r=r.map(i=>a.find(o=>o.name===i.name)?{name:`x-bind:${i.name}`,value:`"${i.value}"`}:i),Yn(e,r,n).map(i=>{s.push(i.runCleanups),i()}),()=>{for(;s.length;)s.pop()()}}var la={};function mo(e,t){la[e]=t}function ho(e,t){return Object.entries(la).forEach(([n,s])=>{Object.defineProperty(e,n,{get(){return(...r)=>s.bind(t)(...r)},enumerable:!1})}),e}var go={get reactive(){return Ne},get release(){return De},get effect(){return Se},get raw(){return xr},version:"3.14.9",flushAndStopDeferringMutations:xi,dontAutoEvaluateFunctions:Rr,disableEffectScheduling:di,startObservingMutations:qn,stopObservingMutations:Er,setReactivityEngine:ui,onAttributeRemoved:kr,onAttributesAdded:_r,closestDataStack:Me,skipDuringClone:me,onlyDuringClone:Wi,addRootSelector:Gr,addInitSelector:Wr,interceptClone:Bt,addScopeToNode:at,deferMutations:gi,mapAttributes:Kn,evaluateLater:U,interceptInit:Ni,setEvaluator:ki,mergeProxies:it,extractProp:oo,findClosest:ze,onElRemoved:Fn,closestRoot:Nt,destroyTree:$e,interceptor:Cr,transition:Rn,setStyles:Dt,mutateDom:R,directive:M,entangle:aa,throttle:ra,debounce:sa,evaluate:ve,initTree:de,nextTick:Jn,prefixed:Be,prefix:Ai,plugin:lo,magic:Q,store:co,start:Mi,clone:Yi,cloneNode:Vi,bound:io,$data:Tr,watch:br,walk:_e,data:mo,bind:po},ot=go;function xo(e,t){const n=Object.create(null),s=e.split(",");for(let r=0;r<s.length;r++)n[s[r]]=!0;return r=>!!n[r]}var bo=Object.freeze({}),vo=Object.prototype.hasOwnProperty,zt=(e,t)=>vo.call(e,t),we=Array.isArray,nt=e=>ca(e)==="[object Map]",wo=e=>typeof e=="string",ts=e=>typeof e=="symbol",$t=e=>e!==null&&typeof e=="object",yo=Object.prototype.toString,ca=e=>yo.call(e),da=e=>ca(e).slice(8,-1),ns=e=>wo(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,_o=e=>{const t=Object.create(null);return n=>t[n]||(t[n]=e(n))},ko=_o(e=>e.charAt(0).toUpperCase()+e.slice(1)),ua=(e,t)=>e!==t&&(e===e||t===t),On=new WeakMap,We=[],se,ye=Symbol("iterate"),Mn=Symbol("Map key iterate");function So(e){return e&&e._isEffect===!0}function Eo(e,t=bo){So(e)&&(e=e.raw);const n=Co(e,t);return t.lazy||n(),n}function To(e){e.active&&(pa(e),e.options.onStop&&e.options.onStop(),e.active=!1)}var Ao=0;function Co(e,t){const n=function(){if(!n.active)return e();if(!We.includes(n)){pa(n);try{return Ro(),We.push(n),se=n,e()}finally{We.pop(),fa(),se=We[We.length-1]}}};return n.id=Ao++,n.allowRecurse=!!t.allowRecurse,n._isEffect=!0,n.active=!0,n.raw=e,n.deps=[],n.options=t,n}function pa(e){const{deps:t}=e;if(t.length){for(let n=0;n<t.length;n++)t[n].delete(e);t.length=0}}var Pe=!0,ss=[];function Lo(){ss.push(Pe),Pe=!1}function Ro(){ss.push(Pe),Pe=!0}function fa(){const e=ss.pop();Pe=e===void 0?!0:e}function J(e,t,n){if(!Pe||se===void 0)return;let s=On.get(e);s||On.set(e,s=new Map);let r=s.get(n);r||s.set(n,r=new Set),r.has(se)||(r.add(se),se.deps.push(r),se.options.onTrack&&se.options.onTrack({effect:se,target:e,type:t,key:n}))}function fe(e,t,n,s,r,a){const i=On.get(e);if(!i)return;const o=new Set,l=u=>{u&&u.forEach(m=>{(m!==se||m.allowRecurse)&&o.add(m)})};if(t==="clear")i.forEach(l);else if(n==="length"&&we(e))i.forEach((u,m)=>{(m==="length"||m>=s)&&l(u)});else switch(n!==void 0&&l(i.get(n)),t){case"add":we(e)?ns(n)&&l(i.get("length")):(l(i.get(ye)),nt(e)&&l(i.get(Mn)));break;case"delete":we(e)||(l(i.get(ye)),nt(e)&&l(i.get(Mn)));break;case"set":nt(e)&&l(i.get(ye));break}const c=u=>{u.options.onTrigger&&u.options.onTrigger({effect:u,target:e,key:n,type:t,newValue:s,oldValue:r,oldTarget:a}),u.options.scheduler?u.options.scheduler(u):u()};o.forEach(c)}var Io=xo("__proto__,__v_isRef,__isVue"),ma=new Set(Object.getOwnPropertyNames(Symbol).map(e=>Symbol[e]).filter(ts)),Oo=ha(),Mo=ha(!0),Vs=Po();function Po(){const e={};return["includes","indexOf","lastIndexOf"].forEach(t=>{e[t]=function(...n){const s=A(this);for(let a=0,i=this.length;a<i;a++)J(s,"get",a+"");const r=s[t](...n);return r===-1||r===!1?s[t](...n.map(A)):r}}),["push","pop","shift","unshift","splice"].forEach(t=>{e[t]=function(...n){Lo();const s=A(this)[t].apply(this,n);return fa(),s}}),e}function ha(e=!1,t=!1){return function(s,r,a){if(r==="__v_isReactive")return!e;if(r==="__v_isReadonly")return e;if(r==="__v_raw"&&a===(e?t?Yo:va:t?Vo:ba).get(s))return s;const i=we(s);if(!e&&i&&zt(Vs,r))return Reflect.get(Vs,r,a);const o=Reflect.get(s,r,a);return(ts(r)?ma.has(r):Io(r))||(e||J(s,"get",r),t)?o:Pn(o)?!i||!ns(r)?o.value:o:$t(o)?e?wa(o):os(o):o}}var No=Do();function Do(e=!1){return function(n,s,r,a){let i=n[s];if(!e&&(r=A(r),i=A(i),!we(n)&&Pn(i)&&!Pn(r)))return i.value=r,!0;const o=we(n)&&ns(s)?Number(s)<n.length:zt(n,s),l=Reflect.set(n,s,r,a);return n===A(a)&&(o?ua(r,i)&&fe(n,"set",s,r,i):fe(n,"add",s,r)),l}}function Bo(e,t){const n=zt(e,t),s=e[t],r=Reflect.deleteProperty(e,t);return r&&n&&fe(e,"delete",t,void 0,s),r}function zo(e,t){const n=Reflect.has(e,t);return(!ts(t)||!ma.has(t))&&J(e,"has",t),n}function $o(e){return J(e,"iterate",we(e)?"length":ye),Reflect.ownKeys(e)}var jo={get:Oo,set:No,deleteProperty:Bo,has:zo,ownKeys:$o},Fo={get:Mo,set(e,t){return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`,e),!0},deleteProperty(e,t){return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`,e),!0}},rs=e=>$t(e)?os(e):e,as=e=>$t(e)?wa(e):e,is=e=>e,jt=e=>Reflect.getPrototypeOf(e);function gt(e,t,n=!1,s=!1){e=e.__v_raw;const r=A(e),a=A(t);t!==a&&!n&&J(r,"get",t),!n&&J(r,"get",a);const{has:i}=jt(r),o=s?is:n?as:rs;if(i.call(r,t))return o(e.get(t));if(i.call(r,a))return o(e.get(a));e!==r&&e.get(t)}function xt(e,t=!1){const n=this.__v_raw,s=A(n),r=A(e);return e!==r&&!t&&J(s,"has",e),!t&&J(s,"has",r),e===r?n.has(e):n.has(e)||n.has(r)}function bt(e,t=!1){return e=e.__v_raw,!t&&J(A(e),"iterate",ye),Reflect.get(e,"size",e)}function Ys(e){e=A(e);const t=A(this);return jt(t).has.call(t,e)||(t.add(e),fe(t,"add",e,e)),this}function Ks(e,t){t=A(t);const n=A(this),{has:s,get:r}=jt(n);let a=s.call(n,e);a?xa(n,s,e):(e=A(e),a=s.call(n,e));const i=r.call(n,e);return n.set(e,t),a?ua(t,i)&&fe(n,"set",e,t,i):fe(n,"add",e,t),this}function Zs(e){const t=A(this),{has:n,get:s}=jt(t);let r=n.call(t,e);r?xa(t,n,e):(e=A(e),r=n.call(t,e));const a=s?s.call(t,e):void 0,i=t.delete(e);return r&&fe(t,"delete",e,void 0,a),i}function Xs(){const e=A(this),t=e.size!==0,n=nt(e)?new Map(e):new Set(e),s=e.clear();return t&&fe(e,"clear",void 0,void 0,n),s}function vt(e,t){return function(s,r){const a=this,i=a.__v_raw,o=A(i),l=t?is:e?as:rs;return!e&&J(o,"iterate",ye),i.forEach((c,u)=>s.call(r,l(c),l(u),a))}}function wt(e,t,n){return function(...s){const r=this.__v_raw,a=A(r),i=nt(a),o=e==="entries"||e===Symbol.iterator&&i,l=e==="keys"&&i,c=r[e](...s),u=n?is:t?as:rs;return!t&&J(a,"iterate",l?Mn:ye),{next(){const{value:m,done:p}=c.next();return p?{value:m,done:p}:{value:o?[u(m[0]),u(m[1])]:u(m),done:p}},[Symbol.iterator](){return this}}}}function ue(e){return function(...t){{const n=t[0]?`on key "${t[0]}" `:"";console.warn(`${ko(e)} operation ${n}failed: target is readonly.`,A(this))}return e==="delete"?!1:this}}function Ho(){const e={get(a){return gt(this,a)},get size(){return bt(this)},has:xt,add:Ys,set:Ks,delete:Zs,clear:Xs,forEach:vt(!1,!1)},t={get(a){return gt(this,a,!1,!0)},get size(){return bt(this)},has:xt,add:Ys,set:Ks,delete:Zs,clear:Xs,forEach:vt(!1,!0)},n={get(a){return gt(this,a,!0)},get size(){return bt(this,!0)},has(a){return xt.call(this,a,!0)},add:ue("add"),set:ue("set"),delete:ue("delete"),clear:ue("clear"),forEach:vt(!0,!1)},s={get(a){return gt(this,a,!0,!0)},get size(){return bt(this,!0)},has(a){return xt.call(this,a,!0)},add:ue("add"),set:ue("set"),delete:ue("delete"),clear:ue("clear"),forEach:vt(!0,!0)};return["keys","values","entries",Symbol.iterator].forEach(a=>{e[a]=wt(a,!1,!1),n[a]=wt(a,!0,!1),t[a]=wt(a,!1,!0),s[a]=wt(a,!0,!0)}),[e,n,t,s]}var[Uo,qo,kc,Sc]=Ho();function ga(e,t){const n=e?qo:Uo;return(s,r,a)=>r==="__v_isReactive"?!e:r==="__v_isReadonly"?e:r==="__v_raw"?s:Reflect.get(zt(n,r)&&r in s?n:s,r,a)}var Go={get:ga(!1)},Wo={get:ga(!0)};function xa(e,t,n){const s=A(n);if(s!==n&&t.call(e,s)){const r=da(e);console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r==="Map"?" as keys":""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`)}}var ba=new WeakMap,Vo=new WeakMap,va=new WeakMap,Yo=new WeakMap;function Ko(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function Zo(e){return e.__v_skip||!Object.isExtensible(e)?0:Ko(da(e))}function os(e){return e&&e.__v_isReadonly?e:ya(e,!1,jo,Go,ba)}function wa(e){return ya(e,!0,Fo,Wo,va)}function ya(e,t,n,s,r){if(!$t(e))return console.warn(`value cannot be made reactive: ${String(e)}`),e;if(e.__v_raw&&!(t&&e.__v_isReactive))return e;const a=r.get(e);if(a)return a;const i=Zo(e);if(i===0)return e;const o=new Proxy(e,i===2?s:n);return r.set(e,o),o}function A(e){return e&&A(e.__v_raw)||e}function Pn(e){return!!(e&&e.__v_isRef===!0)}Q("nextTick",()=>Jn);Q("dispatch",e=>tt.bind(tt,e));Q("watch",(e,{evaluateLater:t,cleanup:n})=>(s,r)=>{let a=t(s),o=br(()=>{let l;return a(c=>l=c),l},r);n(o)});Q("store",uo);Q("data",e=>Tr(e));Q("root",e=>Nt(e));Q("refs",e=>(e._x_refs_proxy||(e._x_refs_proxy=it(Xo(e))),e._x_refs_proxy));function Xo(e){let t=[];return ze(e,n=>{n._x_refs&&t.push(n._x_refs)}),t}var dn={};function _a(e){return dn[e]||(dn[e]=0),++dn[e]}function Jo(e,t){return ze(e,n=>{if(n._x_ids&&n._x_ids[t])return!0})}function Qo(e,t){e._x_ids||(e._x_ids={}),e._x_ids[t]||(e._x_ids[t]=_a(t))}Q("id",(e,{cleanup:t})=>(n,s=null)=>{let r=`${n}${s?`-${s}`:""}`;return el(e,r,t,()=>{let a=Jo(e,n),i=a?a._x_ids[n]:_a(n);return s?`${n}-${i}-${s}`:`${n}-${i}`})});Bt((e,t)=>{e._x_id&&(t._x_id=e._x_id)});function el(e,t,n,s){if(e._x_id||(e._x_id={}),e._x_id[t])return e._x_id[t];let r=s();return e._x_id[t]=r,n(()=>{delete e._x_id[t]}),r}Q("el",e=>e);ka("Focus","focus","focus");ka("Persist","persist","persist");function ka(e,t,n){Q(t,s=>K(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`,s))}M("modelable",(e,{expression:t},{effect:n,evaluateLater:s,cleanup:r})=>{let a=s(t),i=()=>{let u;return a(m=>u=m),u},o=s(`${t} = __placeholder`),l=u=>o(()=>{},{scope:{__placeholder:u}}),c=i();l(c),queueMicrotask(()=>{if(!e._x_model)return;e._x_removeModelListeners.default();let u=e._x_model.get,m=e._x_model.set,p=aa({get(){return u()},set(v){m(v)}},{get(){return i()},set(v){l(v)}});r(p)})});M("teleport",(e,{modifiers:t,expression:n},{cleanup:s})=>{e.tagName.toLowerCase()!=="template"&&K("x-teleport can only be used on a <template> tag",e);let r=Js(n),a=e.content.cloneNode(!0).firstElementChild;e._x_teleport=a,a._x_teleportBack=e,e.setAttribute("data-teleport-template",!0),a.setAttribute("data-teleport-target",!0),e._x_forwardEvents&&e._x_forwardEvents.forEach(o=>{a.addEventListener(o,l=>{l.stopPropagation(),e.dispatchEvent(new l.constructor(l.type,l))})}),at(a,{},e);let i=(o,l,c)=>{c.includes("prepend")?l.parentNode.insertBefore(o,l):c.includes("append")?l.parentNode.insertBefore(o,l.nextSibling):l.appendChild(o)};R(()=>{i(a,r,t),me(()=>{de(a)})()}),e._x_teleportPutBack=()=>{let o=Js(n);R(()=>{i(e._x_teleport,o,t)})},s(()=>R(()=>{a.remove(),$e(a)}))});var tl=document.createElement("div");function Js(e){let t=me(()=>document.querySelector(e),()=>tl)();return t||K(`Cannot find x-teleport element for selector: "${e}"`),t}var Sa=()=>{};Sa.inline=(e,{modifiers:t},{cleanup:n})=>{t.includes("self")?e._x_ignoreSelf=!0:e._x_ignore=!0,n(()=>{t.includes("self")?delete e._x_ignoreSelf:delete e._x_ignore})};M("ignore",Sa);M("effect",me((e,{expression:t},{effect:n})=>{n(U(e,t))}));function Nn(e,t,n,s){let r=e,a=l=>s(l),i={},o=(l,c)=>u=>c(l,u);if(n.includes("dot")&&(t=nl(t)),n.includes("camel")&&(t=sl(t)),n.includes("passive")&&(i.passive=!0),n.includes("capture")&&(i.capture=!0),n.includes("window")&&(r=window),n.includes("document")&&(r=document),n.includes("debounce")){let l=n[n.indexOf("debounce")+1]||"invalid-wait",c=It(l.split("ms")[0])?Number(l.split("ms")[0]):250;a=sa(a,c)}if(n.includes("throttle")){let l=n[n.indexOf("throttle")+1]||"invalid-wait",c=It(l.split("ms")[0])?Number(l.split("ms")[0]):250;a=ra(a,c)}return n.includes("prevent")&&(a=o(a,(l,c)=>{c.preventDefault(),l(c)})),n.includes("stop")&&(a=o(a,(l,c)=>{c.stopPropagation(),l(c)})),n.includes("once")&&(a=o(a,(l,c)=>{l(c),r.removeEventListener(t,a,i)})),(n.includes("away")||n.includes("outside"))&&(r=document,a=o(a,(l,c)=>{e.contains(c.target)||c.target.isConnected!==!1&&(e.offsetWidth<1&&e.offsetHeight<1||e._x_isShown!==!1&&l(c))})),n.includes("self")&&(a=o(a,(l,c)=>{c.target===e&&l(c)})),(al(t)||Ea(t))&&(a=o(a,(l,c)=>{il(c,n)||l(c)})),r.addEventListener(t,a,i),()=>{r.removeEventListener(t,a,i)}}function nl(e){return e.replace(/-/g,".")}function sl(e){return e.toLowerCase().replace(/-(\w)/g,(t,n)=>n.toUpperCase())}function It(e){return!Array.isArray(e)&&!isNaN(e)}function rl(e){return[" ","_"].includes(e)?e:e.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/[_\s]/,"-").toLowerCase()}function al(e){return["keydown","keyup"].includes(e)}function Ea(e){return["contextmenu","click","mouse"].some(t=>e.includes(t))}function il(e,t){let n=t.filter(a=>!["window","document","prevent","stop","once","capture","self","away","outside","passive"].includes(a));if(n.includes("debounce")){let a=n.indexOf("debounce");n.splice(a,It((n[a+1]||"invalid-wait").split("ms")[0])?2:1)}if(n.includes("throttle")){let a=n.indexOf("throttle");n.splice(a,It((n[a+1]||"invalid-wait").split("ms")[0])?2:1)}if(n.length===0||n.length===1&&Qs(e.key).includes(n[0]))return!1;const r=["ctrl","shift","alt","meta","cmd","super"].filter(a=>n.includes(a));return n=n.filter(a=>!r.includes(a)),!(r.length>0&&r.filter(i=>((i==="cmd"||i==="super")&&(i="meta"),e[`${i}Key`])).length===r.length&&(Ea(e.type)||Qs(e.key).includes(n[0])))}function Qs(e){if(!e)return[];e=rl(e);let t={ctrl:"control",slash:"/",space:" ",spacebar:" ",cmd:"meta",esc:"escape",up:"arrow-up",down:"arrow-down",left:"arrow-left",right:"arrow-right",period:".",comma:",",equal:"=",minus:"-",underscore:"_"};return t[e]=e,Object.keys(t).map(n=>{if(t[n]===e)return n}).filter(n=>n)}M("model",(e,{modifiers:t,expression:n},{effect:s,cleanup:r})=>{let a=e;t.includes("parent")&&(a=e.parentNode);let i=U(a,n),o;typeof n=="string"?o=U(a,`${n} = __placeholder`):typeof n=="function"&&typeof n()=="string"?o=U(a,`${n()} = __placeholder`):o=()=>{};let l=()=>{let p;return i(v=>p=v),er(p)?p.get():p},c=p=>{let v;i(b=>v=b),er(v)?v.set(p):o(()=>{},{scope:{__placeholder:p}})};typeof n=="string"&&e.type==="radio"&&R(()=>{e.hasAttribute("name")||e.setAttribute("name",n)});var u=e.tagName.toLowerCase()==="select"||["checkbox","radio"].includes(e.type)||t.includes("lazy")?"change":"input";let m=pe?()=>{}:Nn(e,u,t,p=>{c(un(e,t,p,l()))});if(t.includes("fill")&&([void 0,null,""].includes(l())||es(e)&&Array.isArray(l())||e.tagName.toLowerCase()==="select"&&e.multiple)&&c(un(e,t,{target:e},l())),e._x_removeModelListeners||(e._x_removeModelListeners={}),e._x_removeModelListeners.default=m,r(()=>e._x_removeModelListeners.default()),e.form){let p=Nn(e.form,"reset",[],v=>{Jn(()=>e._x_model&&e._x_model.set(un(e,t,{target:e},l())))});r(()=>p())}e._x_model={get(){return l()},set(p){c(p)}},e._x_forceModelUpdate=p=>{p===void 0&&typeof n=="string"&&n.match(/\./)&&(p=""),window.fromModel=!0,R(()=>Jr(e,"value",p)),delete window.fromModel},s(()=>{let p=l();t.includes("unintrusive")&&document.activeElement.isSameNode(e)||e._x_forceModelUpdate(p)})});function un(e,t,n,s){return R(()=>{if(n instanceof CustomEvent&&n.detail!==void 0)return n.detail!==null&&n.detail!==void 0?n.detail:n.target.value;if(es(e))if(Array.isArray(s)){let r=null;return t.includes("number")?r=pn(n.target.value):t.includes("boolean")?r=Et(n.target.value):r=n.target.value,n.target.checked?s.includes(r)?s:s.concat([r]):s.filter(a=>!ol(a,r))}else return n.target.checked;else{if(e.tagName.toLowerCase()==="select"&&e.multiple)return t.includes("number")?Array.from(n.target.selectedOptions).map(r=>{let a=r.value||r.text;return pn(a)}):t.includes("boolean")?Array.from(n.target.selectedOptions).map(r=>{let a=r.value||r.text;return Et(a)}):Array.from(n.target.selectedOptions).map(r=>r.value||r.text);{let r;return na(e)?n.target.checked?r=n.target.value:r=s:r=n.target.value,t.includes("number")?pn(r):t.includes("boolean")?Et(r):t.includes("trim")?r.trim():r}}})}function pn(e){let t=e?parseFloat(e):null;return ll(t)?t:e}function ol(e,t){return e==t}function ll(e){return!Array.isArray(e)&&!isNaN(e)}function er(e){return e!==null&&typeof e=="object"&&typeof e.get=="function"&&typeof e.set=="function"}M("cloak",e=>queueMicrotask(()=>R(()=>e.removeAttribute(Be("cloak")))));Wr(()=>`[${Be("init")}]`);M("init",me((e,{expression:t},{evaluate:n})=>typeof t=="string"?!!t.trim()&&n(t,{},!1):n(t,{},!1)));M("text",(e,{expression:t},{effect:n,evaluateLater:s})=>{let r=s(t);n(()=>{r(a=>{R(()=>{e.textContent=a})})})});M("html",(e,{expression:t},{effect:n,evaluateLater:s})=>{let r=s(t);n(()=>{r(a=>{R(()=>{e.innerHTML=a,e._x_ignoreSelf=!0,de(e),delete e._x_ignoreSelf})})})});Kn(Dr(":",Br(Be("bind:"))));var Ta=(e,{value:t,modifiers:n,expression:s,original:r},{effect:a,cleanup:i})=>{if(!t){let l={};fo(l),U(e,s)(u=>{oa(e,u,r)},{scope:l});return}if(t==="key")return cl(e,s);if(e._x_inlineBindings&&e._x_inlineBindings[t]&&e._x_inlineBindings[t].extract)return;let o=U(e,s);a(()=>o(l=>{l===void 0&&typeof s=="string"&&s.match(/\./)&&(l=""),R(()=>Jr(e,t,l,n))})),i(()=>{e._x_undoAddedClasses&&e._x_undoAddedClasses(),e._x_undoAddedStyles&&e._x_undoAddedStyles()})};Ta.inline=(e,{value:t,modifiers:n,expression:s})=>{t&&(e._x_inlineBindings||(e._x_inlineBindings={}),e._x_inlineBindings[t]={expression:s,extract:!1})};M("bind",Ta);function cl(e,t){e._x_keyExpression=t}Gr(()=>`[${Be("data")}]`);M("data",(e,{expression:t},{cleanup:n})=>{if(dl(e))return;t=t===""?"{}":t;let s={};Sn(s,e);let r={};ho(r,s);let a=ve(e,t,{scope:r});(a===void 0||a===!0)&&(a={}),Sn(a,e);let i=Ne(a);Ar(i);let o=at(e,i);i.init&&ve(e,i.init),n(()=>{i.destroy&&ve(e,i.destroy),o()})});Bt((e,t)=>{e._x_dataStack&&(t._x_dataStack=e._x_dataStack,t.setAttribute("data-has-alpine-state",!0))});function dl(e){return pe?In?!0:e.hasAttribute("data-has-alpine-state"):!1}M("show",(e,{modifiers:t,expression:n},{effect:s})=>{let r=U(e,n);e._x_doHide||(e._x_doHide=()=>{R(()=>{e.style.setProperty("display","none",t.includes("important")?"important":void 0)})}),e._x_doShow||(e._x_doShow=()=>{R(()=>{e.style.length===1&&e.style.display==="none"?e.removeAttribute("style"):e.style.removeProperty("display")})});let a=()=>{e._x_doHide(),e._x_isShown=!1},i=()=>{e._x_doShow(),e._x_isShown=!0},o=()=>setTimeout(i),l=Ln(m=>m?i():a(),m=>{typeof e._x_toggleAndCascadeWithTransitions=="function"?e._x_toggleAndCascadeWithTransitions(e,m,i,a):m?o():a()}),c,u=!0;s(()=>r(m=>{!u&&m===c||(t.includes("immediate")&&(m?o():a()),l(m),c=m,u=!1)}))});M("for",(e,{expression:t},{effect:n,cleanup:s})=>{let r=pl(t),a=U(e,r.items),i=U(e,e._x_keyExpression||"index");e._x_prevKeys=[],e._x_lookup={},n(()=>ul(e,r,a,i)),s(()=>{Object.values(e._x_lookup).forEach(o=>R(()=>{$e(o),o.remove()})),delete e._x_prevKeys,delete e._x_lookup})});function ul(e,t,n,s){let r=i=>typeof i=="object"&&!Array.isArray(i),a=e;n(i=>{fl(i)&&i>=0&&(i=Array.from(Array(i).keys(),x=>x+1)),i===void 0&&(i=[]);let o=e._x_lookup,l=e._x_prevKeys,c=[],u=[];if(r(i))i=Object.entries(i).map(([x,_])=>{let T=tr(t,_,x,i);s(C=>{u.includes(C)&&K("Duplicate key on x-for",e),u.push(C)},{scope:{index:x,...T}}),c.push(T)});else for(let x=0;x<i.length;x++){let _=tr(t,i[x],x,i);s(T=>{u.includes(T)&&K("Duplicate key on x-for",e),u.push(T)},{scope:{index:x,..._}}),c.push(_)}let m=[],p=[],v=[],b=[];for(let x=0;x<l.length;x++){let _=l[x];u.indexOf(_)===-1&&v.push(_)}l=l.filter(x=>!v.includes(x));let I="template";for(let x=0;x<u.length;x++){let _=u[x],T=l.indexOf(_);if(T===-1)l.splice(x,0,_),m.push([I,x]);else if(T!==x){let C=l.splice(x,1)[0],y=l.splice(T-1,1)[0];l.splice(x,0,y),l.splice(T,0,C),p.push([C,y])}else b.push(_);I=_}for(let x=0;x<v.length;x++){let _=v[x];_ in o&&(R(()=>{$e(o[_]),o[_].remove()}),delete o[_])}for(let x=0;x<p.length;x++){let[_,T]=p[x],C=o[_],y=o[T],W=document.createElement("div");R(()=>{y||K('x-for ":key" is undefined or invalid',a,T,o),y.after(W),C.after(y),y._x_currentIfEl&&y.after(y._x_currentIfEl),W.before(C),C._x_currentIfEl&&C.after(C._x_currentIfEl),W.remove()}),y._x_refreshXForScope(c[u.indexOf(T)])}for(let x=0;x<m.length;x++){let[_,T]=m[x],C=_==="template"?a:o[_];C._x_currentIfEl&&(C=C._x_currentIfEl);let y=c[T],W=u[T],Y=document.importNode(a.content,!0).firstElementChild,ee=Ne(y);at(Y,ee,a),Y._x_refreshXForScope=qt=>{Object.entries(qt).forEach(([Gt,Wt])=>{ee[Gt]=Wt})},R(()=>{C.after(Y),me(()=>de(Y))()}),typeof W=="object"&&K("x-for key cannot be an object, it must be a string or an integer",a),o[W]=Y}for(let x=0;x<b.length;x++)o[b[x]]._x_refreshXForScope(c[u.indexOf(b[x])]);a._x_prevKeys=u})}function pl(e){let t=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,n=/^\s*\(|\)\s*$/g,s=/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,r=e.match(s);if(!r)return;let a={};a.items=r[2].trim();let i=r[1].replace(n,"").trim(),o=i.match(t);return o?(a.item=i.replace(t,"").trim(),a.index=o[1].trim(),o[2]&&(a.collection=o[2].trim())):a.item=i,a}function tr(e,t,n,s){let r={};return/^\[.*\]$/.test(e.item)&&Array.isArray(t)?e.item.replace("[","").replace("]","").split(",").map(i=>i.trim()).forEach((i,o)=>{r[i]=t[o]}):/^\{.*\}$/.test(e.item)&&!Array.isArray(t)&&typeof t=="object"?e.item.replace("{","").replace("}","").split(",").map(i=>i.trim()).forEach(i=>{r[i]=t[i]}):r[e.item]=t,e.index&&(r[e.index]=n),e.collection&&(r[e.collection]=s),r}function fl(e){return!Array.isArray(e)&&!isNaN(e)}function Aa(){}Aa.inline=(e,{expression:t},{cleanup:n})=>{let s=Nt(e);s._x_refs||(s._x_refs={}),s._x_refs[t]=e,n(()=>delete s._x_refs[t])};M("ref",Aa);M("if",(e,{expression:t},{effect:n,cleanup:s})=>{e.tagName.toLowerCase()!=="template"&&K("x-if can only be used on a <template> tag",e);let r=U(e,t),a=()=>{if(e._x_currentIfEl)return e._x_currentIfEl;let o=e.content.cloneNode(!0).firstElementChild;return at(o,{},e),R(()=>{e.after(o),me(()=>de(o))()}),e._x_currentIfEl=o,e._x_undoIf=()=>{R(()=>{$e(o),o.remove()}),delete e._x_currentIfEl},o},i=()=>{e._x_undoIf&&(e._x_undoIf(),delete e._x_undoIf)};n(()=>r(o=>{o?a():i()})),s(()=>e._x_undoIf&&e._x_undoIf())});M("id",(e,{expression:t},{evaluate:n})=>{n(t).forEach(r=>Qo(e,r))});Bt((e,t)=>{e._x_ids&&(t._x_ids=e._x_ids)});Kn(Dr("@",Br(Be("on:"))));M("on",me((e,{value:t,modifiers:n,expression:s},{cleanup:r})=>{let a=s?U(e,s):()=>{};e.tagName.toLowerCase()==="template"&&(e._x_forwardEvents||(e._x_forwardEvents=[]),e._x_forwardEvents.includes(t)||e._x_forwardEvents.push(t));let i=Nn(e,t,n,o=>{a(()=>{},{scope:{$event:o},params:[o]})});r(()=>i())}));Ft("Collapse","collapse","collapse");Ft("Intersect","intersect","intersect");Ft("Focus","trap","focus");Ft("Mask","mask","mask");function Ft(e,t,n){M(t,s=>K(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`,s))}ot.setEvaluator(Or);ot.setReactivityEngine({reactive:os,effect:Eo,release:To,raw:A});var ml=ot,Ca=ml;function nr(){return`
    <div class="min-h-screen bg-gradient-to-br from-base-200 to-base-300" dir="rtl">
    <!-- Responsive Sticky Navbar -->
<div class="navbar bg-base-100/80 backdrop-blur-lg rounded-none ml-0 mr-0 sm:mx-4 lg:mx-auto max-w-6xl shadow-lg fixed top-0 left-0 right-0 z-50 mobile-navbar">
    <!-- Logo/Brand - Left side -->
    <div class="navbar-start">
        <!-- Logo container with your styling but adapted for navbar -->
        <div class="flex items-center gap-3" style="margin-right: 8px;">
            <img src="/static/vibereach-logo.png" alt="VibeReach Logo" class="w-11">
             <a class="text-2xl sm:text-3xl lg:text-3xl fustat-font font-extrabold gradient-text tracking-tight" style="font-weight:900;"> 
                فايب ريتش
            </a>    
        </div>
    </div>
    
    <!-- Desktop menu - Center -->
    <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal gap-2 px-1 fustat-font">
            <li><a href="#how-it-works" class="text-lg font-medium hover:bg-base-200 rounded-btn transition-colors">كيف تعمل</a></li>
            <li><a href="#features" class="text-lg font-medium hover:bg-base-200 rounded-btn transition-colors">الميزات</a></li>
            <li><a href="#cta" class="text-lg font-medium hover:bg-base-200 rounded-btn transition-colors">كل شيء عن النسخة التجريبية</a></li>
        </ul>
    </div>
    
    <!-- Right side - CTA Button + Mobile Menu -->
    <div class="navbar-end gap-2">
        <button class="btn btn-ghost btn-sm md:btn-md mx-1 md:mx-2 fustat-font font-bold" 
        onclick="window.location.href = '/en/';">
            EN
        </button>

        <a href="#early-access" class="btn btn-primary text-lg px-6 hidden md:inline-flex fustat-font">احصل على وصول مبكر</a>
        
        <!-- Mobile hamburger menu -->
        <div class="dropdown dropdown-end lg:hidden">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
            </div>
            <!-- Mobile menu dropdown -->
            <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100/90 backdrop-blur-lg rounded-box z-[1] mt-3 w-52 p-2 shadow-xl border border-base-300 fustat-font">
                <li><a href="#how-it-works" class="text-base font-medium py-3">كيف تعمل</a></li>
                <li><a href="#features" class="text-base font-medium py-3">الميزات</a></li>
                <li><a href="#cta" class="text-base font-medium py-3">كل شيء عن النسخة التجريبية</a></li>
                <li class="mt-2 pt-2 border-t border-base-300">
                    <a href="#early-access" class="btn btn-primary btn-sm w-full">احصل على وصول مبكر</a>
                </li>
            </ul>
        </div>
    </div>
</div>
      
      <!-- Hero Section -->
<div class="container mx-auto px-6 py-16 bg-stars container-custom relative">
    <div class="hero min-h-[85vh] relative">
        <!-- Only change flex direction on small screens -->
        <div class="hero-content flex-col lg:flex-row-reverse gap-16 max-w-7xl pt-14 lg:pt-0 relative z-10">
            <!-- Hero Image/Visual - now comes first in DOM for mobile -->
            <div class="flex-1 flex justify-center order-1 lg:order-none mobile-hero-image-container">
                <img src="/static/home/hero.webp" class="w-full max-w-md lg:max-w-none mobile-hero-image">
            </div>
            <!-- Hero Text -->
            <div class="flex-1 sm:text-center lg:text-right mobile-hero-content" dir="auto">
                <div class="badge badge-primary badge-outline text-base p-3 mb-4 hidden md:inline-flex fustat-font">
                    🚀 ودّع الإرسال اليدوي، وركّز على العملاء
                </div>
                <h1 class="text-5xl lg:text-7xl font-bold gradient-text mb-6 pb-2 leading-tight fustat-font" 
                    style="padding-bottom: 8px;">
                    حوّل إيميلاتك الباردة إلى 
                    <span class="text-primary">عملاء محتملين</span>
                </h1>
               <p class="text-xl text-base-content/80 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 fustat-font ">
                    <span class="font-semibold">تواصل شخصي على نطاق واسع</span>...<br>
<span class="pb-2">
أرسل إيميلات باردة مخصصة تصل الinbox، لا البريد المزعج.
</span>
<br>
قسّم قوائم عملائك المحتملين، خصص الإيميلات بحقول ديناميكية،<br> ثم جدول الحملات.<br>
كل ذلك مع تتبع معدل الفتح، الرد و زيارات اللينكات المضمنة  في الإيميل المرسل في مكان واحد.
</p>
                <!-- Key Benefits -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 fustat-font">
                    <div class="flex items-center gap-3 hidden md:inline-flex">
                        <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <i class="fas fa-brain text-primary"></i>
                        </div>
                        <span class="font-medium">تحرك بناءً على الأرقام</span>
                    </div>
                    <div class="flex items-center gap-3 justify-center lg:justify-start">
                        <div class="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                            <i class="fas fa-chart-line text-secondary"></i>
                        </div>
                        <span class="font-medium">تواصل على نطاق واسع</span>
                    </div>
                    <div class="flex items-center gap-3 justify-center lg:justify-start">
                        <div class="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                            <i class="fas fa-clock text-accent"></i>
                        </div>
                        <span class="font-medium">وفر أكثر من 10 ساعات أسبوعيًا</span>
                    </div>
                    <div class="flex items-center gap-3 hidden md:inline-flex">
                        <div class="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
                            <i class="fas fa-bullseye text-info"></i>
                        </div>
                        <span class="font-medium">صل إلى صندوق الوارد لعملائك</span>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start fustat-font">
                    <a href="#early-access" class="btn btn-primary btn-lg gap-2 hover:scale-105 transition-transform shadow-lg">
                        <i class="fas fa-rocket"></i>
                        انضم إلى قائمة الانتظار
                    </a>
                    <a href="https://gataraai.zohobookings.com/#/ceo-call" class="btn btn-outline btn-lg gap-2 mobile-visible-btn">
                        <i class="fas fa-play"></i>
                        احجز عرضًا تجريبيًا
                    </a>
                </div>
                <br>
            </div>
        </div>
    </div>
</div>

      
      <!-- How It Works Section -->
      <div id="how-it-works" class="bg-base-100 px-0 sm:px-6 py-20 pb-0 how-it-works-mobile-container" style="padding-left: 0px; padding-right: 0px;">
          <div class="container mx-auto px-0 sm:px-6">
               <div class="text-center mb-16 px-5 sm:px-0 fustat-font" dir="auto">
                  <div class="badge badge-primary badge-outline text-lg p-3 mb-4">
                      كيف تعمل
                  </div>
                  <h2 class="text-4xl lg:text-5xl font-bold mb-6">
                  من قائمة عملاء محتملين
                  لعملاء مهتمين </h2>
                  <p class="text-xl text-base-content/70 max-w-3xl mx-auto">
                      بسّط تواصلك البارد ب ثلاث خطوات
                  </p>
              </div>
              <!-- Process Flow -->
            <div class="max-w-6xl mx-auto mb-[10vh] px-5 sm:px-0 mb-32">
            <div class="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Step 1 -->
                <div class="flex flex-col h-full">
                    <div class="card bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                        <div class="card-body text-center p-8 flex flex-col justify-between fustat-font" dir="auto">
                           <div>
                                <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <i class="fas fa-upload text-2xl text-primary-content"></i>
                                </div>
                                <h3 class="text-2xl font-bold mb-6">
                                1. ارفع قائمة عملائك المحتملين</h3>
                            </div>
                            <div>
                               <p class="text-base-content/70 mb-6">
 حمّل الـlead list خاصتك والتي تحوي المعلومات من أسماء الأشخاص، الشركات، روابط لينكدان و حتى الـwebsites.
                                  
                                  <br><br>
                                  
كل البيانات مرتبة وبمكان واحد لحين حاجتها عندما يصبح العميل المحتمل مهتما.
                              </p>
                            </div>
                            <div class="mockup-code bg-base-200 text-left !pt-0" dir="ltr">
                                <div class="overflow-x-auto text-primary -mt-4">
                                    <table class="table table-xs">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Name</th>
                                                <th>Headline</th>
                                                <th>About</th>
                                                <th>Position</th>
                                                <th>Company</th>
                                                <th>Company About</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th>1</th>
                                                <td>Sarah Johnson</td>
                                                <td>Sarah's Headline</td>
                                                <td>Sarah's About</td>
                                                <td>Sarah's Position</td>
                                                <td>Sarah's Company</td>
                                                <td>Company About</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Arrow 1 - Positioned between cards -->
                <div class="hidden lg:block absolute left-1/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary text-2xl z-10">
                    <i class="fas fa-arrow-left"></i>
                </div>

                <!-- Step 2 -->
                <div class="flex flex-col h-full">
                    <div class="card bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                        <div class="card-body text-center p-8 flex flex-col justify-between fustat-font" dir="auto">
                            <div>
                                <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <i class="fas fa-robot text-2xl text-secondary-content"></i>
                                </div>
                                <h3 class="text-2xl font-bold mb-6">2. خصص على نطاق واسع</h3>
                            </div>
                            <div>
                              <p class="text-base-content/70 mb-6">
                                    أنشئ قوالب إيميلات بحقول ديناميكية (مثل الاسم، الدور، أو الشركة).<br><br> 
                                    يقوم النظام تلقائيًا بتخصيص كل بريد إلكتروني لعملائك، بحيث يكون تواصلك ذو صلة دون أي عمل يدوي.
                              </p>
                            </div>
                            <div class="bg-base-200 rounded-lg p-4 text-right">
                                <div class="flex items-center gap-2 mb-2">
                                    <div class="loading loading-spinner loading-2xs text-secondary" style="width: 1.2rem; height: 1.2rem;"></div>
                                    <span class="text-sm">تحليل بيانات العميل...</span>
                                </div>
                                <div class="flex items-center gap-2 mb-2">
                                    <i class="fas fa-check text-success text-sm"></i>
                                    <span class="text-sm">
                                    تخصيص كل إيميل على حده
                             </span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <i class="fas fa-check text-success text-sm"></i>
                                    <span class="text-sm">الرسالة المخصصة جاهزة</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Arrow 2 - Positioned between cards -->
                <div class="hidden lg:block absolute left-2/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-secondary text-2xl z-10">
                    <i class="fas fa-arrow-left"></i>
                </div>

                <!-- Step 3 -->
                <div class="flex flex-col h-full">
                    <div class="card bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                        <div class="card-body text-center p-8 flex flex-col justify-between fustat-font" dir="auto">
                            <div>
                                <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i class="fas fa-paper-plane text-2xl text-accent-content"></i>
                                </div>
                                <h3 class="text-2xl font-bold mb-4">3. أرسل وتتبع النتائج</h3>
                            </div>
                             <div>
                               <p class="text-base-content/70 mb-6">
                                  جدول حملتك وتتبع كل شيء...<br>
                                 معدل فتح الإيميلات، النقرات، الردود.
                                 <br><br>
                                  بتحليلات واضحة تساعدك على تحسين النتائج، والمدوبلة على ما يعمل!
                               </p>
                            </div>
                            <div class="stats stats-vertical shadow bg-base-100">
                                <div class="stat py-3">
                                    <div class="stat-title text-xs">تم التوصيل</div>
                                    <div class="stat-value text-success text-lg">97%</div>
                                </div>
                                <div class="stat py-3">
                                    <div class="stat-title text-xs">تم الفتح</div>
                                    <div class="stat-value text-primary text-lg">38.14%</div>
                                </div>
                                <div class="stat py-3">
                                    <div class="stat-title text-xs">تم الرد</div>
                                    <div class="stat-value text-accent text-lg">5-10%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    

<!-- =============================================== -->
<!-- START: LEAD SEGMENTATION SECTION               -->
<!-- =============================================== -->
<div id="features" class="relative bg-base-100 py-16 sm:py-32 overflow-hidden mt-16 mb-16 md:mt-32 md:mb-32">

    <!-- Background Image Layer with Animation Hooks - Mobile Simplified -->
    <div id="image-stack-container" class="group absolute inset-0 z-0 opacity-30 md:opacity-60 image-stack-container-lead-segmintaion">
        <div class="relative w-full h-full">
            <!-- Image 1 - Simplified for mobile -->
            <img 
                src="/static/home/webp/lead-lists-overview.webp" 
                alt="UI for lead lists" 
                class="absolute top-1/2 left-1/2 w-[90vw] max-w-4xl rounded-xl shadow-xl transition-all duration-700 ease-out transform 
                       -translate-x-1/2 -translate-y-1/2 -rotate-6
                       group-[.is-in-view]:-translate-x-1/2 group-[.is-in-view]:-translate-y-1/2 group-[.is-in-view]:-rotate-3
                       hover:!rotate-0 hover:opacity-70 hover:!z-20 min-w-0
                       md:w-[70vw] md:-translate-x-[60%] md:-translate-y-[60%] md:-rotate-12 
                       md:group-[.is-in-view]:-translate-x-[55%] md:group-[.is-in-view]:-translate-y-[55%] md:group-[.is-in-view]:-rotate-4"
            />
            <!-- Image 2 - Simplified for mobile -->
            <img 
                src="/static/home/webp/lead-list-details.webp" 
                alt="UI for a specific lead list" 
                class="absolute top-1/2 left-1/2 w-[85vw] max-w-4xl rounded-xl shadow-xl transition-all duration-700 ease-out transform 
                       -translate-x-1/2 -translate-y-1/2 rotate-6
                       group-[.is-in-view]:-translate-x-1/2 group-[.is-in-view]:-translate-y-1/2 group-[.is-in-view]:rotate-3
                       hover:!rotate-0 hover:opacity-70 hover:!z-20 min-w-0
                       md:w-[70vw] md:-translate-x-[40%] md:-translate-y-[40%] md:rotate-12
                       md:group-[.is-in-view]:-translate-x-[45%] md:group-[.is-in-view]:-translate-y-[45%] md:group-[.is-in-view]:rotate-4"
            />
        </div>
    </div>

    <!-- Foreground Content Layer - Mobile Optimized -->
    <div class="relative z-10 container mx-auto px-4 md:px-6 flex flex-col justify-between min-h-[50vh] sm:min-h-[60vh]">
      
        <!-- Top Content - Mobile Adjusted -->
        <div class="text-center pt-4 md:pt-8 header-container-lead-segmintaion fustat-font" dir="auto">
            <div class="badge badge-primary badge-outline text-sm md:text-base p-2 md:p-3 mb-3 md:mb-4 font-semibold">
                إدارة العملاء المحتملين
            </div>
             <h2 class="text-3xl md:text-5xl lg:text-7xl font-bold mb-3 md:mb-4 text-shadow-lg">
                تقسيم العملاء إلى قوائم
            </h2>
        </div>

        <!-- Bottom Content - Mobile Optimized -->
        <div class="
        p-4 md:p-6 lg:p-8 max-w-3xl mx-auto mb-4 md:mb-8
         content-container-lead-segmintaion fustat-font" dir="auto">
             <p class="text-base md:text-lg lg:text-xl text-base-content/80 mb-4 md:mb-6 font-semibold leading-relaxed font-medium text-center md:text-right">
               اجعل الرسالة المناسبة تستهدف العميل المناسب
            </p>
            <ul class="space-y-3 md:space-y-4 text-base-content/90">
                <li class="flex items-start gap-2 md:gap-3">
                    <i class="fas fa-check-circle text-secondary mt-1 md:mt-1.5 text-sm md:text-base"></i>
                    <span class="text-sm md:text-base"><strong>نظم العملاء في قوائم</strong> مختلفة حسب الحملة.</span>
                </li>
                <li class="flex items-start gap-2 md:gap-3">
                    <i class="fas fa-check-circle text-secondary mt-1 md:mt-1.5 text-sm md:text-base"></i>
                    <span class="text-sm md:text-base"><strong>
                    ارفع البيانات من أسماء و أدوار
                </strong> أو روابط اللينكدان.</span>
                </li>
                <li class="flex items-start gap-2 md:gap-3">
                    <i class="fas fa-check-circle text-secondary mt-1 md:mt-1.5 text-sm md:text-base"></i>
                    <span class="text-sm md:text-base">حافظ على تواصلك <strong>مركزًا وذا صلة.</strong></span>
                </li>
            </ul>
        </div>

    </div>
</div>

<!-- JavaScript remains the same -->
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const imageStackContainer = document.getElementById('image-stack-container');
        if (imageStackContainer) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            imageStackContainer.classList.add('is-in-view');
                        } else {
                            imageStackContainer.classList.remove('is-in-view');
                        }
                    });
                },
                { threshold: 0.2 }
            );
            observer.observe(document.getElementById('features'));
        }
    });
<\/script>
<!-- =============================================== -->
<!-- END: LEAD SEGMENTATION SECTION                 -->
<!-- =============================================== -->



<!-- =============================================== -->
<!-- START: PERSONALIZATION AT SCALE SECTION (MOBILE OPTIMIZED) -->
<!-- =============================================== -->
<div class="bg-base-200 py-16 sm:py-32" style="padding-bottom: 0px;">
    <div class="container mx-auto px-4 md:px-6">
      
        <!-- Section Header - Mobile Adjusted -->
        <div class="text-center max-w-4xl mx-auto fustat-font" dir="auto">
            <div class="badge badge-primary badge-outline text-sm md:text-base p-2 md:p-3 mb-3 md:mb-4 font-semibold">
                إيميلات ديناميكية
            </div>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">تخصيص على نطاق واسع</h2>
            <p class="text-base md:text-lg lg:text-xl text-base-content/80 leading-relaxed">
                أرسل إيميلات لا تبدو كقوالب. تنقل بين علامات التبويب لترى كيف يعمل.
            </p>
        </div>

        <!-- Interactive Visual - Mobile Optimized -->
        <div class="max-w-6xl mx-auto mt-8 md:mt-16" x-data="{ activeTab: 'variables' }">
            <!-- Lifted Tabs - Mobile Friendly -->
            <div role="tablist" class="tabs tabs-lift tabs-md md:tabs-lg justify-center md:justify-start fustat-font">
                <a role="tab" class="tab text-xs md:text-sm" :class="{ 'tab-active': activeTab === 'variables' }" @click.prevent="activeTab = 'variables'">
                    <i class="fas fa-code ml-1 md:ml-2 opacity-70"></i> قالب
                </a>
                <a role="tab" class="tab text-xs md:text-sm" :class="{ 'tab-active': activeTab === 'clean' }" @click.prevent="activeTab = 'clean'">
                    <i class="fas fa-magic ml-1 md:ml-2 opacity-70"></i> مخصص
                </a>
                <!-- Dummy tab for spacing - hidden on mobile -->
                <a role="tab" class="tab [--tab-bg:transparent] [--tab-border-color:transparent] flex-1 hidden md:block"></a>
            </div>

            <!-- Image Container - Mobile Adjusted -->
            <div class="relative w-full bg-base-100 rounded-b-box rounded-tr-box shadow-xl md:shadow-2xl mt-2">
                <div class="p-1 sm:p-2 min-h-[300px] md:min-h-[400px] lg:min-h-[450px]">
                    <!-- Image 1: With Variables -->
                    <div x-show="activeTab === 'variables'" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="transition ease-in duration-200" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0">
                        <img 
                            src="/static/home/webp/image-composer-with-variables.webp" 
                            alt="Message composer showing dynamic variables" 
                            class="w-full rounded-lg"
                        />
                    </div>
                    <!-- Image 2: Clean -->
                    <div x-show="activeTab === 'clean'" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="transition ease-in duration-200" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" style="display: none;">
                        <img 
                            src="/static/home/webp/image-composer-clean.webp" 
                            alt="A clean view of the personalized message template"
                            class="w-full rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Feature List - Using Your content-container Class -->
        <div class="content-container-dynamic-msg max-w-2xl mx-auto md:mx-0 mt-8 md:mt-12 lg:mt-16 fustat-font" dir="auto">
            <ul class="space-y-3 md:space-y-4 text-base-content/90 text-center md:text-right text-base md:text-lg">
                <li class="flex items-start gap-2 md:gap-3 justify-center md:justify-start">
                    <i class="fas fa-check-circle text-secondary mt-1 md:mt-1.5 "></i>
                    <span class="">استخدم حقولًا ديناميكية مثل <code class="text-xs md:text-sm">{first_name}</code> و <code class="text-xs md:text-sm">{company}</code>.</span>
                </li>
                <li class="flex items-start gap-2 md:gap-3 justify-center md:justify-start">
                    <i class="fas fa-check-circle text-secondary mt-1 md:mt-1.5"></i>
                    <span class="">خصص قالبًا واحدًا لمئات العملاء دفعة واحدة.</span>
                </li>
                <li class="flex items-start gap-2 md:gap-3 justify-center md:justify-start">
                    <i class="fas fa-check-circle text-secondary mt-1 md:mt-1.5"></i>
                    <span class="">وفر ساعات من العمل اليدوي وتجنب الأخطاء المكلفة.</span>
                </li>
            </ul>
        </div>

    </div>
</div>
<!-- =============================================== -->
<!-- END: PERSONALIZATION AT SCALE SECTION          -->
<!-- =============================================== -->

<!-- =============================================== -->
<!-- START: CAMPAIGN ANALYTICS SECTION (MOBILE OPTIMIZED) -->
<!-- =============================================== -->
<div class="bg-base-100 py-12 sm:py-24 section-container">
    <div class="container mx-auto px-4 md:px-6 relative">
        <!-- Text Content Container - Mobile Optimized -->
        <div class="content-container mx-auto md:mx-0 w-full md:w-11/12 lg:w-9/12 xl:w-44% fustat-font" dir="auto">
            <div class="text-center max-w-4xl mx-auto">
                <div class="badge badge-primary badge-outline text-sm md:text-base p-2 md:p-3 mb-3 md:mb-4 font-semibold">
                    تحليلات الحملة
                </div>
            </div>    
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-center md:text-right">أداء الحملة، في لمحة</h2>
          
            <p class="text-base md:text-lg text-base-content/80 mb-6 md:mb-8 leading-relaxed text-center md:text-right">
                شاهد أداء كل حملة في الوقت الفعلي ومع مرور الوقت.
            </p>
            <ul class="space-y-3 md:space-y-4 text-center md:text-right">
                <li class="flex items-start gap-2 md:gap-3 justify-center md:justify-start">
                    <i class="fas fa-check-circle text-secondary mt-1 md:mt-1.5 text-sm md:text-base"></i>
                    <span class="text-sm md:text-base">تتبع المقاييس الرئيسية مثل الإيميلات المرسلة، معدل الفتح، النقر الرد، والفرص.</span>
                </li>
                <li class="flex items-start gap-2 md:gap-3 justify-center md:justify-start">
                    <i class="fas fa-check-circle text-secondary mt-1 md:mt-1.5 text-sm md:text-base"></i>
                    <span class="text-sm md:text-base">قارن بين الحملات النشطة والمكتملة.</span>
                </li>
                <li class="flex items-start gap-2 md:gap-3 justify-center md:justify-start">
                    <i class="fas fa-check-circle text-secondary mt-1 md:mt-1.5 text-sm md:text-base"></i>
                    <span class="text-sm md:text-base">اكتشف الاتجاهات باستخدام لوحات معلومات مرئية واضحة.</span>
                </li>
                <li class="flex items-start gap-2 md:gap-3 justify-center md:justify-start">
                    <i class="fas fa-check-circle text-secondary mt-1 md:mt-1.5 text-sm md:text-base"></i>
                    <span class="text-sm md:text-base">ركز على الأداء خلال فلترة المخطط للحصول على رؤى سريعة.</span>
                </li>
            </ul>
        </div>

        <!-- Carousel Container - Mobile Optimized -->
        <div 
            class="carousel-container mt-8 md:mt-0"
            x-data="{ 
                activeSlide: 1, 
                slideCount: 3,
            }"
        >
            <!-- Slide 1 -->
            <div 
                x-show="activeSlide === 1" 
                x-transition:enter="transition ease-out duration-500"
                x-transition:enter-start="opacity-0 transform translate-y-8"
                x-transition:enter-end="opacity-100 transform translate-y-0"
                class="carousel-slide absolute inset-0 flex justify-center md:justify-end"
            >
                <img src="/static/home/webp/campaign_completed_7_d_dash.webp" class="carousel-image max-w-full md:max-w-none" alt="Active Campaign Dashboard" />
            </div> 
            <!-- Slide 2 -->
            <div 
                x-show="activeSlide === 2" 
                x-transition:enter="transition ease-out duration-500"
                x-transition:enter-start="opacity-0 transform translate-y-8"
                x-transition:enter-end="opacity-100 transform translate-y-0"
                class="carousel-slide absolute inset-0 flex justify-center md:justify-end"
            >
                <img src="/static/home/webp/campaign_completed_dash.webp" class="carousel-image max-w-full md:max-w-none" alt="Completed Campaign Dashboard" />
            </div> 
            <!-- Slide 3 -->
            <div 
                x-show="activeSlide === 3" 
                x-transition:enter="transition ease-out duration-500"
                x-transition:enter-start="opacity-0 transform translate-y-8"
                x-transition:enter-end="opacity-100 transform translate-y-0"
                class="carousel-slide absolute inset-0 flex justify-center md:justify-end"
            >
                <img src="/static/home/webp/campaign_active_dash.webp" class="carousel-image max-w-full md:max-w-none" alt="7-Day Completed Campaign Dashboard" />
            </div>
            
            <!-- Navigation Arrows - Mobile Adjusted -->
            <div class="nav-arrows right-2 md:right-0">
                <button 
                    @click="activeSlide = activeSlide === 1 ? slideCount : activeSlide - 1" 
                    class="btn btn-circle btn-accent btn-sm md:btn-md shadow-lg"
                >
                    <i class="fas fa-chevron-up text-xs md:text-sm"></i>
                </button>
                <button 
                    @click="activeSlide = activeSlide % slideCount + 1" 
                    class="btn btn-circle btn-accent btn-sm md:btn-md shadow-lg"
                >
                    <i class="fas fa-chevron-down text-xs md:text-sm"></i>
                </button>
            </div>
            
            <!-- Dots Navigation - Mobile Adjusted -->
            <div class="dot-indicators bottom-4 md:bottom-[-33px]">
                <template x-for="i in slideCount" :key="i">
                    <button 
                        class="w-2 h-2 md:w-3 md:h-3 rounded-full transition-all"
                        :class="{'bg-accent scale-125': activeSlide === i, 'bg-gray-400': activeSlide !== i}"
                        @click="activeSlide = i"
                    ></button>
                </template>
            </div>
        </div>
    </div>
</div>
<!-- =============================================== -->
<!-- END: CAMPAIGN ANALYTICS SECTION                -->
<!-- =============================================== -->



<!-- =============================================== -->
<!-- START: EMAIL-LEVEL ANALYTICS SECTION           -->
<!-- =============================================== -->
<div class="bg-base-100 py-16 sm:py-32 relative overflow-hidden">
    <!-- Background Images - Mobile Simplified Layout -->
    <div class="bg-imgs-email-analaticss absolute inset-0 z-0 opacity-40 md:opacity-70"> 
        <!-- Right Image - Mobile Adjusted -->
        <div class="absolute right-0 top-1/2 -translate-y-1/2 md:-translate-y-2/3 w-4/5 max-w-5xl">
            <img 
                src="/static/home/webp/recipient_activity_report_2.webp" 
                alt="Continuation of Recipient Activity Report with detailed tracking" 
                class="w-full rounded-lg md:rounded-xl shadow-lg md:shadow-2xl transform rotate-2 md:rotate-3 transition-all duration-500"
            />
        </div>

        <!-- Left Image - Mobile Adjusted -->
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-4/5 max-w-5xl">
            <img 
                src="/static/home/webp/recipient_activity_report_1.webp" 
                alt="Recipient Activity Report showing leads, subject, and status" 
                class="w-full rounded-lg md:rounded-xl shadow-lg md:shadow-2xl transform -rotate-2 md:-rotate-3 transition-all duration-500"
            />
        </div>
    </div>

   <!-- Content Container - Mobile Optimized -->
    <div class="relative z-10 container mx-auto px-4 md:px-6 flex justify-center">
        <div class="content-container-vertical bg-gradient-to-t from-base-100/95 to-base-100/70 md:from-base-100/90 md:to-base-100/50 
                backdrop-blur-sm md:backdrop-blur-md rounded-xl 
                md:rounded-2xl p-6 md:p-8 max-w-4xl mx-auto w-full border border-base-content/10 shadow-lg md:shadow-2xl 
                mt-[40vh] md:mt-[60vh] content-container-vertical-issue-email-analatics fustat-font" dir="auto">
            <!-- Centered Header Content -->
            <div class="text-center max-w-4xl mx-auto">
                <div class="badge badge-primary badge-outline text-sm md:text-base p-2 md:p-3 mb-3 md:mb-4 font-semibold">
                    تحليلات البريد الإلكتروني
                </div>
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                    كلّ عميل، كلّ إجراء، وكلّ وقت
                </h2>
                <p class="text-base md:text-lg text-base-content/80 mb-6 md:mb-8 leading-relaxed text-center">
                    تجاوز المقاييس السطحية.<br>يُظهر تقرير نشاط الاستلام لدينا ما يحدث بالضبط!
                </p>
            </div>
            
            <!-- Mobile-centered content -->
            <div class="text-center md:text-right content-ul-email-analaticss ">
                <p class="text-base-content/90 mb-3 md:mb-2 text-base md:text-lg">
                    ولكل بريد إلكتروني:
                </p>
                <ul class="space-y-3 md:space-y-4 text-base-content/90 max-w-2xl mx-auto md:mx-0">
                    <li class="flex items-start gap-2 md:gap-3 justify-center md:justify-start">
                        <i class="fas fa-check-circle text-secondary mt-1 md:mt-1.5 text-sm md:text-base"></i>
                        <span class="text-sm md:text-base">شاهد ما إذا كان كل مستلم قد <strong>فتح، نقر، أو رد</strong> — ومتى.</span>
                    </li>
                    <li class="flex items-start gap-2 md:gap-3 justify-center md:justify-start">
                        <i class="fas fa-check-circle text-secondary mt-1 md:mt-1.5 text-sm md:text-base"></i>
                        <span class="text-sm md:text-base">تتبع سجل الإيميلات مع <strong> مع التواريخ والأوقات لسياق كامل</strong>.</span>
                    </li>
                    <li class="flex items-start gap-2 md:gap-3 justify-center md:justify-start">
                        <i class="fas fa-check-circle text-secondary mt-1 md:mt-1.5 text-sm md:text-base"></i>
                        <span class="text-sm md:text-base">
                        ضع علامة 
                         <strong>
                        "تم الرد" 
                         </strong>
                        على العملاء المهتمين لتحويلهم لفرصة
                        </span>
                    </li>
                    <li class="flex items-start gap-2 md:gap-3 justify-center md:justify-start">
                        <i class="fas fa-check-circle text-secondary mt-1 md:mt-1.5 text-sm md:text-base"></i>
                        <span class="text-sm md:text-base"><strong>حدد أولويات المتابعة</strong> بناءً على التفاعل الفعلي.</span>
                    </li>
                </ul>
            </div>
            
            <div class="text-center mt-6 md:mt-8">
                 <div class="badge badge-accent badge-md md:badge-lg p-3 md:p-4 text-accent-content text-base md:text-sm">
                    ⚡ 
                  تحرك بناءً على النتائج لا الظن!
                </div>
            </div>
        </div>
    </div>
</div>
<!-- =============================================== -->
<!-- END: EMAIL-LEVEL ANALYTICS SECTION             -->
<!-- =============================================== -->



<!-- =============================================== -->
<!-- START: BENEFITS SECTION (MOBILE OPTIMIZED)      -->
<!-- =============================================== -->
<div class="bg-base-100 py-16 sm:py-32 fustat-font" dir="auto">
    <div class="container mx-auto px-4 md:px-6">
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                إيميل بارد يعمل <span class="text-success">بالطريقة التي ينبغي أن يعمل بها</span>
            </h2>
            <p class="text-lg md:text-xl text-base-content/80 leading-relaxed">
                لا تتوقع أن يحقق الإيميل البارد نتائج فورية.<br>
                في الحقيقة، هو مجرد نقطة اتصال [touch point] واحدة مع عملائك المستقبليين!
            </p>
        </div>

        <!-- Value Proposition -->
        <div class="text-center max-w-4xl mx-auto mb-12 md:mb-16">
            <p class="text-xl md:text-2xl font-semibold text-primary mb-0">
                مع <span class="gradient-text">فايب ريتش</span>:
            </p>
        </div>

        <!-- Three Column Benefits - Mobile Stacked -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <!-- Benefit 1: Stay Organized -->
            <div class="card bg-gradient-to-br from-base-200 to-base-100 border border-base-300 shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl transition-all duration-300 h-full">
                <div class="card-body text-center p-6 md:p-8">
                    <div class="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <svg class="w-10 h-10 md:w-12 md:h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl md:text-2xl font-bold mb-3 md:mb-4">ابق منظمًا</h3>
                    <p class="text-base-content/70 text-sm md:text-base">
                        أنشئ وأدر قوائم عملائك المحتملين — حتى ترسل دائمًا <span class="gradient-text">الإيميل الصحيح</span> إلى <span class="gradient-text">العميل المناسب</span>.
                    </p>
                </div>
            </div>

            <!-- Benefit 2: Be Present Consistently -->
            <div class="card bg-gradient-to-br from-base-200 to-base-100 border border-base-300 shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl transition-all duration-300 h-full">
                <div class="card-body text-center p-6 md:p-8">
                    <div class="w-16 h-16 md:w-20 md:h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <svg class="w-8 h-8 md:w-10 md:h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl md:text-2xl font-bold mb-3 md:mb-4">كن حاضرًا باستمرار</h3>
                    <p class="text-base-content/70 text-sm md:text-base">
                        أرسل الحملات على نطاق واسع مع <span class="success-gradient">الحفاظ على التخصيص</span>!
                    </p>
                </div>
            </div>

            <!-- Benefit 3: Double Down on What Works -->
            <div class="card bg-gradient-to-br from-base-200 to-base-100 border border-base-300 shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl transition-all duration-300 h-full">
                <div class="card-body text-center p-6 md:p-8">
                    <div class="w-16 h-16 md:w-20 md:h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <svg class="w-8 h-8 md:w-10 md:h-10 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl md:text-2xl font-bold mb-3 md:mb-4">ركز على ما ينجح</h3>
                    <p class="text-base-content/70 text-sm md:text-base">
                        تتبع النقرات، الردود والتفاعل <br class="hidden sm:inline">& <span class="info-gradient">ركز على العملاء المهتمين</span>.
                    </p>
                </div>
            </div>
        </div>

        <!-- Closing Statement -->
        <div class="text-center max-w-3xl mx-auto mt-12 md:mt-16">
            <p class="text-lg md:text-xl text-base-content/70 italic leading-relaxed text-[16px] md:text-lg">
                فايب ريتش... هو مجرد زميل لك، متخصص في إرسال إيميلاتك الباردة — يبقيك مرئيًا ومتابعًا مع العملاء المحتملين، بينما تركز أنت على العملاء المهتمين حقا، والمحادثات التي تغلق الصفقات.
            </p>
        </div>
    </div>
</div>
<!-- =============================================== -->
<!-- END: BENEFITS SECTION                          -->
<!-- =============================================== -->




<!-- =============================================== -->
<!-- START: FINAL CALL TO ACTION (CTA) SECTION      -->
<!-- =============================================== -->
<div id="cta" class="px-4 py-10 md:py-28 bg-base-100 relative overflow-hidden fustat-font" dir="auto">
  <!-- Blurred Dashboard Background -->
  <div class="absolute inset-0 z-0">
    <!-- Vertical gradient overlay for the image -->
    <div class="absolute inset-0 bg-gradient-to-b from-base-100/0 via-base-100/20 to-base-100/70"></div>
    <img 
      src="/static/home/webp/overall_dash_orange.webp" 
      alt="VibeReach Dashboard Overview" 
      class="w-full h-full object-cover opacity-20"
      style="filter: blur(4px);"
    />
  </div>

  <!-- Glass Effect Overlay (optional, can adjust or remove) -->
  <div class="absolute inset-0 z-1 bg-gradient-to-b from-base-100/50 via-base-100/20 to-base-100/10 backdrop-blur-sm"></div>

  <div class="container mx-auto px-0 md:px-6 py-20 text-center relative z-10">
    <h2 class="text-4xl md:text-5xl font-bold text-base-content">
     أمستعدٌ لجعل التواصل <span class="disappear-gradient">أقل جهدًا</span> و <span class="success-gradient">أكثر نتائجًا؟</span> 
    </h2>
    <p class="text-lg text-base-content/70 mt-4 mb-8 max-w-2xl mx-auto leading-relaxed">
      سيساعدك فايب ريتش على تبسيط التواصل البارد، وتتبع ما ينجح، ثم التواصل مع العملاء بطريقة أذكى — دون تخمين.
    </p>
    <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
      <a href="#early-access" class="btn btn-primary btn-lg gap-2 shadow-lg hover:scale-105 transition-transform">
        احصل على وصول مبكر
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H4" />
        </svg>
      </a>
      <a href="https://gataraai.zohobookings.com/#/ceo-call" class="btn btn-outline btn-lg gap-2">
        <i class="fas fa-play"></i>
        احجز عرضًا تجريبيًا
      </a>
    </div>
    <p class="text-sm text-base-content/50 mt-4">
      كن جزءًا من النسخة التجريبية — ملاحظاتك تشكل فايب ريتش.
    </p>
  </div>
</div>
<!-- =============================================== -->
<!-- END: FINAL CALL TO ACTION (CTA) SECTION        -->
<!-- =============================================== -->


</div>




<!-- =============================================== -->
<!-- START: FOOTER SECTION                          -->
<!-- =============================================== -->
<footer class="w-full px-6 py-12 bg-base-200 border-t border-base-300/30 mt-24 fustat-font" dir="auto">
  <div class="container mx-auto">
    <!-- Main Footer Content -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-8">
      <!-- Branding -->
      <div class="flex flex-col items-center md:items-start">
          <div class="flex items-center gap-3 mb-2">
                  <img src="/static/home/logo/webp/vibereach-logoo-bg-base-200.webp" alt="VibeReach Logo" class="w-10">
              <a class="text-2xl font-semibold playpen-sans-arabic gradient-text tracking-tight" dir="auto" font-weight="900">
                  فايب ريتش
              </a>
          </div>
          <p class="text-base-content/60 text-sm max-w-xs text-center md:text-right">
              تواصل بارد يعمل بالفعل. لا تخمين، نتائج فقط.
          </p>
      </div>

      <!-- Social Links -->
      <div class="flex flex-col items-center md:items-end">
        <div class="flex items-center justify-center gap-5 mb-4">
          <a href="https://www.linkedin.com/showcase/vibereach/" target="_blank" class="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center hover:bg-primary hover:text-primary-content transition-colors">
            <i class="fab fa-linkedin"></i>
          </a>
          <a href="mailto:vibereach@gatara.org" class="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center hover:bg-primary hover:text-primary-content transition-colors">
            <i class="fas fa-envelope"></i>
          </a>
          <a href="https://gatara.org" target="_blank" class="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center hover:bg-primary hover:text-primary-content transition-colors">
            <i class="fas fa-globe"></i>
          </a>
        </div>
        
        <!-- Copyright -->
        <div class="text-center md:text-right">
          <p class="text-base-content/60 text-sm" dir="auto">
            © 2025 <span class="font-semibold text-base-content" dir="auto"><bdi>GataraAI</bdi></span><bdi> جميع الحقوق محفوظة.</bdi> 
          </p>
        </div>
      </div>
    </div>

    <!-- Bottom divider -->
    <div class="border-t border-base-300/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
      <!-- Legal links -->
      <div class="flex gap-6 mb-4 md:mb-0">
        <a href="#" class="text-base-content/60 hover:text-primary text-sm transition-colors">سياسة الخصوصية</a>
        <a href="#" class="text-base-content/60 hover:text-primary text-sm transition-colors">شروط الخدمة</a>
      </div>
      
      <!-- Made with love -->
      <p class="text-base-content/40 text-sm">
        صنع بـ <i class="fas fa-heart text-red-400"></i> لفرق المبيعات
      </p>
    </div>
  </div>
</footer>
<!-- =============================================== -->
<!-- END: FOOTER SECTION                            -->
<!-- =============================================== -->








</div>
    
  `}document.addEventListener("alpine:init",()=>{Alpine.data("scrollHandler",()=>({active:!1,init(){}}))});function hl(){return`
    <div class="min-h-screen bg-base-200">
      <div class="container mx-auto px-1 sm:px-6 py-8">
        <div class="mb-8">
          <a href="#landing" class="btn btn-ghost gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>
        
        <div id="user-section" class="max-w-2xl mx-auto">
          <div class="card bg-base-100 shadow-2xl">
            <div class="card-body p-8">
              <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-base-content mb-1">Get Started</h1>
                <h1 class="text-xl text-base-content mb-2 hormozi-gradient-text">Generate Hormozi-Style Headlines & Email Subjects for Free! ;)</h1>
                <p class="text-lg text-base-content/70">First, we need some basic information about you</p>
              </div>
              
              <form id="user-form" class="space-y-6">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold">Full Name</span>
                  </label>
                  <input type="text" id="name" name="name" class="input input-bordered input-lg" placeholder="Your Full Name" required>
                  <div id="name-error" class="label hidden">
                    <span class="label-text-alt text-error"></span>
                  </div>
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold">LinkedIn Profile Link</span>
                  </label>
                  <input type="url" id="linkedin" name="linkedin" class="input input-bordered input-lg" placeholder="https://linkedin.com/in/your-profile" required>
                  <div id="linkedin-error" class="label hidden">
                    <span class="label-text-alt text-error"></span>
                  </div>
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold">Business Email</span>
                  </label>
                  <input type="email" id="email" name="email" class="input input-bordered input-lg"  placeholder="Your Business Email" required>
                  <div id="email-error" class="label hidden">
                    <span class="label-text-alt text-error"></span>
                  </div>
                  <div class="label">
                    <span class="label-text-alt text-base-content/60">Gmail/Outlook addresses are not accepted for business use</span>
                  </div>
                </div>
                
                <button type="submit" class="btn btn-primary btn-lg w-full">
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div id="ai-section" class="max-w-3xl mx-auto hidden">
          <div class="card bg-base-100 shadow-2xl">
            <div class="card-body p-8">
              <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-base-content mb-4">Generate Hormozi-style headlines and subjects for your cold outreach!</h1>
                <div class="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span class="font-semibold">⚠️ You only got one shot, use it wisely!</span>
                </div>
              </div>
              
              <form id="ai-form" class="space-y-6">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold">Email Content</span>
                  </label>
                  <textarea id="email_content" name="email_content" class="textarea textarea-bordered textarea-lg h-32" placeholder="INSERT EMAIL BODY HERE" required></textarea>
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold">Target Audience</span>
                  </label>
                  <input type="text" id="target_audience" name="target_audience" class="input input-bordered input-lg" placeholder="e.g., B2B SaaS founders, 51–200 employees" required>
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold">Tone of Voice</span>
                  </label>
                  <input type="text" id="tone_of_voice" name="tone_of_voice" class="input input-bordered input-lg" placeholder="e.g., like Hormozi meets cold email pro" required>
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold">Main Pain Point</span>
                  </label>
                  <textarea id="main_pain" name="main_pain" class="textarea textarea-bordered textarea-lg h-24" placeholder="Manual cold outreach is time-consuming, lack of personalization, doesn't scale" required></textarea>
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold">Outcome We Promise</span>
                  </label>
                  <input type="text" id="outcome" name="outcome" class="input input-bordered input-lg" placeholder="Get more replies and convert more." required>
                </div>
                
                <button type="submit" class="btn btn-primary btn-lg w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Headlines
                </button>
              </form>
            </div>
          </div>
        </div>

        <div id="loader-section" class="max-w-2xl mx-auto hidden">
          <div class="card bg-base-100 shadow-2xl">
            <div class="card-body p-12 text-center">
              <!-- loder -->
              <div class="flex-col gap-4 w-full flex items-center justify-center pb-4">
                <div
                  class="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
                >
                  <div
                    class="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
                  ></div>
                </div>
              </div>

              <h2 class="text-3xl font-bold text-base-content mb-4">Bear with me for a minute...</h2>
              <p class="text-lg text-base-content/70 leading-relaxed">I'm not a normal AI, and I focus on results and it will be valuable for you, so I will take time to think ;)</p>
            </div>
          </div>
        </div>

        <div id="result-section" class="max-w-4xl mx-auto hidden">
          <!-- Results will be populated here -->
        </div>
      </div>
    </div>
  `}function gl(){return`
    <div class="min-h-screen bg-base-200">
      <div class="container mx-auto px-1 sm:px-6 py-8">
        <div class="mb-8">
          <a href="#landing" class="btn btn-ghost gap-2">
            <span class="fustat-font" dir="auto">العودة للصفحة الرئيسية</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
        
        <div class="w-full max-w-4xl mx-auto flex flex-col justify-center">
          <!-- Welcome Screen -->
          <div id="welcome-screen" class="bg-base-100 rounded-xl shadow-lg p-6 md:p-10 flex flex-col items-center justify-center text-center">
            <div class="mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold text-base-content mb-4 fustat-font" dir="auto">احصل على وصول مبكر حصري</h1>
            <p class="text-lg md:text-xl text-base-content/80 leading-relaxed mb-8 max-w-2xl mx-auto fustat-font" dir="auto">
              كن من بين الأوائل الذين يجربون فايب ريتش — <span class="text-primary">زميلك الآلي</span> الذي سيساعدك بتبسيط التواصل البارد، وتتبع ما ينجح، ثم التواصل مع العملاء بطريقة أذكى — دون تخمين.
            </p>
            <div class="space-y-4 w-full max-w-xs">
              <button id="start-form" class="btn btn-primary btn-lg w-full text-lg transform transition-transform hover:scale-[1.02] active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
                </svg>
                <span class="fustat-font" dir="auto">قدّم طلبك الآن</span>
              </button>
              <p class="text-sm text-base-content/60 fustat-font" dir="auto">يستغرق دقيقتين فقط</p>
            </div>
            <div class="mt-8 flex items-center space-x-4">
              <div class="flex -space-x-2 space-x-reverse">
                <div class="h-8 w-8 rounded-full bg-primary/20 border-2 border-base-100"></div>
                <div class="h-8 w-8 rounded-full bg-primary/30 border-2 border-base-100"></div>
                <div class="h-8 w-8 rounded-full bg-primary/40 border-2 border-base-100"></div>
              </div>
              <p class="text-sm text-base-content/60 fustat-font" dir="auto">انضم إلى مستخدمي فايب ريتش الأوائل</p>
            </div>
          </div>

          <!-- Multi-step Form -->
          <div id="form-container" class="bg-base-100 rounded-xl shadow-lg hidden">
            <!-- Progress Bar -->
            <div class="px-6 pt-6 sticky top-0 bg-base-100 z-10 border-b border-base-200">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-base-content/70 fustat-font" dir="auto">خطوة <span id="progress-text">1</span> من 13</span>
                <span id="progress-percent" class="text-sm font-medium text-primary">8%</span>
              </div>
              <div class="w-full bg-base-200 rounded-full h-2.5 mb-4">
                <div id="progress-bar" class="bg-primary h-2.5 rounded-full transition-all duration-300" style="width: 7.7%"></div>
              </div>
            </div>

            <div class="px-6 pb-8">
              <form id="early-access-form" class="flex flex-col">
                <!-- Step 1: Name -->
                <div class="form-step active" data-step="1">
                  <div class="py-8 md:py-12 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-3 fustat-font" dir="auto">ما هو اسمك؟</h2>
                    <p class="text-base-content/60 max-w-md mx-auto fustat-font" dir="auto">سنستخدم هذا لتخصيص تجربتك</p>
                  </div>
                  <div class="max-w-md mx-auto">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-control">
                        <label class="label">
                          <span class="label-text text-base-content/70 fustat-font" dir="auto">الاسم الأخير</span>
                        </label>
                        <input type="text" name="lastName" class="input input-bordered w-full text-lg fustat-font" placeholder="جتاره" dir="auto" required>
                      </div>
                      
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text text-base-content/70 fustat-font" dir="auto">الاسم الأول</span>
                        </label>
                        <div class="relative">
                          <input type="text" name="firstName" class="input input-bordered w-full text-lg pr-10 fustat-font" placeholder="عمر" dir="auto" required>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute right-3 top-3.5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>

                <!-- Step 2: Business Email -->
                <div class="form-step" data-step="2">
                  <div class="py-8 md:py-12 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-3 fustat-font" dir="auto">ما هو بريدك الإلكتروني التجاري؟</h2>
                    <p class="text-base-content/60 max-w-md mx-auto fustat-font" dir="auto">سنرسل دعوة الوصول المبكر الخاصة بك إلى هنا</p>
                  </div>
                  <div class="max-w-md mx-auto">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text text-base-content/70 fustat-font" dir="auto">عنوان البريد الإلكتروني</span>
                      </label>
                      <div class="relative">
                        <input type="email" name="email" class="input input-bordered w-full text-lg pr-10" placeholder="john@company.com" dir="auto" required>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute right-3 top-3.5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <label class="label">
                        <span class="label-text-alt text-base-content/50 fustat-font" dir="auto">الرجاء استخدام عنوان بريدك الإلكتروني التجاري</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Step 3: Position -->
                <div class="form-step" data-step="3">
                  <div class="py-8 md:py-12 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-3 fustat-font" dir="auto">ما هو منصبك الوظيفي؟</h2>
                    <p class="text-base-content/60 max-w-md mx-auto fustat-font" dir="auto">يساعدنا ذلك في تخصيص التجربة لدورك</p>
                  </div>
                  <div class="max-w-md mx-auto">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text text-base-content/70 fustat-font" dir="auto">دورك الوظيفي</span>
                      </label>
                      <div class="relative">
                        <input type="text" name="position" class="input input-bordered w-full text-lg pr-10 fustat-font" placeholder="مثال: مدير مبيعات، مدير تسويق" dir="auto" required>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute right-3 top-3.5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 4: LinkedIn -->
                <div class="form-step" data-step="4">
                  <div class="py-8 md:py-12 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-3 fustat-font" dir="auto">ما هو ملفك الشخصي على لينكد إن؟</h2>
                    <p class="text-base-content/60 max-w-md mx-auto fustat-font" dir="auto">يساعدنا هذا في التحقق من أنك محترف حقيقي</p>
                  </div>
                  <div class="max-w-md mx-auto">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text text-base-content/70 fustat-font" dir="auto">رابط لينكد إن</span>
                      </label>
                      <div class="relative">
                        <input type="url" name="linkedin" class="input input-bordered w-full text-lg pr-10" placeholder="https://linkedin.com/in/your-profile" dir="auto" required>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute right-3 top-3.5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 5: Company Name -->
                <div class="form-step" data-step="5">
                  <div class="py-8 md:py-12 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-3 fustat-font" dir="auto">ما هي الشركة التي تعمل بها؟</h2>
                    <p class="text-base-content/60 max-w-md mx-auto fustat-font" dir="auto">يساعدنا هذا على فهم احتياجاتك بشكل أفضل</p>
                  </div>
                  <div class="max-w-md mx-auto">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text text-base-content/70 fustat-font" dir="auto">اسم الشركة</span>
                      </label>
                      <div class="relative">
                        <input type="text" name="company" class="input input-bordered w-full text-lg pr-10 fustat-font" placeholder="شركة أكمي" dir="auto" required>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute right-3 top-3.5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 6: Company Website -->
                <div class="form-step" data-step="6">
                  <div class="py-8 md:py-12 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-3 fustat-font" dir="auto">ما هو موقع شركتك الإلكتروني؟</h2>
                    <p class="text-base-content/60 max-w-md mx-auto fustat-font" dir="auto">سنبحث عن شركتك لتخصيص العرض التوضيحي لك</p>
                  </div>
                  <div class="max-w-md mx-auto">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text text-base-content/70 fustat-font" dir="auto">رابط الموقع الإلكتروني</span>
                      </label>
                      <div class="relative">
                        <input type="url" name="website" class="input input-bordered w-full text-lg pr-10" placeholder="https://yourcompany.com" dir="auto" required>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute right-3 top-3.5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 7: Cold Outreach -->
                <div class="form-step" data-step="7">
                  <div class="py-8 md:py-12 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-3 fustat-font" dir="auto">هل تدير حاليًا حملات تواصل باردة؟</h2>
                    <p class="text-base-content/60 max-w-md mx-auto fustat-font" dir="auto">يساعدنا هذا على فهم سير عملك الحالي</p>
                  </div>
                  <div class="max-w-md mx-auto space-y-3">
                    <div class="form-control">
                      <label class="label cursor-pointer justify-start gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors" dir="auto">
                        <input type="radio" name="outreach" value="active" class="radio radio-primary" required>
                        <span class="label-text text-lg text-base-content fustat-font">نعم - نقوم حاليًا بحملات تواصل باردة</span>
                      </label>
                    </div>
                    <div class="form-control">
                      <label class="label cursor-pointer justify-start gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors" dir="auto">
                        <input type="radio" name="outreach" value="soon" class="radio radio-primary" required>
                        <span class="label-text text-lg text-base-content fustat-font">لا - لكننا نرغب في البدء قريبًا</span>
                      </label>
                    </div>
                    <div class="form-control">
                      <label class="label cursor-pointer justify-start gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors" dir="auto">
                        <input type="radio" name="outreach" value="exploring" class="radio radio-primary" required>
                        <span class="label-text text-lg text-base-content fustat-font">لا - نستكشف الخيارات فقط</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Step 8: Automation -->
                <div class="form-step" data-step="8">
                  <div class="py-8 md:py-12 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-3 fustat-font" dir="auto">هل عملية التواصل البارد الحالية لديك مؤتمتة؟</h2>
                    <p class="text-base-content/60 max-w-md mx-auto fustat-font" dir="auto">يساعدنا هذا على فهم مجموعة التقنيات التي تستخدمها</p>
                  </div>
                  <div class="max-w-md mx-auto space-y-3">
                    <div class="form-control">
                      <label class="label cursor-pointer justify-start gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors" dir="auto">
                        <input type="radio" name="automation" value="fully" class="radio radio-primary" required>
                        <span class="label-text text-lg text-base-content fustat-font">مؤتمتة بالكامل</span>
                      </label>
                    </div>
                    <div class="form-control">
                      <label class="label cursor-pointer justify-start gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors" dir="auto">
                        <input type="radio" name="automation" value="partially" class="radio radio-primary" required>
                        <span class="label-text text-lg text-base-content fustat-font">مؤتمتة جزئيًا</span>
                      </label>
                    </div>
                    <div class="form-control">
                      <label class="label cursor-pointer justify-start gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors" dir="auto">
                        <input type="radio" name="automation" value="manual" class="radio radio-primary" required>
                        <span class="label-text text-lg text-base-content fustat-font">يدوية بالكامل</span>
                      </label>
                    </div>
                    <div class="form-control">
                      <label class="label cursor-pointer justify-start gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors" dir="auto">
                        <input type="radio" name="automation" value="none" class="radio radio-primary" required>
                        <span class="label-text text-lg text-base-content fustat-font">لم نبدأ حملات التواصل بعد</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Step 9: Tools -->
                <div class="form-step" data-step="9">
                  <div class="py-8 md:py-12 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-3 fustat-font" dir="auto">ما هي أدوات الأتمتة التي تستخدمها حاليًا للتواصل؟</h2>
                    <p class="text-base-content/60 max-w-md mx-auto fustat-font" dir="auto">يساعدنا هذا على التكامل مع سير عملك الحالي</p>
                  </div>
                  <div class="max-w-md mx-auto">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text text-base-content/70 fustat-font" dir="auto">الأدوات (إن وجدت)</span>
                      </label>
                      <div class="relative">
                        <input type="text" name="tools" class="input input-bordered w-full text-lg pr-10 fustat-font" placeholder="مثال: Outreach, SalesLoft, Apollo, أو لا شيء" dir="auto" required>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute right-3 top-3.5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 10: Challenge -->
                <div class="form-step" data-step="10">
                  <div class="py-8 md:py-12 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-3 fustat-font" dir="auto">ما هو أكبر تحدٍ تواجهه في سير عملك الحالي للتواصل؟</h2>
                    <p class="text-base-content/60 max-w-md mx-auto fustat-font" dir="auto">سنركز على حل هذا التحدي لك أولاً</p>
                  </div>
                  <div class="max-w-md mx-auto">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text text-base-content/70 fustat-font" dir="auto">التحدي الذي تواجهه</span>
                      </label>
                      <div class="relative">
                       <textarea 
                          name="challenge" 
                          class="textarea textarea-bordered w-full text-lg pr-10 min-h-[100px] fustat-font" 
                          placeholder="التواصل اليدوي يستغرق وقتًا طويلاً، يفتقر إلى التخصيص، ولا يمكن توسيعه"
                          dir="auto"
                          required
                        ></textarea>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute right-3 top-3.5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 11: Volume -->
                <div class="form-step" data-step="11">
                  <div class="py-8 md:py-12 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-3 fustat-font" dir="auto">كم عدد العملاء المحتملين الذين تتواصل معهم شهريًا؟</h2>
                    <p class="text-base-content/60 max-w-md mx-auto fustat-font" dir="auto">يساعدنا هذا على فهم حجم احتياجاتك</p>
                  </div>
                  <div class="max-w-md mx-auto space-y-3">
                    <div class="form-control">
                      <label class="label cursor-pointer justify-start gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors" dir="auto">
                        <input type="radio" name="volume" value="<100" class="radio radio-primary" required>
                        <span class="label-text text-lg text-base-content fustat-font">أقل من 100</span>
                      </label>
                    </div>
                    <div class="form-control">
                      <label class="label cursor-pointer justify-start gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors" dir="auto">
                        <input type="radio" name="volume" value="100-500" class="radio radio-primary" required>
                        <span class="label-text text-lg text-base-content">100–500</span>
                      </label>
                    </div>
                    <div class="form-control">
                      <label class="label cursor-pointer justify-start gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors" dir="auto">
                        <input type="radio" name="volume" value="500-2000" class="radio radio-primary" required>
                        <span class="label-text text-lg text-base-content">500–2,000</span>
                      </label>
                    </div>
                    <div class="form-control">
                      <label class="label cursor-pointer justify-start gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors" dir="auto">
                        <input type="radio" name="volume" value="2000+" class="radio radio-primary" required>
                        <span class="label-text text-lg text-base-content fustat-font">أكثر من 2,000</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Step 12: CRM -->
                <div class="form-step" data-step="12">
                  <div class="py-8 md:py-12 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-3 fustat-font" dir="auto">ما هو برنامج إدارة علاقات العملاء (CRM) الذي تستخدمه؟</h2>
                    <p class="text-base-content/60 max-w-md mx-auto fustat-font" dir="auto">سنعطي الأولوية للتكامل مع برنامج CRM الخاص بك</p>
                  </div>
                  <div class="max-w-md mx-auto">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text text-base-content/70 fustat-font" dir="auto">اسم برنامج CRM</span>
                      </label>
                      <div class="relative">
                        <input type="text" name="crm" class="input input-bordered w-full text-lg pr-10 fustat-font" placeholder="مثال: Salesforce, HubSpot, Pipedrive, أو لا شيء" dir="auto" required>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute right-3 top-3.5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 13: Chat -->
                <div class="form-step" data-step="13">
                  <div class="py-8 md:py-12 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-base-content mb-3 fustat-font" dir="auto">هل تريد الحصول على أولوية الوصول؟</h2>
                    <p class="text-base-content/60 max-w-md mx-auto fustat-font" dir="auto">مكالمة سريعة لمدة 15 دقيقة تضعك في مقدمة قائمة الانتظار</p>
                  </div>
                  <div class="max-w-md mx-auto space-y-3">
                    <div class="form-control">
                      <label class="label cursor-pointer justify-start gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors" dir="auto">
                        <input type="radio" name="chat" value="yes" class="radio radio-primary" required>
                        <span class="label-text text-lg text-base-content fustat-font">نعم، احجز لي مكالمة سريعة</span>
                      </label>
                    </div>
                    <div class="form-control">
                      <label class="label cursor-pointer justify-start gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors" dir="auto">
                        <input type="radio" name="chat" value="no" class="radio radio-primary" required>
                        <span class="label-text text-lg text-base-content fustat-font">لا شكرًا، أضفني إلى قائمة الانتظار فقط</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="flex justify-between items-center mt-12 max-w-md mx-auto w-full">
                  <button type="button" id="prev-btn" class="btn btn-ghost text-primary hover:bg-primary/10 gap-2" disabled>
                    <span class="fustat-font" dir="auto">السابق</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                  <div class="flex items-center gap-2 text-sm text-base-content/50">
                    <span id="current-step">1</span>
                    <span>/</span>
                    <span>13</span>
                  </div>
                  <button type="button" id="next-btn" class="btn btn-primary gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    <span class="fustat-font" dir="auto">التالي</span>
                  </button>
                  <button type="submit" id="submit-btn" class="btn btn-primary gap-2 hidden">
                    <span class="fustat-font" dir="auto">إرسال الطلب</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Thank You Screen -->
          <div id="thank-you-screen" class="bg-base-100 rounded-xl shadow-lg p-8 md:p-12 hidden">
            <div class="text-center max-w-2xl mx-auto">
              <div class="mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 class="text-3xl md:text-4xl font-bold text-base-content mb-4 fustat-font" dir="auto">لقد تم تسجيلك في القائمة!</h1>
              <p class="text-lg text-base-content/80 leading-relaxed mb-8 fustat-font" dir="auto">
                شكرًا لتقديم طلب الوصول المبكر إلى فايب ريتش. سنراجع طلبك وسنعاود التواصل معك قريبًا بدعوتك الحصرية.
              </p>
              <div class="space-y-4">
                <div id="chat-option" class="hidden">
                  <p class="text-base-content/70 mb-4 fustat-font" dir="auto">هل تريد تخطي قائمة الانتظار؟</p>
                  <a href="https://gataraai.zohobookings.com/#/ceo-call" class="btn btn-secondary btn-lg w-full max-w-xs fustat-font" dir="auto">
                    احجز مكالمة سريعة لمدة 15 دقيقة
                  </a>
                </div>
                <div class="pt-8">
                  <p class="text-sm text-base-content/60 fustat-font" dir="auto">في هذه الأثناء، تابعنا على <a href="https://www.linkedin.com/showcase/vibereach/" class="link link-primary">لينكد إن</a> للحصول على آخر التحديثات.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function ls(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ee=ls();function La(e){Ee=e}var st={exec:()=>null};function k(e,t=""){let n=typeof e=="string"?e:e.source;const s={replace:(r,a)=>{let i=typeof a=="string"?a:a.source;return i=i.replace(H.caret,"$1"),n=n.replace(r,i),s},getRegex:()=>new RegExp(n,t)};return s}var H={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i")},xl=/^(?:[ \t]*(?:\n|$))+/,bl=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,vl=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,lt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,wl=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,cs=/(?:[*+-]|\d{1,9}[.)])/,Ra=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Ia=k(Ra).replace(/bull/g,cs).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),yl=k(Ra).replace(/bull/g,cs).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),ds=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,_l=/^[^\n]+/,us=/(?!\s*\])(?:\\.|[^\[\]\\])+/,kl=k(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",us).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Sl=k(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,cs).getRegex(),Ht="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",ps=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,El=k("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",ps).replace("tag",Ht).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Oa=k(ds).replace("hr",lt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ht).getRegex(),Tl=k(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Oa).getRegex(),fs={blockquote:Tl,code:bl,def:kl,fences:vl,heading:wl,hr:lt,html:El,lheading:Ia,list:Sl,newline:xl,paragraph:Oa,table:st,text:_l},sr=k("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",lt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ht).getRegex(),Al={...fs,lheading:yl,table:sr,paragraph:k(ds).replace("hr",lt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",sr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ht).getRegex()},Cl={...fs,html:k(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",ps).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:st,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:k(ds).replace("hr",lt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Ia).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Ll=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Rl=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ma=/^( {2,}|\\)\n(?!\s*$)/,Il=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Ut=/[\p{P}\p{S}]/u,ms=/[\s\p{P}\p{S}]/u,Pa=/[^\s\p{P}\p{S}]/u,Ol=k(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,ms).getRegex(),Na=/(?!~)[\p{P}\p{S}]/u,Ml=/(?!~)[\s\p{P}\p{S}]/u,Pl=/(?:[^\s\p{P}\p{S}]|~)/u,Nl=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,Da=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Dl=k(Da,"u").replace(/punct/g,Ut).getRegex(),Bl=k(Da,"u").replace(/punct/g,Na).getRegex(),Ba="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",zl=k(Ba,"gu").replace(/notPunctSpace/g,Pa).replace(/punctSpace/g,ms).replace(/punct/g,Ut).getRegex(),$l=k(Ba,"gu").replace(/notPunctSpace/g,Pl).replace(/punctSpace/g,Ml).replace(/punct/g,Na).getRegex(),jl=k("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Pa).replace(/punctSpace/g,ms).replace(/punct/g,Ut).getRegex(),Fl=k(/\\(punct)/,"gu").replace(/punct/g,Ut).getRegex(),Hl=k(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Ul=k(ps).replace("(?:-->|$)","-->").getRegex(),ql=k("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Ul).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ot=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,Gl=k(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Ot).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),za=k(/^!?\[(label)\]\[(ref)\]/).replace("label",Ot).replace("ref",us).getRegex(),$a=k(/^!?\[(ref)\](?:\[\])?/).replace("ref",us).getRegex(),Wl=k("reflink|nolink(?!\\()","g").replace("reflink",za).replace("nolink",$a).getRegex(),hs={_backpedal:st,anyPunctuation:Fl,autolink:Hl,blockSkip:Nl,br:Ma,code:Rl,del:st,emStrongLDelim:Dl,emStrongRDelimAst:zl,emStrongRDelimUnd:jl,escape:Ll,link:Gl,nolink:$a,punctuation:Ol,reflink:za,reflinkSearch:Wl,tag:ql,text:Il,url:st},Vl={...hs,link:k(/^!?\[(label)\]\((.*?)\)/).replace("label",Ot).getRegex(),reflink:k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ot).getRegex()},Dn={...hs,emStrongRDelimAst:$l,emStrongLDelim:Bl,url:k(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},Yl={...Dn,br:k(Ma).replace("{2,}","*").getRegex(),text:k(Dn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},yt={normal:fs,gfm:Al,pedantic:Cl},Ve={normal:hs,gfm:Dn,breaks:Yl,pedantic:Vl},Kl={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},rr=e=>Kl[e];function ne(e,t){if(t){if(H.escapeTest.test(e))return e.replace(H.escapeReplace,rr)}else if(H.escapeTestNoEncode.test(e))return e.replace(H.escapeReplaceNoEncode,rr);return e}function ar(e){try{e=encodeURI(e).replace(H.percentDecode,"%")}catch{return null}return e}function ir(e,t){var a;const n=e.replace(H.findPipe,(i,o,l)=>{let c=!1,u=o;for(;--u>=0&&l[u]==="\\";)c=!c;return c?"|":" |"}),s=n.split(H.splitPipe);let r=0;if(s[0].trim()||s.shift(),s.length>0&&!((a=s.at(-1))!=null&&a.trim())&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;r<s.length;r++)s[r]=s[r].trim().replace(H.slashPipe,"|");return s}function Ye(e,t,n){const s=e.length;if(s===0)return"";let r=0;for(;r<s&&e.charAt(s-r-1)===t;)r++;return e.slice(0,s-r)}function Zl(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return n>0?-2:-1}function or(e,t,n,s,r){const a=t.href,i=t.title||null,o=e[1].replace(r.other.outputLinkReplace,"$1");s.state.inLink=!0;const l={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:a,title:i,text:o,tokens:s.inlineTokens(o)};return s.state.inLink=!1,l}function Xl(e,t,n){const s=e.match(n.other.indentCodeCompensation);if(s===null)return t;const r=s[1];return t.split(`
`).map(a=>{const i=a.match(n.other.beginningSpace);if(i===null)return a;const[o]=i;return o.length>=r.length?a.slice(r.length):a}).join(`
`)}var Mt=class{constructor(e){E(this,"options");E(this,"rules");E(this,"lexer");this.options=e||Ee}space(e){const t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){const t=this.rules.block.code.exec(e);if(t){const n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Ye(n,`
`)}}}fences(e){const t=this.rules.block.fences.exec(e);if(t){const n=t[0],s=Xl(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){const t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){const s=Ye(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){const t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:Ye(t[0],`
`)}}blockquote(e){const t=this.rules.block.blockquote.exec(e);if(t){let n=Ye(t[0],`
`).split(`
`),s="",r="";const a=[];for(;n.length>0;){let i=!1;const o=[];let l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))o.push(n[l]),i=!0;else if(!i)o.push(n[l]);else break;n=n.slice(l);const c=o.join(`
`),u=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${c}`:c,r=r?`${r}
${u}`:u;const m=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,a,!0),this.lexer.state.top=m,n.length===0)break;const p=a.at(-1);if((p==null?void 0:p.type)==="code")break;if((p==null?void 0:p.type)==="blockquote"){const v=p,b=v.raw+`
`+n.join(`
`),I=this.blockquote(b);a[a.length-1]=I,s=s.substring(0,s.length-v.raw.length)+I.raw,r=r.substring(0,r.length-v.text.length)+I.text;break}else if((p==null?void 0:p.type)==="list"){const v=p,b=v.raw+`
`+n.join(`
`),I=this.list(b);a[a.length-1]=I,s=s.substring(0,s.length-p.raw.length)+I.raw,r=r.substring(0,r.length-v.raw.length)+I.raw,n=b.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:a,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim();const s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");const a=this.rules.other.listItemRegex(n);let i=!1;for(;e;){let l=!1,c="",u="";if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;c=t[0],e=e.substring(c.length);let m=t[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,_=>" ".repeat(3*_.length)),p=e.split(`
`,1)[0],v=!m.trim(),b=0;if(this.options.pedantic?(b=2,u=m.trimStart()):v?b=t[1].length+1:(b=t[2].search(this.rules.other.nonSpaceChar),b=b>4?1:b,u=m.slice(b),b+=t[1].length),v&&this.rules.other.blankLine.test(p)&&(c+=p+`
`,e=e.substring(p.length+1),l=!0),!l){const _=this.rules.other.nextBulletRegex(b),T=this.rules.other.hrRegex(b),C=this.rules.other.fencesBeginRegex(b),y=this.rules.other.headingBeginRegex(b),W=this.rules.other.htmlBeginRegex(b);for(;e;){const Y=e.split(`
`,1)[0];let ee;if(p=Y,this.options.pedantic?(p=p.replace(this.rules.other.listReplaceNesting,"  "),ee=p):ee=p.replace(this.rules.other.tabCharGlobal,"    "),C.test(p)||y.test(p)||W.test(p)||_.test(p)||T.test(p))break;if(ee.search(this.rules.other.nonSpaceChar)>=b||!p.trim())u+=`
`+ee.slice(b);else{if(v||m.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||C.test(m)||y.test(m)||T.test(m))break;u+=`
`+p}!v&&!p.trim()&&(v=!0),c+=Y+`
`,e=e.substring(Y.length+1),m=ee.slice(b)}}r.loose||(i?r.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(i=!0));let I=null,x;this.options.gfm&&(I=this.rules.other.listIsTask.exec(u),I&&(x=I[0]!=="[ ] ",u=u.replace(this.rules.other.listReplaceTask,""))),r.items.push({type:"list_item",raw:c,task:!!I,checked:x,loose:!1,text:u,tokens:[]}),r.raw+=c}const o=r.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let l=0;l<r.items.length;l++)if(this.lexer.state.top=!1,r.items[l].tokens=this.lexer.blockTokens(r.items[l].text,[]),!r.loose){const c=r.items[l].tokens.filter(m=>m.type==="space"),u=c.length>0&&c.some(m=>this.rules.other.anyLine.test(m.raw));r.loose=u}if(r.loose)for(let l=0;l<r.items.length;l++)r.items[l].loose=!0;return r}}html(e){const t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){const t=this.rules.block.def.exec(e);if(t){const n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:r}}}table(e){var i;const t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;const n=ir(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=(i=t[3])!=null&&i.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(const o of s)this.rules.other.tableAlignRight.test(o)?a.align.push("right"):this.rules.other.tableAlignCenter.test(o)?a.align.push("center"):this.rules.other.tableAlignLeft.test(o)?a.align.push("left"):a.align.push(null);for(let o=0;o<n.length;o++)a.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:a.align[o]});for(const o of r)a.rows.push(ir(o,a.header.length).map((l,c)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:a.align[c]})));return a}}lheading(e){const t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){const t=this.rules.block.paragraph.exec(e);if(t){const n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){const t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){const t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){const t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){const t=this.rules.inline.link.exec(e);if(t){const n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;const a=Ye(n.slice(0,-1),"\\");if((n.length-a.length)%2===0)return}else{const a=Zl(t[2],"()");if(a===-2)return;if(a>-1){const o=(t[0].indexOf("!")===0?5:4)+t[1].length+a;t[2]=t[2].substring(0,a),t[0]=t[0].substring(0,o).trim(),t[3]=""}}let s=t[2],r="";if(this.options.pedantic){const a=this.rules.other.pedanticHrefTitle.exec(s);a&&(s=a[1],r=a[3])}else r=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),or(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){const s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=t[s.toLowerCase()];if(!r){const a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return or(n,r,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))return;if(!(s[1]||s[2]||"")||!n||this.rules.inline.punctuation.exec(n)){const a=[...s[0]].length-1;let i,o,l=a,c=0;const u=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,t=t.slice(-1*e.length+a);(s=u.exec(t))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(o=[...i].length,s[3]||s[4]){l+=o;continue}else if((s[5]||s[6])&&a%3&&!((a+o)%3)){c+=o;continue}if(l-=o,l>0)continue;o=Math.min(o,o+l+c);const m=[...s[0]][0].length,p=e.slice(0,a+s.index+m+o);if(Math.min(a,o)%2){const b=p.slice(1,-1);return{type:"em",raw:p,text:b,tokens:this.lexer.inlineTokens(b)}}const v=p.slice(2,-2);return{type:"strong",raw:p,text:v,tokens:this.lexer.inlineTokens(v)}}}}codespan(e){const t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," ");const s=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){const t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){const t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){const t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){var n;let t;if(t=this.rules.inline.url.exec(e)){let s,r;if(t[2]==="@")s=t[0],r="mailto:"+s;else{let a;do a=t[0],t[0]=((n=this.rules.inline._backpedal.exec(t[0]))==null?void 0:n[0])??"";while(a!==t[0]);s=t[0],t[1]==="www."?r="http://"+t[0]:r=t[0]}return{type:"link",raw:t[0],text:s,href:r,tokens:[{type:"text",raw:s,text:s}]}}}inlineText(e){const t=this.rules.inline.text.exec(e);if(t){const n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},le=class Bn{constructor(t){E(this,"tokens");E(this,"options");E(this,"state");E(this,"tokenizer");E(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Ee,this.options.tokenizer=this.options.tokenizer||new Mt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const n={other:H,block:yt.normal,inline:Ve.normal};this.options.pedantic?(n.block=yt.pedantic,n.inline=Ve.pedantic):this.options.gfm&&(n.block=yt.gfm,this.options.breaks?n.inline=Ve.breaks:n.inline=Ve.gfm),this.tokenizer.rules=n}static get rules(){return{block:yt,inline:Ve}}static lex(t,n){return new Bn(n).lex(t)}static lexInline(t,n){return new Bn(n).inlineTokens(t)}lex(t){t=t.replace(H.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){const s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],s=!1){var r,a,i;for(this.options.pedantic&&(t=t.replace(H.tabCharGlobal,"    ").replace(H.spaceLine,""));t;){let o;if((a=(r=this.options.extensions)==null?void 0:r.block)!=null&&a.some(c=>(o=c.call({lexer:this},t,n))?(t=t.substring(o.raw.length),n.push(o),!0):!1))continue;if(o=this.tokenizer.space(t)){t=t.substring(o.raw.length);const c=n.at(-1);o.raw.length===1&&c!==void 0?c.raw+=`
`:n.push(o);continue}if(o=this.tokenizer.code(t)){t=t.substring(o.raw.length);const c=n.at(-1);(c==null?void 0:c.type)==="paragraph"||(c==null?void 0:c.type)==="text"?(c.raw+=`
`+o.raw,c.text+=`
`+o.text,this.inlineQueue.at(-1).src=c.text):n.push(o);continue}if(o=this.tokenizer.fences(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.heading(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.hr(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.blockquote(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.list(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.html(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.def(t)){t=t.substring(o.raw.length);const c=n.at(-1);(c==null?void 0:c.type)==="paragraph"||(c==null?void 0:c.type)==="text"?(c.raw+=`
`+o.raw,c.text+=`
`+o.raw,this.inlineQueue.at(-1).src=c.text):this.tokens.links[o.tag]||(this.tokens.links[o.tag]={href:o.href,title:o.title});continue}if(o=this.tokenizer.table(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.lheading(t)){t=t.substring(o.raw.length),n.push(o);continue}let l=t;if((i=this.options.extensions)!=null&&i.startBlock){let c=1/0;const u=t.slice(1);let m;this.options.extensions.startBlock.forEach(p=>{m=p.call({lexer:this},u),typeof m=="number"&&m>=0&&(c=Math.min(c,m))}),c<1/0&&c>=0&&(l=t.substring(0,c+1))}if(this.state.top&&(o=this.tokenizer.paragraph(l))){const c=n.at(-1);s&&(c==null?void 0:c.type)==="paragraph"?(c.raw+=`
`+o.raw,c.text+=`
`+o.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=c.text):n.push(o),s=l.length!==t.length,t=t.substring(o.raw.length);continue}if(o=this.tokenizer.text(t)){t=t.substring(o.raw.length);const c=n.at(-1);(c==null?void 0:c.type)==="text"?(c.raw+=`
`+o.raw,c.text+=`
`+o.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=c.text):n.push(o);continue}if(t){const c="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){var o,l,c;let s=t,r=null;if(this.tokens.links){const u=Object.keys(this.tokens.links);if(u.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)u.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,r.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;(r=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);let a=!1,i="";for(;t;){a||(i=""),a=!1;let u;if((l=(o=this.options.extensions)==null?void 0:o.inline)!=null&&l.some(p=>(u=p.call({lexer:this},t,n))?(t=t.substring(u.raw.length),n.push(u),!0):!1))continue;if(u=this.tokenizer.escape(t)){t=t.substring(u.raw.length),n.push(u);continue}if(u=this.tokenizer.tag(t)){t=t.substring(u.raw.length),n.push(u);continue}if(u=this.tokenizer.link(t)){t=t.substring(u.raw.length),n.push(u);continue}if(u=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(u.raw.length);const p=n.at(-1);u.type==="text"&&(p==null?void 0:p.type)==="text"?(p.raw+=u.raw,p.text+=u.text):n.push(u);continue}if(u=this.tokenizer.emStrong(t,s,i)){t=t.substring(u.raw.length),n.push(u);continue}if(u=this.tokenizer.codespan(t)){t=t.substring(u.raw.length),n.push(u);continue}if(u=this.tokenizer.br(t)){t=t.substring(u.raw.length),n.push(u);continue}if(u=this.tokenizer.del(t)){t=t.substring(u.raw.length),n.push(u);continue}if(u=this.tokenizer.autolink(t)){t=t.substring(u.raw.length),n.push(u);continue}if(!this.state.inLink&&(u=this.tokenizer.url(t))){t=t.substring(u.raw.length),n.push(u);continue}let m=t;if((c=this.options.extensions)!=null&&c.startInline){let p=1/0;const v=t.slice(1);let b;this.options.extensions.startInline.forEach(I=>{b=I.call({lexer:this},v),typeof b=="number"&&b>=0&&(p=Math.min(p,b))}),p<1/0&&p>=0&&(m=t.substring(0,p+1))}if(u=this.tokenizer.inlineText(m)){t=t.substring(u.raw.length),u.raw.slice(-1)!=="_"&&(i=u.raw.slice(-1)),a=!0;const p=n.at(-1);(p==null?void 0:p.type)==="text"?(p.raw+=u.raw,p.text+=u.text):n.push(u);continue}if(t){const p="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(p);break}else throw new Error(p)}}return n}},Pt=class{constructor(e){E(this,"options");E(this,"parser");this.options=e||Ee}space(e){return""}code({text:e,lang:t,escaped:n}){var a;const s=(a=(t||"").match(H.notSpaceStart))==null?void 0:a[0],r=e.replace(H.endingNewline,"")+`
`;return s?'<pre><code class="language-'+ne(s)+'">'+(n?r:ne(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:ne(r,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){const t=e.ordered,n=e.start;let s="";for(let i=0;i<e.items.length;i++){const o=e.items[i];s+=this.listitem(o)}const r=t?"ol":"ul",a=t&&n!==1?' start="'+n+'"':"";return"<"+r+a+`>
`+s+"</"+r+`>
`}listitem(e){var n;let t="";if(e.task){const s=this.checkbox({checked:!!e.checked});e.loose?((n=e.tokens[0])==null?void 0:n.type)==="paragraph"?(e.tokens[0].text=s+" "+e.tokens[0].text,e.tokens[0].tokens&&e.tokens[0].tokens.length>0&&e.tokens[0].tokens[0].type==="text"&&(e.tokens[0].tokens[0].text=s+" "+ne(e.tokens[0].tokens[0].text),e.tokens[0].tokens[0].escaped=!0)):e.tokens.unshift({type:"text",raw:s+" ",text:s+" ",escaped:!0}):t+=s+" "}return t+=this.parser.parse(e.tokens,!!e.loose),`<li>${t}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let r=0;r<e.header.length;r++)n+=this.tablecell(e.header[r]);t+=this.tablerow({text:n});let s="";for(let r=0;r<e.rows.length;r++){const a=e.rows[r];n="";for(let i=0;i<a.length;i++)n+=this.tablecell(a[i]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+s+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){const t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${ne(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){const s=this.parser.parseInline(n),r=ar(e);if(r===null)return s;e=r;let a='<a href="'+e+'"';return t&&(a+=' title="'+ne(t)+'"'),a+=">"+s+"</a>",a}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));const r=ar(e);if(r===null)return ne(n);e=r;let a=`<img src="${e}" alt="${n}"`;return t&&(a+=` title="${ne(t)}"`),a+=">",a}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:ne(e.text)}},gs=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}},ce=class zn{constructor(t){E(this,"options");E(this,"renderer");E(this,"textRenderer");this.options=t||Ee,this.options.renderer=this.options.renderer||new Pt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new gs}static parse(t,n){return new zn(n).parse(t)}static parseInline(t,n){return new zn(n).parseInline(t)}parse(t,n=!0){var r,a;let s="";for(let i=0;i<t.length;i++){const o=t[i];if((a=(r=this.options.extensions)==null?void 0:r.renderers)!=null&&a[o.type]){const c=o,u=this.options.extensions.renderers[c.type].call({parser:this},c);if(u!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(c.type)){s+=u||"";continue}}const l=o;switch(l.type){case"space":{s+=this.renderer.space(l);continue}case"hr":{s+=this.renderer.hr(l);continue}case"heading":{s+=this.renderer.heading(l);continue}case"code":{s+=this.renderer.code(l);continue}case"table":{s+=this.renderer.table(l);continue}case"blockquote":{s+=this.renderer.blockquote(l);continue}case"list":{s+=this.renderer.list(l);continue}case"html":{s+=this.renderer.html(l);continue}case"paragraph":{s+=this.renderer.paragraph(l);continue}case"text":{let c=l,u=this.renderer.text(c);for(;i+1<t.length&&t[i+1].type==="text";)c=t[++i],u+=`
`+this.renderer.text(c);n?s+=this.renderer.paragraph({type:"paragraph",raw:u,text:u,tokens:[{type:"text",raw:u,text:u,escaped:!0}]}):s+=u;continue}default:{const c='Token with "'+l.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return s}parseInline(t,n=this.renderer){var r,a;let s="";for(let i=0;i<t.length;i++){const o=t[i];if((a=(r=this.options.extensions)==null?void 0:r.renderers)!=null&&a[o.type]){const c=this.options.extensions.renderers[o.type].call({parser:this},o);if(c!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(o.type)){s+=c||"";continue}}const l=o;switch(l.type){case"escape":{s+=n.text(l);break}case"html":{s+=n.html(l);break}case"link":{s+=n.link(l);break}case"image":{s+=n.image(l);break}case"strong":{s+=n.strong(l);break}case"em":{s+=n.em(l);break}case"codespan":{s+=n.codespan(l);break}case"br":{s+=n.br(l);break}case"del":{s+=n.del(l);break}case"text":{s+=n.text(l);break}default:{const c='Token with "'+l.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return s}},bn,Tt=(bn=class{constructor(e){E(this,"options");E(this,"block");this.options=e||Ee}preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}provideLexer(){return this.block?le.lex:le.lexInline}provideParser(){return this.block?ce.parse:ce.parseInline}},E(bn,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"])),bn),Jl=class{constructor(...e){E(this,"defaults",ls());E(this,"options",this.setOptions);E(this,"parse",this.parseMarkdown(!0));E(this,"parseInline",this.parseMarkdown(!1));E(this,"Parser",ce);E(this,"Renderer",Pt);E(this,"TextRenderer",gs);E(this,"Lexer",le);E(this,"Tokenizer",Mt);E(this,"Hooks",Tt);this.use(...e)}walkTokens(e,t){var s,r;let n=[];for(const a of e)switch(n=n.concat(t.call(this,a)),a.type){case"table":{const i=a;for(const o of i.header)n=n.concat(this.walkTokens(o.tokens,t));for(const o of i.rows)for(const l of o)n=n.concat(this.walkTokens(l.tokens,t));break}case"list":{const i=a;n=n.concat(this.walkTokens(i.items,t));break}default:{const i=a;(r=(s=this.defaults.extensions)==null?void 0:s.childTokens)!=null&&r[i.type]?this.defaults.extensions.childTokens[i.type].forEach(o=>{const l=i[o].flat(1/0);n=n.concat(this.walkTokens(l,t))}):i.tokens&&(n=n.concat(this.walkTokens(i.tokens,t)))}}return n}use(...e){const t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{const s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){const a=t.renderers[r.name];a?t.renderers[r.name]=function(...i){let o=r.renderer.apply(this,i);return o===!1&&(o=a.apply(this,i)),o}:t.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const a=t[r.level];a?a.unshift(r.tokenizer):t[r.level]=[r.tokenizer],r.start&&(r.level==="block"?t.startBlock?t.startBlock.push(r.start):t.startBlock=[r.start]:r.level==="inline"&&(t.startInline?t.startInline.push(r.start):t.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(t.childTokens[r.name]=r.childTokens)}),s.extensions=t),n.renderer){const r=this.defaults.renderer||new Pt(this.defaults);for(const a in n.renderer){if(!(a in r))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;const i=a,o=n.renderer[i],l=r[i];r[i]=(...c)=>{let u=o.apply(r,c);return u===!1&&(u=l.apply(r,c)),u||""}}s.renderer=r}if(n.tokenizer){const r=this.defaults.tokenizer||new Mt(this.defaults);for(const a in n.tokenizer){if(!(a in r))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;const i=a,o=n.tokenizer[i],l=r[i];r[i]=(...c)=>{let u=o.apply(r,c);return u===!1&&(u=l.apply(r,c)),u}}s.tokenizer=r}if(n.hooks){const r=this.defaults.hooks||new Tt;for(const a in n.hooks){if(!(a in r))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;const i=a,o=n.hooks[i],l=r[i];Tt.passThroughHooks.has(a)?r[i]=c=>{if(this.defaults.async)return Promise.resolve(o.call(r,c)).then(m=>l.call(r,m));const u=o.call(r,c);return l.call(r,u)}:r[i]=(...c)=>{let u=o.apply(r,c);return u===!1&&(u=l.apply(r,c)),u}}s.hooks=r}if(n.walkTokens){const r=this.defaults.walkTokens,a=n.walkTokens;s.walkTokens=function(i){let o=[];return o.push(a.call(this,i)),r&&(o=o.concat(r.call(this,i))),o}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return le.lex(e,t??this.defaults)}parser(e,t){return ce.parse(e,t??this.defaults)}parseMarkdown(e){return(n,s)=>{const r={...s},a={...this.defaults,...r},i=this.onError(!!a.silent,!!a.async);if(this.defaults.async===!0&&r.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof n>"u"||n===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));a.hooks&&(a.hooks.options=a,a.hooks.block=e);const o=a.hooks?a.hooks.provideLexer():e?le.lex:le.lexInline,l=a.hooks?a.hooks.provideParser():e?ce.parse:ce.parseInline;if(a.async)return Promise.resolve(a.hooks?a.hooks.preprocess(n):n).then(c=>o(c,a)).then(c=>a.hooks?a.hooks.processAllTokens(c):c).then(c=>a.walkTokens?Promise.all(this.walkTokens(c,a.walkTokens)).then(()=>c):c).then(c=>l(c,a)).then(c=>a.hooks?a.hooks.postprocess(c):c).catch(i);try{a.hooks&&(n=a.hooks.preprocess(n));let c=o(n,a);a.hooks&&(c=a.hooks.processAllTokens(c)),a.walkTokens&&this.walkTokens(c,a.walkTokens);let u=l(c,a);return a.hooks&&(u=a.hooks.postprocess(u)),u}catch(c){return i(c)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){const s="<p>An error occurred:</p><pre>"+ne(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}},ke=new Jl;function S(e,t){return ke.parse(e,t)}S.options=S.setOptions=function(e){return ke.setOptions(e),S.defaults=ke.defaults,La(S.defaults),S};S.getDefaults=ls;S.defaults=Ee;S.use=function(...e){return ke.use(...e),S.defaults=ke.defaults,La(S.defaults),S};S.walkTokens=function(e,t){return ke.walkTokens(e,t)};S.parseInline=ke.parseInline;S.Parser=ce;S.parser=ce.parse;S.Renderer=Pt;S.TextRenderer=gs;S.Lexer=le;S.lexer=le.lex;S.Tokenizer=Mt;S.Hooks=Tt;S.parse=S;S.options;S.setOptions;S.use;S.walkTokens;S.parseInline;ce.parse;le.lex;/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */const{entries:ja,setPrototypeOf:lr,isFrozen:Ql,getPrototypeOf:ec,getOwnPropertyDescriptor:tc}=Object;let{freeze:q,seal:Z,create:Fa}=Object,{apply:$n,construct:jn}=typeof Reflect<"u"&&Reflect;q||(q=function(t){return t});Z||(Z=function(t){return t});$n||($n=function(t,n,s){return t.apply(n,s)});jn||(jn=function(t,n){return new t(...n)});const _t=G(Array.prototype.forEach),nc=G(Array.prototype.lastIndexOf),cr=G(Array.prototype.pop),Ke=G(Array.prototype.push),sc=G(Array.prototype.splice),At=G(String.prototype.toLowerCase),fn=G(String.prototype.toString),dr=G(String.prototype.match),Ze=G(String.prototype.replace),rc=G(String.prototype.indexOf),ac=G(String.prototype.trim),X=G(Object.prototype.hasOwnProperty),F=G(RegExp.prototype.test),Xe=ic(TypeError);function G(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,s=new Array(n>1?n-1:0),r=1;r<n;r++)s[r-1]=arguments[r];return $n(e,t,s)}}function ic(e){return function(){for(var t=arguments.length,n=new Array(t),s=0;s<t;s++)n[s]=arguments[s];return jn(e,n)}}function w(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:At;lr&&lr(e,null);let s=t.length;for(;s--;){let r=t[s];if(typeof r=="string"){const a=n(r);a!==r&&(Ql(t)||(t[s]=a),r=a)}e[r]=!0}return e}function oc(e){for(let t=0;t<e.length;t++)X(e,t)||(e[t]=null);return e}function oe(e){const t=Fa(null);for(const[n,s]of ja(e))X(e,n)&&(Array.isArray(s)?t[n]=oc(s):s&&typeof s=="object"&&s.constructor===Object?t[n]=oe(s):t[n]=s);return t}function Je(e,t){for(;e!==null;){const s=tc(e,t);if(s){if(s.get)return G(s.get);if(typeof s.value=="function")return G(s.value)}e=ec(e)}function n(){return null}return n}const ur=q(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),mn=q(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),hn=q(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),lc=q(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),gn=q(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),cc=q(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),pr=q(["#text"]),fr=q(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),xn=q(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),mr=q(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),kt=q(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),dc=Z(/\{\{[\w\W]*|[\w\W]*\}\}/gm),uc=Z(/<%[\w\W]*|[\w\W]*%>/gm),pc=Z(/\$\{[\w\W]*/gm),fc=Z(/^data-[\-\w.\u00B7-\uFFFF]+$/),mc=Z(/^aria-[\-\w]+$/),Ha=Z(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),hc=Z(/^(?:\w+script|data):/i),gc=Z(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Ua=Z(/^html$/i),xc=Z(/^[a-z][.\w]*(-[.\w]+)+$/i);var hr=Object.freeze({__proto__:null,ARIA_ATTR:mc,ATTR_WHITESPACE:gc,CUSTOM_ELEMENT:xc,DATA_ATTR:fc,DOCTYPE_NAME:Ua,ERB_EXPR:uc,IS_ALLOWED_URI:Ha,IS_SCRIPT_OR_DATA:hc,MUSTACHE_EXPR:dc,TMPLIT_EXPR:pc});const Qe={element:1,text:3,progressingInstruction:7,comment:8,document:9},bc=function(){return typeof window>"u"?null:window},vc=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const r="data-tt-policy-suffix";n&&n.hasAttribute(r)&&(s=n.getAttribute(r));const a="dompurify"+(s?"#"+s:"");try{return t.createPolicy(a,{createHTML(i){return i},createScriptURL(i){return i}})}catch{return console.warn("TrustedTypes policy "+a+" could not be created."),null}},gr=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function qa(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:bc();const t=g=>qa(g);if(t.version="3.2.6",t.removed=[],!e||!e.document||e.document.nodeType!==Qe.document||!e.Element)return t.isSupported=!1,t;let{document:n}=e;const s=n,r=s.currentScript,{DocumentFragment:a,HTMLTemplateElement:i,Node:o,Element:l,NodeFilter:c,NamedNodeMap:u=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:m,DOMParser:p,trustedTypes:v}=e,b=l.prototype,I=Je(b,"cloneNode"),x=Je(b,"remove"),_=Je(b,"nextSibling"),T=Je(b,"childNodes"),C=Je(b,"parentNode");if(typeof i=="function"){const g=n.createElement("template");g.content&&g.content.ownerDocument&&(n=g.content.ownerDocument)}let y,W="";const{implementation:Y,createNodeIterator:ee,createDocumentFragment:qt,getElementsByTagName:Gt}=n,{importNode:Wt}=s;let j=gr();t.isSupported=typeof ja=="function"&&typeof C=="function"&&Y&&Y.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:Vt,ERB_EXPR:Yt,TMPLIT_EXPR:Kt,DATA_ATTR:Ga,ARIA_ATTR:Wa,IS_SCRIPT_OR_DATA:Va,ATTR_WHITESPACE:xs,CUSTOM_ELEMENT:Ya}=hr;let{IS_ALLOWED_URI:bs}=hr,N=null;const vs=w({},[...ur,...mn,...hn,...gn,...pr]);let B=null;const ws=w({},[...fr,...xn,...mr,...kt]);let O=Object.seal(Fa(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),je=null,Zt=null,ys=!0,Xt=!0,_s=!1,ks=!0,Te=!1,ct=!0,he=!1,Jt=!1,Qt=!1,Ae=!1,dt=!1,ut=!1,Ss=!0,Es=!1;const Ka="user-content-";let en=!0,Fe=!1,Ce={},Le=null;const Ts=w({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let As=null;const Cs=w({},["audio","video","img","source","image","track"]);let tn=null;const Ls=w({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),pt="http://www.w3.org/1998/Math/MathML",ft="http://www.w3.org/2000/svg",re="http://www.w3.org/1999/xhtml";let Re=re,nn=!1,sn=null;const Za=w({},[pt,ft,re],fn);let mt=w({},["mi","mo","mn","ms","mtext"]),ht=w({},["annotation-xml"]);const Xa=w({},["title","style","font","a","script"]);let He=null;const Ja=["application/xhtml+xml","text/html"],Qa="text/html";let D=null,Ie=null;const ei=n.createElement("form"),Rs=function(d){return d instanceof RegExp||d instanceof Function},rn=function(){let d=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(Ie&&Ie===d)){if((!d||typeof d!="object")&&(d={}),d=oe(d),He=Ja.indexOf(d.PARSER_MEDIA_TYPE)===-1?Qa:d.PARSER_MEDIA_TYPE,D=He==="application/xhtml+xml"?fn:At,N=X(d,"ALLOWED_TAGS")?w({},d.ALLOWED_TAGS,D):vs,B=X(d,"ALLOWED_ATTR")?w({},d.ALLOWED_ATTR,D):ws,sn=X(d,"ALLOWED_NAMESPACES")?w({},d.ALLOWED_NAMESPACES,fn):Za,tn=X(d,"ADD_URI_SAFE_ATTR")?w(oe(Ls),d.ADD_URI_SAFE_ATTR,D):Ls,As=X(d,"ADD_DATA_URI_TAGS")?w(oe(Cs),d.ADD_DATA_URI_TAGS,D):Cs,Le=X(d,"FORBID_CONTENTS")?w({},d.FORBID_CONTENTS,D):Ts,je=X(d,"FORBID_TAGS")?w({},d.FORBID_TAGS,D):oe({}),Zt=X(d,"FORBID_ATTR")?w({},d.FORBID_ATTR,D):oe({}),Ce=X(d,"USE_PROFILES")?d.USE_PROFILES:!1,ys=d.ALLOW_ARIA_ATTR!==!1,Xt=d.ALLOW_DATA_ATTR!==!1,_s=d.ALLOW_UNKNOWN_PROTOCOLS||!1,ks=d.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Te=d.SAFE_FOR_TEMPLATES||!1,ct=d.SAFE_FOR_XML!==!1,he=d.WHOLE_DOCUMENT||!1,Ae=d.RETURN_DOM||!1,dt=d.RETURN_DOM_FRAGMENT||!1,ut=d.RETURN_TRUSTED_TYPE||!1,Qt=d.FORCE_BODY||!1,Ss=d.SANITIZE_DOM!==!1,Es=d.SANITIZE_NAMED_PROPS||!1,en=d.KEEP_CONTENT!==!1,Fe=d.IN_PLACE||!1,bs=d.ALLOWED_URI_REGEXP||Ha,Re=d.NAMESPACE||re,mt=d.MATHML_TEXT_INTEGRATION_POINTS||mt,ht=d.HTML_INTEGRATION_POINTS||ht,O=d.CUSTOM_ELEMENT_HANDLING||{},d.CUSTOM_ELEMENT_HANDLING&&Rs(d.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(O.tagNameCheck=d.CUSTOM_ELEMENT_HANDLING.tagNameCheck),d.CUSTOM_ELEMENT_HANDLING&&Rs(d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(O.attributeNameCheck=d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),d.CUSTOM_ELEMENT_HANDLING&&typeof d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(O.allowCustomizedBuiltInElements=d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Te&&(Xt=!1),dt&&(Ae=!0),Ce&&(N=w({},pr),B=[],Ce.html===!0&&(w(N,ur),w(B,fr)),Ce.svg===!0&&(w(N,mn),w(B,xn),w(B,kt)),Ce.svgFilters===!0&&(w(N,hn),w(B,xn),w(B,kt)),Ce.mathMl===!0&&(w(N,gn),w(B,mr),w(B,kt))),d.ADD_TAGS&&(N===vs&&(N=oe(N)),w(N,d.ADD_TAGS,D)),d.ADD_ATTR&&(B===ws&&(B=oe(B)),w(B,d.ADD_ATTR,D)),d.ADD_URI_SAFE_ATTR&&w(tn,d.ADD_URI_SAFE_ATTR,D),d.FORBID_CONTENTS&&(Le===Ts&&(Le=oe(Le)),w(Le,d.FORBID_CONTENTS,D)),en&&(N["#text"]=!0),he&&w(N,["html","head","body"]),N.table&&(w(N,["tbody"]),delete je.tbody),d.TRUSTED_TYPES_POLICY){if(typeof d.TRUSTED_TYPES_POLICY.createHTML!="function")throw Xe('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof d.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw Xe('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');y=d.TRUSTED_TYPES_POLICY,W=y.createHTML("")}else y===void 0&&(y=vc(v,r)),y!==null&&typeof W=="string"&&(W=y.createHTML(""));q&&q(d),Ie=d}},Is=w({},[...mn,...hn,...lc]),Os=w({},[...gn,...cc]),ti=function(d){let f=C(d);(!f||!f.tagName)&&(f={namespaceURI:Re,tagName:"template"});const h=At(d.tagName),L=At(f.tagName);return sn[d.namespaceURI]?d.namespaceURI===ft?f.namespaceURI===re?h==="svg":f.namespaceURI===pt?h==="svg"&&(L==="annotation-xml"||mt[L]):!!Is[h]:d.namespaceURI===pt?f.namespaceURI===re?h==="math":f.namespaceURI===ft?h==="math"&&ht[L]:!!Os[h]:d.namespaceURI===re?f.namespaceURI===ft&&!ht[L]||f.namespaceURI===pt&&!mt[L]?!1:!Os[h]&&(Xa[h]||!Is[h]):!!(He==="application/xhtml+xml"&&sn[d.namespaceURI]):!1},te=function(d){Ke(t.removed,{element:d});try{C(d).removeChild(d)}catch{x(d)}},Oe=function(d,f){try{Ke(t.removed,{attribute:f.getAttributeNode(d),from:f})}catch{Ke(t.removed,{attribute:null,from:f})}if(f.removeAttribute(d),d==="is")if(Ae||dt)try{te(f)}catch{}else try{f.setAttribute(d,"")}catch{}},Ms=function(d){let f=null,h=null;if(Qt)d="<remove></remove>"+d;else{const P=dr(d,/^[\r\n\t ]+/);h=P&&P[0]}He==="application/xhtml+xml"&&Re===re&&(d='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+d+"</body></html>");const L=y?y.createHTML(d):d;if(Re===re)try{f=new p().parseFromString(L,He)}catch{}if(!f||!f.documentElement){f=Y.createDocument(Re,"template",null);try{f.documentElement.innerHTML=nn?W:L}catch{}}const z=f.body||f.documentElement;return d&&h&&z.insertBefore(n.createTextNode(h),z.childNodes[0]||null),Re===re?Gt.call(f,he?"html":"body")[0]:he?f.documentElement:z},Ps=function(d){return ee.call(d.ownerDocument||d,d,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},an=function(d){return d instanceof m&&(typeof d.nodeName!="string"||typeof d.textContent!="string"||typeof d.removeChild!="function"||!(d.attributes instanceof u)||typeof d.removeAttribute!="function"||typeof d.setAttribute!="function"||typeof d.namespaceURI!="string"||typeof d.insertBefore!="function"||typeof d.hasChildNodes!="function")},Ns=function(d){return typeof o=="function"&&d instanceof o};function ae(g,d,f){_t(g,h=>{h.call(t,d,f,Ie)})}const Ds=function(d){let f=null;if(ae(j.beforeSanitizeElements,d,null),an(d))return te(d),!0;const h=D(d.nodeName);if(ae(j.uponSanitizeElement,d,{tagName:h,allowedTags:N}),ct&&d.hasChildNodes()&&!Ns(d.firstElementChild)&&F(/<[/\w!]/g,d.innerHTML)&&F(/<[/\w!]/g,d.textContent)||d.nodeType===Qe.progressingInstruction||ct&&d.nodeType===Qe.comment&&F(/<[/\w]/g,d.data))return te(d),!0;if(!N[h]||je[h]){if(!je[h]&&zs(h)&&(O.tagNameCheck instanceof RegExp&&F(O.tagNameCheck,h)||O.tagNameCheck instanceof Function&&O.tagNameCheck(h)))return!1;if(en&&!Le[h]){const L=C(d)||d.parentNode,z=T(d)||d.childNodes;if(z&&L){const P=z.length;for(let V=P-1;V>=0;--V){const ie=I(z[V],!0);ie.__removalCount=(d.__removalCount||0)+1,L.insertBefore(ie,_(d))}}}return te(d),!0}return d instanceof l&&!ti(d)||(h==="noscript"||h==="noembed"||h==="noframes")&&F(/<\/no(script|embed|frames)/i,d.innerHTML)?(te(d),!0):(Te&&d.nodeType===Qe.text&&(f=d.textContent,_t([Vt,Yt,Kt],L=>{f=Ze(f,L," ")}),d.textContent!==f&&(Ke(t.removed,{element:d.cloneNode()}),d.textContent=f)),ae(j.afterSanitizeElements,d,null),!1)},Bs=function(d,f,h){if(Ss&&(f==="id"||f==="name")&&(h in n||h in ei))return!1;if(!(Xt&&!Zt[f]&&F(Ga,f))){if(!(ys&&F(Wa,f))){if(!B[f]||Zt[f]){if(!(zs(d)&&(O.tagNameCheck instanceof RegExp&&F(O.tagNameCheck,d)||O.tagNameCheck instanceof Function&&O.tagNameCheck(d))&&(O.attributeNameCheck instanceof RegExp&&F(O.attributeNameCheck,f)||O.attributeNameCheck instanceof Function&&O.attributeNameCheck(f))||f==="is"&&O.allowCustomizedBuiltInElements&&(O.tagNameCheck instanceof RegExp&&F(O.tagNameCheck,h)||O.tagNameCheck instanceof Function&&O.tagNameCheck(h))))return!1}else if(!tn[f]){if(!F(bs,Ze(h,xs,""))){if(!((f==="src"||f==="xlink:href"||f==="href")&&d!=="script"&&rc(h,"data:")===0&&As[d])){if(!(_s&&!F(Va,Ze(h,xs,"")))){if(h)return!1}}}}}}return!0},zs=function(d){return d!=="annotation-xml"&&dr(d,Ya)},$s=function(d){ae(j.beforeSanitizeAttributes,d,null);const{attributes:f}=d;if(!f||an(d))return;const h={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:B,forceKeepAttr:void 0};let L=f.length;for(;L--;){const z=f[L],{name:P,namespaceURI:V,value:ie}=z,Ue=D(P),on=ie;let $=P==="value"?on:ac(on);if(h.attrName=Ue,h.attrValue=$,h.keepAttr=!0,h.forceKeepAttr=void 0,ae(j.uponSanitizeAttribute,d,h),$=h.attrValue,Es&&(Ue==="id"||Ue==="name")&&(Oe(P,d),$=Ka+$),ct&&F(/((--!?|])>)|<\/(style|title)/i,$)){Oe(P,d);continue}if(h.forceKeepAttr)continue;if(!h.keepAttr){Oe(P,d);continue}if(!ks&&F(/\/>/i,$)){Oe(P,d);continue}Te&&_t([Vt,Yt,Kt],Fs=>{$=Ze($,Fs," ")});const js=D(d.nodeName);if(!Bs(js,Ue,$)){Oe(P,d);continue}if(y&&typeof v=="object"&&typeof v.getAttributeType=="function"&&!V)switch(v.getAttributeType(js,Ue)){case"TrustedHTML":{$=y.createHTML($);break}case"TrustedScriptURL":{$=y.createScriptURL($);break}}if($!==on)try{V?d.setAttributeNS(V,P,$):d.setAttribute(P,$),an(d)?te(d):cr(t.removed)}catch{Oe(P,d)}}ae(j.afterSanitizeAttributes,d,null)},ni=function g(d){let f=null;const h=Ps(d);for(ae(j.beforeSanitizeShadowDOM,d,null);f=h.nextNode();)ae(j.uponSanitizeShadowNode,f,null),Ds(f),$s(f),f.content instanceof a&&g(f.content);ae(j.afterSanitizeShadowDOM,d,null)};return t.sanitize=function(g){let d=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},f=null,h=null,L=null,z=null;if(nn=!g,nn&&(g="<!-->"),typeof g!="string"&&!Ns(g))if(typeof g.toString=="function"){if(g=g.toString(),typeof g!="string")throw Xe("dirty is not a string, aborting")}else throw Xe("toString is not a function");if(!t.isSupported)return g;if(Jt||rn(d),t.removed=[],typeof g=="string"&&(Fe=!1),Fe){if(g.nodeName){const ie=D(g.nodeName);if(!N[ie]||je[ie])throw Xe("root node is forbidden and cannot be sanitized in-place")}}else if(g instanceof o)f=Ms("<!---->"),h=f.ownerDocument.importNode(g,!0),h.nodeType===Qe.element&&h.nodeName==="BODY"||h.nodeName==="HTML"?f=h:f.appendChild(h);else{if(!Ae&&!Te&&!he&&g.indexOf("<")===-1)return y&&ut?y.createHTML(g):g;if(f=Ms(g),!f)return Ae?null:ut?W:""}f&&Qt&&te(f.firstChild);const P=Ps(Fe?g:f);for(;L=P.nextNode();)Ds(L),$s(L),L.content instanceof a&&ni(L.content);if(Fe)return g;if(Ae){if(dt)for(z=qt.call(f.ownerDocument);f.firstChild;)z.appendChild(f.firstChild);else z=f;return(B.shadowroot||B.shadowrootmode)&&(z=Wt.call(s,z,!0)),z}let V=he?f.outerHTML:f.innerHTML;return he&&N["!doctype"]&&f.ownerDocument&&f.ownerDocument.doctype&&f.ownerDocument.doctype.name&&F(Ua,f.ownerDocument.doctype.name)&&(V="<!DOCTYPE "+f.ownerDocument.doctype.name+`>
`+V),Te&&_t([Vt,Yt,Kt],ie=>{V=Ze(V,ie," ")}),y&&ut?y.createHTML(V):V},t.setConfig=function(){let g=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};rn(g),Jt=!0},t.clearConfig=function(){Ie=null,Jt=!1},t.isValidAttribute=function(g,d,f){Ie||rn({});const h=D(g),L=D(d);return Bs(h,L,f)},t.addHook=function(g,d){typeof d=="function"&&Ke(j[g],d)},t.removeHook=function(g,d){if(d!==void 0){const f=nc(j[g],d);return f===-1?void 0:sc(j[g],f,1)[0]}return cr(j[g])},t.removeHooks=function(g){j[g]=[]},t.removeAllHooks=function(){j=gr()},t}var wc=qa();window.Alpine=Ca;Ca.start();class yc{constructor(){this.currentPage="landing",this.appElement=document.querySelector("#app"),this.currentStep=1,this.totalSteps=13,this.setupEarlyAccessArEvents(),this.init()}init(){this.setupRouter(),this.render()}setupRouter(){window.addEventListener("hashchange",()=>{this.handleRouteChange()}),this.handleRouteChange()}handleRouteChange(){const t=window.location.hash.slice(1)||"landing";this.currentPage=t,this.render()}render(){switch(this.currentPage){case"landing":this.appElement.innerHTML=nr();break;case"hormozi-style-headline-generator":this.appElement.innerHTML=hl(),this.setupHeadlineGeneratorEvents();break;case"early-access":this.appElement.innerHTML=gl(),this.setupEarlyAccessArEvents();break;default:this.appElement.innerHTML=nr()}}setupEarlyAccessArEvents(){const t=document.getElementById("start-form"),n=document.getElementById("next-btn"),s=document.getElementById("prev-btn");document.getElementById("submit-btn");const r=document.getElementById("early-access-form");t&&t.addEventListener("click",this.showForm.bind(this)),n&&n.addEventListener("click",this.nextStep.bind(this)),s&&s.addEventListener("click",this.prevStep.bind(this)),r&&r.addEventListener("submit",this.handleFormSubmit.bind(this))}showForm(){const t=document.getElementById("welcome-screen"),n=document.getElementById("form-container");t.classList.add("hidden"),n.classList.remove("hidden"),n.classList.add("fade-in")}nextStep(){this.validateCurrentStep()&&this.currentStep<this.totalSteps&&(this.hideCurrentStep(),this.currentStep++,this.showCurrentStep(),this.updateProgress(),this.updateButtons())}prevStep(){this.currentStep>1&&(this.hideCurrentStep(),this.currentStep--,this.showCurrentStep(),this.updateProgress(),this.updateButtons())}validateCurrentStep(){const t=document.querySelector(`.form-step[data-step="${this.currentStep}"]`),n=t.querySelectorAll("input[required], textarea[required]");for(let a of n){if(!a.value.trim())return a.focus(),this.showError("Please fill in all required fields"),!1;if(a.type==="email"&&!this.validateEmail(a.value))return a.focus(),this.showError("Please enter a valid business email address"),!1;if(a.type==="url"){let i=a.value.trim();if(!/^(https?:\/\/|www\.)/i.test(i))return a.focus(),this.showError("Please enter a valid URL (should start with http://, https://, or www.)"),!1;const o=i.replace(/^((https?:\/\/|www\.)[^\/?#]+).*$/i,"$1");a.value=o.toLowerCase()}}const s=t.querySelectorAll('input[type="radio"][required]'),r=[...new Set([...s].map(a=>a.name))];for(let a of r)if(!t.querySelector(`input[name="${a}"]:checked`))return this.showError("Please select an option"),!1;return!0}validateEmail(t){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t))return!1;const r=["gmail.com","outlook.com","hotmail.com","yahoo.com","ymail.com","protonmail.com","icloud.com","mail.com","example.com","aol.com","duck.com"],a=t.split("@")[1].toLowerCase();return!r.includes(a)}validateURL(t){try{return t.match(/^https?:\/\//i)||(t="https://"+t),new URL(t),!0}catch{return!1}}hideCurrentStep(){const t=document.querySelector(`.form-step[data-step="${this.currentStep}"]`);t&&(t.classList.remove("active"),t.style.opacity="0",setTimeout(()=>{t.style.display="none"},300))}showCurrentStep(){const t=document.querySelector(`.form-step[data-step="${this.currentStep}"]`);t&&(t.style.display="block",setTimeout(()=>{t.style.opacity="1",t.classList.add("active")},50))}updateProgress(){const t=document.getElementById("progress-bar"),n=this.currentStep/this.totalSteps*100,s=document.getElementById("progress-percent"),r=document.getElementById("progress-text"),a=document.getElementById("current-step");r&&a&&(a.textContent=this.currentStep,r.textContent=`${this.currentStep}`),s&&(s.textContent=`${Math.round(n)}%`),t&&(t.style.width=`${n}%`),document.querySelectorAll(".step").forEach((o,l)=>{l<this.currentStep?o.classList.add("step-primary"):o.classList.remove("step-primary")})}updateButtons(){const t=document.getElementById("next-btn"),n=document.getElementById("prev-btn"),s=document.getElementById("submit-btn");n&&(n.disabled=this.currentStep===1),this.currentStep===this.totalSteps?(t&&t.classList.add("hidden"),s&&s.classList.remove("hidden")):(t&&t.classList.remove("hidden"),s&&s.classList.add("hidden"))}async handleFormSubmit(t){if(t.preventDefault(),!this.validateCurrentStep())return;const n=new FormData(t.target),s=Object.fromEntries(n.entries()),r=new URLSearchParams(window.location.search);["utm_id","utm_source","utm_medium","utm_campaign","utm_term","utm_content","ref"].forEach(o=>{r.has(o)&&(s[o]=r.get(o))}),s.timestamp=new Date().toISOString();const a=document.getElementById("submit-btn"),i=a.innerHTML;a.innerHTML=`
      <span class="loading loading-spinner loading-sm"></span>
      Submitting...
    `,a.disabled=!0;try{const o=new URL("https://script.google.com/macros/s/AKfycbzgO2EG_gIkLvHgeZu3N0uTcd_16ZUrnwUwO29T_FJrtg883JK8tVqTW2sjc0xt_iYf9g/exec");if(o.search=new URLSearchParams(s).toString(),!(await fetch(o,{method:"GET",redirect:"follow"})).ok)throw new Error("Submission failed");this.showThankYou()}catch(o){console.error("Submission error:",o),this.showError("Submission failed. Please try again.")}finally{a.innerHTML=i,a.disabled=!1}}showThankYou(){const t=document.getElementById("form-container"),n=document.getElementById("thank-you-screen");t.classList.add("hidden"),n.classList.remove("hidden"),n.classList.add("fade-in")}setupHeadlineGeneratorEvents(){const t=document.getElementById("user-form"),n=document.getElementById("ai-form");t&&t.addEventListener("submit",this.handleUserSubmit.bind(this)),n&&n.addEventListener("submit",this.handleAISubmit.bind(this))}validateLinkedInURL(t){return/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(t)}validateBusinessEmail(t){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t))return!1;const r=["gmail.com","outlook.com","hotmail.com","yahoo.com","ymail.com","protonmail.com","icloud.com","mail.com","example.com","aol.com","duck.com"],a=t.split("@")[1].toLowerCase();return!r.includes(a)}showFieldError(t,n){const s=document.getElementById(t),r=document.getElementById(`${t}-error`),a=r.querySelector(".label-text-alt");s.classList.add("input-error"),a.textContent=n,r.classList.remove("hidden")}clearFieldError(t){const n=document.getElementById(t),s=document.getElementById(`${t}-error`);n.classList.remove("input-error"),s.classList.add("hidden")}clearAllErrors(){["name","linkedin","email"].forEach(t=>{this.clearFieldError(t)})}validateUserForm(t){var i;this.clearAllErrors();let n=!0;const s=t.get("name"),r=t.get("linkedin"),a=t.get("email");if((!s||s.trim().length<2)&&(this.showFieldError("name","Please enter a valid full name"),n=!1),(!r||!this.validateLinkedInURL(r))&&(this.showFieldError("linkedin","Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/your-profile)"),n=!1),!a||!this.validateBusinessEmail(a)){if(a){const o=(i=a.split("@")[1])==null?void 0:i.toLowerCase();o&&["gmail.com","outlook.com","hotmail.com","yahoo.com","ymail.com","protonmail.com","icloud.com","mail.com","example.com","aol.com","duck.com"].includes(o)?this.showFieldError("email",`Email addresses from ${o} are not accepted. Please use your business email.`):this.showFieldError("email","Please enter a valid business email address")}else this.showFieldError("email","Please enter a valid business email address");n=!1}return n}async handleUserSubmit(t){t.preventDefault();const n=new FormData(t.target);if(!this.validateUserForm(n))return;const s={full_name:n.get("name"),email:n.get("email"),linkedin:n.get("linkedin")},r=t.target.querySelector('button[type="submit"]'),a=r.innerHTML;r.innerHTML=`
      <span class="loading loading-spinner loading-sm"></span>
      Submitting...
    `,r.disabled=!0;try{(await(await fetch("https://outreach.gatara.org/api/submit/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json()).success?this.showAIForm():this.showError("Submission failed. Please try again.")}catch{this.showError("Network error. Please check your connection and try again.")}finally{r.innerHTML=a,r.disabled=!1}}async handleAISubmit(t){t.preventDefault();const n=new FormData(t.target),s={email_content:n.get("email_content"),target_audience:n.get("target_audience"),tone_of_voice:n.get("tone_of_voice"),main_pain:n.get("main_pain"),outcome:n.get("outcome")};this.showLoader();try{const a=await(await fetch("https://outreach.gatara.org/api/ai-response/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json();this.showResult(a.result)}catch{this.showError("AI processing failed. Please try again.")}}showAIForm(){const t=document.getElementById("user-section"),n=document.getElementById("ai-section");t.classList.add("hidden"),n.classList.remove("hidden"),n.classList.add("fade-in"),n.scrollIntoView({behavior:"smooth"})}showLoader(){const t=document.getElementById("ai-section"),n=document.getElementById("loader-section");t.classList.add("hidden"),n.classList.remove("hidden"),n.classList.add("fade-in"),n.scrollIntoView({behavior:"smooth"})}showResult(t){const n=document.getElementById("loader-section"),s=document.getElementById("result-section");n.classList.add("hidden");const a=(typeof t=="string"?t:(t==null?void 0:t.result)||"⚠️ Invalid response format").replace(/(Pair \d+) (Subject: )?(.*?) (Headline: )?(.*?)(\n|$)/g,`$1
- Subject:
$3
- Headline:
$5
`),i=wc.sanitize(S.parse(a));s.innerHTML=`
      <div class="card bg-base-100 shadow-2xl">
        <div class="card-body p-8">
          <div class="text-center mb-8">
            <h2 class="text-4xl font-bold text-base-content mb-4">Your Hormozi-Style Headlines & Subjects</h2>
            <div class="badge badge-success badge-lg">Generated Successfully!</div>
          </div>
          <div class="bg-base-200 rounded-lg p-6 mb-8 text-lg leading-relaxed whitespace-pre-line [&>p]:my-4">
            ${i}
          </div>
          <div class="text-center">
            <button onclick="window.location.href = '/'" class="btn btn-primary btn-lg gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Go Back Home ;)
            </button>
          </div>
        </div>
      </div>
    `,s.classList.remove("hidden"),s.classList.add("fade-in"),s.scrollIntoView({behavior:"smooth"})}showError(t){const n=document.createElement("div");n.className="toast toast-top toast-end z-50",n.innerHTML=`
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>${t}</span>
      </div>
    `,document.body.appendChild(n),setTimeout(()=>{n.remove()},5e3)}}new yc;
