(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();function L1(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Sy={exports:{}},ql={},ky={exports:{}},se={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bo=Symbol.for("react.element"),j1=Symbol.for("react.portal"),F1=Symbol.for("react.fragment"),U1=Symbol.for("react.strict_mode"),z1=Symbol.for("react.profiler"),B1=Symbol.for("react.provider"),$1=Symbol.for("react.context"),H1=Symbol.for("react.forward_ref"),q1=Symbol.for("react.suspense"),W1=Symbol.for("react.memo"),G1=Symbol.for("react.lazy"),zp=Symbol.iterator;function K1(t){return t===null||typeof t!="object"?null:(t=zp&&t[zp]||t["@@iterator"],typeof t=="function"?t:null)}var Ay={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Cy=Object.assign,by={};function Js(t,e,n){this.props=t,this.context=e,this.refs=by,this.updater=n||Ay}Js.prototype.isReactComponent={};Js.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Js.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Ry(){}Ry.prototype=Js.prototype;function nd(t,e,n){this.props=t,this.context=e,this.refs=by,this.updater=n||Ay}var rd=nd.prototype=new Ry;rd.constructor=nd;Cy(rd,Js.prototype);rd.isPureReactComponent=!0;var Bp=Array.isArray,Py=Object.prototype.hasOwnProperty,sd={current:null},Ny={key:!0,ref:!0,__self:!0,__source:!0};function Dy(t,e,n){var r,s={},i=null,o=null;if(e!=null)for(r in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(i=""+e.key),e)Py.call(e,r)&&!Ny.hasOwnProperty(r)&&(s[r]=e[r]);var l=arguments.length-2;if(l===1)s.children=n;else if(1<l){for(var u=Array(l),h=0;h<l;h++)u[h]=arguments[h+2];s.children=u}if(t&&t.defaultProps)for(r in l=t.defaultProps,l)s[r]===void 0&&(s[r]=l[r]);return{$$typeof:bo,type:t,key:i,ref:o,props:s,_owner:sd.current}}function Q1(t,e){return{$$typeof:bo,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function id(t){return typeof t=="object"&&t!==null&&t.$$typeof===bo}function X1(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var $p=/\/+/g;function Xu(t,e){return typeof t=="object"&&t!==null&&t.key!=null?X1(""+t.key):e.toString(36)}function ba(t,e,n,r,s){var i=typeof t;(i==="undefined"||i==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(i){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case bo:case j1:o=!0}}if(o)return o=t,s=s(o),t=r===""?"."+Xu(o,0):r,Bp(s)?(n="",t!=null&&(n=t.replace($p,"$&/")+"/"),ba(s,e,n,"",function(h){return h})):s!=null&&(id(s)&&(s=Q1(s,n+(!s.key||o&&o.key===s.key?"":(""+s.key).replace($p,"$&/")+"/")+t)),e.push(s)),1;if(o=0,r=r===""?".":r+":",Bp(t))for(var l=0;l<t.length;l++){i=t[l];var u=r+Xu(i,l);o+=ba(i,e,n,u,s)}else if(u=K1(t),typeof u=="function")for(t=u.call(t),l=0;!(i=t.next()).done;)i=i.value,u=r+Xu(i,l++),o+=ba(i,e,n,u,s);else if(i==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function ia(t,e,n){if(t==null)return t;var r=[],s=0;return ba(t,r,"","",function(i){return e.call(n,i,s++)}),r}function Y1(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var dt={current:null},Ra={transition:null},J1={ReactCurrentDispatcher:dt,ReactCurrentBatchConfig:Ra,ReactCurrentOwner:sd};function Vy(){throw Error("act(...) is not supported in production builds of React.")}se.Children={map:ia,forEach:function(t,e,n){ia(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return ia(t,function(){e++}),e},toArray:function(t){return ia(t,function(e){return e})||[]},only:function(t){if(!id(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};se.Component=Js;se.Fragment=F1;se.Profiler=z1;se.PureComponent=nd;se.StrictMode=U1;se.Suspense=q1;se.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=J1;se.act=Vy;se.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var r=Cy({},t.props),s=t.key,i=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(i=e.ref,o=sd.current),e.key!==void 0&&(s=""+e.key),t.type&&t.type.defaultProps)var l=t.type.defaultProps;for(u in e)Py.call(e,u)&&!Ny.hasOwnProperty(u)&&(r[u]=e[u]===void 0&&l!==void 0?l[u]:e[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){l=Array(u);for(var h=0;h<u;h++)l[h]=arguments[h+2];r.children=l}return{$$typeof:bo,type:t.type,key:s,ref:i,props:r,_owner:o}};se.createContext=function(t){return t={$$typeof:$1,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:B1,_context:t},t.Consumer=t};se.createElement=Dy;se.createFactory=function(t){var e=Dy.bind(null,t);return e.type=t,e};se.createRef=function(){return{current:null}};se.forwardRef=function(t){return{$$typeof:H1,render:t}};se.isValidElement=id;se.lazy=function(t){return{$$typeof:G1,_payload:{_status:-1,_result:t},_init:Y1}};se.memo=function(t,e){return{$$typeof:W1,type:t,compare:e===void 0?null:e}};se.startTransition=function(t){var e=Ra.transition;Ra.transition={};try{t()}finally{Ra.transition=e}};se.unstable_act=Vy;se.useCallback=function(t,e){return dt.current.useCallback(t,e)};se.useContext=function(t){return dt.current.useContext(t)};se.useDebugValue=function(){};se.useDeferredValue=function(t){return dt.current.useDeferredValue(t)};se.useEffect=function(t,e){return dt.current.useEffect(t,e)};se.useId=function(){return dt.current.useId()};se.useImperativeHandle=function(t,e,n){return dt.current.useImperativeHandle(t,e,n)};se.useInsertionEffect=function(t,e){return dt.current.useInsertionEffect(t,e)};se.useLayoutEffect=function(t,e){return dt.current.useLayoutEffect(t,e)};se.useMemo=function(t,e){return dt.current.useMemo(t,e)};se.useReducer=function(t,e,n){return dt.current.useReducer(t,e,n)};se.useRef=function(t){return dt.current.useRef(t)};se.useState=function(t){return dt.current.useState(t)};se.useSyncExternalStore=function(t,e,n){return dt.current.useSyncExternalStore(t,e,n)};se.useTransition=function(){return dt.current.useTransition()};se.version="18.3.1";ky.exports=se;var H=ky.exports;const Z1=L1(H);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var eE=H,tE=Symbol.for("react.element"),nE=Symbol.for("react.fragment"),rE=Object.prototype.hasOwnProperty,sE=eE.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,iE={key:!0,ref:!0,__self:!0,__source:!0};function My(t,e,n){var r,s={},i=null,o=null;n!==void 0&&(i=""+n),e.key!==void 0&&(i=""+e.key),e.ref!==void 0&&(o=e.ref);for(r in e)rE.call(e,r)&&!iE.hasOwnProperty(r)&&(s[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)s[r]===void 0&&(s[r]=e[r]);return{$$typeof:tE,type:t,key:i,ref:o,props:s,_owner:sE.current}}ql.Fragment=nE;ql.jsx=My;ql.jsxs=My;Sy.exports=ql;var f=Sy.exports,Vc={},Oy={exports:{}},Ct={},Ly={exports:{}},jy={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(z,G){var L=z.length;z.push(G);e:for(;0<L;){var te=L-1>>>1,pe=z[te];if(0<s(pe,G))z[te]=G,z[L]=pe,L=te;else break e}}function n(z){return z.length===0?null:z[0]}function r(z){if(z.length===0)return null;var G=z[0],L=z.pop();if(L!==G){z[0]=L;e:for(var te=0,pe=z.length,pt=pe>>>1;te<pt;){var Pe=2*(te+1)-1,hn=z[Pe],jt=Pe+1,Mn=z[jt];if(0>s(hn,L))jt<pe&&0>s(Mn,hn)?(z[te]=Mn,z[jt]=L,te=jt):(z[te]=hn,z[Pe]=L,te=Pe);else if(jt<pe&&0>s(Mn,L))z[te]=Mn,z[jt]=L,te=jt;else break e}}return G}function s(z,G){var L=z.sortIndex-G.sortIndex;return L!==0?L:z.id-G.id}if(typeof performance=="object"&&typeof performance.now=="function"){var i=performance;t.unstable_now=function(){return i.now()}}else{var o=Date,l=o.now();t.unstable_now=function(){return o.now()-l}}var u=[],h=[],p=1,m=null,g=3,A=!1,b=!1,R=!1,V=typeof setTimeout=="function"?setTimeout:null,I=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function k(z){for(var G=n(h);G!==null;){if(G.callback===null)r(h);else if(G.startTime<=z)r(h),G.sortIndex=G.expirationTime,e(u,G);else break;G=n(h)}}function D(z){if(R=!1,k(z),!b)if(n(u)!==null)b=!0,ee(j);else{var G=n(h);G!==null&&de(D,G.startTime-z)}}function j(z,G){b=!1,R&&(R=!1,I(v),v=-1),A=!0;var L=g;try{for(k(G),m=n(u);m!==null&&(!(m.expirationTime>G)||z&&!S());){var te=m.callback;if(typeof te=="function"){m.callback=null,g=m.priorityLevel;var pe=te(m.expirationTime<=G);G=t.unstable_now(),typeof pe=="function"?m.callback=pe:m===n(u)&&r(u),k(G)}else r(u);m=n(u)}if(m!==null)var pt=!0;else{var Pe=n(h);Pe!==null&&de(D,Pe.startTime-G),pt=!1}return pt}finally{m=null,g=L,A=!1}}var U=!1,x=null,v=-1,E=5,T=-1;function S(){return!(t.unstable_now()-T<E)}function C(){if(x!==null){var z=t.unstable_now();T=z;var G=!0;try{G=x(!0,z)}finally{G?w():(U=!1,x=null)}}else U=!1}var w;if(typeof _=="function")w=function(){_(C)};else if(typeof MessageChannel<"u"){var re=new MessageChannel,X=re.port2;re.port1.onmessage=C,w=function(){X.postMessage(null)}}else w=function(){V(C,0)};function ee(z){x=z,U||(U=!0,w())}function de(z,G){v=V(function(){z(t.unstable_now())},G)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(z){z.callback=null},t.unstable_continueExecution=function(){b||A||(b=!0,ee(j))},t.unstable_forceFrameRate=function(z){0>z||125<z?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):E=0<z?Math.floor(1e3/z):5},t.unstable_getCurrentPriorityLevel=function(){return g},t.unstable_getFirstCallbackNode=function(){return n(u)},t.unstable_next=function(z){switch(g){case 1:case 2:case 3:var G=3;break;default:G=g}var L=g;g=G;try{return z()}finally{g=L}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(z,G){switch(z){case 1:case 2:case 3:case 4:case 5:break;default:z=3}var L=g;g=z;try{return G()}finally{g=L}},t.unstable_scheduleCallback=function(z,G,L){var te=t.unstable_now();switch(typeof L=="object"&&L!==null?(L=L.delay,L=typeof L=="number"&&0<L?te+L:te):L=te,z){case 1:var pe=-1;break;case 2:pe=250;break;case 5:pe=1073741823;break;case 4:pe=1e4;break;default:pe=5e3}return pe=L+pe,z={id:p++,callback:G,priorityLevel:z,startTime:L,expirationTime:pe,sortIndex:-1},L>te?(z.sortIndex=L,e(h,z),n(u)===null&&z===n(h)&&(R?(I(v),v=-1):R=!0,de(D,L-te))):(z.sortIndex=pe,e(u,z),b||A||(b=!0,ee(j))),z},t.unstable_shouldYield=S,t.unstable_wrapCallback=function(z){var G=g;return function(){var L=g;g=G;try{return z.apply(this,arguments)}finally{g=L}}}})(jy);Ly.exports=jy;var oE=Ly.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var aE=H,At=oE;function F(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Fy=new Set,no={};function es(t,e){Ls(t,e),Ls(t+"Capture",e)}function Ls(t,e){for(no[t]=e,t=0;t<e.length;t++)Fy.add(e[t])}var Tn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Mc=Object.prototype.hasOwnProperty,lE=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Hp={},qp={};function uE(t){return Mc.call(qp,t)?!0:Mc.call(Hp,t)?!1:lE.test(t)?qp[t]=!0:(Hp[t]=!0,!1)}function cE(t,e,n,r){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function hE(t,e,n,r){if(e===null||typeof e>"u"||cE(t,e,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function ft(t,e,n,r,s,i,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=r,this.attributeNamespace=s,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=i,this.removeEmptyString=o}var Xe={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Xe[t]=new ft(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Xe[e]=new ft(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Xe[t]=new ft(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Xe[t]=new ft(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Xe[t]=new ft(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Xe[t]=new ft(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Xe[t]=new ft(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Xe[t]=new ft(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Xe[t]=new ft(t,5,!1,t.toLowerCase(),null,!1,!1)});var od=/[\-:]([a-z])/g;function ad(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(od,ad);Xe[e]=new ft(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(od,ad);Xe[e]=new ft(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(od,ad);Xe[e]=new ft(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Xe[t]=new ft(t,1,!1,t.toLowerCase(),null,!1,!1)});Xe.xlinkHref=new ft("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Xe[t]=new ft(t,1,!1,t.toLowerCase(),null,!0,!0)});function ld(t,e,n,r){var s=Xe.hasOwnProperty(e)?Xe[e]:null;(s!==null?s.type!==0:r||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(hE(e,n,s,r)&&(n=null),r||s===null?uE(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):s.mustUseProperty?t[s.propertyName]=n===null?s.type===3?!1:"":n:(e=s.attributeName,r=s.attributeNamespace,n===null?t.removeAttribute(e):(s=s.type,n=s===3||s===4&&n===!0?"":""+n,r?t.setAttributeNS(r,e,n):t.setAttribute(e,n))))}var Dn=aE.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,oa=Symbol.for("react.element"),fs=Symbol.for("react.portal"),ps=Symbol.for("react.fragment"),ud=Symbol.for("react.strict_mode"),Oc=Symbol.for("react.profiler"),Uy=Symbol.for("react.provider"),zy=Symbol.for("react.context"),cd=Symbol.for("react.forward_ref"),Lc=Symbol.for("react.suspense"),jc=Symbol.for("react.suspense_list"),hd=Symbol.for("react.memo"),Hn=Symbol.for("react.lazy"),By=Symbol.for("react.offscreen"),Wp=Symbol.iterator;function Si(t){return t===null||typeof t!="object"?null:(t=Wp&&t[Wp]||t["@@iterator"],typeof t=="function"?t:null)}var Se=Object.assign,Yu;function Di(t){if(Yu===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Yu=e&&e[1]||""}return`
`+Yu+t}var Ju=!1;function Zu(t,e){if(!t||Ju)return"";Ju=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(h){var r=h}Reflect.construct(t,[],e)}else{try{e.call()}catch(h){r=h}t.call(e.prototype)}else{try{throw Error()}catch(h){r=h}t()}}catch(h){if(h&&r&&typeof h.stack=="string"){for(var s=h.stack.split(`
`),i=r.stack.split(`
`),o=s.length-1,l=i.length-1;1<=o&&0<=l&&s[o]!==i[l];)l--;for(;1<=o&&0<=l;o--,l--)if(s[o]!==i[l]){if(o!==1||l!==1)do if(o--,l--,0>l||s[o]!==i[l]){var u=`
`+s[o].replace(" at new "," at ");return t.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",t.displayName)),u}while(1<=o&&0<=l);break}}}finally{Ju=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?Di(t):""}function dE(t){switch(t.tag){case 5:return Di(t.type);case 16:return Di("Lazy");case 13:return Di("Suspense");case 19:return Di("SuspenseList");case 0:case 2:case 15:return t=Zu(t.type,!1),t;case 11:return t=Zu(t.type.render,!1),t;case 1:return t=Zu(t.type,!0),t;default:return""}}function Fc(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case ps:return"Fragment";case fs:return"Portal";case Oc:return"Profiler";case ud:return"StrictMode";case Lc:return"Suspense";case jc:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case zy:return(t.displayName||"Context")+".Consumer";case Uy:return(t._context.displayName||"Context")+".Provider";case cd:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case hd:return e=t.displayName||null,e!==null?e:Fc(t.type)||"Memo";case Hn:e=t._payload,t=t._init;try{return Fc(t(e))}catch{}}return null}function fE(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Fc(e);case 8:return e===ud?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function mr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function $y(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function pE(t){var e=$y(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),r=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var s=n.get,i=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return s.call(this)},set:function(o){r=""+o,i.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function aa(t){t._valueTracker||(t._valueTracker=pE(t))}function Hy(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),r="";return t&&(r=$y(t)?t.checked?"true":"false":t.value),t=r,t!==n?(e.setValue(t),!0):!1}function el(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Uc(t,e){var n=e.checked;return Se({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Gp(t,e){var n=e.defaultValue==null?"":e.defaultValue,r=e.checked!=null?e.checked:e.defaultChecked;n=mr(e.value!=null?e.value:n),t._wrapperState={initialChecked:r,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function qy(t,e){e=e.checked,e!=null&&ld(t,"checked",e,!1)}function zc(t,e){qy(t,e);var n=mr(e.value),r=e.type;if(n!=null)r==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(r==="submit"||r==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Bc(t,e.type,n):e.hasOwnProperty("defaultValue")&&Bc(t,e.type,mr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Kp(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var r=e.type;if(!(r!=="submit"&&r!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Bc(t,e,n){(e!=="number"||el(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Vi=Array.isArray;function ks(t,e,n,r){if(t=t.options,e){e={};for(var s=0;s<n.length;s++)e["$"+n[s]]=!0;for(n=0;n<t.length;n++)s=e.hasOwnProperty("$"+t[n].value),t[n].selected!==s&&(t[n].selected=s),s&&r&&(t[n].defaultSelected=!0)}else{for(n=""+mr(n),e=null,s=0;s<t.length;s++){if(t[s].value===n){t[s].selected=!0,r&&(t[s].defaultSelected=!0);return}e!==null||t[s].disabled||(e=t[s])}e!==null&&(e.selected=!0)}}function $c(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(F(91));return Se({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Qp(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(F(92));if(Vi(n)){if(1<n.length)throw Error(F(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:mr(n)}}function Wy(t,e){var n=mr(e.value),r=mr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),r!=null&&(t.defaultValue=""+r)}function Xp(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Gy(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Hc(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Gy(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var la,Ky=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,r,s){MSApp.execUnsafeLocalFunction(function(){return t(e,n,r,s)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(la=la||document.createElement("div"),la.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=la.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function ro(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var zi={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},mE=["Webkit","ms","Moz","O"];Object.keys(zi).forEach(function(t){mE.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),zi[e]=zi[t]})});function Qy(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||zi.hasOwnProperty(t)&&zi[t]?(""+e).trim():e+"px"}function Xy(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var r=n.indexOf("--")===0,s=Qy(n,e[n],r);n==="float"&&(n="cssFloat"),r?t.setProperty(n,s):t[n]=s}}var gE=Se({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function qc(t,e){if(e){if(gE[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(F(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(F(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(F(61))}if(e.style!=null&&typeof e.style!="object")throw Error(F(62))}}function Wc(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Gc=null;function dd(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Kc=null,As=null,Cs=null;function Yp(t){if(t=No(t)){if(typeof Kc!="function")throw Error(F(280));var e=t.stateNode;e&&(e=Xl(e),Kc(t.stateNode,t.type,e))}}function Yy(t){As?Cs?Cs.push(t):Cs=[t]:As=t}function Jy(){if(As){var t=As,e=Cs;if(Cs=As=null,Yp(t),e)for(t=0;t<e.length;t++)Yp(e[t])}}function Zy(t,e){return t(e)}function e_(){}var ec=!1;function t_(t,e,n){if(ec)return t(e,n);ec=!0;try{return Zy(t,e,n)}finally{ec=!1,(As!==null||Cs!==null)&&(e_(),Jy())}}function so(t,e){var n=t.stateNode;if(n===null)return null;var r=Xl(n);if(r===null)return null;n=r[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(t=t.type,r=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!r;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(F(231,e,typeof n));return n}var Qc=!1;if(Tn)try{var ki={};Object.defineProperty(ki,"passive",{get:function(){Qc=!0}}),window.addEventListener("test",ki,ki),window.removeEventListener("test",ki,ki)}catch{Qc=!1}function yE(t,e,n,r,s,i,o,l,u){var h=Array.prototype.slice.call(arguments,3);try{e.apply(n,h)}catch(p){this.onError(p)}}var Bi=!1,tl=null,nl=!1,Xc=null,_E={onError:function(t){Bi=!0,tl=t}};function vE(t,e,n,r,s,i,o,l,u){Bi=!1,tl=null,yE.apply(_E,arguments)}function wE(t,e,n,r,s,i,o,l,u){if(vE.apply(this,arguments),Bi){if(Bi){var h=tl;Bi=!1,tl=null}else throw Error(F(198));nl||(nl=!0,Xc=h)}}function ts(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function n_(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Jp(t){if(ts(t)!==t)throw Error(F(188))}function EE(t){var e=t.alternate;if(!e){if(e=ts(t),e===null)throw Error(F(188));return e!==t?null:t}for(var n=t,r=e;;){var s=n.return;if(s===null)break;var i=s.alternate;if(i===null){if(r=s.return,r!==null){n=r;continue}break}if(s.child===i.child){for(i=s.child;i;){if(i===n)return Jp(s),t;if(i===r)return Jp(s),e;i=i.sibling}throw Error(F(188))}if(n.return!==r.return)n=s,r=i;else{for(var o=!1,l=s.child;l;){if(l===n){o=!0,n=s,r=i;break}if(l===r){o=!0,r=s,n=i;break}l=l.sibling}if(!o){for(l=i.child;l;){if(l===n){o=!0,n=i,r=s;break}if(l===r){o=!0,r=i,n=s;break}l=l.sibling}if(!o)throw Error(F(189))}}if(n.alternate!==r)throw Error(F(190))}if(n.tag!==3)throw Error(F(188));return n.stateNode.current===n?t:e}function r_(t){return t=EE(t),t!==null?s_(t):null}function s_(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=s_(t);if(e!==null)return e;t=t.sibling}return null}var i_=At.unstable_scheduleCallback,Zp=At.unstable_cancelCallback,xE=At.unstable_shouldYield,TE=At.unstable_requestPaint,Re=At.unstable_now,IE=At.unstable_getCurrentPriorityLevel,fd=At.unstable_ImmediatePriority,o_=At.unstable_UserBlockingPriority,rl=At.unstable_NormalPriority,SE=At.unstable_LowPriority,a_=At.unstable_IdlePriority,Wl=null,Zt=null;function kE(t){if(Zt&&typeof Zt.onCommitFiberRoot=="function")try{Zt.onCommitFiberRoot(Wl,t,void 0,(t.current.flags&128)===128)}catch{}}var Ht=Math.clz32?Math.clz32:bE,AE=Math.log,CE=Math.LN2;function bE(t){return t>>>=0,t===0?32:31-(AE(t)/CE|0)|0}var ua=64,ca=4194304;function Mi(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function sl(t,e){var n=t.pendingLanes;if(n===0)return 0;var r=0,s=t.suspendedLanes,i=t.pingedLanes,o=n&268435455;if(o!==0){var l=o&~s;l!==0?r=Mi(l):(i&=o,i!==0&&(r=Mi(i)))}else o=n&~s,o!==0?r=Mi(o):i!==0&&(r=Mi(i));if(r===0)return 0;if(e!==0&&e!==r&&!(e&s)&&(s=r&-r,i=e&-e,s>=i||s===16&&(i&4194240)!==0))return e;if(r&4&&(r|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=r;0<e;)n=31-Ht(e),s=1<<n,r|=t[n],e&=~s;return r}function RE(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function PE(t,e){for(var n=t.suspendedLanes,r=t.pingedLanes,s=t.expirationTimes,i=t.pendingLanes;0<i;){var o=31-Ht(i),l=1<<o,u=s[o];u===-1?(!(l&n)||l&r)&&(s[o]=RE(l,e)):u<=e&&(t.expiredLanes|=l),i&=~l}}function Yc(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function l_(){var t=ua;return ua<<=1,!(ua&4194240)&&(ua=64),t}function tc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Ro(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Ht(e),t[e]=n}function NE(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var r=t.eventTimes;for(t=t.expirationTimes;0<n;){var s=31-Ht(n),i=1<<s;e[s]=0,r[s]=-1,t[s]=-1,n&=~i}}function pd(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var r=31-Ht(n),s=1<<r;s&e|t[r]&e&&(t[r]|=e),n&=~s}}var fe=0;function u_(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var c_,md,h_,d_,f_,Jc=!1,ha=[],tr=null,nr=null,rr=null,io=new Map,oo=new Map,Wn=[],DE="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function em(t,e){switch(t){case"focusin":case"focusout":tr=null;break;case"dragenter":case"dragleave":nr=null;break;case"mouseover":case"mouseout":rr=null;break;case"pointerover":case"pointerout":io.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":oo.delete(e.pointerId)}}function Ai(t,e,n,r,s,i){return t===null||t.nativeEvent!==i?(t={blockedOn:e,domEventName:n,eventSystemFlags:r,nativeEvent:i,targetContainers:[s]},e!==null&&(e=No(e),e!==null&&md(e)),t):(t.eventSystemFlags|=r,e=t.targetContainers,s!==null&&e.indexOf(s)===-1&&e.push(s),t)}function VE(t,e,n,r,s){switch(e){case"focusin":return tr=Ai(tr,t,e,n,r,s),!0;case"dragenter":return nr=Ai(nr,t,e,n,r,s),!0;case"mouseover":return rr=Ai(rr,t,e,n,r,s),!0;case"pointerover":var i=s.pointerId;return io.set(i,Ai(io.get(i)||null,t,e,n,r,s)),!0;case"gotpointercapture":return i=s.pointerId,oo.set(i,Ai(oo.get(i)||null,t,e,n,r,s)),!0}return!1}function p_(t){var e=Lr(t.target);if(e!==null){var n=ts(e);if(n!==null){if(e=n.tag,e===13){if(e=n_(n),e!==null){t.blockedOn=e,f_(t.priority,function(){h_(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Pa(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=Zc(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var r=new n.constructor(n.type,n);Gc=r,n.target.dispatchEvent(r),Gc=null}else return e=No(n),e!==null&&md(e),t.blockedOn=n,!1;e.shift()}return!0}function tm(t,e,n){Pa(t)&&n.delete(e)}function ME(){Jc=!1,tr!==null&&Pa(tr)&&(tr=null),nr!==null&&Pa(nr)&&(nr=null),rr!==null&&Pa(rr)&&(rr=null),io.forEach(tm),oo.forEach(tm)}function Ci(t,e){t.blockedOn===e&&(t.blockedOn=null,Jc||(Jc=!0,At.unstable_scheduleCallback(At.unstable_NormalPriority,ME)))}function ao(t){function e(s){return Ci(s,t)}if(0<ha.length){Ci(ha[0],t);for(var n=1;n<ha.length;n++){var r=ha[n];r.blockedOn===t&&(r.blockedOn=null)}}for(tr!==null&&Ci(tr,t),nr!==null&&Ci(nr,t),rr!==null&&Ci(rr,t),io.forEach(e),oo.forEach(e),n=0;n<Wn.length;n++)r=Wn[n],r.blockedOn===t&&(r.blockedOn=null);for(;0<Wn.length&&(n=Wn[0],n.blockedOn===null);)p_(n),n.blockedOn===null&&Wn.shift()}var bs=Dn.ReactCurrentBatchConfig,il=!0;function OE(t,e,n,r){var s=fe,i=bs.transition;bs.transition=null;try{fe=1,gd(t,e,n,r)}finally{fe=s,bs.transition=i}}function LE(t,e,n,r){var s=fe,i=bs.transition;bs.transition=null;try{fe=4,gd(t,e,n,r)}finally{fe=s,bs.transition=i}}function gd(t,e,n,r){if(il){var s=Zc(t,e,n,r);if(s===null)hc(t,e,r,ol,n),em(t,r);else if(VE(s,t,e,n,r))r.stopPropagation();else if(em(t,r),e&4&&-1<DE.indexOf(t)){for(;s!==null;){var i=No(s);if(i!==null&&c_(i),i=Zc(t,e,n,r),i===null&&hc(t,e,r,ol,n),i===s)break;s=i}s!==null&&r.stopPropagation()}else hc(t,e,r,null,n)}}var ol=null;function Zc(t,e,n,r){if(ol=null,t=dd(r),t=Lr(t),t!==null)if(e=ts(t),e===null)t=null;else if(n=e.tag,n===13){if(t=n_(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return ol=t,null}function m_(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(IE()){case fd:return 1;case o_:return 4;case rl:case SE:return 16;case a_:return 536870912;default:return 16}default:return 16}}var Jn=null,yd=null,Na=null;function g_(){if(Na)return Na;var t,e=yd,n=e.length,r,s="value"in Jn?Jn.value:Jn.textContent,i=s.length;for(t=0;t<n&&e[t]===s[t];t++);var o=n-t;for(r=1;r<=o&&e[n-r]===s[i-r];r++);return Na=s.slice(t,1<r?1-r:void 0)}function Da(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function da(){return!0}function nm(){return!1}function bt(t){function e(n,r,s,i,o){this._reactName=n,this._targetInst=s,this.type=r,this.nativeEvent=i,this.target=o,this.currentTarget=null;for(var l in t)t.hasOwnProperty(l)&&(n=t[l],this[l]=n?n(i):i[l]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?da:nm,this.isPropagationStopped=nm,this}return Se(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=da)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=da)},persist:function(){},isPersistent:da}),e}var Zs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},_d=bt(Zs),Po=Se({},Zs,{view:0,detail:0}),jE=bt(Po),nc,rc,bi,Gl=Se({},Po,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:vd,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==bi&&(bi&&t.type==="mousemove"?(nc=t.screenX-bi.screenX,rc=t.screenY-bi.screenY):rc=nc=0,bi=t),nc)},movementY:function(t){return"movementY"in t?t.movementY:rc}}),rm=bt(Gl),FE=Se({},Gl,{dataTransfer:0}),UE=bt(FE),zE=Se({},Po,{relatedTarget:0}),sc=bt(zE),BE=Se({},Zs,{animationName:0,elapsedTime:0,pseudoElement:0}),$E=bt(BE),HE=Se({},Zs,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),qE=bt(HE),WE=Se({},Zs,{data:0}),sm=bt(WE),GE={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},KE={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},QE={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function XE(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=QE[t])?!!e[t]:!1}function vd(){return XE}var YE=Se({},Po,{key:function(t){if(t.key){var e=GE[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Da(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?KE[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:vd,charCode:function(t){return t.type==="keypress"?Da(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Da(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),JE=bt(YE),ZE=Se({},Gl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),im=bt(ZE),ex=Se({},Po,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:vd}),tx=bt(ex),nx=Se({},Zs,{propertyName:0,elapsedTime:0,pseudoElement:0}),rx=bt(nx),sx=Se({},Gl,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),ix=bt(sx),ox=[9,13,27,32],wd=Tn&&"CompositionEvent"in window,$i=null;Tn&&"documentMode"in document&&($i=document.documentMode);var ax=Tn&&"TextEvent"in window&&!$i,y_=Tn&&(!wd||$i&&8<$i&&11>=$i),om=" ",am=!1;function __(t,e){switch(t){case"keyup":return ox.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function v_(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var ms=!1;function lx(t,e){switch(t){case"compositionend":return v_(e);case"keypress":return e.which!==32?null:(am=!0,om);case"textInput":return t=e.data,t===om&&am?null:t;default:return null}}function ux(t,e){if(ms)return t==="compositionend"||!wd&&__(t,e)?(t=g_(),Na=yd=Jn=null,ms=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return y_&&e.locale!=="ko"?null:e.data;default:return null}}var cx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function lm(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!cx[t.type]:e==="textarea"}function w_(t,e,n,r){Yy(r),e=al(e,"onChange"),0<e.length&&(n=new _d("onChange","change",null,n,r),t.push({event:n,listeners:e}))}var Hi=null,lo=null;function hx(t){P_(t,0)}function Kl(t){var e=_s(t);if(Hy(e))return t}function dx(t,e){if(t==="change")return e}var E_=!1;if(Tn){var ic;if(Tn){var oc="oninput"in document;if(!oc){var um=document.createElement("div");um.setAttribute("oninput","return;"),oc=typeof um.oninput=="function"}ic=oc}else ic=!1;E_=ic&&(!document.documentMode||9<document.documentMode)}function cm(){Hi&&(Hi.detachEvent("onpropertychange",x_),lo=Hi=null)}function x_(t){if(t.propertyName==="value"&&Kl(lo)){var e=[];w_(e,lo,t,dd(t)),t_(hx,e)}}function fx(t,e,n){t==="focusin"?(cm(),Hi=e,lo=n,Hi.attachEvent("onpropertychange",x_)):t==="focusout"&&cm()}function px(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Kl(lo)}function mx(t,e){if(t==="click")return Kl(e)}function gx(t,e){if(t==="input"||t==="change")return Kl(e)}function yx(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Wt=typeof Object.is=="function"?Object.is:yx;function uo(t,e){if(Wt(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var s=n[r];if(!Mc.call(e,s)||!Wt(t[s],e[s]))return!1}return!0}function hm(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function dm(t,e){var n=hm(t);t=0;for(var r;n;){if(n.nodeType===3){if(r=t+n.textContent.length,t<=e&&r>=e)return{node:n,offset:e-t};t=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=hm(n)}}function T_(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?T_(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function I_(){for(var t=window,e=el();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=el(t.document)}return e}function Ed(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function _x(t){var e=I_(),n=t.focusedElem,r=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&T_(n.ownerDocument.documentElement,n)){if(r!==null&&Ed(n)){if(e=r.start,t=r.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var s=n.textContent.length,i=Math.min(r.start,s);r=r.end===void 0?i:Math.min(r.end,s),!t.extend&&i>r&&(s=r,r=i,i=s),s=dm(n,i);var o=dm(n,r);s&&o&&(t.rangeCount!==1||t.anchorNode!==s.node||t.anchorOffset!==s.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(s.node,s.offset),t.removeAllRanges(),i>r?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var vx=Tn&&"documentMode"in document&&11>=document.documentMode,gs=null,eh=null,qi=null,th=!1;function fm(t,e,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;th||gs==null||gs!==el(r)||(r=gs,"selectionStart"in r&&Ed(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),qi&&uo(qi,r)||(qi=r,r=al(eh,"onSelect"),0<r.length&&(e=new _d("onSelect","select",null,e,n),t.push({event:e,listeners:r}),e.target=gs)))}function fa(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var ys={animationend:fa("Animation","AnimationEnd"),animationiteration:fa("Animation","AnimationIteration"),animationstart:fa("Animation","AnimationStart"),transitionend:fa("Transition","TransitionEnd")},ac={},S_={};Tn&&(S_=document.createElement("div").style,"AnimationEvent"in window||(delete ys.animationend.animation,delete ys.animationiteration.animation,delete ys.animationstart.animation),"TransitionEvent"in window||delete ys.transitionend.transition);function Ql(t){if(ac[t])return ac[t];if(!ys[t])return t;var e=ys[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in S_)return ac[t]=e[n];return t}var k_=Ql("animationend"),A_=Ql("animationiteration"),C_=Ql("animationstart"),b_=Ql("transitionend"),R_=new Map,pm="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Ir(t,e){R_.set(t,e),es(e,[t])}for(var lc=0;lc<pm.length;lc++){var uc=pm[lc],wx=uc.toLowerCase(),Ex=uc[0].toUpperCase()+uc.slice(1);Ir(wx,"on"+Ex)}Ir(k_,"onAnimationEnd");Ir(A_,"onAnimationIteration");Ir(C_,"onAnimationStart");Ir("dblclick","onDoubleClick");Ir("focusin","onFocus");Ir("focusout","onBlur");Ir(b_,"onTransitionEnd");Ls("onMouseEnter",["mouseout","mouseover"]);Ls("onMouseLeave",["mouseout","mouseover"]);Ls("onPointerEnter",["pointerout","pointerover"]);Ls("onPointerLeave",["pointerout","pointerover"]);es("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));es("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));es("onBeforeInput",["compositionend","keypress","textInput","paste"]);es("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));es("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));es("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Oi="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),xx=new Set("cancel close invalid load scroll toggle".split(" ").concat(Oi));function mm(t,e,n){var r=t.type||"unknown-event";t.currentTarget=n,wE(r,e,void 0,t),t.currentTarget=null}function P_(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var r=t[n],s=r.event;r=r.listeners;e:{var i=void 0;if(e)for(var o=r.length-1;0<=o;o--){var l=r[o],u=l.instance,h=l.currentTarget;if(l=l.listener,u!==i&&s.isPropagationStopped())break e;mm(s,l,h),i=u}else for(o=0;o<r.length;o++){if(l=r[o],u=l.instance,h=l.currentTarget,l=l.listener,u!==i&&s.isPropagationStopped())break e;mm(s,l,h),i=u}}}if(nl)throw t=Xc,nl=!1,Xc=null,t}function _e(t,e){var n=e[oh];n===void 0&&(n=e[oh]=new Set);var r=t+"__bubble";n.has(r)||(N_(e,t,2,!1),n.add(r))}function cc(t,e,n){var r=0;e&&(r|=4),N_(n,t,r,e)}var pa="_reactListening"+Math.random().toString(36).slice(2);function co(t){if(!t[pa]){t[pa]=!0,Fy.forEach(function(n){n!=="selectionchange"&&(xx.has(n)||cc(n,!1,t),cc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[pa]||(e[pa]=!0,cc("selectionchange",!1,e))}}function N_(t,e,n,r){switch(m_(e)){case 1:var s=OE;break;case 4:s=LE;break;default:s=gd}n=s.bind(null,e,n,t),s=void 0,!Qc||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(s=!0),r?s!==void 0?t.addEventListener(e,n,{capture:!0,passive:s}):t.addEventListener(e,n,!0):s!==void 0?t.addEventListener(e,n,{passive:s}):t.addEventListener(e,n,!1)}function hc(t,e,n,r,s){var i=r;if(!(e&1)&&!(e&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var l=r.stateNode.containerInfo;if(l===s||l.nodeType===8&&l.parentNode===s)break;if(o===4)for(o=r.return;o!==null;){var u=o.tag;if((u===3||u===4)&&(u=o.stateNode.containerInfo,u===s||u.nodeType===8&&u.parentNode===s))return;o=o.return}for(;l!==null;){if(o=Lr(l),o===null)return;if(u=o.tag,u===5||u===6){r=i=o;continue e}l=l.parentNode}}r=r.return}t_(function(){var h=i,p=dd(n),m=[];e:{var g=R_.get(t);if(g!==void 0){var A=_d,b=t;switch(t){case"keypress":if(Da(n)===0)break e;case"keydown":case"keyup":A=JE;break;case"focusin":b="focus",A=sc;break;case"focusout":b="blur",A=sc;break;case"beforeblur":case"afterblur":A=sc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":A=rm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":A=UE;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":A=tx;break;case k_:case A_:case C_:A=$E;break;case b_:A=rx;break;case"scroll":A=jE;break;case"wheel":A=ix;break;case"copy":case"cut":case"paste":A=qE;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":A=im}var R=(e&4)!==0,V=!R&&t==="scroll",I=R?g!==null?g+"Capture":null:g;R=[];for(var _=h,k;_!==null;){k=_;var D=k.stateNode;if(k.tag===5&&D!==null&&(k=D,I!==null&&(D=so(_,I),D!=null&&R.push(ho(_,D,k)))),V)break;_=_.return}0<R.length&&(g=new A(g,b,null,n,p),m.push({event:g,listeners:R}))}}if(!(e&7)){e:{if(g=t==="mouseover"||t==="pointerover",A=t==="mouseout"||t==="pointerout",g&&n!==Gc&&(b=n.relatedTarget||n.fromElement)&&(Lr(b)||b[In]))break e;if((A||g)&&(g=p.window===p?p:(g=p.ownerDocument)?g.defaultView||g.parentWindow:window,A?(b=n.relatedTarget||n.toElement,A=h,b=b?Lr(b):null,b!==null&&(V=ts(b),b!==V||b.tag!==5&&b.tag!==6)&&(b=null)):(A=null,b=h),A!==b)){if(R=rm,D="onMouseLeave",I="onMouseEnter",_="mouse",(t==="pointerout"||t==="pointerover")&&(R=im,D="onPointerLeave",I="onPointerEnter",_="pointer"),V=A==null?g:_s(A),k=b==null?g:_s(b),g=new R(D,_+"leave",A,n,p),g.target=V,g.relatedTarget=k,D=null,Lr(p)===h&&(R=new R(I,_+"enter",b,n,p),R.target=k,R.relatedTarget=V,D=R),V=D,A&&b)t:{for(R=A,I=b,_=0,k=R;k;k=as(k))_++;for(k=0,D=I;D;D=as(D))k++;for(;0<_-k;)R=as(R),_--;for(;0<k-_;)I=as(I),k--;for(;_--;){if(R===I||I!==null&&R===I.alternate)break t;R=as(R),I=as(I)}R=null}else R=null;A!==null&&gm(m,g,A,R,!1),b!==null&&V!==null&&gm(m,V,b,R,!0)}}e:{if(g=h?_s(h):window,A=g.nodeName&&g.nodeName.toLowerCase(),A==="select"||A==="input"&&g.type==="file")var j=dx;else if(lm(g))if(E_)j=gx;else{j=px;var U=fx}else(A=g.nodeName)&&A.toLowerCase()==="input"&&(g.type==="checkbox"||g.type==="radio")&&(j=mx);if(j&&(j=j(t,h))){w_(m,j,n,p);break e}U&&U(t,g,h),t==="focusout"&&(U=g._wrapperState)&&U.controlled&&g.type==="number"&&Bc(g,"number",g.value)}switch(U=h?_s(h):window,t){case"focusin":(lm(U)||U.contentEditable==="true")&&(gs=U,eh=h,qi=null);break;case"focusout":qi=eh=gs=null;break;case"mousedown":th=!0;break;case"contextmenu":case"mouseup":case"dragend":th=!1,fm(m,n,p);break;case"selectionchange":if(vx)break;case"keydown":case"keyup":fm(m,n,p)}var x;if(wd)e:{switch(t){case"compositionstart":var v="onCompositionStart";break e;case"compositionend":v="onCompositionEnd";break e;case"compositionupdate":v="onCompositionUpdate";break e}v=void 0}else ms?__(t,n)&&(v="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(v="onCompositionStart");v&&(y_&&n.locale!=="ko"&&(ms||v!=="onCompositionStart"?v==="onCompositionEnd"&&ms&&(x=g_()):(Jn=p,yd="value"in Jn?Jn.value:Jn.textContent,ms=!0)),U=al(h,v),0<U.length&&(v=new sm(v,t,null,n,p),m.push({event:v,listeners:U}),x?v.data=x:(x=v_(n),x!==null&&(v.data=x)))),(x=ax?lx(t,n):ux(t,n))&&(h=al(h,"onBeforeInput"),0<h.length&&(p=new sm("onBeforeInput","beforeinput",null,n,p),m.push({event:p,listeners:h}),p.data=x))}P_(m,e)})}function ho(t,e,n){return{instance:t,listener:e,currentTarget:n}}function al(t,e){for(var n=e+"Capture",r=[];t!==null;){var s=t,i=s.stateNode;s.tag===5&&i!==null&&(s=i,i=so(t,n),i!=null&&r.unshift(ho(t,i,s)),i=so(t,e),i!=null&&r.push(ho(t,i,s))),t=t.return}return r}function as(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function gm(t,e,n,r,s){for(var i=e._reactName,o=[];n!==null&&n!==r;){var l=n,u=l.alternate,h=l.stateNode;if(u!==null&&u===r)break;l.tag===5&&h!==null&&(l=h,s?(u=so(n,i),u!=null&&o.unshift(ho(n,u,l))):s||(u=so(n,i),u!=null&&o.push(ho(n,u,l)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var Tx=/\r\n?/g,Ix=/\u0000|\uFFFD/g;function ym(t){return(typeof t=="string"?t:""+t).replace(Tx,`
`).replace(Ix,"")}function ma(t,e,n){if(e=ym(e),ym(t)!==e&&n)throw Error(F(425))}function ll(){}var nh=null,rh=null;function sh(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var ih=typeof setTimeout=="function"?setTimeout:void 0,Sx=typeof clearTimeout=="function"?clearTimeout:void 0,_m=typeof Promise=="function"?Promise:void 0,kx=typeof queueMicrotask=="function"?queueMicrotask:typeof _m<"u"?function(t){return _m.resolve(null).then(t).catch(Ax)}:ih;function Ax(t){setTimeout(function(){throw t})}function dc(t,e){var n=e,r=0;do{var s=n.nextSibling;if(t.removeChild(n),s&&s.nodeType===8)if(n=s.data,n==="/$"){if(r===0){t.removeChild(s),ao(e);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=s}while(n);ao(e)}function sr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function vm(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var ei=Math.random().toString(36).slice(2),Jt="__reactFiber$"+ei,fo="__reactProps$"+ei,In="__reactContainer$"+ei,oh="__reactEvents$"+ei,Cx="__reactListeners$"+ei,bx="__reactHandles$"+ei;function Lr(t){var e=t[Jt];if(e)return e;for(var n=t.parentNode;n;){if(e=n[In]||n[Jt]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=vm(t);t!==null;){if(n=t[Jt])return n;t=vm(t)}return e}t=n,n=t.parentNode}return null}function No(t){return t=t[Jt]||t[In],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function _s(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(F(33))}function Xl(t){return t[fo]||null}var ah=[],vs=-1;function Sr(t){return{current:t}}function Ee(t){0>vs||(t.current=ah[vs],ah[vs]=null,vs--)}function ge(t,e){vs++,ah[vs]=t.current,t.current=e}var gr={},it=Sr(gr),vt=Sr(!1),qr=gr;function js(t,e){var n=t.type.contextTypes;if(!n)return gr;var r=t.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===e)return r.__reactInternalMemoizedMaskedChildContext;var s={},i;for(i in n)s[i]=e[i];return r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=s),s}function wt(t){return t=t.childContextTypes,t!=null}function ul(){Ee(vt),Ee(it)}function wm(t,e,n){if(it.current!==gr)throw Error(F(168));ge(it,e),ge(vt,n)}function D_(t,e,n){var r=t.stateNode;if(e=e.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var s in r)if(!(s in e))throw Error(F(108,fE(t)||"Unknown",s));return Se({},n,r)}function cl(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||gr,qr=it.current,ge(it,t),ge(vt,vt.current),!0}function Em(t,e,n){var r=t.stateNode;if(!r)throw Error(F(169));n?(t=D_(t,e,qr),r.__reactInternalMemoizedMergedChildContext=t,Ee(vt),Ee(it),ge(it,t)):Ee(vt),ge(vt,n)}var fn=null,Yl=!1,fc=!1;function V_(t){fn===null?fn=[t]:fn.push(t)}function Rx(t){Yl=!0,V_(t)}function kr(){if(!fc&&fn!==null){fc=!0;var t=0,e=fe;try{var n=fn;for(fe=1;t<n.length;t++){var r=n[t];do r=r(!0);while(r!==null)}fn=null,Yl=!1}catch(s){throw fn!==null&&(fn=fn.slice(t+1)),i_(fd,kr),s}finally{fe=e,fc=!1}}return null}var ws=[],Es=0,hl=null,dl=0,Rt=[],Pt=0,Wr=null,pn=1,mn="";function Vr(t,e){ws[Es++]=dl,ws[Es++]=hl,hl=t,dl=e}function M_(t,e,n){Rt[Pt++]=pn,Rt[Pt++]=mn,Rt[Pt++]=Wr,Wr=t;var r=pn;t=mn;var s=32-Ht(r)-1;r&=~(1<<s),n+=1;var i=32-Ht(e)+s;if(30<i){var o=s-s%5;i=(r&(1<<o)-1).toString(32),r>>=o,s-=o,pn=1<<32-Ht(e)+s|n<<s|r,mn=i+t}else pn=1<<i|n<<s|r,mn=t}function xd(t){t.return!==null&&(Vr(t,1),M_(t,1,0))}function Td(t){for(;t===hl;)hl=ws[--Es],ws[Es]=null,dl=ws[--Es],ws[Es]=null;for(;t===Wr;)Wr=Rt[--Pt],Rt[Pt]=null,mn=Rt[--Pt],Rt[Pt]=null,pn=Rt[--Pt],Rt[Pt]=null}var kt=null,It=null,xe=!1,Bt=null;function O_(t,e){var n=Vt(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function xm(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,kt=t,It=sr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,kt=t,It=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Wr!==null?{id:pn,overflow:mn}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Vt(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,kt=t,It=null,!0):!1;default:return!1}}function lh(t){return(t.mode&1)!==0&&(t.flags&128)===0}function uh(t){if(xe){var e=It;if(e){var n=e;if(!xm(t,e)){if(lh(t))throw Error(F(418));e=sr(n.nextSibling);var r=kt;e&&xm(t,e)?O_(r,n):(t.flags=t.flags&-4097|2,xe=!1,kt=t)}}else{if(lh(t))throw Error(F(418));t.flags=t.flags&-4097|2,xe=!1,kt=t}}}function Tm(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;kt=t}function ga(t){if(t!==kt)return!1;if(!xe)return Tm(t),xe=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!sh(t.type,t.memoizedProps)),e&&(e=It)){if(lh(t))throw L_(),Error(F(418));for(;e;)O_(t,e),e=sr(e.nextSibling)}if(Tm(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(F(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){It=sr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}It=null}}else It=kt?sr(t.stateNode.nextSibling):null;return!0}function L_(){for(var t=It;t;)t=sr(t.nextSibling)}function Fs(){It=kt=null,xe=!1}function Id(t){Bt===null?Bt=[t]:Bt.push(t)}var Px=Dn.ReactCurrentBatchConfig;function Ri(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(F(309));var r=n.stateNode}if(!r)throw Error(F(147,t));var s=r,i=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===i?e.ref:(e=function(o){var l=s.refs;o===null?delete l[i]:l[i]=o},e._stringRef=i,e)}if(typeof t!="string")throw Error(F(284));if(!n._owner)throw Error(F(290,t))}return t}function ya(t,e){throw t=Object.prototype.toString.call(e),Error(F(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Im(t){var e=t._init;return e(t._payload)}function j_(t){function e(I,_){if(t){var k=I.deletions;k===null?(I.deletions=[_],I.flags|=16):k.push(_)}}function n(I,_){if(!t)return null;for(;_!==null;)e(I,_),_=_.sibling;return null}function r(I,_){for(I=new Map;_!==null;)_.key!==null?I.set(_.key,_):I.set(_.index,_),_=_.sibling;return I}function s(I,_){return I=lr(I,_),I.index=0,I.sibling=null,I}function i(I,_,k){return I.index=k,t?(k=I.alternate,k!==null?(k=k.index,k<_?(I.flags|=2,_):k):(I.flags|=2,_)):(I.flags|=1048576,_)}function o(I){return t&&I.alternate===null&&(I.flags|=2),I}function l(I,_,k,D){return _===null||_.tag!==6?(_=wc(k,I.mode,D),_.return=I,_):(_=s(_,k),_.return=I,_)}function u(I,_,k,D){var j=k.type;return j===ps?p(I,_,k.props.children,D,k.key):_!==null&&(_.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===Hn&&Im(j)===_.type)?(D=s(_,k.props),D.ref=Ri(I,_,k),D.return=I,D):(D=Ua(k.type,k.key,k.props,null,I.mode,D),D.ref=Ri(I,_,k),D.return=I,D)}function h(I,_,k,D){return _===null||_.tag!==4||_.stateNode.containerInfo!==k.containerInfo||_.stateNode.implementation!==k.implementation?(_=Ec(k,I.mode,D),_.return=I,_):(_=s(_,k.children||[]),_.return=I,_)}function p(I,_,k,D,j){return _===null||_.tag!==7?(_=Br(k,I.mode,D,j),_.return=I,_):(_=s(_,k),_.return=I,_)}function m(I,_,k){if(typeof _=="string"&&_!==""||typeof _=="number")return _=wc(""+_,I.mode,k),_.return=I,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case oa:return k=Ua(_.type,_.key,_.props,null,I.mode,k),k.ref=Ri(I,null,_),k.return=I,k;case fs:return _=Ec(_,I.mode,k),_.return=I,_;case Hn:var D=_._init;return m(I,D(_._payload),k)}if(Vi(_)||Si(_))return _=Br(_,I.mode,k,null),_.return=I,_;ya(I,_)}return null}function g(I,_,k,D){var j=_!==null?_.key:null;if(typeof k=="string"&&k!==""||typeof k=="number")return j!==null?null:l(I,_,""+k,D);if(typeof k=="object"&&k!==null){switch(k.$$typeof){case oa:return k.key===j?u(I,_,k,D):null;case fs:return k.key===j?h(I,_,k,D):null;case Hn:return j=k._init,g(I,_,j(k._payload),D)}if(Vi(k)||Si(k))return j!==null?null:p(I,_,k,D,null);ya(I,k)}return null}function A(I,_,k,D,j){if(typeof D=="string"&&D!==""||typeof D=="number")return I=I.get(k)||null,l(_,I,""+D,j);if(typeof D=="object"&&D!==null){switch(D.$$typeof){case oa:return I=I.get(D.key===null?k:D.key)||null,u(_,I,D,j);case fs:return I=I.get(D.key===null?k:D.key)||null,h(_,I,D,j);case Hn:var U=D._init;return A(I,_,k,U(D._payload),j)}if(Vi(D)||Si(D))return I=I.get(k)||null,p(_,I,D,j,null);ya(_,D)}return null}function b(I,_,k,D){for(var j=null,U=null,x=_,v=_=0,E=null;x!==null&&v<k.length;v++){x.index>v?(E=x,x=null):E=x.sibling;var T=g(I,x,k[v],D);if(T===null){x===null&&(x=E);break}t&&x&&T.alternate===null&&e(I,x),_=i(T,_,v),U===null?j=T:U.sibling=T,U=T,x=E}if(v===k.length)return n(I,x),xe&&Vr(I,v),j;if(x===null){for(;v<k.length;v++)x=m(I,k[v],D),x!==null&&(_=i(x,_,v),U===null?j=x:U.sibling=x,U=x);return xe&&Vr(I,v),j}for(x=r(I,x);v<k.length;v++)E=A(x,I,v,k[v],D),E!==null&&(t&&E.alternate!==null&&x.delete(E.key===null?v:E.key),_=i(E,_,v),U===null?j=E:U.sibling=E,U=E);return t&&x.forEach(function(S){return e(I,S)}),xe&&Vr(I,v),j}function R(I,_,k,D){var j=Si(k);if(typeof j!="function")throw Error(F(150));if(k=j.call(k),k==null)throw Error(F(151));for(var U=j=null,x=_,v=_=0,E=null,T=k.next();x!==null&&!T.done;v++,T=k.next()){x.index>v?(E=x,x=null):E=x.sibling;var S=g(I,x,T.value,D);if(S===null){x===null&&(x=E);break}t&&x&&S.alternate===null&&e(I,x),_=i(S,_,v),U===null?j=S:U.sibling=S,U=S,x=E}if(T.done)return n(I,x),xe&&Vr(I,v),j;if(x===null){for(;!T.done;v++,T=k.next())T=m(I,T.value,D),T!==null&&(_=i(T,_,v),U===null?j=T:U.sibling=T,U=T);return xe&&Vr(I,v),j}for(x=r(I,x);!T.done;v++,T=k.next())T=A(x,I,v,T.value,D),T!==null&&(t&&T.alternate!==null&&x.delete(T.key===null?v:T.key),_=i(T,_,v),U===null?j=T:U.sibling=T,U=T);return t&&x.forEach(function(C){return e(I,C)}),xe&&Vr(I,v),j}function V(I,_,k,D){if(typeof k=="object"&&k!==null&&k.type===ps&&k.key===null&&(k=k.props.children),typeof k=="object"&&k!==null){switch(k.$$typeof){case oa:e:{for(var j=k.key,U=_;U!==null;){if(U.key===j){if(j=k.type,j===ps){if(U.tag===7){n(I,U.sibling),_=s(U,k.props.children),_.return=I,I=_;break e}}else if(U.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===Hn&&Im(j)===U.type){n(I,U.sibling),_=s(U,k.props),_.ref=Ri(I,U,k),_.return=I,I=_;break e}n(I,U);break}else e(I,U);U=U.sibling}k.type===ps?(_=Br(k.props.children,I.mode,D,k.key),_.return=I,I=_):(D=Ua(k.type,k.key,k.props,null,I.mode,D),D.ref=Ri(I,_,k),D.return=I,I=D)}return o(I);case fs:e:{for(U=k.key;_!==null;){if(_.key===U)if(_.tag===4&&_.stateNode.containerInfo===k.containerInfo&&_.stateNode.implementation===k.implementation){n(I,_.sibling),_=s(_,k.children||[]),_.return=I,I=_;break e}else{n(I,_);break}else e(I,_);_=_.sibling}_=Ec(k,I.mode,D),_.return=I,I=_}return o(I);case Hn:return U=k._init,V(I,_,U(k._payload),D)}if(Vi(k))return b(I,_,k,D);if(Si(k))return R(I,_,k,D);ya(I,k)}return typeof k=="string"&&k!==""||typeof k=="number"?(k=""+k,_!==null&&_.tag===6?(n(I,_.sibling),_=s(_,k),_.return=I,I=_):(n(I,_),_=wc(k,I.mode,D),_.return=I,I=_),o(I)):n(I,_)}return V}var Us=j_(!0),F_=j_(!1),fl=Sr(null),pl=null,xs=null,Sd=null;function kd(){Sd=xs=pl=null}function Ad(t){var e=fl.current;Ee(fl),t._currentValue=e}function ch(t,e,n){for(;t!==null;){var r=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,r!==null&&(r.childLanes|=e)):r!==null&&(r.childLanes&e)!==e&&(r.childLanes|=e),t===n)break;t=t.return}}function Rs(t,e){pl=t,Sd=xs=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(_t=!0),t.firstContext=null)}function Ot(t){var e=t._currentValue;if(Sd!==t)if(t={context:t,memoizedValue:e,next:null},xs===null){if(pl===null)throw Error(F(308));xs=t,pl.dependencies={lanes:0,firstContext:t}}else xs=xs.next=t;return e}var jr=null;function Cd(t){jr===null?jr=[t]:jr.push(t)}function U_(t,e,n,r){var s=e.interleaved;return s===null?(n.next=n,Cd(e)):(n.next=s.next,s.next=n),e.interleaved=n,Sn(t,r)}function Sn(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var qn=!1;function bd(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function z_(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function _n(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function ir(t,e,n){var r=t.updateQueue;if(r===null)return null;if(r=r.shared,ce&2){var s=r.pending;return s===null?e.next=e:(e.next=s.next,s.next=e),r.pending=e,Sn(t,n)}return s=r.interleaved,s===null?(e.next=e,Cd(r)):(e.next=s.next,s.next=e),r.interleaved=e,Sn(t,n)}function Va(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,pd(t,n)}}function Sm(t,e){var n=t.updateQueue,r=t.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var s=null,i=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};i===null?s=i=o:i=i.next=o,n=n.next}while(n!==null);i===null?s=i=e:i=i.next=e}else s=i=e;n={baseState:r.baseState,firstBaseUpdate:s,lastBaseUpdate:i,shared:r.shared,effects:r.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function ml(t,e,n,r){var s=t.updateQueue;qn=!1;var i=s.firstBaseUpdate,o=s.lastBaseUpdate,l=s.shared.pending;if(l!==null){s.shared.pending=null;var u=l,h=u.next;u.next=null,o===null?i=h:o.next=h,o=u;var p=t.alternate;p!==null&&(p=p.updateQueue,l=p.lastBaseUpdate,l!==o&&(l===null?p.firstBaseUpdate=h:l.next=h,p.lastBaseUpdate=u))}if(i!==null){var m=s.baseState;o=0,p=h=u=null,l=i;do{var g=l.lane,A=l.eventTime;if((r&g)===g){p!==null&&(p=p.next={eventTime:A,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var b=t,R=l;switch(g=e,A=n,R.tag){case 1:if(b=R.payload,typeof b=="function"){m=b.call(A,m,g);break e}m=b;break e;case 3:b.flags=b.flags&-65537|128;case 0:if(b=R.payload,g=typeof b=="function"?b.call(A,m,g):b,g==null)break e;m=Se({},m,g);break e;case 2:qn=!0}}l.callback!==null&&l.lane!==0&&(t.flags|=64,g=s.effects,g===null?s.effects=[l]:g.push(l))}else A={eventTime:A,lane:g,tag:l.tag,payload:l.payload,callback:l.callback,next:null},p===null?(h=p=A,u=m):p=p.next=A,o|=g;if(l=l.next,l===null){if(l=s.shared.pending,l===null)break;g=l,l=g.next,g.next=null,s.lastBaseUpdate=g,s.shared.pending=null}}while(!0);if(p===null&&(u=m),s.baseState=u,s.firstBaseUpdate=h,s.lastBaseUpdate=p,e=s.shared.interleaved,e!==null){s=e;do o|=s.lane,s=s.next;while(s!==e)}else i===null&&(s.shared.lanes=0);Kr|=o,t.lanes=o,t.memoizedState=m}}function km(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var r=t[e],s=r.callback;if(s!==null){if(r.callback=null,r=n,typeof s!="function")throw Error(F(191,s));s.call(r)}}}var Do={},en=Sr(Do),po=Sr(Do),mo=Sr(Do);function Fr(t){if(t===Do)throw Error(F(174));return t}function Rd(t,e){switch(ge(mo,e),ge(po,t),ge(en,Do),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Hc(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Hc(e,t)}Ee(en),ge(en,e)}function zs(){Ee(en),Ee(po),Ee(mo)}function B_(t){Fr(mo.current);var e=Fr(en.current),n=Hc(e,t.type);e!==n&&(ge(po,t),ge(en,n))}function Pd(t){po.current===t&&(Ee(en),Ee(po))}var Te=Sr(0);function gl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var pc=[];function Nd(){for(var t=0;t<pc.length;t++)pc[t]._workInProgressVersionPrimary=null;pc.length=0}var Ma=Dn.ReactCurrentDispatcher,mc=Dn.ReactCurrentBatchConfig,Gr=0,Ie=null,je=null,He=null,yl=!1,Wi=!1,go=0,Nx=0;function Ze(){throw Error(F(321))}function Dd(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Wt(t[n],e[n]))return!1;return!0}function Vd(t,e,n,r,s,i){if(Gr=i,Ie=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Ma.current=t===null||t.memoizedState===null?Ox:Lx,t=n(r,s),Wi){i=0;do{if(Wi=!1,go=0,25<=i)throw Error(F(301));i+=1,He=je=null,e.updateQueue=null,Ma.current=jx,t=n(r,s)}while(Wi)}if(Ma.current=_l,e=je!==null&&je.next!==null,Gr=0,He=je=Ie=null,yl=!1,e)throw Error(F(300));return t}function Md(){var t=go!==0;return go=0,t}function Xt(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return He===null?Ie.memoizedState=He=t:He=He.next=t,He}function Lt(){if(je===null){var t=Ie.alternate;t=t!==null?t.memoizedState:null}else t=je.next;var e=He===null?Ie.memoizedState:He.next;if(e!==null)He=e,je=t;else{if(t===null)throw Error(F(310));je=t,t={memoizedState:je.memoizedState,baseState:je.baseState,baseQueue:je.baseQueue,queue:je.queue,next:null},He===null?Ie.memoizedState=He=t:He=He.next=t}return He}function yo(t,e){return typeof e=="function"?e(t):e}function gc(t){var e=Lt(),n=e.queue;if(n===null)throw Error(F(311));n.lastRenderedReducer=t;var r=je,s=r.baseQueue,i=n.pending;if(i!==null){if(s!==null){var o=s.next;s.next=i.next,i.next=o}r.baseQueue=s=i,n.pending=null}if(s!==null){i=s.next,r=r.baseState;var l=o=null,u=null,h=i;do{var p=h.lane;if((Gr&p)===p)u!==null&&(u=u.next={lane:0,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null}),r=h.hasEagerState?h.eagerState:t(r,h.action);else{var m={lane:p,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null};u===null?(l=u=m,o=r):u=u.next=m,Ie.lanes|=p,Kr|=p}h=h.next}while(h!==null&&h!==i);u===null?o=r:u.next=l,Wt(r,e.memoizedState)||(_t=!0),e.memoizedState=r,e.baseState=o,e.baseQueue=u,n.lastRenderedState=r}if(t=n.interleaved,t!==null){s=t;do i=s.lane,Ie.lanes|=i,Kr|=i,s=s.next;while(s!==t)}else s===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function yc(t){var e=Lt(),n=e.queue;if(n===null)throw Error(F(311));n.lastRenderedReducer=t;var r=n.dispatch,s=n.pending,i=e.memoizedState;if(s!==null){n.pending=null;var o=s=s.next;do i=t(i,o.action),o=o.next;while(o!==s);Wt(i,e.memoizedState)||(_t=!0),e.memoizedState=i,e.baseQueue===null&&(e.baseState=i),n.lastRenderedState=i}return[i,r]}function $_(){}function H_(t,e){var n=Ie,r=Lt(),s=e(),i=!Wt(r.memoizedState,s);if(i&&(r.memoizedState=s,_t=!0),r=r.queue,Od(G_.bind(null,n,r,t),[t]),r.getSnapshot!==e||i||He!==null&&He.memoizedState.tag&1){if(n.flags|=2048,_o(9,W_.bind(null,n,r,s,e),void 0,null),qe===null)throw Error(F(349));Gr&30||q_(n,e,s)}return s}function q_(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=Ie.updateQueue,e===null?(e={lastEffect:null,stores:null},Ie.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function W_(t,e,n,r){e.value=n,e.getSnapshot=r,K_(e)&&Q_(t)}function G_(t,e,n){return n(function(){K_(e)&&Q_(t)})}function K_(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Wt(t,n)}catch{return!0}}function Q_(t){var e=Sn(t,1);e!==null&&qt(e,t,1,-1)}function Am(t){var e=Xt();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:yo,lastRenderedState:t},e.queue=t,t=t.dispatch=Mx.bind(null,Ie,t),[e.memoizedState,t]}function _o(t,e,n,r){return t={tag:t,create:e,destroy:n,deps:r,next:null},e=Ie.updateQueue,e===null?(e={lastEffect:null,stores:null},Ie.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(r=n.next,n.next=t,t.next=r,e.lastEffect=t)),t}function X_(){return Lt().memoizedState}function Oa(t,e,n,r){var s=Xt();Ie.flags|=t,s.memoizedState=_o(1|e,n,void 0,r===void 0?null:r)}function Jl(t,e,n,r){var s=Lt();r=r===void 0?null:r;var i=void 0;if(je!==null){var o=je.memoizedState;if(i=o.destroy,r!==null&&Dd(r,o.deps)){s.memoizedState=_o(e,n,i,r);return}}Ie.flags|=t,s.memoizedState=_o(1|e,n,i,r)}function Cm(t,e){return Oa(8390656,8,t,e)}function Od(t,e){return Jl(2048,8,t,e)}function Y_(t,e){return Jl(4,2,t,e)}function J_(t,e){return Jl(4,4,t,e)}function Z_(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function e0(t,e,n){return n=n!=null?n.concat([t]):null,Jl(4,4,Z_.bind(null,e,t),n)}function Ld(){}function t0(t,e){var n=Lt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Dd(e,r[1])?r[0]:(n.memoizedState=[t,e],t)}function n0(t,e){var n=Lt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Dd(e,r[1])?r[0]:(t=t(),n.memoizedState=[t,e],t)}function r0(t,e,n){return Gr&21?(Wt(n,e)||(n=l_(),Ie.lanes|=n,Kr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,_t=!0),t.memoizedState=n)}function Dx(t,e){var n=fe;fe=n!==0&&4>n?n:4,t(!0);var r=mc.transition;mc.transition={};try{t(!1),e()}finally{fe=n,mc.transition=r}}function s0(){return Lt().memoizedState}function Vx(t,e,n){var r=ar(t);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},i0(t))o0(e,n);else if(n=U_(t,e,n,r),n!==null){var s=ht();qt(n,t,r,s),a0(n,e,r)}}function Mx(t,e,n){var r=ar(t),s={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(i0(t))o0(e,s);else{var i=t.alternate;if(t.lanes===0&&(i===null||i.lanes===0)&&(i=e.lastRenderedReducer,i!==null))try{var o=e.lastRenderedState,l=i(o,n);if(s.hasEagerState=!0,s.eagerState=l,Wt(l,o)){var u=e.interleaved;u===null?(s.next=s,Cd(e)):(s.next=u.next,u.next=s),e.interleaved=s;return}}catch{}finally{}n=U_(t,e,s,r),n!==null&&(s=ht(),qt(n,t,r,s),a0(n,e,r))}}function i0(t){var e=t.alternate;return t===Ie||e!==null&&e===Ie}function o0(t,e){Wi=yl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function a0(t,e,n){if(n&4194240){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,pd(t,n)}}var _l={readContext:Ot,useCallback:Ze,useContext:Ze,useEffect:Ze,useImperativeHandle:Ze,useInsertionEffect:Ze,useLayoutEffect:Ze,useMemo:Ze,useReducer:Ze,useRef:Ze,useState:Ze,useDebugValue:Ze,useDeferredValue:Ze,useTransition:Ze,useMutableSource:Ze,useSyncExternalStore:Ze,useId:Ze,unstable_isNewReconciler:!1},Ox={readContext:Ot,useCallback:function(t,e){return Xt().memoizedState=[t,e===void 0?null:e],t},useContext:Ot,useEffect:Cm,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,Oa(4194308,4,Z_.bind(null,e,t),n)},useLayoutEffect:function(t,e){return Oa(4194308,4,t,e)},useInsertionEffect:function(t,e){return Oa(4,2,t,e)},useMemo:function(t,e){var n=Xt();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var r=Xt();return e=n!==void 0?n(e):e,r.memoizedState=r.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},r.queue=t,t=t.dispatch=Vx.bind(null,Ie,t),[r.memoizedState,t]},useRef:function(t){var e=Xt();return t={current:t},e.memoizedState=t},useState:Am,useDebugValue:Ld,useDeferredValue:function(t){return Xt().memoizedState=t},useTransition:function(){var t=Am(!1),e=t[0];return t=Dx.bind(null,t[1]),Xt().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var r=Ie,s=Xt();if(xe){if(n===void 0)throw Error(F(407));n=n()}else{if(n=e(),qe===null)throw Error(F(349));Gr&30||q_(r,e,n)}s.memoizedState=n;var i={value:n,getSnapshot:e};return s.queue=i,Cm(G_.bind(null,r,i,t),[t]),r.flags|=2048,_o(9,W_.bind(null,r,i,n,e),void 0,null),n},useId:function(){var t=Xt(),e=qe.identifierPrefix;if(xe){var n=mn,r=pn;n=(r&~(1<<32-Ht(r)-1)).toString(32)+n,e=":"+e+"R"+n,n=go++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=Nx++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},Lx={readContext:Ot,useCallback:t0,useContext:Ot,useEffect:Od,useImperativeHandle:e0,useInsertionEffect:Y_,useLayoutEffect:J_,useMemo:n0,useReducer:gc,useRef:X_,useState:function(){return gc(yo)},useDebugValue:Ld,useDeferredValue:function(t){var e=Lt();return r0(e,je.memoizedState,t)},useTransition:function(){var t=gc(yo)[0],e=Lt().memoizedState;return[t,e]},useMutableSource:$_,useSyncExternalStore:H_,useId:s0,unstable_isNewReconciler:!1},jx={readContext:Ot,useCallback:t0,useContext:Ot,useEffect:Od,useImperativeHandle:e0,useInsertionEffect:Y_,useLayoutEffect:J_,useMemo:n0,useReducer:yc,useRef:X_,useState:function(){return yc(yo)},useDebugValue:Ld,useDeferredValue:function(t){var e=Lt();return je===null?e.memoizedState=t:r0(e,je.memoizedState,t)},useTransition:function(){var t=yc(yo)[0],e=Lt().memoizedState;return[t,e]},useMutableSource:$_,useSyncExternalStore:H_,useId:s0,unstable_isNewReconciler:!1};function Ut(t,e){if(t&&t.defaultProps){e=Se({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function hh(t,e,n,r){e=t.memoizedState,n=n(r,e),n=n==null?e:Se({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Zl={isMounted:function(t){return(t=t._reactInternals)?ts(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var r=ht(),s=ar(t),i=_n(r,s);i.payload=e,n!=null&&(i.callback=n),e=ir(t,i,s),e!==null&&(qt(e,t,s,r),Va(e,t,s))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var r=ht(),s=ar(t),i=_n(r,s);i.tag=1,i.payload=e,n!=null&&(i.callback=n),e=ir(t,i,s),e!==null&&(qt(e,t,s,r),Va(e,t,s))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=ht(),r=ar(t),s=_n(n,r);s.tag=2,e!=null&&(s.callback=e),e=ir(t,s,r),e!==null&&(qt(e,t,r,n),Va(e,t,r))}};function bm(t,e,n,r,s,i,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(r,i,o):e.prototype&&e.prototype.isPureReactComponent?!uo(n,r)||!uo(s,i):!0}function l0(t,e,n){var r=!1,s=gr,i=e.contextType;return typeof i=="object"&&i!==null?i=Ot(i):(s=wt(e)?qr:it.current,r=e.contextTypes,i=(r=r!=null)?js(t,s):gr),e=new e(n,i),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Zl,t.stateNode=e,e._reactInternals=t,r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=s,t.__reactInternalMemoizedMaskedChildContext=i),e}function Rm(t,e,n,r){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,r),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,r),e.state!==t&&Zl.enqueueReplaceState(e,e.state,null)}function dh(t,e,n,r){var s=t.stateNode;s.props=n,s.state=t.memoizedState,s.refs={},bd(t);var i=e.contextType;typeof i=="object"&&i!==null?s.context=Ot(i):(i=wt(e)?qr:it.current,s.context=js(t,i)),s.state=t.memoizedState,i=e.getDerivedStateFromProps,typeof i=="function"&&(hh(t,e,i,n),s.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(e=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),e!==s.state&&Zl.enqueueReplaceState(s,s.state,null),ml(t,n,s,r),s.state=t.memoizedState),typeof s.componentDidMount=="function"&&(t.flags|=4194308)}function Bs(t,e){try{var n="",r=e;do n+=dE(r),r=r.return;while(r);var s=n}catch(i){s=`
Error generating stack: `+i.message+`
`+i.stack}return{value:t,source:e,stack:s,digest:null}}function _c(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function fh(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var Fx=typeof WeakMap=="function"?WeakMap:Map;function u0(t,e,n){n=_n(-1,n),n.tag=3,n.payload={element:null};var r=e.value;return n.callback=function(){wl||(wl=!0,Th=r),fh(t,e)},n}function c0(t,e,n){n=_n(-1,n),n.tag=3;var r=t.type.getDerivedStateFromError;if(typeof r=="function"){var s=e.value;n.payload=function(){return r(s)},n.callback=function(){fh(t,e)}}var i=t.stateNode;return i!==null&&typeof i.componentDidCatch=="function"&&(n.callback=function(){fh(t,e),typeof r!="function"&&(or===null?or=new Set([this]):or.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function Pm(t,e,n){var r=t.pingCache;if(r===null){r=t.pingCache=new Fx;var s=new Set;r.set(e,s)}else s=r.get(e),s===void 0&&(s=new Set,r.set(e,s));s.has(n)||(s.add(n),t=Zx.bind(null,t,e,n),e.then(t,t))}function Nm(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Dm(t,e,n,r,s){return t.mode&1?(t.flags|=65536,t.lanes=s,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=_n(-1,1),e.tag=2,ir(n,e,1))),n.lanes|=1),t)}var Ux=Dn.ReactCurrentOwner,_t=!1;function ct(t,e,n,r){e.child=t===null?F_(e,null,n,r):Us(e,t.child,n,r)}function Vm(t,e,n,r,s){n=n.render;var i=e.ref;return Rs(e,s),r=Vd(t,e,n,r,i,s),n=Md(),t!==null&&!_t?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~s,kn(t,e,s)):(xe&&n&&xd(e),e.flags|=1,ct(t,e,r,s),e.child)}function Mm(t,e,n,r,s){if(t===null){var i=n.type;return typeof i=="function"&&!qd(i)&&i.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=i,h0(t,e,i,r,s)):(t=Ua(n.type,null,r,e,e.mode,s),t.ref=e.ref,t.return=e,e.child=t)}if(i=t.child,!(t.lanes&s)){var o=i.memoizedProps;if(n=n.compare,n=n!==null?n:uo,n(o,r)&&t.ref===e.ref)return kn(t,e,s)}return e.flags|=1,t=lr(i,r),t.ref=e.ref,t.return=e,e.child=t}function h0(t,e,n,r,s){if(t!==null){var i=t.memoizedProps;if(uo(i,r)&&t.ref===e.ref)if(_t=!1,e.pendingProps=r=i,(t.lanes&s)!==0)t.flags&131072&&(_t=!0);else return e.lanes=t.lanes,kn(t,e,s)}return ph(t,e,n,r,s)}function d0(t,e,n){var r=e.pendingProps,s=r.children,i=t!==null?t.memoizedState:null;if(r.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ge(Is,Tt),Tt|=n;else{if(!(n&1073741824))return t=i!==null?i.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,ge(Is,Tt),Tt|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=i!==null?i.baseLanes:n,ge(Is,Tt),Tt|=r}else i!==null?(r=i.baseLanes|n,e.memoizedState=null):r=n,ge(Is,Tt),Tt|=r;return ct(t,e,s,n),e.child}function f0(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function ph(t,e,n,r,s){var i=wt(n)?qr:it.current;return i=js(e,i),Rs(e,s),n=Vd(t,e,n,r,i,s),r=Md(),t!==null&&!_t?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~s,kn(t,e,s)):(xe&&r&&xd(e),e.flags|=1,ct(t,e,n,s),e.child)}function Om(t,e,n,r,s){if(wt(n)){var i=!0;cl(e)}else i=!1;if(Rs(e,s),e.stateNode===null)La(t,e),l0(e,n,r),dh(e,n,r,s),r=!0;else if(t===null){var o=e.stateNode,l=e.memoizedProps;o.props=l;var u=o.context,h=n.contextType;typeof h=="object"&&h!==null?h=Ot(h):(h=wt(n)?qr:it.current,h=js(e,h));var p=n.getDerivedStateFromProps,m=typeof p=="function"||typeof o.getSnapshotBeforeUpdate=="function";m||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==r||u!==h)&&Rm(e,o,r,h),qn=!1;var g=e.memoizedState;o.state=g,ml(e,r,o,s),u=e.memoizedState,l!==r||g!==u||vt.current||qn?(typeof p=="function"&&(hh(e,n,p,r),u=e.memoizedState),(l=qn||bm(e,n,l,r,g,u,h))?(m||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=r,e.memoizedState=u),o.props=r,o.state=u,o.context=h,r=l):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),r=!1)}else{o=e.stateNode,z_(t,e),l=e.memoizedProps,h=e.type===e.elementType?l:Ut(e.type,l),o.props=h,m=e.pendingProps,g=o.context,u=n.contextType,typeof u=="object"&&u!==null?u=Ot(u):(u=wt(n)?qr:it.current,u=js(e,u));var A=n.getDerivedStateFromProps;(p=typeof A=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==m||g!==u)&&Rm(e,o,r,u),qn=!1,g=e.memoizedState,o.state=g,ml(e,r,o,s);var b=e.memoizedState;l!==m||g!==b||vt.current||qn?(typeof A=="function"&&(hh(e,n,A,r),b=e.memoizedState),(h=qn||bm(e,n,h,r,g,b,u)||!1)?(p||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,b,u),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,b,u)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=1024),e.memoizedProps=r,e.memoizedState=b),o.props=r,o.state=b,o.context=u,r=h):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=1024),r=!1)}return mh(t,e,n,r,i,s)}function mh(t,e,n,r,s,i){f0(t,e);var o=(e.flags&128)!==0;if(!r&&!o)return s&&Em(e,n,!1),kn(t,e,i);r=e.stateNode,Ux.current=e;var l=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return e.flags|=1,t!==null&&o?(e.child=Us(e,t.child,null,i),e.child=Us(e,null,l,i)):ct(t,e,l,i),e.memoizedState=r.state,s&&Em(e,n,!0),e.child}function p0(t){var e=t.stateNode;e.pendingContext?wm(t,e.pendingContext,e.pendingContext!==e.context):e.context&&wm(t,e.context,!1),Rd(t,e.containerInfo)}function Lm(t,e,n,r,s){return Fs(),Id(s),e.flags|=256,ct(t,e,n,r),e.child}var gh={dehydrated:null,treeContext:null,retryLane:0};function yh(t){return{baseLanes:t,cachePool:null,transitions:null}}function m0(t,e,n){var r=e.pendingProps,s=Te.current,i=!1,o=(e.flags&128)!==0,l;if((l=o)||(l=t!==null&&t.memoizedState===null?!1:(s&2)!==0),l?(i=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(s|=1),ge(Te,s&1),t===null)return uh(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=r.children,t=r.fallback,i?(r=e.mode,i=e.child,o={mode:"hidden",children:o},!(r&1)&&i!==null?(i.childLanes=0,i.pendingProps=o):i=nu(o,r,0,null),t=Br(t,r,n,null),i.return=e,t.return=e,i.sibling=t,e.child=i,e.child.memoizedState=yh(n),e.memoizedState=gh,t):jd(e,o));if(s=t.memoizedState,s!==null&&(l=s.dehydrated,l!==null))return zx(t,e,o,r,l,s,n);if(i){i=r.fallback,o=e.mode,s=t.child,l=s.sibling;var u={mode:"hidden",children:r.children};return!(o&1)&&e.child!==s?(r=e.child,r.childLanes=0,r.pendingProps=u,e.deletions=null):(r=lr(s,u),r.subtreeFlags=s.subtreeFlags&14680064),l!==null?i=lr(l,i):(i=Br(i,o,n,null),i.flags|=2),i.return=e,r.return=e,r.sibling=i,e.child=r,r=i,i=e.child,o=t.child.memoizedState,o=o===null?yh(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},i.memoizedState=o,i.childLanes=t.childLanes&~n,e.memoizedState=gh,r}return i=t.child,t=i.sibling,r=lr(i,{mode:"visible",children:r.children}),!(e.mode&1)&&(r.lanes=n),r.return=e,r.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=r,e.memoizedState=null,r}function jd(t,e){return e=nu({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function _a(t,e,n,r){return r!==null&&Id(r),Us(e,t.child,null,n),t=jd(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function zx(t,e,n,r,s,i,o){if(n)return e.flags&256?(e.flags&=-257,r=_c(Error(F(422))),_a(t,e,o,r)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(i=r.fallback,s=e.mode,r=nu({mode:"visible",children:r.children},s,0,null),i=Br(i,s,o,null),i.flags|=2,r.return=e,i.return=e,r.sibling=i,e.child=r,e.mode&1&&Us(e,t.child,null,o),e.child.memoizedState=yh(o),e.memoizedState=gh,i);if(!(e.mode&1))return _a(t,e,o,null);if(s.data==="$!"){if(r=s.nextSibling&&s.nextSibling.dataset,r)var l=r.dgst;return r=l,i=Error(F(419)),r=_c(i,r,void 0),_a(t,e,o,r)}if(l=(o&t.childLanes)!==0,_t||l){if(r=qe,r!==null){switch(o&-o){case 4:s=2;break;case 16:s=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:s=32;break;case 536870912:s=268435456;break;default:s=0}s=s&(r.suspendedLanes|o)?0:s,s!==0&&s!==i.retryLane&&(i.retryLane=s,Sn(t,s),qt(r,t,s,-1))}return Hd(),r=_c(Error(F(421))),_a(t,e,o,r)}return s.data==="$?"?(e.flags|=128,e.child=t.child,e=eT.bind(null,t),s._reactRetry=e,null):(t=i.treeContext,It=sr(s.nextSibling),kt=e,xe=!0,Bt=null,t!==null&&(Rt[Pt++]=pn,Rt[Pt++]=mn,Rt[Pt++]=Wr,pn=t.id,mn=t.overflow,Wr=e),e=jd(e,r.children),e.flags|=4096,e)}function jm(t,e,n){t.lanes|=e;var r=t.alternate;r!==null&&(r.lanes|=e),ch(t.return,e,n)}function vc(t,e,n,r,s){var i=t.memoizedState;i===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:s}:(i.isBackwards=e,i.rendering=null,i.renderingStartTime=0,i.last=r,i.tail=n,i.tailMode=s)}function g0(t,e,n){var r=e.pendingProps,s=r.revealOrder,i=r.tail;if(ct(t,e,r.children,n),r=Te.current,r&2)r=r&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&jm(t,n,e);else if(t.tag===19)jm(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}r&=1}if(ge(Te,r),!(e.mode&1))e.memoizedState=null;else switch(s){case"forwards":for(n=e.child,s=null;n!==null;)t=n.alternate,t!==null&&gl(t)===null&&(s=n),n=n.sibling;n=s,n===null?(s=e.child,e.child=null):(s=n.sibling,n.sibling=null),vc(e,!1,s,n,i);break;case"backwards":for(n=null,s=e.child,e.child=null;s!==null;){if(t=s.alternate,t!==null&&gl(t)===null){e.child=s;break}t=s.sibling,s.sibling=n,n=s,s=t}vc(e,!0,n,null,i);break;case"together":vc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function La(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function kn(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Kr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(F(153));if(e.child!==null){for(t=e.child,n=lr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=lr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function Bx(t,e,n){switch(e.tag){case 3:p0(e),Fs();break;case 5:B_(e);break;case 1:wt(e.type)&&cl(e);break;case 4:Rd(e,e.stateNode.containerInfo);break;case 10:var r=e.type._context,s=e.memoizedProps.value;ge(fl,r._currentValue),r._currentValue=s;break;case 13:if(r=e.memoizedState,r!==null)return r.dehydrated!==null?(ge(Te,Te.current&1),e.flags|=128,null):n&e.child.childLanes?m0(t,e,n):(ge(Te,Te.current&1),t=kn(t,e,n),t!==null?t.sibling:null);ge(Te,Te.current&1);break;case 19:if(r=(n&e.childLanes)!==0,t.flags&128){if(r)return g0(t,e,n);e.flags|=128}if(s=e.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),ge(Te,Te.current),r)break;return null;case 22:case 23:return e.lanes=0,d0(t,e,n)}return kn(t,e,n)}var y0,_h,_0,v0;y0=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};_h=function(){};_0=function(t,e,n,r){var s=t.memoizedProps;if(s!==r){t=e.stateNode,Fr(en.current);var i=null;switch(n){case"input":s=Uc(t,s),r=Uc(t,r),i=[];break;case"select":s=Se({},s,{value:void 0}),r=Se({},r,{value:void 0}),i=[];break;case"textarea":s=$c(t,s),r=$c(t,r),i=[];break;default:typeof s.onClick!="function"&&typeof r.onClick=="function"&&(t.onclick=ll)}qc(n,r);var o;n=null;for(h in s)if(!r.hasOwnProperty(h)&&s.hasOwnProperty(h)&&s[h]!=null)if(h==="style"){var l=s[h];for(o in l)l.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else h!=="dangerouslySetInnerHTML"&&h!=="children"&&h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&h!=="autoFocus"&&(no.hasOwnProperty(h)?i||(i=[]):(i=i||[]).push(h,null));for(h in r){var u=r[h];if(l=s!=null?s[h]:void 0,r.hasOwnProperty(h)&&u!==l&&(u!=null||l!=null))if(h==="style")if(l){for(o in l)!l.hasOwnProperty(o)||u&&u.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in u)u.hasOwnProperty(o)&&l[o]!==u[o]&&(n||(n={}),n[o]=u[o])}else n||(i||(i=[]),i.push(h,n)),n=u;else h==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,l=l?l.__html:void 0,u!=null&&l!==u&&(i=i||[]).push(h,u)):h==="children"?typeof u!="string"&&typeof u!="number"||(i=i||[]).push(h,""+u):h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&(no.hasOwnProperty(h)?(u!=null&&h==="onScroll"&&_e("scroll",t),i||l===u||(i=[])):(i=i||[]).push(h,u))}n&&(i=i||[]).push("style",n);var h=i;(e.updateQueue=h)&&(e.flags|=4)}};v0=function(t,e,n,r){n!==r&&(e.flags|=4)};function Pi(t,e){if(!xe)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:r.sibling=null}}function et(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,r=0;if(e)for(var s=t.child;s!==null;)n|=s.lanes|s.childLanes,r|=s.subtreeFlags&14680064,r|=s.flags&14680064,s.return=t,s=s.sibling;else for(s=t.child;s!==null;)n|=s.lanes|s.childLanes,r|=s.subtreeFlags,r|=s.flags,s.return=t,s=s.sibling;return t.subtreeFlags|=r,t.childLanes=n,e}function $x(t,e,n){var r=e.pendingProps;switch(Td(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return et(e),null;case 1:return wt(e.type)&&ul(),et(e),null;case 3:return r=e.stateNode,zs(),Ee(vt),Ee(it),Nd(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(t===null||t.child===null)&&(ga(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Bt!==null&&(kh(Bt),Bt=null))),_h(t,e),et(e),null;case 5:Pd(e);var s=Fr(mo.current);if(n=e.type,t!==null&&e.stateNode!=null)_0(t,e,n,r,s),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!r){if(e.stateNode===null)throw Error(F(166));return et(e),null}if(t=Fr(en.current),ga(e)){r=e.stateNode,n=e.type;var i=e.memoizedProps;switch(r[Jt]=e,r[fo]=i,t=(e.mode&1)!==0,n){case"dialog":_e("cancel",r),_e("close",r);break;case"iframe":case"object":case"embed":_e("load",r);break;case"video":case"audio":for(s=0;s<Oi.length;s++)_e(Oi[s],r);break;case"source":_e("error",r);break;case"img":case"image":case"link":_e("error",r),_e("load",r);break;case"details":_e("toggle",r);break;case"input":Gp(r,i),_e("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!i.multiple},_e("invalid",r);break;case"textarea":Qp(r,i),_e("invalid",r)}qc(n,i),s=null;for(var o in i)if(i.hasOwnProperty(o)){var l=i[o];o==="children"?typeof l=="string"?r.textContent!==l&&(i.suppressHydrationWarning!==!0&&ma(r.textContent,l,t),s=["children",l]):typeof l=="number"&&r.textContent!==""+l&&(i.suppressHydrationWarning!==!0&&ma(r.textContent,l,t),s=["children",""+l]):no.hasOwnProperty(o)&&l!=null&&o==="onScroll"&&_e("scroll",r)}switch(n){case"input":aa(r),Kp(r,i,!0);break;case"textarea":aa(r),Xp(r);break;case"select":case"option":break;default:typeof i.onClick=="function"&&(r.onclick=ll)}r=s,e.updateQueue=r,r!==null&&(e.flags|=4)}else{o=s.nodeType===9?s:s.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Gy(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof r.is=="string"?t=o.createElement(n,{is:r.is}):(t=o.createElement(n),n==="select"&&(o=t,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):t=o.createElementNS(t,n),t[Jt]=e,t[fo]=r,y0(t,e,!1,!1),e.stateNode=t;e:{switch(o=Wc(n,r),n){case"dialog":_e("cancel",t),_e("close",t),s=r;break;case"iframe":case"object":case"embed":_e("load",t),s=r;break;case"video":case"audio":for(s=0;s<Oi.length;s++)_e(Oi[s],t);s=r;break;case"source":_e("error",t),s=r;break;case"img":case"image":case"link":_e("error",t),_e("load",t),s=r;break;case"details":_e("toggle",t),s=r;break;case"input":Gp(t,r),s=Uc(t,r),_e("invalid",t);break;case"option":s=r;break;case"select":t._wrapperState={wasMultiple:!!r.multiple},s=Se({},r,{value:void 0}),_e("invalid",t);break;case"textarea":Qp(t,r),s=$c(t,r),_e("invalid",t);break;default:s=r}qc(n,s),l=s;for(i in l)if(l.hasOwnProperty(i)){var u=l[i];i==="style"?Xy(t,u):i==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&Ky(t,u)):i==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&ro(t,u):typeof u=="number"&&ro(t,""+u):i!=="suppressContentEditableWarning"&&i!=="suppressHydrationWarning"&&i!=="autoFocus"&&(no.hasOwnProperty(i)?u!=null&&i==="onScroll"&&_e("scroll",t):u!=null&&ld(t,i,u,o))}switch(n){case"input":aa(t),Kp(t,r,!1);break;case"textarea":aa(t),Xp(t);break;case"option":r.value!=null&&t.setAttribute("value",""+mr(r.value));break;case"select":t.multiple=!!r.multiple,i=r.value,i!=null?ks(t,!!r.multiple,i,!1):r.defaultValue!=null&&ks(t,!!r.multiple,r.defaultValue,!0);break;default:typeof s.onClick=="function"&&(t.onclick=ll)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return et(e),null;case 6:if(t&&e.stateNode!=null)v0(t,e,t.memoizedProps,r);else{if(typeof r!="string"&&e.stateNode===null)throw Error(F(166));if(n=Fr(mo.current),Fr(en.current),ga(e)){if(r=e.stateNode,n=e.memoizedProps,r[Jt]=e,(i=r.nodeValue!==n)&&(t=kt,t!==null))switch(t.tag){case 3:ma(r.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&ma(r.nodeValue,n,(t.mode&1)!==0)}i&&(e.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Jt]=e,e.stateNode=r}return et(e),null;case 13:if(Ee(Te),r=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(xe&&It!==null&&e.mode&1&&!(e.flags&128))L_(),Fs(),e.flags|=98560,i=!1;else if(i=ga(e),r!==null&&r.dehydrated!==null){if(t===null){if(!i)throw Error(F(318));if(i=e.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(F(317));i[Jt]=e}else Fs(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;et(e),i=!1}else Bt!==null&&(kh(Bt),Bt=null),i=!0;if(!i)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(r=r!==null,r!==(t!==null&&t.memoizedState!==null)&&r&&(e.child.flags|=8192,e.mode&1&&(t===null||Te.current&1?Ue===0&&(Ue=3):Hd())),e.updateQueue!==null&&(e.flags|=4),et(e),null);case 4:return zs(),_h(t,e),t===null&&co(e.stateNode.containerInfo),et(e),null;case 10:return Ad(e.type._context),et(e),null;case 17:return wt(e.type)&&ul(),et(e),null;case 19:if(Ee(Te),i=e.memoizedState,i===null)return et(e),null;if(r=(e.flags&128)!==0,o=i.rendering,o===null)if(r)Pi(i,!1);else{if(Ue!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=gl(t),o!==null){for(e.flags|=128,Pi(i,!1),r=o.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),e.subtreeFlags=0,r=n,n=e.child;n!==null;)i=n,t=r,i.flags&=14680066,o=i.alternate,o===null?(i.childLanes=0,i.lanes=t,i.child=null,i.subtreeFlags=0,i.memoizedProps=null,i.memoizedState=null,i.updateQueue=null,i.dependencies=null,i.stateNode=null):(i.childLanes=o.childLanes,i.lanes=o.lanes,i.child=o.child,i.subtreeFlags=0,i.deletions=null,i.memoizedProps=o.memoizedProps,i.memoizedState=o.memoizedState,i.updateQueue=o.updateQueue,i.type=o.type,t=o.dependencies,i.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return ge(Te,Te.current&1|2),e.child}t=t.sibling}i.tail!==null&&Re()>$s&&(e.flags|=128,r=!0,Pi(i,!1),e.lanes=4194304)}else{if(!r)if(t=gl(o),t!==null){if(e.flags|=128,r=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Pi(i,!0),i.tail===null&&i.tailMode==="hidden"&&!o.alternate&&!xe)return et(e),null}else 2*Re()-i.renderingStartTime>$s&&n!==1073741824&&(e.flags|=128,r=!0,Pi(i,!1),e.lanes=4194304);i.isBackwards?(o.sibling=e.child,e.child=o):(n=i.last,n!==null?n.sibling=o:e.child=o,i.last=o)}return i.tail!==null?(e=i.tail,i.rendering=e,i.tail=e.sibling,i.renderingStartTime=Re(),e.sibling=null,n=Te.current,ge(Te,r?n&1|2:n&1),e):(et(e),null);case 22:case 23:return $d(),r=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==r&&(e.flags|=8192),r&&e.mode&1?Tt&1073741824&&(et(e),e.subtreeFlags&6&&(e.flags|=8192)):et(e),null;case 24:return null;case 25:return null}throw Error(F(156,e.tag))}function Hx(t,e){switch(Td(e),e.tag){case 1:return wt(e.type)&&ul(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return zs(),Ee(vt),Ee(it),Nd(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Pd(e),null;case 13:if(Ee(Te),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(F(340));Fs()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return Ee(Te),null;case 4:return zs(),null;case 10:return Ad(e.type._context),null;case 22:case 23:return $d(),null;case 24:return null;default:return null}}var va=!1,rt=!1,qx=typeof WeakSet=="function"?WeakSet:Set,q=null;function Ts(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Ce(t,e,r)}else n.current=null}function vh(t,e,n){try{n()}catch(r){Ce(t,e,r)}}var Fm=!1;function Wx(t,e){if(nh=il,t=I_(),Ed(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var s=r.anchorOffset,i=r.focusNode;r=r.focusOffset;try{n.nodeType,i.nodeType}catch{n=null;break e}var o=0,l=-1,u=-1,h=0,p=0,m=t,g=null;t:for(;;){for(var A;m!==n||s!==0&&m.nodeType!==3||(l=o+s),m!==i||r!==0&&m.nodeType!==3||(u=o+r),m.nodeType===3&&(o+=m.nodeValue.length),(A=m.firstChild)!==null;)g=m,m=A;for(;;){if(m===t)break t;if(g===n&&++h===s&&(l=o),g===i&&++p===r&&(u=o),(A=m.nextSibling)!==null)break;m=g,g=m.parentNode}m=A}n=l===-1||u===-1?null:{start:l,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(rh={focusedElem:t,selectionRange:n},il=!1,q=e;q!==null;)if(e=q,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,q=t;else for(;q!==null;){e=q;try{var b=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(b!==null){var R=b.memoizedProps,V=b.memoizedState,I=e.stateNode,_=I.getSnapshotBeforeUpdate(e.elementType===e.type?R:Ut(e.type,R),V);I.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var k=e.stateNode.containerInfo;k.nodeType===1?k.textContent="":k.nodeType===9&&k.documentElement&&k.removeChild(k.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(F(163))}}catch(D){Ce(e,e.return,D)}if(t=e.sibling,t!==null){t.return=e.return,q=t;break}q=e.return}return b=Fm,Fm=!1,b}function Gi(t,e,n){var r=e.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var s=r=r.next;do{if((s.tag&t)===t){var i=s.destroy;s.destroy=void 0,i!==void 0&&vh(e,n,i)}s=s.next}while(s!==r)}}function eu(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var r=n.create;n.destroy=r()}n=n.next}while(n!==e)}}function wh(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function w0(t){var e=t.alternate;e!==null&&(t.alternate=null,w0(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Jt],delete e[fo],delete e[oh],delete e[Cx],delete e[bx])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function E0(t){return t.tag===5||t.tag===3||t.tag===4}function Um(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||E0(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Eh(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=ll));else if(r!==4&&(t=t.child,t!==null))for(Eh(t,e,n),t=t.sibling;t!==null;)Eh(t,e,n),t=t.sibling}function xh(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(r!==4&&(t=t.child,t!==null))for(xh(t,e,n),t=t.sibling;t!==null;)xh(t,e,n),t=t.sibling}var We=null,zt=!1;function Bn(t,e,n){for(n=n.child;n!==null;)x0(t,e,n),n=n.sibling}function x0(t,e,n){if(Zt&&typeof Zt.onCommitFiberUnmount=="function")try{Zt.onCommitFiberUnmount(Wl,n)}catch{}switch(n.tag){case 5:rt||Ts(n,e);case 6:var r=We,s=zt;We=null,Bn(t,e,n),We=r,zt=s,We!==null&&(zt?(t=We,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):We.removeChild(n.stateNode));break;case 18:We!==null&&(zt?(t=We,n=n.stateNode,t.nodeType===8?dc(t.parentNode,n):t.nodeType===1&&dc(t,n),ao(t)):dc(We,n.stateNode));break;case 4:r=We,s=zt,We=n.stateNode.containerInfo,zt=!0,Bn(t,e,n),We=r,zt=s;break;case 0:case 11:case 14:case 15:if(!rt&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){s=r=r.next;do{var i=s,o=i.destroy;i=i.tag,o!==void 0&&(i&2||i&4)&&vh(n,e,o),s=s.next}while(s!==r)}Bn(t,e,n);break;case 1:if(!rt&&(Ts(n,e),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(l){Ce(n,e,l)}Bn(t,e,n);break;case 21:Bn(t,e,n);break;case 22:n.mode&1?(rt=(r=rt)||n.memoizedState!==null,Bn(t,e,n),rt=r):Bn(t,e,n);break;default:Bn(t,e,n)}}function zm(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new qx),e.forEach(function(r){var s=tT.bind(null,t,r);n.has(r)||(n.add(r),r.then(s,s))})}}function Ft(t,e){var n=e.deletions;if(n!==null)for(var r=0;r<n.length;r++){var s=n[r];try{var i=t,o=e,l=o;e:for(;l!==null;){switch(l.tag){case 5:We=l.stateNode,zt=!1;break e;case 3:We=l.stateNode.containerInfo,zt=!0;break e;case 4:We=l.stateNode.containerInfo,zt=!0;break e}l=l.return}if(We===null)throw Error(F(160));x0(i,o,s),We=null,zt=!1;var u=s.alternate;u!==null&&(u.return=null),s.return=null}catch(h){Ce(s,e,h)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)T0(e,t),e=e.sibling}function T0(t,e){var n=t.alternate,r=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Ft(e,t),Qt(t),r&4){try{Gi(3,t,t.return),eu(3,t)}catch(R){Ce(t,t.return,R)}try{Gi(5,t,t.return)}catch(R){Ce(t,t.return,R)}}break;case 1:Ft(e,t),Qt(t),r&512&&n!==null&&Ts(n,n.return);break;case 5:if(Ft(e,t),Qt(t),r&512&&n!==null&&Ts(n,n.return),t.flags&32){var s=t.stateNode;try{ro(s,"")}catch(R){Ce(t,t.return,R)}}if(r&4&&(s=t.stateNode,s!=null)){var i=t.memoizedProps,o=n!==null?n.memoizedProps:i,l=t.type,u=t.updateQueue;if(t.updateQueue=null,u!==null)try{l==="input"&&i.type==="radio"&&i.name!=null&&qy(s,i),Wc(l,o);var h=Wc(l,i);for(o=0;o<u.length;o+=2){var p=u[o],m=u[o+1];p==="style"?Xy(s,m):p==="dangerouslySetInnerHTML"?Ky(s,m):p==="children"?ro(s,m):ld(s,p,m,h)}switch(l){case"input":zc(s,i);break;case"textarea":Wy(s,i);break;case"select":var g=s._wrapperState.wasMultiple;s._wrapperState.wasMultiple=!!i.multiple;var A=i.value;A!=null?ks(s,!!i.multiple,A,!1):g!==!!i.multiple&&(i.defaultValue!=null?ks(s,!!i.multiple,i.defaultValue,!0):ks(s,!!i.multiple,i.multiple?[]:"",!1))}s[fo]=i}catch(R){Ce(t,t.return,R)}}break;case 6:if(Ft(e,t),Qt(t),r&4){if(t.stateNode===null)throw Error(F(162));s=t.stateNode,i=t.memoizedProps;try{s.nodeValue=i}catch(R){Ce(t,t.return,R)}}break;case 3:if(Ft(e,t),Qt(t),r&4&&n!==null&&n.memoizedState.isDehydrated)try{ao(e.containerInfo)}catch(R){Ce(t,t.return,R)}break;case 4:Ft(e,t),Qt(t);break;case 13:Ft(e,t),Qt(t),s=t.child,s.flags&8192&&(i=s.memoizedState!==null,s.stateNode.isHidden=i,!i||s.alternate!==null&&s.alternate.memoizedState!==null||(zd=Re())),r&4&&zm(t);break;case 22:if(p=n!==null&&n.memoizedState!==null,t.mode&1?(rt=(h=rt)||p,Ft(e,t),rt=h):Ft(e,t),Qt(t),r&8192){if(h=t.memoizedState!==null,(t.stateNode.isHidden=h)&&!p&&t.mode&1)for(q=t,p=t.child;p!==null;){for(m=q=p;q!==null;){switch(g=q,A=g.child,g.tag){case 0:case 11:case 14:case 15:Gi(4,g,g.return);break;case 1:Ts(g,g.return);var b=g.stateNode;if(typeof b.componentWillUnmount=="function"){r=g,n=g.return;try{e=r,b.props=e.memoizedProps,b.state=e.memoizedState,b.componentWillUnmount()}catch(R){Ce(r,n,R)}}break;case 5:Ts(g,g.return);break;case 22:if(g.memoizedState!==null){$m(m);continue}}A!==null?(A.return=g,q=A):$m(m)}p=p.sibling}e:for(p=null,m=t;;){if(m.tag===5){if(p===null){p=m;try{s=m.stateNode,h?(i=s.style,typeof i.setProperty=="function"?i.setProperty("display","none","important"):i.display="none"):(l=m.stateNode,u=m.memoizedProps.style,o=u!=null&&u.hasOwnProperty("display")?u.display:null,l.style.display=Qy("display",o))}catch(R){Ce(t,t.return,R)}}}else if(m.tag===6){if(p===null)try{m.stateNode.nodeValue=h?"":m.memoizedProps}catch(R){Ce(t,t.return,R)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===t)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===t)break e;for(;m.sibling===null;){if(m.return===null||m.return===t)break e;p===m&&(p=null),m=m.return}p===m&&(p=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:Ft(e,t),Qt(t),r&4&&zm(t);break;case 21:break;default:Ft(e,t),Qt(t)}}function Qt(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(E0(n)){var r=n;break e}n=n.return}throw Error(F(160))}switch(r.tag){case 5:var s=r.stateNode;r.flags&32&&(ro(s,""),r.flags&=-33);var i=Um(t);xh(t,i,s);break;case 3:case 4:var o=r.stateNode.containerInfo,l=Um(t);Eh(t,l,o);break;default:throw Error(F(161))}}catch(u){Ce(t,t.return,u)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function Gx(t,e,n){q=t,I0(t)}function I0(t,e,n){for(var r=(t.mode&1)!==0;q!==null;){var s=q,i=s.child;if(s.tag===22&&r){var o=s.memoizedState!==null||va;if(!o){var l=s.alternate,u=l!==null&&l.memoizedState!==null||rt;l=va;var h=rt;if(va=o,(rt=u)&&!h)for(q=s;q!==null;)o=q,u=o.child,o.tag===22&&o.memoizedState!==null?Hm(s):u!==null?(u.return=o,q=u):Hm(s);for(;i!==null;)q=i,I0(i),i=i.sibling;q=s,va=l,rt=h}Bm(t)}else s.subtreeFlags&8772&&i!==null?(i.return=s,q=i):Bm(t)}}function Bm(t){for(;q!==null;){var e=q;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:rt||eu(5,e);break;case 1:var r=e.stateNode;if(e.flags&4&&!rt)if(n===null)r.componentDidMount();else{var s=e.elementType===e.type?n.memoizedProps:Ut(e.type,n.memoizedProps);r.componentDidUpdate(s,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var i=e.updateQueue;i!==null&&km(e,i,r);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}km(e,o,n)}break;case 5:var l=e.stateNode;if(n===null&&e.flags&4){n=l;var u=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var h=e.alternate;if(h!==null){var p=h.memoizedState;if(p!==null){var m=p.dehydrated;m!==null&&ao(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(F(163))}rt||e.flags&512&&wh(e)}catch(g){Ce(e,e.return,g)}}if(e===t){q=null;break}if(n=e.sibling,n!==null){n.return=e.return,q=n;break}q=e.return}}function $m(t){for(;q!==null;){var e=q;if(e===t){q=null;break}var n=e.sibling;if(n!==null){n.return=e.return,q=n;break}q=e.return}}function Hm(t){for(;q!==null;){var e=q;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{eu(4,e)}catch(u){Ce(e,n,u)}break;case 1:var r=e.stateNode;if(typeof r.componentDidMount=="function"){var s=e.return;try{r.componentDidMount()}catch(u){Ce(e,s,u)}}var i=e.return;try{wh(e)}catch(u){Ce(e,i,u)}break;case 5:var o=e.return;try{wh(e)}catch(u){Ce(e,o,u)}}}catch(u){Ce(e,e.return,u)}if(e===t){q=null;break}var l=e.sibling;if(l!==null){l.return=e.return,q=l;break}q=e.return}}var Kx=Math.ceil,vl=Dn.ReactCurrentDispatcher,Fd=Dn.ReactCurrentOwner,Mt=Dn.ReactCurrentBatchConfig,ce=0,qe=null,Ve=null,Qe=0,Tt=0,Is=Sr(0),Ue=0,vo=null,Kr=0,tu=0,Ud=0,Ki=null,gt=null,zd=0,$s=1/0,dn=null,wl=!1,Th=null,or=null,wa=!1,Zn=null,El=0,Qi=0,Ih=null,ja=-1,Fa=0;function ht(){return ce&6?Re():ja!==-1?ja:ja=Re()}function ar(t){return t.mode&1?ce&2&&Qe!==0?Qe&-Qe:Px.transition!==null?(Fa===0&&(Fa=l_()),Fa):(t=fe,t!==0||(t=window.event,t=t===void 0?16:m_(t.type)),t):1}function qt(t,e,n,r){if(50<Qi)throw Qi=0,Ih=null,Error(F(185));Ro(t,n,r),(!(ce&2)||t!==qe)&&(t===qe&&(!(ce&2)&&(tu|=n),Ue===4&&Gn(t,Qe)),Et(t,r),n===1&&ce===0&&!(e.mode&1)&&($s=Re()+500,Yl&&kr()))}function Et(t,e){var n=t.callbackNode;PE(t,e);var r=sl(t,t===qe?Qe:0);if(r===0)n!==null&&Zp(n),t.callbackNode=null,t.callbackPriority=0;else if(e=r&-r,t.callbackPriority!==e){if(n!=null&&Zp(n),e===1)t.tag===0?Rx(qm.bind(null,t)):V_(qm.bind(null,t)),kx(function(){!(ce&6)&&kr()}),n=null;else{switch(u_(r)){case 1:n=fd;break;case 4:n=o_;break;case 16:n=rl;break;case 536870912:n=a_;break;default:n=rl}n=N0(n,S0.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function S0(t,e){if(ja=-1,Fa=0,ce&6)throw Error(F(327));var n=t.callbackNode;if(Ps()&&t.callbackNode!==n)return null;var r=sl(t,t===qe?Qe:0);if(r===0)return null;if(r&30||r&t.expiredLanes||e)e=xl(t,r);else{e=r;var s=ce;ce|=2;var i=A0();(qe!==t||Qe!==e)&&(dn=null,$s=Re()+500,zr(t,e));do try{Yx();break}catch(l){k0(t,l)}while(!0);kd(),vl.current=i,ce=s,Ve!==null?e=0:(qe=null,Qe=0,e=Ue)}if(e!==0){if(e===2&&(s=Yc(t),s!==0&&(r=s,e=Sh(t,s))),e===1)throw n=vo,zr(t,0),Gn(t,r),Et(t,Re()),n;if(e===6)Gn(t,r);else{if(s=t.current.alternate,!(r&30)&&!Qx(s)&&(e=xl(t,r),e===2&&(i=Yc(t),i!==0&&(r=i,e=Sh(t,i))),e===1))throw n=vo,zr(t,0),Gn(t,r),Et(t,Re()),n;switch(t.finishedWork=s,t.finishedLanes=r,e){case 0:case 1:throw Error(F(345));case 2:Mr(t,gt,dn);break;case 3:if(Gn(t,r),(r&130023424)===r&&(e=zd+500-Re(),10<e)){if(sl(t,0)!==0)break;if(s=t.suspendedLanes,(s&r)!==r){ht(),t.pingedLanes|=t.suspendedLanes&s;break}t.timeoutHandle=ih(Mr.bind(null,t,gt,dn),e);break}Mr(t,gt,dn);break;case 4:if(Gn(t,r),(r&4194240)===r)break;for(e=t.eventTimes,s=-1;0<r;){var o=31-Ht(r);i=1<<o,o=e[o],o>s&&(s=o),r&=~i}if(r=s,r=Re()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Kx(r/1960))-r,10<r){t.timeoutHandle=ih(Mr.bind(null,t,gt,dn),r);break}Mr(t,gt,dn);break;case 5:Mr(t,gt,dn);break;default:throw Error(F(329))}}}return Et(t,Re()),t.callbackNode===n?S0.bind(null,t):null}function Sh(t,e){var n=Ki;return t.current.memoizedState.isDehydrated&&(zr(t,e).flags|=256),t=xl(t,e),t!==2&&(e=gt,gt=n,e!==null&&kh(e)),t}function kh(t){gt===null?gt=t:gt.push.apply(gt,t)}function Qx(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var s=n[r],i=s.getSnapshot;s=s.value;try{if(!Wt(i(),s))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Gn(t,e){for(e&=~Ud,e&=~tu,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Ht(e),r=1<<n;t[n]=-1,e&=~r}}function qm(t){if(ce&6)throw Error(F(327));Ps();var e=sl(t,0);if(!(e&1))return Et(t,Re()),null;var n=xl(t,e);if(t.tag!==0&&n===2){var r=Yc(t);r!==0&&(e=r,n=Sh(t,r))}if(n===1)throw n=vo,zr(t,0),Gn(t,e),Et(t,Re()),n;if(n===6)throw Error(F(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Mr(t,gt,dn),Et(t,Re()),null}function Bd(t,e){var n=ce;ce|=1;try{return t(e)}finally{ce=n,ce===0&&($s=Re()+500,Yl&&kr())}}function Qr(t){Zn!==null&&Zn.tag===0&&!(ce&6)&&Ps();var e=ce;ce|=1;var n=Mt.transition,r=fe;try{if(Mt.transition=null,fe=1,t)return t()}finally{fe=r,Mt.transition=n,ce=e,!(ce&6)&&kr()}}function $d(){Tt=Is.current,Ee(Is)}function zr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,Sx(n)),Ve!==null)for(n=Ve.return;n!==null;){var r=n;switch(Td(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&ul();break;case 3:zs(),Ee(vt),Ee(it),Nd();break;case 5:Pd(r);break;case 4:zs();break;case 13:Ee(Te);break;case 19:Ee(Te);break;case 10:Ad(r.type._context);break;case 22:case 23:$d()}n=n.return}if(qe=t,Ve=t=lr(t.current,null),Qe=Tt=e,Ue=0,vo=null,Ud=tu=Kr=0,gt=Ki=null,jr!==null){for(e=0;e<jr.length;e++)if(n=jr[e],r=n.interleaved,r!==null){n.interleaved=null;var s=r.next,i=n.pending;if(i!==null){var o=i.next;i.next=s,r.next=o}n.pending=r}jr=null}return t}function k0(t,e){do{var n=Ve;try{if(kd(),Ma.current=_l,yl){for(var r=Ie.memoizedState;r!==null;){var s=r.queue;s!==null&&(s.pending=null),r=r.next}yl=!1}if(Gr=0,He=je=Ie=null,Wi=!1,go=0,Fd.current=null,n===null||n.return===null){Ue=1,vo=e,Ve=null;break}e:{var i=t,o=n.return,l=n,u=e;if(e=Qe,l.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var h=u,p=l,m=p.tag;if(!(p.mode&1)&&(m===0||m===11||m===15)){var g=p.alternate;g?(p.updateQueue=g.updateQueue,p.memoizedState=g.memoizedState,p.lanes=g.lanes):(p.updateQueue=null,p.memoizedState=null)}var A=Nm(o);if(A!==null){A.flags&=-257,Dm(A,o,l,i,e),A.mode&1&&Pm(i,h,e),e=A,u=h;var b=e.updateQueue;if(b===null){var R=new Set;R.add(u),e.updateQueue=R}else b.add(u);break e}else{if(!(e&1)){Pm(i,h,e),Hd();break e}u=Error(F(426))}}else if(xe&&l.mode&1){var V=Nm(o);if(V!==null){!(V.flags&65536)&&(V.flags|=256),Dm(V,o,l,i,e),Id(Bs(u,l));break e}}i=u=Bs(u,l),Ue!==4&&(Ue=2),Ki===null?Ki=[i]:Ki.push(i),i=o;do{switch(i.tag){case 3:i.flags|=65536,e&=-e,i.lanes|=e;var I=u0(i,u,e);Sm(i,I);break e;case 1:l=u;var _=i.type,k=i.stateNode;if(!(i.flags&128)&&(typeof _.getDerivedStateFromError=="function"||k!==null&&typeof k.componentDidCatch=="function"&&(or===null||!or.has(k)))){i.flags|=65536,e&=-e,i.lanes|=e;var D=c0(i,l,e);Sm(i,D);break e}}i=i.return}while(i!==null)}b0(n)}catch(j){e=j,Ve===n&&n!==null&&(Ve=n=n.return);continue}break}while(!0)}function A0(){var t=vl.current;return vl.current=_l,t===null?_l:t}function Hd(){(Ue===0||Ue===3||Ue===2)&&(Ue=4),qe===null||!(Kr&268435455)&&!(tu&268435455)||Gn(qe,Qe)}function xl(t,e){var n=ce;ce|=2;var r=A0();(qe!==t||Qe!==e)&&(dn=null,zr(t,e));do try{Xx();break}catch(s){k0(t,s)}while(!0);if(kd(),ce=n,vl.current=r,Ve!==null)throw Error(F(261));return qe=null,Qe=0,Ue}function Xx(){for(;Ve!==null;)C0(Ve)}function Yx(){for(;Ve!==null&&!xE();)C0(Ve)}function C0(t){var e=P0(t.alternate,t,Tt);t.memoizedProps=t.pendingProps,e===null?b0(t):Ve=e,Fd.current=null}function b0(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=Hx(n,e),n!==null){n.flags&=32767,Ve=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Ue=6,Ve=null;return}}else if(n=$x(n,e,Tt),n!==null){Ve=n;return}if(e=e.sibling,e!==null){Ve=e;return}Ve=e=t}while(e!==null);Ue===0&&(Ue=5)}function Mr(t,e,n){var r=fe,s=Mt.transition;try{Mt.transition=null,fe=1,Jx(t,e,n,r)}finally{Mt.transition=s,fe=r}return null}function Jx(t,e,n,r){do Ps();while(Zn!==null);if(ce&6)throw Error(F(327));n=t.finishedWork;var s=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(F(177));t.callbackNode=null,t.callbackPriority=0;var i=n.lanes|n.childLanes;if(NE(t,i),t===qe&&(Ve=qe=null,Qe=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||wa||(wa=!0,N0(rl,function(){return Ps(),null})),i=(n.flags&15990)!==0,n.subtreeFlags&15990||i){i=Mt.transition,Mt.transition=null;var o=fe;fe=1;var l=ce;ce|=4,Fd.current=null,Wx(t,n),T0(n,t),_x(rh),il=!!nh,rh=nh=null,t.current=n,Gx(n),TE(),ce=l,fe=o,Mt.transition=i}else t.current=n;if(wa&&(wa=!1,Zn=t,El=s),i=t.pendingLanes,i===0&&(or=null),kE(n.stateNode),Et(t,Re()),e!==null)for(r=t.onRecoverableError,n=0;n<e.length;n++)s=e[n],r(s.value,{componentStack:s.stack,digest:s.digest});if(wl)throw wl=!1,t=Th,Th=null,t;return El&1&&t.tag!==0&&Ps(),i=t.pendingLanes,i&1?t===Ih?Qi++:(Qi=0,Ih=t):Qi=0,kr(),null}function Ps(){if(Zn!==null){var t=u_(El),e=Mt.transition,n=fe;try{if(Mt.transition=null,fe=16>t?16:t,Zn===null)var r=!1;else{if(t=Zn,Zn=null,El=0,ce&6)throw Error(F(331));var s=ce;for(ce|=4,q=t.current;q!==null;){var i=q,o=i.child;if(q.flags&16){var l=i.deletions;if(l!==null){for(var u=0;u<l.length;u++){var h=l[u];for(q=h;q!==null;){var p=q;switch(p.tag){case 0:case 11:case 15:Gi(8,p,i)}var m=p.child;if(m!==null)m.return=p,q=m;else for(;q!==null;){p=q;var g=p.sibling,A=p.return;if(w0(p),p===h){q=null;break}if(g!==null){g.return=A,q=g;break}q=A}}}var b=i.alternate;if(b!==null){var R=b.child;if(R!==null){b.child=null;do{var V=R.sibling;R.sibling=null,R=V}while(R!==null)}}q=i}}if(i.subtreeFlags&2064&&o!==null)o.return=i,q=o;else e:for(;q!==null;){if(i=q,i.flags&2048)switch(i.tag){case 0:case 11:case 15:Gi(9,i,i.return)}var I=i.sibling;if(I!==null){I.return=i.return,q=I;break e}q=i.return}}var _=t.current;for(q=_;q!==null;){o=q;var k=o.child;if(o.subtreeFlags&2064&&k!==null)k.return=o,q=k;else e:for(o=_;q!==null;){if(l=q,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:eu(9,l)}}catch(j){Ce(l,l.return,j)}if(l===o){q=null;break e}var D=l.sibling;if(D!==null){D.return=l.return,q=D;break e}q=l.return}}if(ce=s,kr(),Zt&&typeof Zt.onPostCommitFiberRoot=="function")try{Zt.onPostCommitFiberRoot(Wl,t)}catch{}r=!0}return r}finally{fe=n,Mt.transition=e}}return!1}function Wm(t,e,n){e=Bs(n,e),e=u0(t,e,1),t=ir(t,e,1),e=ht(),t!==null&&(Ro(t,1,e),Et(t,e))}function Ce(t,e,n){if(t.tag===3)Wm(t,t,n);else for(;e!==null;){if(e.tag===3){Wm(e,t,n);break}else if(e.tag===1){var r=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(or===null||!or.has(r))){t=Bs(n,t),t=c0(e,t,1),e=ir(e,t,1),t=ht(),e!==null&&(Ro(e,1,t),Et(e,t));break}}e=e.return}}function Zx(t,e,n){var r=t.pingCache;r!==null&&r.delete(e),e=ht(),t.pingedLanes|=t.suspendedLanes&n,qe===t&&(Qe&n)===n&&(Ue===4||Ue===3&&(Qe&130023424)===Qe&&500>Re()-zd?zr(t,0):Ud|=n),Et(t,e)}function R0(t,e){e===0&&(t.mode&1?(e=ca,ca<<=1,!(ca&130023424)&&(ca=4194304)):e=1);var n=ht();t=Sn(t,e),t!==null&&(Ro(t,e,n),Et(t,n))}function eT(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),R0(t,n)}function tT(t,e){var n=0;switch(t.tag){case 13:var r=t.stateNode,s=t.memoizedState;s!==null&&(n=s.retryLane);break;case 19:r=t.stateNode;break;default:throw Error(F(314))}r!==null&&r.delete(e),R0(t,n)}var P0;P0=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||vt.current)_t=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return _t=!1,Bx(t,e,n);_t=!!(t.flags&131072)}else _t=!1,xe&&e.flags&1048576&&M_(e,dl,e.index);switch(e.lanes=0,e.tag){case 2:var r=e.type;La(t,e),t=e.pendingProps;var s=js(e,it.current);Rs(e,n),s=Vd(null,e,r,t,s,n);var i=Md();return e.flags|=1,typeof s=="object"&&s!==null&&typeof s.render=="function"&&s.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,wt(r)?(i=!0,cl(e)):i=!1,e.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,bd(e),s.updater=Zl,e.stateNode=s,s._reactInternals=e,dh(e,r,t,n),e=mh(null,e,r,!0,i,n)):(e.tag=0,xe&&i&&xd(e),ct(null,e,s,n),e=e.child),e;case 16:r=e.elementType;e:{switch(La(t,e),t=e.pendingProps,s=r._init,r=s(r._payload),e.type=r,s=e.tag=rT(r),t=Ut(r,t),s){case 0:e=ph(null,e,r,t,n);break e;case 1:e=Om(null,e,r,t,n);break e;case 11:e=Vm(null,e,r,t,n);break e;case 14:e=Mm(null,e,r,Ut(r.type,t),n);break e}throw Error(F(306,r,""))}return e;case 0:return r=e.type,s=e.pendingProps,s=e.elementType===r?s:Ut(r,s),ph(t,e,r,s,n);case 1:return r=e.type,s=e.pendingProps,s=e.elementType===r?s:Ut(r,s),Om(t,e,r,s,n);case 3:e:{if(p0(e),t===null)throw Error(F(387));r=e.pendingProps,i=e.memoizedState,s=i.element,z_(t,e),ml(e,r,null,n);var o=e.memoizedState;if(r=o.element,i.isDehydrated)if(i={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=i,e.memoizedState=i,e.flags&256){s=Bs(Error(F(423)),e),e=Lm(t,e,r,n,s);break e}else if(r!==s){s=Bs(Error(F(424)),e),e=Lm(t,e,r,n,s);break e}else for(It=sr(e.stateNode.containerInfo.firstChild),kt=e,xe=!0,Bt=null,n=F_(e,null,r,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Fs(),r===s){e=kn(t,e,n);break e}ct(t,e,r,n)}e=e.child}return e;case 5:return B_(e),t===null&&uh(e),r=e.type,s=e.pendingProps,i=t!==null?t.memoizedProps:null,o=s.children,sh(r,s)?o=null:i!==null&&sh(r,i)&&(e.flags|=32),f0(t,e),ct(t,e,o,n),e.child;case 6:return t===null&&uh(e),null;case 13:return m0(t,e,n);case 4:return Rd(e,e.stateNode.containerInfo),r=e.pendingProps,t===null?e.child=Us(e,null,r,n):ct(t,e,r,n),e.child;case 11:return r=e.type,s=e.pendingProps,s=e.elementType===r?s:Ut(r,s),Vm(t,e,r,s,n);case 7:return ct(t,e,e.pendingProps,n),e.child;case 8:return ct(t,e,e.pendingProps.children,n),e.child;case 12:return ct(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(r=e.type._context,s=e.pendingProps,i=e.memoizedProps,o=s.value,ge(fl,r._currentValue),r._currentValue=o,i!==null)if(Wt(i.value,o)){if(i.children===s.children&&!vt.current){e=kn(t,e,n);break e}}else for(i=e.child,i!==null&&(i.return=e);i!==null;){var l=i.dependencies;if(l!==null){o=i.child;for(var u=l.firstContext;u!==null;){if(u.context===r){if(i.tag===1){u=_n(-1,n&-n),u.tag=2;var h=i.updateQueue;if(h!==null){h=h.shared;var p=h.pending;p===null?u.next=u:(u.next=p.next,p.next=u),h.pending=u}}i.lanes|=n,u=i.alternate,u!==null&&(u.lanes|=n),ch(i.return,n,e),l.lanes|=n;break}u=u.next}}else if(i.tag===10)o=i.type===e.type?null:i.child;else if(i.tag===18){if(o=i.return,o===null)throw Error(F(341));o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),ch(o,n,e),o=i.sibling}else o=i.child;if(o!==null)o.return=i;else for(o=i;o!==null;){if(o===e){o=null;break}if(i=o.sibling,i!==null){i.return=o.return,o=i;break}o=o.return}i=o}ct(t,e,s.children,n),e=e.child}return e;case 9:return s=e.type,r=e.pendingProps.children,Rs(e,n),s=Ot(s),r=r(s),e.flags|=1,ct(t,e,r,n),e.child;case 14:return r=e.type,s=Ut(r,e.pendingProps),s=Ut(r.type,s),Mm(t,e,r,s,n);case 15:return h0(t,e,e.type,e.pendingProps,n);case 17:return r=e.type,s=e.pendingProps,s=e.elementType===r?s:Ut(r,s),La(t,e),e.tag=1,wt(r)?(t=!0,cl(e)):t=!1,Rs(e,n),l0(e,r,s),dh(e,r,s,n),mh(null,e,r,!0,t,n);case 19:return g0(t,e,n);case 22:return d0(t,e,n)}throw Error(F(156,e.tag))};function N0(t,e){return i_(t,e)}function nT(t,e,n,r){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Vt(t,e,n,r){return new nT(t,e,n,r)}function qd(t){return t=t.prototype,!(!t||!t.isReactComponent)}function rT(t){if(typeof t=="function")return qd(t)?1:0;if(t!=null){if(t=t.$$typeof,t===cd)return 11;if(t===hd)return 14}return 2}function lr(t,e){var n=t.alternate;return n===null?(n=Vt(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Ua(t,e,n,r,s,i){var o=2;if(r=t,typeof t=="function")qd(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case ps:return Br(n.children,s,i,e);case ud:o=8,s|=8;break;case Oc:return t=Vt(12,n,e,s|2),t.elementType=Oc,t.lanes=i,t;case Lc:return t=Vt(13,n,e,s),t.elementType=Lc,t.lanes=i,t;case jc:return t=Vt(19,n,e,s),t.elementType=jc,t.lanes=i,t;case By:return nu(n,s,i,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Uy:o=10;break e;case zy:o=9;break e;case cd:o=11;break e;case hd:o=14;break e;case Hn:o=16,r=null;break e}throw Error(F(130,t==null?t:typeof t,""))}return e=Vt(o,n,e,s),e.elementType=t,e.type=r,e.lanes=i,e}function Br(t,e,n,r){return t=Vt(7,t,r,e),t.lanes=n,t}function nu(t,e,n,r){return t=Vt(22,t,r,e),t.elementType=By,t.lanes=n,t.stateNode={isHidden:!1},t}function wc(t,e,n){return t=Vt(6,t,null,e),t.lanes=n,t}function Ec(t,e,n){return e=Vt(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function sT(t,e,n,r,s){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=tc(0),this.expirationTimes=tc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=tc(0),this.identifierPrefix=r,this.onRecoverableError=s,this.mutableSourceEagerHydrationData=null}function Wd(t,e,n,r,s,i,o,l,u){return t=new sT(t,e,n,l,u),e===1?(e=1,i===!0&&(e|=8)):e=0,i=Vt(3,null,null,e),t.current=i,i.stateNode=t,i.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},bd(i),t}function iT(t,e,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:fs,key:r==null?null:""+r,children:t,containerInfo:e,implementation:n}}function D0(t){if(!t)return gr;t=t._reactInternals;e:{if(ts(t)!==t||t.tag!==1)throw Error(F(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(wt(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(F(171))}if(t.tag===1){var n=t.type;if(wt(n))return D_(t,n,e)}return e}function V0(t,e,n,r,s,i,o,l,u){return t=Wd(n,r,!0,t,s,i,o,l,u),t.context=D0(null),n=t.current,r=ht(),s=ar(n),i=_n(r,s),i.callback=e??null,ir(n,i,s),t.current.lanes=s,Ro(t,s,r),Et(t,r),t}function ru(t,e,n,r){var s=e.current,i=ht(),o=ar(s);return n=D0(n),e.context===null?e.context=n:e.pendingContext=n,e=_n(i,o),e.payload={element:t},r=r===void 0?null:r,r!==null&&(e.callback=r),t=ir(s,e,o),t!==null&&(qt(t,s,o,i),Va(t,s,o)),o}function Tl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Gm(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Gd(t,e){Gm(t,e),(t=t.alternate)&&Gm(t,e)}function oT(){return null}var M0=typeof reportError=="function"?reportError:function(t){console.error(t)};function Kd(t){this._internalRoot=t}su.prototype.render=Kd.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(F(409));ru(t,e,null,null)};su.prototype.unmount=Kd.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Qr(function(){ru(null,t,null,null)}),e[In]=null}};function su(t){this._internalRoot=t}su.prototype.unstable_scheduleHydration=function(t){if(t){var e=d_();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Wn.length&&e!==0&&e<Wn[n].priority;n++);Wn.splice(n,0,t),n===0&&p_(t)}};function Qd(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function iu(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Km(){}function aT(t,e,n,r,s){if(s){if(typeof r=="function"){var i=r;r=function(){var h=Tl(o);i.call(h)}}var o=V0(e,r,t,0,null,!1,!1,"",Km);return t._reactRootContainer=o,t[In]=o.current,co(t.nodeType===8?t.parentNode:t),Qr(),o}for(;s=t.lastChild;)t.removeChild(s);if(typeof r=="function"){var l=r;r=function(){var h=Tl(u);l.call(h)}}var u=Wd(t,0,!1,null,null,!1,!1,"",Km);return t._reactRootContainer=u,t[In]=u.current,co(t.nodeType===8?t.parentNode:t),Qr(function(){ru(e,u,n,r)}),u}function ou(t,e,n,r,s){var i=n._reactRootContainer;if(i){var o=i;if(typeof s=="function"){var l=s;s=function(){var u=Tl(o);l.call(u)}}ru(e,o,t,s)}else o=aT(n,e,t,s,r);return Tl(o)}c_=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Mi(e.pendingLanes);n!==0&&(pd(e,n|1),Et(e,Re()),!(ce&6)&&($s=Re()+500,kr()))}break;case 13:Qr(function(){var r=Sn(t,1);if(r!==null){var s=ht();qt(r,t,1,s)}}),Gd(t,1)}};md=function(t){if(t.tag===13){var e=Sn(t,134217728);if(e!==null){var n=ht();qt(e,t,134217728,n)}Gd(t,134217728)}};h_=function(t){if(t.tag===13){var e=ar(t),n=Sn(t,e);if(n!==null){var r=ht();qt(n,t,e,r)}Gd(t,e)}};d_=function(){return fe};f_=function(t,e){var n=fe;try{return fe=t,e()}finally{fe=n}};Kc=function(t,e,n){switch(e){case"input":if(zc(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var r=n[e];if(r!==t&&r.form===t.form){var s=Xl(r);if(!s)throw Error(F(90));Hy(r),zc(r,s)}}}break;case"textarea":Wy(t,n);break;case"select":e=n.value,e!=null&&ks(t,!!n.multiple,e,!1)}};Zy=Bd;e_=Qr;var lT={usingClientEntryPoint:!1,Events:[No,_s,Xl,Yy,Jy,Bd]},Ni={findFiberByHostInstance:Lr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},uT={bundleType:Ni.bundleType,version:Ni.version,rendererPackageName:Ni.rendererPackageName,rendererConfig:Ni.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Dn.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=r_(t),t===null?null:t.stateNode},findFiberByHostInstance:Ni.findFiberByHostInstance||oT,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Ea=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Ea.isDisabled&&Ea.supportsFiber)try{Wl=Ea.inject(uT),Zt=Ea}catch{}}Ct.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=lT;Ct.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Qd(e))throw Error(F(200));return iT(t,e,null,n)};Ct.createRoot=function(t,e){if(!Qd(t))throw Error(F(299));var n=!1,r="",s=M0;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(r=e.identifierPrefix),e.onRecoverableError!==void 0&&(s=e.onRecoverableError)),e=Wd(t,1,!1,null,null,n,!1,r,s),t[In]=e.current,co(t.nodeType===8?t.parentNode:t),new Kd(e)};Ct.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(F(188)):(t=Object.keys(t).join(","),Error(F(268,t)));return t=r_(e),t=t===null?null:t.stateNode,t};Ct.flushSync=function(t){return Qr(t)};Ct.hydrate=function(t,e,n){if(!iu(e))throw Error(F(200));return ou(null,t,e,!0,n)};Ct.hydrateRoot=function(t,e,n){if(!Qd(t))throw Error(F(405));var r=n!=null&&n.hydratedSources||null,s=!1,i="",o=M0;if(n!=null&&(n.unstable_strictMode===!0&&(s=!0),n.identifierPrefix!==void 0&&(i=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=V0(e,null,t,1,n??null,s,!1,i,o),t[In]=e.current,co(t),r)for(t=0;t<r.length;t++)n=r[t],s=n._getVersion,s=s(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,s]:e.mutableSourceEagerHydrationData.push(n,s);return new su(e)};Ct.render=function(t,e,n){if(!iu(e))throw Error(F(200));return ou(null,t,e,!1,n)};Ct.unmountComponentAtNode=function(t){if(!iu(t))throw Error(F(40));return t._reactRootContainer?(Qr(function(){ou(null,null,t,!1,function(){t._reactRootContainer=null,t[In]=null})}),!0):!1};Ct.unstable_batchedUpdates=Bd;Ct.unstable_renderSubtreeIntoContainer=function(t,e,n,r){if(!iu(n))throw Error(F(200));if(t==null||t._reactInternals===void 0)throw Error(F(38));return ou(t,e,n,!1,r)};Ct.version="18.3.1-next-f1338f8080-20240426";function O0(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(O0)}catch(t){console.error(t)}}O0(),Oy.exports=Ct;var cT=Oy.exports,Qm=cT;Vc.createRoot=Qm.createRoot,Vc.hydrateRoot=Qm.hydrateRoot;/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var hT={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dT=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase().trim(),ie=(t,e)=>{const n=H.forwardRef(({color:r="currentColor",size:s=24,strokeWidth:i=2,absoluteStrokeWidth:o,className:l="",children:u,...h},p)=>H.createElement("svg",{ref:p,...hT,width:s,height:s,stroke:r,strokeWidth:o?Number(i)*24/Number(s):i,className:["lucide",`lucide-${dT(t)}`,l].join(" "),...h},[...e.map(([m,g])=>H.createElement(m,g)),...Array.isArray(u)?u:[u]]));return n.displayName=`${t}`,n};/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xm=ie("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fT=ie("BarChart3",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pT=ie("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L0=ie("Brain",[["path",{d:"M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z",key:"1mhkh5"}],["path",{d:"M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z",key:"1d6s00"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mT=ie("CheckSquare",[["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}],["path",{d:"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",key:"1jnkn4"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xd=ie("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j0=ie("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gT=ie("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F0=ie("Cloud",[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yd=ie("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jd=ie("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zd=ie("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yT=ie("FileJson",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",key:"1oajmo"}],["path",{d:"M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",key:"mpwhp6"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _T=ie("HeartHandshake",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}],["path",{d:"M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66",key:"12sd6o"}],["path",{d:"m18 15-2-2",key:"60u0ii"}],["path",{d:"m15 18-2-2",key:"6p76be"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ah=ie("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U0=ie("History",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Il=ie("Loader2",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vT=ie("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wT=ie("LogIn",[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}],["polyline",{points:"10 17 15 12 10 7",key:"1ail0h"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ch=ie("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ET=ie("Maximize",[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3",key:"1dcmit"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3",key:"1e4gt3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3",key:"wsl5sc"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3",key:"18trek"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const za=ie("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xT=ie("Minimize",[["path",{d:"M8 3v3a2 2 0 0 1-2 2H3",key:"hohbtr"}],["path",{d:"M21 8h-3a2 2 0 0 1-2-2V3",key:"5jw1f3"}],["path",{d:"M3 16h3a2 2 0 0 1 2 2v3",key:"198tvr"}],["path",{d:"M16 21v-3a2 2 0 0 1 2-2h3",key:"ph8mxp"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const TT=ie("PenLine",[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z",key:"ymcmye"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const IT=ie("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ST=ie("QrCode",[["rect",{width:"5",height:"5",x:"3",y:"3",rx:"1",key:"1tu5fj"}],["rect",{width:"5",height:"5",x:"16",y:"3",rx:"1",key:"1v8r4q"}],["rect",{width:"5",height:"5",x:"3",y:"16",rx:"1",key:"1x03jg"}],["path",{d:"M21 16h-3a2 2 0 0 0-2 2v3",key:"177gqh"}],["path",{d:"M21 21v.01",key:"ents32"}],["path",{d:"M12 7v3a2 2 0 0 1-2 2H7",key:"8crl2c"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M12 3h.01",key:"n36tog"}],["path",{d:"M12 16v.01",key:"133mhm"}],["path",{d:"M16 12h1",key:"1slzba"}],["path",{d:"M21 12v.01",key:"1lwtk9"}],["path",{d:"M12 21v-1",key:"1880an"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kT=ie("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ym=ie("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const AT=ie("Save",[["path",{d:"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z",key:"1owoqh"}],["polyline",{points:"17 21 17 13 7 13 7 21",key:"1md35c"}],["polyline",{points:"7 3 7 8 15 8",key:"8nz8an"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bh=ie("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z0=ie("Smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const CT=ie("ThermometerSun",[["path",{d:"M12 9a4 4 0 0 0-2 7.5",key:"1jvsq6"}],["path",{d:"M12 3v2",key:"1w22ol"}],["path",{d:"m6.6 18.4-1.4 1.4",key:"w2yidj"}],["path",{d:"M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z",key:"iof6y5"}],["path",{d:"M4 13H2",key:"118le4"}],["path",{d:"M6.34 7.34 4.93 5.93",key:"1brd51"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sl=ie("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B0=ie("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ti=ie("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bT=ie("ZoomIn",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"11",x2:"11",y1:"8",y2:"14",key:"1vmskp"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]);/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const RT=ie("ZoomOut",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]),PT=()=>{};var Jm={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $0=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let s=t.charCodeAt(r);s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):(s&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},NT=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const s=t[n++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=t[n++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=t[n++],o=t[n++],l=t[n++],u=((s&7)<<18|(i&63)<<12|(o&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const i=t[n++],o=t[n++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},H0={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<t.length;s+=3){const i=t[s],o=s+1<t.length,l=o?t[s+1]:0,u=s+2<t.length,h=u?t[s+2]:0,p=i>>2,m=(i&3)<<4|l>>4;let g=(l&15)<<2|h>>6,A=h&63;u||(A=64,o||(g=64)),r.push(n[p],n[m],n[g],n[A])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray($0(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):NT(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<t.length;){const i=n[t.charAt(s++)],l=s<t.length?n[t.charAt(s)]:0;++s;const h=s<t.length?n[t.charAt(s)]:64;++s;const m=s<t.length?n[t.charAt(s)]:64;if(++s,i==null||l==null||h==null||m==null)throw new DT;const g=i<<2|l>>4;if(r.push(g),h!==64){const A=l<<4&240|h>>2;if(r.push(A),m!==64){const b=h<<6&192|m;r.push(b)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class DT extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const VT=function(t){const e=$0(t);return H0.encodeByteArray(e,!0)},kl=function(t){return VT(t).replace(/\./g,"")},q0=function(t){try{return H0.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function MT(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OT=()=>MT().__FIREBASE_DEFAULTS__,LT=()=>{if(typeof process>"u"||typeof Jm>"u")return;const t=Jm.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},jT=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&q0(t[1]);return e&&JSON.parse(e)},au=()=>{try{return PT()||OT()||LT()||jT()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},W0=t=>{var e,n;return(n=(e=au())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},FT=t=>{const e=W0(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},G0=()=>{var t;return(t=au())==null?void 0:t.config},K0=t=>{var e;return(e=au())==null?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UT{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ni(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Q0(t){return(await fetch(t,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zT(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",s=t.iat||0,i=t.sub||t.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...t};return[kl(JSON.stringify(n)),kl(JSON.stringify(o)),""].join(".")}const Xi={};function BT(){const t={prod:[],emulator:[]};for(const e of Object.keys(Xi))Xi[e]?t.emulator.push(e):t.prod.push(e);return t}function $T(t){let e=document.getElementById(t),n=!1;return e||(e=document.createElement("div"),e.setAttribute("id",t),n=!0),{created:n,element:e}}let Zm=!1;function X0(t,e){if(typeof window>"u"||typeof document>"u"||!ni(window.location.host)||Xi[t]===e||Xi[t]||Zm)return;Xi[t]=e;function n(g){return`__firebase__banner__${g}`}const r="__firebase__banner",i=BT().prod.length>0;function o(){const g=document.getElementById(r);g&&g.remove()}function l(g){g.style.display="flex",g.style.background="#7faaf0",g.style.position="fixed",g.style.bottom="5px",g.style.left="5px",g.style.padding=".5em",g.style.borderRadius="5px",g.style.alignItems="center"}function u(g,A){g.setAttribute("width","24"),g.setAttribute("id",A),g.setAttribute("height","24"),g.setAttribute("viewBox","0 0 24 24"),g.setAttribute("fill","none"),g.style.marginLeft="-6px"}function h(){const g=document.createElement("span");return g.style.cursor="pointer",g.style.marginLeft="16px",g.style.fontSize="24px",g.innerHTML=" &times;",g.onclick=()=>{Zm=!0,o()},g}function p(g,A){g.setAttribute("id",A),g.innerText="Learn more",g.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",g.setAttribute("target","__blank"),g.style.paddingLeft="5px",g.style.textDecoration="underline"}function m(){const g=$T(r),A=n("text"),b=document.getElementById(A)||document.createElement("span"),R=n("learnmore"),V=document.getElementById(R)||document.createElement("a"),I=n("preprendIcon"),_=document.getElementById(I)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(g.created){const k=g.element;l(k),p(V,R);const D=h();u(_,I),k.append(_,b,V,D),document.body.appendChild(k)}i?(b.innerText="Preview backend disconnected.",_.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(_.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,b.innerText="Preview backend running in this workspace."),b.setAttribute("id",A)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",m):m()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ot(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function HT(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ot())}function qT(){var e;const t=(e=au())==null?void 0:e.forceEnvironment;if(t==="node")return!0;if(t==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function WT(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function GT(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function KT(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function QT(){const t=ot();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function XT(){return!qT()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function YT(){try{return typeof indexedDB=="object"}catch{return!1}}function JT(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var i;e(((i=s.error)==null?void 0:i.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZT="FirebaseError";class Vn extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=ZT,Object.setPrototypeOf(this,Vn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Vo.prototype.create)}}class Vo{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?eI(i,r):"Error",l=`${this.serviceName}: ${o} (${s}).`;return new Vn(s,l,r)}}function eI(t,e){return t.replace(tI,(n,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const tI=/\{\$([^}]+)}/g;function nI(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function yr(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const s of n){if(!r.includes(s))return!1;const i=t[s],o=e[s];if(eg(i)&&eg(o)){if(!yr(i,o))return!1}else if(i!==o)return!1}for(const s of r)if(!n.includes(s))return!1;return!0}function eg(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mo(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function rI(t,e){const n=new sI(t,e);return n.subscribe.bind(n)}class sI{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let s;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");iI(e,["next","error","complete"])?s=e:s={next:e,error:n,complete:r},s.next===void 0&&(s.next=xc),s.error===void 0&&(s.error=xc),s.complete===void 0&&(s.complete=xc);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function iI(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function xc(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function at(t){return t&&t._delegate?t._delegate:t}class Xr{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Or="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oI{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new UT;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(lI(e))try{this.getOrInitializeService({instanceIdentifier:Or})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=Or){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Or){return this.instances.has(e)}getOptions(e=Or){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[i,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);r===l&&o.resolve(s)}return s}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);const i=this.instances.get(r);return i&&e(i,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const s of r)try{s(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:aI(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Or){return this.component?this.component.multipleInstances?e:Or:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function aI(t){return t===Or?void 0:t}function lI(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uI{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new oI(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var oe;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(oe||(oe={}));const cI={debug:oe.DEBUG,verbose:oe.VERBOSE,info:oe.INFO,warn:oe.WARN,error:oe.ERROR,silent:oe.SILENT},hI=oe.INFO,dI={[oe.DEBUG]:"log",[oe.VERBOSE]:"log",[oe.INFO]:"info",[oe.WARN]:"warn",[oe.ERROR]:"error"},fI=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),s=dI[e];if(s)console[s](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ef{constructor(e){this.name=e,this._logLevel=hI,this._logHandler=fI,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in oe))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?cI[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,oe.DEBUG,...e),this._logHandler(this,oe.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,oe.VERBOSE,...e),this._logHandler(this,oe.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,oe.INFO,...e),this._logHandler(this,oe.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,oe.WARN,...e),this._logHandler(this,oe.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,oe.ERROR,...e),this._logHandler(this,oe.ERROR,...e)}}const pI=(t,e)=>e.some(n=>t instanceof n);let tg,ng;function mI(){return tg||(tg=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function gI(){return ng||(ng=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Y0=new WeakMap,Rh=new WeakMap,J0=new WeakMap,Tc=new WeakMap,tf=new WeakMap;function yI(t){const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("success",i),t.removeEventListener("error",o)},i=()=>{n(ur(t.result)),s()},o=()=>{r(t.error),s()};t.addEventListener("success",i),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&Y0.set(n,t)}).catch(()=>{}),tf.set(e,t),e}function _I(t){if(Rh.has(t))return;const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",o),t.removeEventListener("abort",o)},i=()=>{n(),s()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),s()};t.addEventListener("complete",i),t.addEventListener("error",o),t.addEventListener("abort",o)});Rh.set(t,e)}let Ph={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Rh.get(t);if(e==="objectStoreNames")return t.objectStoreNames||J0.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ur(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function vI(t){Ph=t(Ph)}function wI(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Ic(this),e,...n);return J0.set(r,e.sort?e.sort():[e]),ur(r)}:gI().includes(t)?function(...e){return t.apply(Ic(this),e),ur(Y0.get(this))}:function(...e){return ur(t.apply(Ic(this),e))}}function EI(t){return typeof t=="function"?wI(t):(t instanceof IDBTransaction&&_I(t),pI(t,mI())?new Proxy(t,Ph):t)}function ur(t){if(t instanceof IDBRequest)return yI(t);if(Tc.has(t))return Tc.get(t);const e=EI(t);return e!==t&&(Tc.set(t,e),tf.set(e,t)),e}const Ic=t=>tf.get(t);function xI(t,e,{blocked:n,upgrade:r,blocking:s,terminated:i}={}){const o=indexedDB.open(t,e),l=ur(o);return r&&o.addEventListener("upgradeneeded",u=>{r(ur(o.result),u.oldVersion,u.newVersion,ur(o.transaction),u)}),n&&o.addEventListener("blocked",u=>n(u.oldVersion,u.newVersion,u)),l.then(u=>{i&&u.addEventListener("close",()=>i()),s&&u.addEventListener("versionchange",h=>s(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const TI=["get","getKey","getAll","getAllKeys","count"],II=["put","add","delete","clear"],Sc=new Map;function rg(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Sc.get(e))return Sc.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,s=II.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(s||TI.includes(n)))return;const i=async function(o,...l){const u=this.transaction(o,s?"readwrite":"readonly");let h=u.store;return r&&(h=h.index(l.shift())),(await Promise.all([h[n](...l),s&&u.done]))[0]};return Sc.set(e,i),i}vI(t=>({...t,get:(e,n,r)=>rg(e,n)||t.get(e,n,r),has:(e,n)=>!!rg(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SI{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(kI(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function kI(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Nh="@firebase/app",sg="0.14.6";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const An=new ef("@firebase/app"),AI="@firebase/app-compat",CI="@firebase/analytics-compat",bI="@firebase/analytics",RI="@firebase/app-check-compat",PI="@firebase/app-check",NI="@firebase/auth",DI="@firebase/auth-compat",VI="@firebase/database",MI="@firebase/data-connect",OI="@firebase/database-compat",LI="@firebase/functions",jI="@firebase/functions-compat",FI="@firebase/installations",UI="@firebase/installations-compat",zI="@firebase/messaging",BI="@firebase/messaging-compat",$I="@firebase/performance",HI="@firebase/performance-compat",qI="@firebase/remote-config",WI="@firebase/remote-config-compat",GI="@firebase/storage",KI="@firebase/storage-compat",QI="@firebase/firestore",XI="@firebase/ai",YI="@firebase/firestore-compat",JI="firebase",ZI="12.6.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dh="[DEFAULT]",eS={[Nh]:"fire-core",[AI]:"fire-core-compat",[bI]:"fire-analytics",[CI]:"fire-analytics-compat",[PI]:"fire-app-check",[RI]:"fire-app-check-compat",[NI]:"fire-auth",[DI]:"fire-auth-compat",[VI]:"fire-rtdb",[MI]:"fire-data-connect",[OI]:"fire-rtdb-compat",[LI]:"fire-fn",[jI]:"fire-fn-compat",[FI]:"fire-iid",[UI]:"fire-iid-compat",[zI]:"fire-fcm",[BI]:"fire-fcm-compat",[$I]:"fire-perf",[HI]:"fire-perf-compat",[qI]:"fire-rc",[WI]:"fire-rc-compat",[GI]:"fire-gcs",[KI]:"fire-gcs-compat",[QI]:"fire-fst",[YI]:"fire-fst-compat",[XI]:"fire-vertex","fire-js":"fire-js",[JI]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wo=new Map,tS=new Map,Vh=new Map;function ig(t,e){try{t.container.addComponent(e)}catch(n){An.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Hs(t){const e=t.name;if(Vh.has(e))return An.debug(`There were multiple attempts to register component ${e}.`),!1;Vh.set(e,t);for(const n of wo.values())ig(n,t);for(const n of tS.values())ig(n,t);return!0}function nf(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Nt(t){return t==null?!1:t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nS={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},cr=new Vo("app","Firebase",nS);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rS{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Xr("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw cr.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ri=ZI;function Z0(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:Dh,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw cr.create("bad-app-name",{appName:String(s)});if(n||(n=G0()),!n)throw cr.create("no-options");const i=wo.get(s);if(i){if(yr(n,i.options)&&yr(r,i.config))return i;throw cr.create("duplicate-app",{appName:s})}const o=new uI(s);for(const u of Vh.values())o.addComponent(u);const l=new rS(n,r,o);return wo.set(s,l),l}function rf(t=Dh){const e=wo.get(t);if(!e&&t===Dh&&G0())return Z0();if(!e)throw cr.create("no-app",{appName:t});return e}function sS(){return Array.from(wo.values())}function hr(t,e,n){let r=eS[t]??t;n&&(r+=`-${n}`);const s=r.match(/\s|\//),i=e.match(/\s|\//);if(s||i){const o=[`Unable to register library "${r}" with version "${e}":`];s&&o.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),An.warn(o.join(" "));return}Hs(new Xr(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iS="firebase-heartbeat-database",oS=1,Eo="firebase-heartbeat-store";let kc=null;function ev(){return kc||(kc=xI(iS,oS,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Eo)}catch(n){console.warn(n)}}}}).catch(t=>{throw cr.create("idb-open",{originalErrorMessage:t.message})})),kc}async function aS(t){try{const n=(await ev()).transaction(Eo),r=await n.objectStore(Eo).get(tv(t));return await n.done,r}catch(e){if(e instanceof Vn)An.warn(e.message);else{const n=cr.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});An.warn(n.message)}}}async function og(t,e){try{const r=(await ev()).transaction(Eo,"readwrite");await r.objectStore(Eo).put(e,tv(t)),await r.done}catch(n){if(n instanceof Vn)An.warn(n.message);else{const r=cr.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});An.warn(r.message)}}}function tv(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lS=1024,uS=30;class cS{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new dS(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=ag();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>uS){const o=fS(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){An.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=ag(),{heartbeatsToSend:r,unsentEntries:s}=hS(this._heartbeatsCache.heartbeats),i=kl(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(n){return An.warn(n),""}}}function ag(){return new Date().toISOString().substring(0,10)}function hS(t,e=lS){const n=[];let r=t.slice();for(const s of t){const i=n.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),lg(n)>e){i.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),lg(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class dS{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return YT()?JT().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await aS(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return og(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return og(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function lg(t){return kl(JSON.stringify({version:2,heartbeats:t})).length}function fS(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pS(t){Hs(new Xr("platform-logger",e=>new SI(e),"PRIVATE")),Hs(new Xr("heartbeat",e=>new cS(e),"PRIVATE")),hr(Nh,sg,t),hr(Nh,sg,"esm2020"),hr("fire-js","")}pS("");var mS="firebase",gS="12.6.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */hr(mS,gS,"app");var ug=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var dr,nv;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(x,v){function E(){}E.prototype=v.prototype,x.F=v.prototype,x.prototype=new E,x.prototype.constructor=x,x.D=function(T,S,C){for(var w=Array(arguments.length-2),re=2;re<arguments.length;re++)w[re-2]=arguments[re];return v.prototype[S].apply(T,w)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,n),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(x,v,E){E||(E=0);const T=Array(16);if(typeof v=="string")for(var S=0;S<16;++S)T[S]=v.charCodeAt(E++)|v.charCodeAt(E++)<<8|v.charCodeAt(E++)<<16|v.charCodeAt(E++)<<24;else for(S=0;S<16;++S)T[S]=v[E++]|v[E++]<<8|v[E++]<<16|v[E++]<<24;v=x.g[0],E=x.g[1],S=x.g[2];let C=x.g[3],w;w=v+(C^E&(S^C))+T[0]+3614090360&4294967295,v=E+(w<<7&4294967295|w>>>25),w=C+(S^v&(E^S))+T[1]+3905402710&4294967295,C=v+(w<<12&4294967295|w>>>20),w=S+(E^C&(v^E))+T[2]+606105819&4294967295,S=C+(w<<17&4294967295|w>>>15),w=E+(v^S&(C^v))+T[3]+3250441966&4294967295,E=S+(w<<22&4294967295|w>>>10),w=v+(C^E&(S^C))+T[4]+4118548399&4294967295,v=E+(w<<7&4294967295|w>>>25),w=C+(S^v&(E^S))+T[5]+1200080426&4294967295,C=v+(w<<12&4294967295|w>>>20),w=S+(E^C&(v^E))+T[6]+2821735955&4294967295,S=C+(w<<17&4294967295|w>>>15),w=E+(v^S&(C^v))+T[7]+4249261313&4294967295,E=S+(w<<22&4294967295|w>>>10),w=v+(C^E&(S^C))+T[8]+1770035416&4294967295,v=E+(w<<7&4294967295|w>>>25),w=C+(S^v&(E^S))+T[9]+2336552879&4294967295,C=v+(w<<12&4294967295|w>>>20),w=S+(E^C&(v^E))+T[10]+4294925233&4294967295,S=C+(w<<17&4294967295|w>>>15),w=E+(v^S&(C^v))+T[11]+2304563134&4294967295,E=S+(w<<22&4294967295|w>>>10),w=v+(C^E&(S^C))+T[12]+1804603682&4294967295,v=E+(w<<7&4294967295|w>>>25),w=C+(S^v&(E^S))+T[13]+4254626195&4294967295,C=v+(w<<12&4294967295|w>>>20),w=S+(E^C&(v^E))+T[14]+2792965006&4294967295,S=C+(w<<17&4294967295|w>>>15),w=E+(v^S&(C^v))+T[15]+1236535329&4294967295,E=S+(w<<22&4294967295|w>>>10),w=v+(S^C&(E^S))+T[1]+4129170786&4294967295,v=E+(w<<5&4294967295|w>>>27),w=C+(E^S&(v^E))+T[6]+3225465664&4294967295,C=v+(w<<9&4294967295|w>>>23),w=S+(v^E&(C^v))+T[11]+643717713&4294967295,S=C+(w<<14&4294967295|w>>>18),w=E+(C^v&(S^C))+T[0]+3921069994&4294967295,E=S+(w<<20&4294967295|w>>>12),w=v+(S^C&(E^S))+T[5]+3593408605&4294967295,v=E+(w<<5&4294967295|w>>>27),w=C+(E^S&(v^E))+T[10]+38016083&4294967295,C=v+(w<<9&4294967295|w>>>23),w=S+(v^E&(C^v))+T[15]+3634488961&4294967295,S=C+(w<<14&4294967295|w>>>18),w=E+(C^v&(S^C))+T[4]+3889429448&4294967295,E=S+(w<<20&4294967295|w>>>12),w=v+(S^C&(E^S))+T[9]+568446438&4294967295,v=E+(w<<5&4294967295|w>>>27),w=C+(E^S&(v^E))+T[14]+3275163606&4294967295,C=v+(w<<9&4294967295|w>>>23),w=S+(v^E&(C^v))+T[3]+4107603335&4294967295,S=C+(w<<14&4294967295|w>>>18),w=E+(C^v&(S^C))+T[8]+1163531501&4294967295,E=S+(w<<20&4294967295|w>>>12),w=v+(S^C&(E^S))+T[13]+2850285829&4294967295,v=E+(w<<5&4294967295|w>>>27),w=C+(E^S&(v^E))+T[2]+4243563512&4294967295,C=v+(w<<9&4294967295|w>>>23),w=S+(v^E&(C^v))+T[7]+1735328473&4294967295,S=C+(w<<14&4294967295|w>>>18),w=E+(C^v&(S^C))+T[12]+2368359562&4294967295,E=S+(w<<20&4294967295|w>>>12),w=v+(E^S^C)+T[5]+4294588738&4294967295,v=E+(w<<4&4294967295|w>>>28),w=C+(v^E^S)+T[8]+2272392833&4294967295,C=v+(w<<11&4294967295|w>>>21),w=S+(C^v^E)+T[11]+1839030562&4294967295,S=C+(w<<16&4294967295|w>>>16),w=E+(S^C^v)+T[14]+4259657740&4294967295,E=S+(w<<23&4294967295|w>>>9),w=v+(E^S^C)+T[1]+2763975236&4294967295,v=E+(w<<4&4294967295|w>>>28),w=C+(v^E^S)+T[4]+1272893353&4294967295,C=v+(w<<11&4294967295|w>>>21),w=S+(C^v^E)+T[7]+4139469664&4294967295,S=C+(w<<16&4294967295|w>>>16),w=E+(S^C^v)+T[10]+3200236656&4294967295,E=S+(w<<23&4294967295|w>>>9),w=v+(E^S^C)+T[13]+681279174&4294967295,v=E+(w<<4&4294967295|w>>>28),w=C+(v^E^S)+T[0]+3936430074&4294967295,C=v+(w<<11&4294967295|w>>>21),w=S+(C^v^E)+T[3]+3572445317&4294967295,S=C+(w<<16&4294967295|w>>>16),w=E+(S^C^v)+T[6]+76029189&4294967295,E=S+(w<<23&4294967295|w>>>9),w=v+(E^S^C)+T[9]+3654602809&4294967295,v=E+(w<<4&4294967295|w>>>28),w=C+(v^E^S)+T[12]+3873151461&4294967295,C=v+(w<<11&4294967295|w>>>21),w=S+(C^v^E)+T[15]+530742520&4294967295,S=C+(w<<16&4294967295|w>>>16),w=E+(S^C^v)+T[2]+3299628645&4294967295,E=S+(w<<23&4294967295|w>>>9),w=v+(S^(E|~C))+T[0]+4096336452&4294967295,v=E+(w<<6&4294967295|w>>>26),w=C+(E^(v|~S))+T[7]+1126891415&4294967295,C=v+(w<<10&4294967295|w>>>22),w=S+(v^(C|~E))+T[14]+2878612391&4294967295,S=C+(w<<15&4294967295|w>>>17),w=E+(C^(S|~v))+T[5]+4237533241&4294967295,E=S+(w<<21&4294967295|w>>>11),w=v+(S^(E|~C))+T[12]+1700485571&4294967295,v=E+(w<<6&4294967295|w>>>26),w=C+(E^(v|~S))+T[3]+2399980690&4294967295,C=v+(w<<10&4294967295|w>>>22),w=S+(v^(C|~E))+T[10]+4293915773&4294967295,S=C+(w<<15&4294967295|w>>>17),w=E+(C^(S|~v))+T[1]+2240044497&4294967295,E=S+(w<<21&4294967295|w>>>11),w=v+(S^(E|~C))+T[8]+1873313359&4294967295,v=E+(w<<6&4294967295|w>>>26),w=C+(E^(v|~S))+T[15]+4264355552&4294967295,C=v+(w<<10&4294967295|w>>>22),w=S+(v^(C|~E))+T[6]+2734768916&4294967295,S=C+(w<<15&4294967295|w>>>17),w=E+(C^(S|~v))+T[13]+1309151649&4294967295,E=S+(w<<21&4294967295|w>>>11),w=v+(S^(E|~C))+T[4]+4149444226&4294967295,v=E+(w<<6&4294967295|w>>>26),w=C+(E^(v|~S))+T[11]+3174756917&4294967295,C=v+(w<<10&4294967295|w>>>22),w=S+(v^(C|~E))+T[2]+718787259&4294967295,S=C+(w<<15&4294967295|w>>>17),w=E+(C^(S|~v))+T[9]+3951481745&4294967295,x.g[0]=x.g[0]+v&4294967295,x.g[1]=x.g[1]+(S+(w<<21&4294967295|w>>>11))&4294967295,x.g[2]=x.g[2]+S&4294967295,x.g[3]=x.g[3]+C&4294967295}r.prototype.v=function(x,v){v===void 0&&(v=x.length);const E=v-this.blockSize,T=this.C;let S=this.h,C=0;for(;C<v;){if(S==0)for(;C<=E;)s(this,x,C),C+=this.blockSize;if(typeof x=="string"){for(;C<v;)if(T[S++]=x.charCodeAt(C++),S==this.blockSize){s(this,T),S=0;break}}else for(;C<v;)if(T[S++]=x[C++],S==this.blockSize){s(this,T),S=0;break}}this.h=S,this.o+=v},r.prototype.A=function(){var x=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);x[0]=128;for(var v=1;v<x.length-8;++v)x[v]=0;v=this.o*8;for(var E=x.length-8;E<x.length;++E)x[E]=v&255,v/=256;for(this.v(x),x=Array(16),v=0,E=0;E<4;++E)for(let T=0;T<32;T+=8)x[v++]=this.g[E]>>>T&255;return x};function i(x,v){var E=l;return Object.prototype.hasOwnProperty.call(E,x)?E[x]:E[x]=v(x)}function o(x,v){this.h=v;const E=[];let T=!0;for(let S=x.length-1;S>=0;S--){const C=x[S]|0;T&&C==v||(E[S]=C,T=!1)}this.g=E}var l={};function u(x){return-128<=x&&x<128?i(x,function(v){return new o([v|0],v<0?-1:0)}):new o([x|0],x<0?-1:0)}function h(x){if(isNaN(x)||!isFinite(x))return m;if(x<0)return V(h(-x));const v=[];let E=1;for(let T=0;x>=E;T++)v[T]=x/E|0,E*=4294967296;return new o(v,0)}function p(x,v){if(x.length==0)throw Error("number format error: empty string");if(v=v||10,v<2||36<v)throw Error("radix out of range: "+v);if(x.charAt(0)=="-")return V(p(x.substring(1),v));if(x.indexOf("-")>=0)throw Error('number format error: interior "-" character');const E=h(Math.pow(v,8));let T=m;for(let C=0;C<x.length;C+=8){var S=Math.min(8,x.length-C);const w=parseInt(x.substring(C,C+S),v);S<8?(S=h(Math.pow(v,S)),T=T.j(S).add(h(w))):(T=T.j(E),T=T.add(h(w)))}return T}var m=u(0),g=u(1),A=u(16777216);t=o.prototype,t.m=function(){if(R(this))return-V(this).m();let x=0,v=1;for(let E=0;E<this.g.length;E++){const T=this.i(E);x+=(T>=0?T:4294967296+T)*v,v*=4294967296}return x},t.toString=function(x){if(x=x||10,x<2||36<x)throw Error("radix out of range: "+x);if(b(this))return"0";if(R(this))return"-"+V(this).toString(x);const v=h(Math.pow(x,6));var E=this;let T="";for(;;){const S=D(E,v).g;E=I(E,S.j(v));let C=((E.g.length>0?E.g[0]:E.h)>>>0).toString(x);if(E=S,b(E))return C+T;for(;C.length<6;)C="0"+C;T=C+T}},t.i=function(x){return x<0?0:x<this.g.length?this.g[x]:this.h};function b(x){if(x.h!=0)return!1;for(let v=0;v<x.g.length;v++)if(x.g[v]!=0)return!1;return!0}function R(x){return x.h==-1}t.l=function(x){return x=I(this,x),R(x)?-1:b(x)?0:1};function V(x){const v=x.g.length,E=[];for(let T=0;T<v;T++)E[T]=~x.g[T];return new o(E,~x.h).add(g)}t.abs=function(){return R(this)?V(this):this},t.add=function(x){const v=Math.max(this.g.length,x.g.length),E=[];let T=0;for(let S=0;S<=v;S++){let C=T+(this.i(S)&65535)+(x.i(S)&65535),w=(C>>>16)+(this.i(S)>>>16)+(x.i(S)>>>16);T=w>>>16,C&=65535,w&=65535,E[S]=w<<16|C}return new o(E,E[E.length-1]&-2147483648?-1:0)};function I(x,v){return x.add(V(v))}t.j=function(x){if(b(this)||b(x))return m;if(R(this))return R(x)?V(this).j(V(x)):V(V(this).j(x));if(R(x))return V(this.j(V(x)));if(this.l(A)<0&&x.l(A)<0)return h(this.m()*x.m());const v=this.g.length+x.g.length,E=[];for(var T=0;T<2*v;T++)E[T]=0;for(T=0;T<this.g.length;T++)for(let S=0;S<x.g.length;S++){const C=this.i(T)>>>16,w=this.i(T)&65535,re=x.i(S)>>>16,X=x.i(S)&65535;E[2*T+2*S]+=w*X,_(E,2*T+2*S),E[2*T+2*S+1]+=C*X,_(E,2*T+2*S+1),E[2*T+2*S+1]+=w*re,_(E,2*T+2*S+1),E[2*T+2*S+2]+=C*re,_(E,2*T+2*S+2)}for(x=0;x<v;x++)E[x]=E[2*x+1]<<16|E[2*x];for(x=v;x<2*v;x++)E[x]=0;return new o(E,0)};function _(x,v){for(;(x[v]&65535)!=x[v];)x[v+1]+=x[v]>>>16,x[v]&=65535,v++}function k(x,v){this.g=x,this.h=v}function D(x,v){if(b(v))throw Error("division by zero");if(b(x))return new k(m,m);if(R(x))return v=D(V(x),v),new k(V(v.g),V(v.h));if(R(v))return v=D(x,V(v)),new k(V(v.g),v.h);if(x.g.length>30){if(R(x)||R(v))throw Error("slowDivide_ only works with positive integers.");for(var E=g,T=v;T.l(x)<=0;)E=j(E),T=j(T);var S=U(E,1),C=U(T,1);for(T=U(T,2),E=U(E,2);!b(T);){var w=C.add(T);w.l(x)<=0&&(S=S.add(E),C=w),T=U(T,1),E=U(E,1)}return v=I(x,S.j(v)),new k(S,v)}for(S=m;x.l(v)>=0;){for(E=Math.max(1,Math.floor(x.m()/v.m())),T=Math.ceil(Math.log(E)/Math.LN2),T=T<=48?1:Math.pow(2,T-48),C=h(E),w=C.j(v);R(w)||w.l(x)>0;)E-=T,C=h(E),w=C.j(v);b(C)&&(C=g),S=S.add(C),x=I(x,w)}return new k(S,x)}t.B=function(x){return D(this,x).h},t.and=function(x){const v=Math.max(this.g.length,x.g.length),E=[];for(let T=0;T<v;T++)E[T]=this.i(T)&x.i(T);return new o(E,this.h&x.h)},t.or=function(x){const v=Math.max(this.g.length,x.g.length),E=[];for(let T=0;T<v;T++)E[T]=this.i(T)|x.i(T);return new o(E,this.h|x.h)},t.xor=function(x){const v=Math.max(this.g.length,x.g.length),E=[];for(let T=0;T<v;T++)E[T]=this.i(T)^x.i(T);return new o(E,this.h^x.h)};function j(x){const v=x.g.length+1,E=[];for(let T=0;T<v;T++)E[T]=x.i(T)<<1|x.i(T-1)>>>31;return new o(E,x.h)}function U(x,v){const E=v>>5;v%=32;const T=x.g.length-E,S=[];for(let C=0;C<T;C++)S[C]=v>0?x.i(C+E)>>>v|x.i(C+E+1)<<32-v:x.i(C+E);return new o(S,x.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,nv=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=p,dr=o}).apply(typeof ug<"u"?ug:typeof self<"u"?self:typeof window<"u"?window:{});var xa=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var rv,Li,sv,Ba,Mh,iv,ov,av;(function(){var t,e=Object.defineProperty;function n(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof xa=="object"&&xa];for(var c=0;c<a.length;++c){var d=a[c];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var r=n(this);function s(a,c){if(c)e:{var d=r;a=a.split(".");for(var y=0;y<a.length-1;y++){var P=a[y];if(!(P in d))break e;d=d[P]}a=a[a.length-1],y=d[a],c=c(y),c!=y&&c!=null&&e(d,a,{configurable:!0,writable:!0,value:c})}}s("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(a){return a||function(c){var d=[],y;for(y in c)Object.prototype.hasOwnProperty.call(c,y)&&d.push([y,c[y]]);return d}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function l(a){var c=typeof a;return c=="object"&&a!=null||c=="function"}function u(a,c,d){return a.call.apply(a.bind,arguments)}function h(a,c,d){return h=u,h.apply(null,arguments)}function p(a,c){var d=Array.prototype.slice.call(arguments,1);return function(){var y=d.slice();return y.push.apply(y,arguments),a.apply(this,y)}}function m(a,c){function d(){}d.prototype=c.prototype,a.Z=c.prototype,a.prototype=new d,a.prototype.constructor=a,a.Ob=function(y,P,N){for(var B=Array(arguments.length-2),ne=2;ne<arguments.length;ne++)B[ne-2]=arguments[ne];return c.prototype[P].apply(y,B)}}var g=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function A(a){const c=a.length;if(c>0){const d=Array(c);for(let y=0;y<c;y++)d[y]=a[y];return d}return[]}function b(a,c){for(let y=1;y<arguments.length;y++){const P=arguments[y];var d=typeof P;if(d=d!="object"?d:P?Array.isArray(P)?"array":d:"null",d=="array"||d=="object"&&typeof P.length=="number"){d=a.length||0;const N=P.length||0;a.length=d+N;for(let B=0;B<N;B++)a[d+B]=P[B]}else a.push(P)}}class R{constructor(c,d){this.i=c,this.j=d,this.h=0,this.g=null}get(){let c;return this.h>0?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function V(a){o.setTimeout(()=>{throw a},0)}function I(){var a=x;let c=null;return a.g&&(c=a.g,a.g=a.g.next,a.g||(a.h=null),c.next=null),c}class _{constructor(){this.h=this.g=null}add(c,d){const y=k.get();y.set(c,d),this.h?this.h.next=y:this.g=y,this.h=y}}var k=new R(()=>new D,a=>a.reset());class D{constructor(){this.next=this.g=this.h=null}set(c,d){this.h=c,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let j,U=!1,x=new _,v=()=>{const a=Promise.resolve(void 0);j=()=>{a.then(E)}};function E(){for(var a;a=I();){try{a.h.call(a.g)}catch(d){V(d)}var c=k;c.j(a),c.h<100&&(c.h++,a.next=c.g,c.g=a)}U=!1}function T(){this.u=this.u,this.C=this.C}T.prototype.u=!1,T.prototype.dispose=function(){this.u||(this.u=!0,this.N())},T.prototype[Symbol.dispose]=function(){this.dispose()},T.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function S(a,c){this.type=a,this.g=this.target=c,this.defaultPrevented=!1}S.prototype.h=function(){this.defaultPrevented=!0};var C=function(){if(!o.addEventListener||!Object.defineProperty)return!1;var a=!1,c=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};o.addEventListener("test",d,c),o.removeEventListener("test",d,c)}catch{}return a}();function w(a){return/^[\s\xa0]*$/.test(a)}function re(a,c){S.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,c)}m(re,S),re.prototype.init=function(a,c){const d=this.type=a.type,y=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=c,c=a.relatedTarget,c||(d=="mouseover"?c=a.fromElement:d=="mouseout"&&(c=a.toElement)),this.relatedTarget=c,y?(this.clientX=y.clientX!==void 0?y.clientX:y.pageX,this.clientY=y.clientY!==void 0?y.clientY:y.pageY,this.screenX=y.screenX||0,this.screenY=y.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&re.Z.h.call(this)},re.prototype.h=function(){re.Z.h.call(this);const a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var X="closure_listenable_"+(Math.random()*1e6|0),ee=0;function de(a,c,d,y,P){this.listener=a,this.proxy=null,this.src=c,this.type=d,this.capture=!!y,this.ha=P,this.key=++ee,this.da=this.fa=!1}function z(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function G(a,c,d){for(const y in a)c.call(d,a[y],y,a)}function L(a,c){for(const d in a)c.call(void 0,a[d],d,a)}function te(a){const c={};for(const d in a)c[d]=a[d];return c}const pe="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function pt(a,c){let d,y;for(let P=1;P<arguments.length;P++){y=arguments[P];for(d in y)a[d]=y[d];for(let N=0;N<pe.length;N++)d=pe[N],Object.prototype.hasOwnProperty.call(y,d)&&(a[d]=y[d])}}function Pe(a){this.src=a,this.g={},this.h=0}Pe.prototype.add=function(a,c,d,y,P){const N=a.toString();a=this.g[N],a||(a=this.g[N]=[],this.h++);const B=jt(a,c,y,P);return B>-1?(c=a[B],d||(c.fa=!1)):(c=new de(c,this.src,N,!!y,P),c.fa=d,a.push(c)),c};function hn(a,c){const d=c.type;if(d in a.g){var y=a.g[d],P=Array.prototype.indexOf.call(y,c,void 0),N;(N=P>=0)&&Array.prototype.splice.call(y,P,1),N&&(z(c),a.g[d].length==0&&(delete a.g[d],a.h--))}}function jt(a,c,d,y){for(let P=0;P<a.length;++P){const N=a[P];if(!N.da&&N.listener==c&&N.capture==!!d&&N.ha==y)return P}return-1}var Mn="closure_lm_"+(Math.random()*1e6|0),bu={};function $f(a,c,d,y,P){if(Array.isArray(c)){for(let N=0;N<c.length;N++)$f(a,c[N],d,y,P);return null}return d=Wf(d),a&&a[X]?a.J(c,d,l(y)?!!y.capture:!1,P):l1(a,c,d,!1,y,P)}function l1(a,c,d,y,P,N){if(!c)throw Error("Invalid event type");const B=l(P)?!!P.capture:!!P;let ne=Pu(a);if(ne||(a[Mn]=ne=new Pe(a)),d=ne.add(c,d,y,B,N),d.proxy)return d;if(y=u1(),d.proxy=y,y.src=a,y.listener=d,a.addEventListener)C||(P=B),P===void 0&&(P=!1),a.addEventListener(c.toString(),y,P);else if(a.attachEvent)a.attachEvent(qf(c.toString()),y);else if(a.addListener&&a.removeListener)a.addListener(y);else throw Error("addEventListener and attachEvent are unavailable.");return d}function u1(){function a(d){return c.call(a.src,a.listener,d)}const c=c1;return a}function Hf(a,c,d,y,P){if(Array.isArray(c))for(var N=0;N<c.length;N++)Hf(a,c[N],d,y,P);else y=l(y)?!!y.capture:!!y,d=Wf(d),a&&a[X]?(a=a.i,N=String(c).toString(),N in a.g&&(c=a.g[N],d=jt(c,d,y,P),d>-1&&(z(c[d]),Array.prototype.splice.call(c,d,1),c.length==0&&(delete a.g[N],a.h--)))):a&&(a=Pu(a))&&(c=a.g[c.toString()],a=-1,c&&(a=jt(c,d,y,P)),(d=a>-1?c[a]:null)&&Ru(d))}function Ru(a){if(typeof a!="number"&&a&&!a.da){var c=a.src;if(c&&c[X])hn(c.i,a);else{var d=a.type,y=a.proxy;c.removeEventListener?c.removeEventListener(d,y,a.capture):c.detachEvent?c.detachEvent(qf(d),y):c.addListener&&c.removeListener&&c.removeListener(y),(d=Pu(c))?(hn(d,a),d.h==0&&(d.src=null,c[Mn]=null)):z(a)}}}function qf(a){return a in bu?bu[a]:bu[a]="on"+a}function c1(a,c){if(a.da)a=!0;else{c=new re(c,this);const d=a.listener,y=a.ha||a.src;a.fa&&Ru(a),a=d.call(y,c)}return a}function Pu(a){return a=a[Mn],a instanceof Pe?a:null}var Nu="__closure_events_fn_"+(Math.random()*1e9>>>0);function Wf(a){return typeof a=="function"?a:(a[Nu]||(a[Nu]=function(c){return a.handleEvent(c)}),a[Nu])}function Je(){T.call(this),this.i=new Pe(this),this.M=this,this.G=null}m(Je,T),Je.prototype[X]=!0,Je.prototype.removeEventListener=function(a,c,d,y){Hf(this,a,c,d,y)};function lt(a,c){var d,y=a.G;if(y)for(d=[];y;y=y.G)d.push(y);if(a=a.M,y=c.type||c,typeof c=="string")c=new S(c,a);else if(c instanceof S)c.target=c.target||a;else{var P=c;c=new S(y,a),pt(c,P)}P=!0;let N,B;if(d)for(B=d.length-1;B>=0;B--)N=c.g=d[B],P=Go(N,y,!0,c)&&P;if(N=c.g=a,P=Go(N,y,!0,c)&&P,P=Go(N,y,!1,c)&&P,d)for(B=0;B<d.length;B++)N=c.g=d[B],P=Go(N,y,!1,c)&&P}Je.prototype.N=function(){if(Je.Z.N.call(this),this.i){var a=this.i;for(const c in a.g){const d=a.g[c];for(let y=0;y<d.length;y++)z(d[y]);delete a.g[c],a.h--}}this.G=null},Je.prototype.J=function(a,c,d,y){return this.i.add(String(a),c,!1,d,y)},Je.prototype.K=function(a,c,d,y){return this.i.add(String(a),c,!0,d,y)};function Go(a,c,d,y){if(c=a.i.g[String(c)],!c)return!0;c=c.concat();let P=!0;for(let N=0;N<c.length;++N){const B=c[N];if(B&&!B.da&&B.capture==d){const ne=B.listener,Le=B.ha||B.src;B.fa&&hn(a.i,B),P=ne.call(Le,y)!==!1&&P}}return P&&!y.defaultPrevented}function h1(a,c){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=h(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(c)>2147483647?-1:o.setTimeout(a,c||0)}function Gf(a){a.g=h1(()=>{a.g=null,a.i&&(a.i=!1,Gf(a))},a.l);const c=a.h;a.h=null,a.m.apply(null,c)}class d1 extends T{constructor(c,d){super(),this.m=c,this.l=d,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:Gf(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ui(a){T.call(this),this.h=a,this.g={}}m(ui,T);var Kf=[];function Qf(a){G(a.g,function(c,d){this.g.hasOwnProperty(d)&&Ru(c)},a),a.g={}}ui.prototype.N=function(){ui.Z.N.call(this),Qf(this)},ui.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Du=o.JSON.stringify,f1=o.JSON.parse,p1=class{stringify(a){return o.JSON.stringify(a,void 0)}parse(a){return o.JSON.parse(a,void 0)}};function Xf(){}function Yf(){}var ci={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Vu(){S.call(this,"d")}m(Vu,S);function Mu(){S.call(this,"c")}m(Mu,S);var br={},Jf=null;function Ko(){return Jf=Jf||new Je}br.Ia="serverreachability";function Zf(a){S.call(this,br.Ia,a)}m(Zf,S);function hi(a){const c=Ko();lt(c,new Zf(c))}br.STAT_EVENT="statevent";function ep(a,c){S.call(this,br.STAT_EVENT,a),this.stat=c}m(ep,S);function ut(a){const c=Ko();lt(c,new ep(c,a))}br.Ja="timingevent";function tp(a,c){S.call(this,br.Ja,a),this.size=c}m(tp,S);function di(a,c){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){a()},c)}function fi(){this.g=!0}fi.prototype.ua=function(){this.g=!1};function m1(a,c,d,y,P,N){a.info(function(){if(a.g)if(N){var B="",ne=N.split("&");for(let me=0;me<ne.length;me++){var Le=ne[me].split("=");if(Le.length>1){const Be=Le[0];Le=Le[1];const Kt=Be.split("_");B=Kt.length>=2&&Kt[1]=="type"?B+(Be+"="+Le+"&"):B+(Be+"=redacted&")}}}else B=null;else B=N;return"XMLHTTP REQ ("+y+") [attempt "+P+"]: "+c+`
`+d+`
`+B})}function g1(a,c,d,y,P,N,B){a.info(function(){return"XMLHTTP RESP ("+y+") [ attempt "+P+"]: "+c+`
`+d+`
`+N+" "+B})}function ss(a,c,d,y){a.info(function(){return"XMLHTTP TEXT ("+c+"): "+_1(a,d)+(y?" "+y:"")})}function y1(a,c){a.info(function(){return"TIMEOUT: "+c})}fi.prototype.info=function(){};function _1(a,c){if(!a.g)return c;if(!c)return null;try{const N=JSON.parse(c);if(N){for(a=0;a<N.length;a++)if(Array.isArray(N[a])){var d=N[a];if(!(d.length<2)){var y=d[1];if(Array.isArray(y)&&!(y.length<1)){var P=y[0];if(P!="noop"&&P!="stop"&&P!="close")for(let B=1;B<y.length;B++)y[B]=""}}}}return Du(N)}catch{return c}}var Qo={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},np={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},rp;function Ou(){}m(Ou,Xf),Ou.prototype.g=function(){return new XMLHttpRequest},rp=new Ou;function pi(a){return encodeURIComponent(String(a))}function v1(a){var c=1;a=a.split(":");const d=[];for(;c>0&&a.length;)d.push(a.shift()),c--;return a.length&&d.push(a.join(":")),d}function On(a,c,d,y){this.j=a,this.i=c,this.l=d,this.S=y||1,this.V=new ui(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new sp}function sp(){this.i=null,this.g="",this.h=!1}var ip={},Lu={};function ju(a,c,d){a.M=1,a.A=Yo(Gt(c)),a.u=d,a.R=!0,op(a,null)}function op(a,c){a.F=Date.now(),Xo(a),a.B=Gt(a.A);var d=a.B,y=a.S;Array.isArray(y)||(y=[String(y)]),vp(d.i,"t",y),a.C=0,d=a.j.L,a.h=new sp,a.g=Lp(a.j,d?c:null,!a.u),a.P>0&&(a.O=new d1(h(a.Y,a,a.g),a.P)),c=a.V,d=a.g,y=a.ba;var P="readystatechange";Array.isArray(P)||(P&&(Kf[0]=P.toString()),P=Kf);for(let N=0;N<P.length;N++){const B=$f(d,P[N],y||c.handleEvent,!1,c.h||c);if(!B)break;c.g[B.key]=B}c=a.J?te(a.J):{},a.u?(a.v||(a.v="POST"),c["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,c)):(a.v="GET",a.g.ea(a.B,a.v,null,c)),hi(),m1(a.i,a.v,a.B,a.l,a.S,a.u)}On.prototype.ba=function(a){a=a.target;const c=this.O;c&&Fn(a)==3?c.j():this.Y(a)},On.prototype.Y=function(a){try{if(a==this.g)e:{const ne=Fn(this.g),Le=this.g.ya(),me=this.g.ca();if(!(ne<3)&&(ne!=3||this.g&&(this.h.h||this.g.la()||kp(this.g)))){this.K||ne!=4||Le==7||(Le==8||me<=0?hi(3):hi(2)),Fu(this);var c=this.g.ca();this.X=c;var d=w1(this);if(this.o=c==200,g1(this.i,this.v,this.B,this.l,this.S,ne,c),this.o){if(this.U&&!this.L){t:{if(this.g){var y,P=this.g;if((y=P.g?P.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!w(y)){var N=y;break t}}N=null}if(a=N)ss(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Uu(this,a);else{this.o=!1,this.m=3,ut(12),Rr(this),mi(this);break e}}if(this.R){a=!0;let Be;for(;!this.K&&this.C<d.length;)if(Be=E1(this,d),Be==Lu){ne==4&&(this.m=4,ut(14),a=!1),ss(this.i,this.l,null,"[Incomplete Response]");break}else if(Be==ip){this.m=4,ut(15),ss(this.i,this.l,d,"[Invalid Chunk]"),a=!1;break}else ss(this.i,this.l,Be,null),Uu(this,Be);if(ap(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ne!=4||d.length!=0||this.h.h||(this.m=1,ut(16),a=!1),this.o=this.o&&a,!a)ss(this.i,this.l,d,"[Invalid Chunked Response]"),Rr(this),mi(this);else if(d.length>0&&!this.W){this.W=!0;var B=this.j;B.g==this&&B.aa&&!B.P&&(B.j.info("Great, no buffering proxy detected. Bytes received: "+d.length),Ku(B),B.P=!0,ut(11))}}else ss(this.i,this.l,d,null),Uu(this,d);ne==4&&Rr(this),this.o&&!this.K&&(ne==4?Dp(this.j,this):(this.o=!1,Xo(this)))}else M1(this.g),c==400&&d.indexOf("Unknown SID")>0?(this.m=3,ut(12)):(this.m=0,ut(13)),Rr(this),mi(this)}}}catch{}finally{}};function w1(a){if(!ap(a))return a.g.la();const c=kp(a.g);if(c==="")return"";let d="";const y=c.length,P=Fn(a.g)==4;if(!a.h.i){if(typeof TextDecoder>"u")return Rr(a),mi(a),"";a.h.i=new o.TextDecoder}for(let N=0;N<y;N++)a.h.h=!0,d+=a.h.i.decode(c[N],{stream:!(P&&N==y-1)});return c.length=0,a.h.g+=d,a.C=0,a.h.g}function ap(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function E1(a,c){var d=a.C,y=c.indexOf(`
`,d);return y==-1?Lu:(d=Number(c.substring(d,y)),isNaN(d)?ip:(y+=1,y+d>c.length?Lu:(c=c.slice(y,y+d),a.C=y+d,c)))}On.prototype.cancel=function(){this.K=!0,Rr(this)};function Xo(a){a.T=Date.now()+a.H,lp(a,a.H)}function lp(a,c){if(a.D!=null)throw Error("WatchDog timer not null");a.D=di(h(a.aa,a),c)}function Fu(a){a.D&&(o.clearTimeout(a.D),a.D=null)}On.prototype.aa=function(){this.D=null;const a=Date.now();a-this.T>=0?(y1(this.i,this.B),this.M!=2&&(hi(),ut(17)),Rr(this),this.m=2,mi(this)):lp(this,this.T-a)};function mi(a){a.j.I==0||a.K||Dp(a.j,a)}function Rr(a){Fu(a);var c=a.O;c&&typeof c.dispose=="function"&&c.dispose(),a.O=null,Qf(a.V),a.g&&(c=a.g,a.g=null,c.abort(),c.dispose())}function Uu(a,c){try{var d=a.j;if(d.I!=0&&(d.g==a||zu(d.h,a))){if(!a.L&&zu(d.h,a)&&d.I==3){try{var y=d.Ba.g.parse(c)}catch{y=null}if(Array.isArray(y)&&y.length==3){var P=y;if(P[0]==0){e:if(!d.v){if(d.g)if(d.g.F+3e3<a.F)na(d),ea(d);else break e;Gu(d),ut(18)}}else d.xa=P[1],0<d.xa-d.K&&P[2]<37500&&d.F&&d.A==0&&!d.C&&(d.C=di(h(d.Va,d),6e3));hp(d.h)<=1&&d.ta&&(d.ta=void 0)}else Nr(d,11)}else if((a.L||d.g==a)&&na(d),!w(c))for(P=d.Ba.g.parse(c),c=0;c<P.length;c++){let me=P[c];const Be=me[0];if(!(Be<=d.K))if(d.K=Be,me=me[1],d.I==2)if(me[0]=="c"){d.M=me[1],d.ba=me[2];const Kt=me[3];Kt!=null&&(d.ka=Kt,d.j.info("VER="+d.ka));const Dr=me[4];Dr!=null&&(d.za=Dr,d.j.info("SVER="+d.za));const Un=me[5];Un!=null&&typeof Un=="number"&&Un>0&&(y=1.5*Un,d.O=y,d.j.info("backChannelRequestTimeoutMs_="+y)),y=d;const zn=a.g;if(zn){const sa=zn.g?zn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(sa){var N=y.h;N.g||sa.indexOf("spdy")==-1&&sa.indexOf("quic")==-1&&sa.indexOf("h2")==-1||(N.j=N.l,N.g=new Set,N.h&&(Bu(N,N.h),N.h=null))}if(y.G){const Qu=zn.g?zn.g.getResponseHeader("X-HTTP-Session-Id"):null;Qu&&(y.wa=Qu,ye(y.J,y.G,Qu))}}d.I=3,d.l&&d.l.ra(),d.aa&&(d.T=Date.now()-a.F,d.j.info("Handshake RTT: "+d.T+"ms")),y=d;var B=a;if(y.na=Op(y,y.L?y.ba:null,y.W),B.L){dp(y.h,B);var ne=B,Le=y.O;Le&&(ne.H=Le),ne.D&&(Fu(ne),Xo(ne)),y.g=B}else Pp(y);d.i.length>0&&ta(d)}else me[0]!="stop"&&me[0]!="close"||Nr(d,7);else d.I==3&&(me[0]=="stop"||me[0]=="close"?me[0]=="stop"?Nr(d,7):Wu(d):me[0]!="noop"&&d.l&&d.l.qa(me),d.A=0)}}hi(4)}catch{}}var x1=class{constructor(a,c){this.g=a,this.map=c}};function up(a){this.l=a||10,o.PerformanceNavigationTiming?(a=o.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function cp(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function hp(a){return a.h?1:a.g?a.g.size:0}function zu(a,c){return a.h?a.h==c:a.g?a.g.has(c):!1}function Bu(a,c){a.g?a.g.add(c):a.h=c}function dp(a,c){a.h&&a.h==c?a.h=null:a.g&&a.g.has(c)&&a.g.delete(c)}up.prototype.cancel=function(){if(this.i=fp(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function fp(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let c=a.i;for(const d of a.g.values())c=c.concat(d.G);return c}return A(a.i)}var pp=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function T1(a,c){if(a){a=a.split("&");for(let d=0;d<a.length;d++){const y=a[d].indexOf("=");let P,N=null;y>=0?(P=a[d].substring(0,y),N=a[d].substring(y+1)):P=a[d],c(P,N?decodeURIComponent(N.replace(/\+/g," ")):"")}}}function Ln(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let c;a instanceof Ln?(this.l=a.l,gi(this,a.j),this.o=a.o,this.g=a.g,yi(this,a.u),this.h=a.h,$u(this,wp(a.i)),this.m=a.m):a&&(c=String(a).match(pp))?(this.l=!1,gi(this,c[1]||"",!0),this.o=_i(c[2]||""),this.g=_i(c[3]||"",!0),yi(this,c[4]),this.h=_i(c[5]||"",!0),$u(this,c[6]||"",!0),this.m=_i(c[7]||"")):(this.l=!1,this.i=new wi(null,this.l))}Ln.prototype.toString=function(){const a=[];var c=this.j;c&&a.push(vi(c,mp,!0),":");var d=this.g;return(d||c=="file")&&(a.push("//"),(c=this.o)&&a.push(vi(c,mp,!0),"@"),a.push(pi(d).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.u,d!=null&&a.push(":",String(d))),(d=this.h)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(vi(d,d.charAt(0)=="/"?k1:S1,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",vi(d,C1)),a.join("")},Ln.prototype.resolve=function(a){const c=Gt(this);let d=!!a.j;d?gi(c,a.j):d=!!a.o,d?c.o=a.o:d=!!a.g,d?c.g=a.g:d=a.u!=null;var y=a.h;if(d)yi(c,a.u);else if(d=!!a.h){if(y.charAt(0)!="/")if(this.g&&!this.h)y="/"+y;else{var P=c.h.lastIndexOf("/");P!=-1&&(y=c.h.slice(0,P+1)+y)}if(P=y,P==".."||P==".")y="";else if(P.indexOf("./")!=-1||P.indexOf("/.")!=-1){y=P.lastIndexOf("/",0)==0,P=P.split("/");const N=[];for(let B=0;B<P.length;){const ne=P[B++];ne=="."?y&&B==P.length&&N.push(""):ne==".."?((N.length>1||N.length==1&&N[0]!="")&&N.pop(),y&&B==P.length&&N.push("")):(N.push(ne),y=!0)}y=N.join("/")}else y=P}return d?c.h=y:d=a.i.toString()!=="",d?$u(c,wp(a.i)):d=!!a.m,d&&(c.m=a.m),c};function Gt(a){return new Ln(a)}function gi(a,c,d){a.j=d?_i(c,!0):c,a.j&&(a.j=a.j.replace(/:$/,""))}function yi(a,c){if(c){if(c=Number(c),isNaN(c)||c<0)throw Error("Bad port number "+c);a.u=c}else a.u=null}function $u(a,c,d){c instanceof wi?(a.i=c,b1(a.i,a.l)):(d||(c=vi(c,A1)),a.i=new wi(c,a.l))}function ye(a,c,d){a.i.set(c,d)}function Yo(a){return ye(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function _i(a,c){return a?c?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function vi(a,c,d){return typeof a=="string"?(a=encodeURI(a).replace(c,I1),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function I1(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var mp=/[#\/\?@]/g,S1=/[#\?:]/g,k1=/[#\?]/g,A1=/[#\?@]/g,C1=/#/g;function wi(a,c){this.h=this.g=null,this.i=a||null,this.j=!!c}function Pr(a){a.g||(a.g=new Map,a.h=0,a.i&&T1(a.i,function(c,d){a.add(decodeURIComponent(c.replace(/\+/g," ")),d)}))}t=wi.prototype,t.add=function(a,c){Pr(this),this.i=null,a=is(this,a);let d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(c),this.h+=1,this};function gp(a,c){Pr(a),c=is(a,c),a.g.has(c)&&(a.i=null,a.h-=a.g.get(c).length,a.g.delete(c))}function yp(a,c){return Pr(a),c=is(a,c),a.g.has(c)}t.forEach=function(a,c){Pr(this),this.g.forEach(function(d,y){d.forEach(function(P){a.call(c,P,y,this)},this)},this)};function _p(a,c){Pr(a);let d=[];if(typeof c=="string")yp(a,c)&&(d=d.concat(a.g.get(is(a,c))));else for(a=Array.from(a.g.values()),c=0;c<a.length;c++)d=d.concat(a[c]);return d}t.set=function(a,c){return Pr(this),this.i=null,a=is(this,a),yp(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[c]),this.h+=1,this},t.get=function(a,c){return a?(a=_p(this,a),a.length>0?String(a[0]):c):c};function vp(a,c,d){gp(a,c),d.length>0&&(a.i=null,a.g.set(is(a,c),A(d)),a.h+=d.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],c=Array.from(this.g.keys());for(let y=0;y<c.length;y++){var d=c[y];const P=pi(d);d=_p(this,d);for(let N=0;N<d.length;N++){let B=P;d[N]!==""&&(B+="="+pi(d[N])),a.push(B)}}return this.i=a.join("&")};function wp(a){const c=new wi;return c.i=a.i,a.g&&(c.g=new Map(a.g),c.h=a.h),c}function is(a,c){return c=String(c),a.j&&(c=c.toLowerCase()),c}function b1(a,c){c&&!a.j&&(Pr(a),a.i=null,a.g.forEach(function(d,y){const P=y.toLowerCase();y!=P&&(gp(this,y),vp(this,P,d))},a)),a.j=c}function R1(a,c){const d=new fi;if(o.Image){const y=new Image;y.onload=p(jn,d,"TestLoadImage: loaded",!0,c,y),y.onerror=p(jn,d,"TestLoadImage: error",!1,c,y),y.onabort=p(jn,d,"TestLoadImage: abort",!1,c,y),y.ontimeout=p(jn,d,"TestLoadImage: timeout",!1,c,y),o.setTimeout(function(){y.ontimeout&&y.ontimeout()},1e4),y.src=a}else c(!1)}function P1(a,c){const d=new fi,y=new AbortController,P=setTimeout(()=>{y.abort(),jn(d,"TestPingServer: timeout",!1,c)},1e4);fetch(a,{signal:y.signal}).then(N=>{clearTimeout(P),N.ok?jn(d,"TestPingServer: ok",!0,c):jn(d,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(P),jn(d,"TestPingServer: error",!1,c)})}function jn(a,c,d,y,P){try{P&&(P.onload=null,P.onerror=null,P.onabort=null,P.ontimeout=null),y(d)}catch{}}function N1(){this.g=new p1}function Hu(a){this.i=a.Sb||null,this.h=a.ab||!1}m(Hu,Xf),Hu.prototype.g=function(){return new Jo(this.i,this.h)};function Jo(a,c){Je.call(this),this.H=a,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}m(Jo,Je),t=Jo.prototype,t.open=function(a,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=c,this.readyState=1,xi(this)},t.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const c={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(c.body=a),(this.H||o).fetch(new Request(this.D,c)).then(this.Pa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Ei(this)),this.readyState=0},t.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,xi(this)),this.g&&(this.readyState=3,xi(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Ep(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function Ep(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}t.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var c=a.value?a.value:new Uint8Array(0);(c=this.B.decode(c,{stream:!a.done}))&&(this.response=this.responseText+=c)}a.done?Ei(this):xi(this),this.readyState==3&&Ep(this)}},t.Oa=function(a){this.g&&(this.response=this.responseText=a,Ei(this))},t.Na=function(a){this.g&&(this.response=a,Ei(this))},t.ga=function(){this.g&&Ei(this)};function Ei(a){a.readyState=4,a.l=null,a.j=null,a.B=null,xi(a)}t.setRequestHeader=function(a,c){this.A.append(a,c)},t.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],c=this.h.entries();for(var d=c.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=c.next();return a.join(`\r
`)};function xi(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Jo.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function xp(a){let c="";return G(a,function(d,y){c+=y,c+=":",c+=d,c+=`\r
`}),c}function qu(a,c,d){e:{for(y in d){var y=!1;break e}y=!0}y||(d=xp(d),typeof a=="string"?d!=null&&pi(d):ye(a,c,d))}function Ae(a){Je.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}m(Ae,Je);var D1=/^https?$/i,V1=["POST","PUT"];t=Ae.prototype,t.Fa=function(a){this.H=a},t.ea=function(a,c,d,y){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);c=c?c.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():rp.g(),this.g.onreadystatechange=g(h(this.Ca,this));try{this.B=!0,this.g.open(c,String(a),!0),this.B=!1}catch(N){Tp(this,N);return}if(a=d||"",d=new Map(this.headers),y)if(Object.getPrototypeOf(y)===Object.prototype)for(var P in y)d.set(P,y[P]);else if(typeof y.keys=="function"&&typeof y.get=="function")for(const N of y.keys())d.set(N,y.get(N));else throw Error("Unknown input type for opt_headers: "+String(y));y=Array.from(d.keys()).find(N=>N.toLowerCase()=="content-type"),P=o.FormData&&a instanceof o.FormData,!(Array.prototype.indexOf.call(V1,c,void 0)>=0)||y||P||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[N,B]of d)this.g.setRequestHeader(N,B);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(N){Tp(this,N)}};function Tp(a,c){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=c,a.o=5,Ip(a),Zo(a)}function Ip(a){a.A||(a.A=!0,lt(a,"complete"),lt(a,"error"))}t.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,lt(this,"complete"),lt(this,"abort"),Zo(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Zo(this,!0)),Ae.Z.N.call(this)},t.Ca=function(){this.u||(this.B||this.v||this.j?Sp(this):this.Xa())},t.Xa=function(){Sp(this)};function Sp(a){if(a.h&&typeof i<"u"){if(a.v&&Fn(a)==4)setTimeout(a.Ca.bind(a),0);else if(lt(a,"readystatechange"),Fn(a)==4){a.h=!1;try{const N=a.ca();e:switch(N){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var d;if(!(d=c)){var y;if(y=N===0){let B=String(a.D).match(pp)[1]||null;!B&&o.self&&o.self.location&&(B=o.self.location.protocol.slice(0,-1)),y=!D1.test(B?B.toLowerCase():"")}d=y}if(d)lt(a,"complete"),lt(a,"success");else{a.o=6;try{var P=Fn(a)>2?a.g.statusText:""}catch{P=""}a.l=P+" ["+a.ca()+"]",Ip(a)}}finally{Zo(a)}}}}function Zo(a,c){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);const d=a.g;a.g=null,c||lt(a,"ready");try{d.onreadystatechange=null}catch{}}}t.isActive=function(){return!!this.g};function Fn(a){return a.g?a.g.readyState:0}t.ca=function(){try{return Fn(this)>2?this.g.status:-1}catch{return-1}},t.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.La=function(a){if(this.g){var c=this.g.responseText;return a&&c.indexOf(a)==0&&(c=c.substring(a.length)),f1(c)}};function kp(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function M1(a){const c={};a=(a.g&&Fn(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let y=0;y<a.length;y++){if(w(a[y]))continue;var d=v1(a[y]);const P=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const N=c[P]||[];c[P]=N,N.push(d)}L(c,function(y){return y.join(", ")})}t.ya=function(){return this.o},t.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ti(a,c,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||c}function Ap(a){this.za=0,this.i=[],this.j=new fi,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Ti("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Ti("baseRetryDelayMs",5e3,a),this.Za=Ti("retryDelaySeedMs",1e4,a),this.Ta=Ti("forwardChannelMaxRetries",2,a),this.va=Ti("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new up(a&&a.concurrentRequestLimit),this.Ba=new N1,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}t=Ap.prototype,t.ka=8,t.I=1,t.connect=function(a,c,d,y){ut(0),this.W=a,this.H=c||{},d&&y!==void 0&&(this.H.OSID=d,this.H.OAID=y),this.F=this.X,this.J=Op(this,null,this.W),ta(this)};function Wu(a){if(Cp(a),a.I==3){var c=a.V++,d=Gt(a.J);if(ye(d,"SID",a.M),ye(d,"RID",c),ye(d,"TYPE","terminate"),Ii(a,d),c=new On(a,a.j,c),c.M=2,c.A=Yo(Gt(d)),d=!1,o.navigator&&o.navigator.sendBeacon)try{d=o.navigator.sendBeacon(c.A.toString(),"")}catch{}!d&&o.Image&&(new Image().src=c.A,d=!0),d||(c.g=Lp(c.j,null),c.g.ea(c.A)),c.F=Date.now(),Xo(c)}Mp(a)}function ea(a){a.g&&(Ku(a),a.g.cancel(),a.g=null)}function Cp(a){ea(a),a.v&&(o.clearTimeout(a.v),a.v=null),na(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&o.clearTimeout(a.m),a.m=null)}function ta(a){if(!cp(a.h)&&!a.m){a.m=!0;var c=a.Ea;j||v(),U||(j(),U=!0),x.add(c,a),a.D=0}}function O1(a,c){return hp(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=c.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=di(h(a.Ea,a,c),Vp(a,a.D)),a.D++,!0)}t.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;const P=new On(this,this.j,a);let N=this.o;if(this.U&&(N?(N=te(N),pt(N,this.U)):N=this.U),this.u!==null||this.R||(P.J=N,N=null),this.S)e:{for(var c=0,d=0;d<this.i.length;d++){t:{var y=this.i[d];if("__data__"in y.map&&(y=y.map.__data__,typeof y=="string")){y=y.length;break t}y=void 0}if(y===void 0)break;if(c+=y,c>4096){c=d;break e}if(c===4096||d===this.i.length-1){c=d+1;break e}}c=1e3}else c=1e3;c=Rp(this,P,c),d=Gt(this.J),ye(d,"RID",a),ye(d,"CVER",22),this.G&&ye(d,"X-HTTP-Session-Id",this.G),Ii(this,d),N&&(this.R?c="headers="+pi(xp(N))+"&"+c:this.u&&qu(d,this.u,N)),Bu(this.h,P),this.Ra&&ye(d,"TYPE","init"),this.S?(ye(d,"$req",c),ye(d,"SID","null"),P.U=!0,ju(P,d,null)):ju(P,d,c),this.I=2}}else this.I==3&&(a?bp(this,a):this.i.length==0||cp(this.h)||bp(this))};function bp(a,c){var d;c?d=c.l:d=a.V++;const y=Gt(a.J);ye(y,"SID",a.M),ye(y,"RID",d),ye(y,"AID",a.K),Ii(a,y),a.u&&a.o&&qu(y,a.u,a.o),d=new On(a,a.j,d,a.D+1),a.u===null&&(d.J=a.o),c&&(a.i=c.G.concat(a.i)),c=Rp(a,d,1e3),d.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),Bu(a.h,d),ju(d,y,c)}function Ii(a,c){a.H&&G(a.H,function(d,y){ye(c,y,d)}),a.l&&G({},function(d,y){ye(c,y,d)})}function Rp(a,c,d){d=Math.min(a.i.length,d);const y=a.l?h(a.l.Ka,a.l,a):null;e:{var P=a.i;let ne=-1;for(;;){const Le=["count="+d];ne==-1?d>0?(ne=P[0].g,Le.push("ofs="+ne)):ne=0:Le.push("ofs="+ne);let me=!0;for(let Be=0;Be<d;Be++){var N=P[Be].g;const Kt=P[Be].map;if(N-=ne,N<0)ne=Math.max(0,P[Be].g-100),me=!1;else try{N="req"+N+"_"||"";try{var B=Kt instanceof Map?Kt:Object.entries(Kt);for(const[Dr,Un]of B){let zn=Un;l(Un)&&(zn=Du(Un)),Le.push(N+Dr+"="+encodeURIComponent(zn))}}catch(Dr){throw Le.push(N+"type="+encodeURIComponent("_badmap")),Dr}}catch{y&&y(Kt)}}if(me){B=Le.join("&");break e}}B=void 0}return a=a.i.splice(0,d),c.G=a,B}function Pp(a){if(!a.g&&!a.v){a.Y=1;var c=a.Da;j||v(),U||(j(),U=!0),x.add(c,a),a.A=0}}function Gu(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=di(h(a.Da,a),Vp(a,a.A)),a.A++,!0)}t.Da=function(){if(this.v=null,Np(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=di(h(this.Wa,this),a)}},t.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,ut(10),ea(this),Np(this))};function Ku(a){a.B!=null&&(o.clearTimeout(a.B),a.B=null)}function Np(a){a.g=new On(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var c=Gt(a.na);ye(c,"RID","rpc"),ye(c,"SID",a.M),ye(c,"AID",a.K),ye(c,"CI",a.F?"0":"1"),!a.F&&a.ia&&ye(c,"TO",a.ia),ye(c,"TYPE","xmlhttp"),Ii(a,c),a.u&&a.o&&qu(c,a.u,a.o),a.O&&(a.g.H=a.O);var d=a.g;a=a.ba,d.M=1,d.A=Yo(Gt(c)),d.u=null,d.R=!0,op(d,a)}t.Va=function(){this.C!=null&&(this.C=null,ea(this),Gu(this),ut(19))};function na(a){a.C!=null&&(o.clearTimeout(a.C),a.C=null)}function Dp(a,c){var d=null;if(a.g==c){na(a),Ku(a),a.g=null;var y=2}else if(zu(a.h,c))d=c.G,dp(a.h,c),y=1;else return;if(a.I!=0){if(c.o)if(y==1){d=c.u?c.u.length:0,c=Date.now()-c.F;var P=a.D;y=Ko(),lt(y,new tp(y,d)),ta(a)}else Pp(a);else if(P=c.m,P==3||P==0&&c.X>0||!(y==1&&O1(a,c)||y==2&&Gu(a)))switch(d&&d.length>0&&(c=a.h,c.i=c.i.concat(d)),P){case 1:Nr(a,5);break;case 4:Nr(a,10);break;case 3:Nr(a,6);break;default:Nr(a,2)}}}function Vp(a,c){let d=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(d*=2),d*c}function Nr(a,c){if(a.j.info("Error code "+c),c==2){var d=h(a.bb,a),y=a.Ua;const P=!y;y=new Ln(y||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||gi(y,"https"),Yo(y),P?R1(y.toString(),d):P1(y.toString(),d)}else ut(2);a.I=0,a.l&&a.l.pa(c),Mp(a),Cp(a)}t.bb=function(a){a?(this.j.info("Successfully pinged google.com"),ut(2)):(this.j.info("Failed to ping google.com"),ut(1))};function Mp(a){if(a.I=0,a.ja=[],a.l){const c=fp(a.h);(c.length!=0||a.i.length!=0)&&(b(a.ja,c),b(a.ja,a.i),a.h.i.length=0,A(a.i),a.i.length=0),a.l.oa()}}function Op(a,c,d){var y=d instanceof Ln?Gt(d):new Ln(d);if(y.g!="")c&&(y.g=c+"."+y.g),yi(y,y.u);else{var P=o.location;y=P.protocol,c=c?c+"."+P.hostname:P.hostname,P=+P.port;const N=new Ln(null);y&&gi(N,y),c&&(N.g=c),P&&yi(N,P),d&&(N.h=d),y=N}return d=a.G,c=a.wa,d&&c&&ye(y,d,c),ye(y,"VER",a.ka),Ii(a,y),y}function Lp(a,c,d){if(c&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return c=a.Aa&&!a.ma?new Ae(new Hu({ab:d})):new Ae(a.ma),c.Fa(a.L),c}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function jp(){}t=jp.prototype,t.ra=function(){},t.qa=function(){},t.pa=function(){},t.oa=function(){},t.isActive=function(){return!0},t.Ka=function(){};function ra(){}ra.prototype.g=function(a,c){return new xt(a,c)};function xt(a,c){Je.call(this),this.g=new Ap(c),this.l=a,this.h=c&&c.messageUrlParams||null,a=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(a?a["X-WebChannel-Content-Type"]=c.messageContentType:a={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.sa&&(a?a["X-WebChannel-Client-Profile"]=c.sa:a={"X-WebChannel-Client-Profile":c.sa}),this.g.U=a,(a=c&&c.Qb)&&!w(a)&&(this.g.u=a),this.A=c&&c.supportsCrossDomainXhr||!1,this.v=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!w(c)&&(this.g.G=c,a=this.h,a!==null&&c in a&&(a=this.h,c in a&&delete a[c])),this.j=new os(this)}m(xt,Je),xt.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},xt.prototype.close=function(){Wu(this.g)},xt.prototype.o=function(a){var c=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.v&&(d={},d.__data__=Du(a),a=d);c.i.push(new x1(c.Ya++,a)),c.I==3&&ta(c)},xt.prototype.N=function(){this.g.l=null,delete this.j,Wu(this.g),delete this.g,xt.Z.N.call(this)};function Fp(a){Vu.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var c=a.__sm__;if(c){e:{for(const d in c){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,c=c!==null&&a in c?c[a]:void 0),this.data=c}else this.data=a}m(Fp,Vu);function Up(){Mu.call(this),this.status=1}m(Up,Mu);function os(a){this.g=a}m(os,jp),os.prototype.ra=function(){lt(this.g,"a")},os.prototype.qa=function(a){lt(this.g,new Fp(a))},os.prototype.pa=function(a){lt(this.g,new Up)},os.prototype.oa=function(){lt(this.g,"b")},ra.prototype.createWebChannel=ra.prototype.g,xt.prototype.send=xt.prototype.o,xt.prototype.open=xt.prototype.m,xt.prototype.close=xt.prototype.close,av=function(){return new ra},ov=function(){return Ko()},iv=br,Mh={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Qo.NO_ERROR=0,Qo.TIMEOUT=8,Qo.HTTP_ERROR=6,Ba=Qo,np.COMPLETE="complete",sv=np,Yf.EventType=ci,ci.OPEN="a",ci.CLOSE="b",ci.ERROR="c",ci.MESSAGE="d",Je.prototype.listen=Je.prototype.J,Li=Yf,Ae.prototype.listenOnce=Ae.prototype.K,Ae.prototype.getLastError=Ae.prototype.Ha,Ae.prototype.getLastErrorCode=Ae.prototype.ya,Ae.prototype.getStatus=Ae.prototype.ca,Ae.prototype.getResponseJson=Ae.prototype.La,Ae.prototype.getResponseText=Ae.prototype.la,Ae.prototype.send=Ae.prototype.ea,Ae.prototype.setWithCredentials=Ae.prototype.Fa,rv=Ae}).apply(typeof xa<"u"?xa:typeof self<"u"?self:typeof window<"u"?window:{});const cg="@firebase/firestore",hg="4.9.2";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}nt.UNAUTHENTICATED=new nt(null),nt.GOOGLE_CREDENTIALS=new nt("google-credentials-uid"),nt.FIRST_PARTY=new nt("first-party-uid"),nt.MOCK_USER=new nt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let si="12.3.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yr=new ef("@firebase/firestore");function us(){return Yr.logLevel}function $(t,...e){if(Yr.logLevel<=oe.DEBUG){const n=e.map(sf);Yr.debug(`Firestore (${si}): ${t}`,...n)}}function Cn(t,...e){if(Yr.logLevel<=oe.ERROR){const n=e.map(sf);Yr.error(`Firestore (${si}): ${t}`,...n)}}function qs(t,...e){if(Yr.logLevel<=oe.WARN){const n=e.map(sf);Yr.warn(`Firestore (${si}): ${t}`,...n)}}function sf(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(t)}catch{return t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Q(t,e,n){let r="Unexpected state";typeof e=="string"?r=e:n=e,lv(t,r,n)}function lv(t,e,n){let r=`FIRESTORE (${si}) INTERNAL ASSERTION FAILED: ${e} (ID: ${t.toString(16)})`;if(n!==void 0)try{r+=" CONTEXT: "+JSON.stringify(n)}catch{r+=" CONTEXT: "+n}throw Cn(r),new Error(r)}function he(t,e,n,r){let s="Unexpected state";typeof n=="string"?s=n:r=n,t||lv(e,s,r)}function Z(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class W extends Vn{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $r{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uv{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class yS{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(nt.UNAUTHENTICATED))}shutdown(){}}class _S{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class vS{constructor(e){this.t=e,this.currentUser=nt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){he(this.o===void 0,42304);let r=this.i;const s=u=>this.i!==r?(r=this.i,n(u)):Promise.resolve();let i=new $r;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new $r,e.enqueueRetryable(()=>s(this.currentUser))};const o=()=>{const u=i;e.enqueueRetryable(async()=>{await u.promise,await s(this.currentUser)})},l=u=>{$("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(u=>l(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?l(u):($("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new $r)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==e?($("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(he(typeof r.accessToken=="string",31837,{l:r}),new uv(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return he(e===null||typeof e=="string",2055,{h:e}),new nt(e)}}class wS{constructor(e,n,r){this.P=e,this.T=n,this.I=r,this.type="FirstParty",this.user=nt.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class ES{constructor(e,n,r){this.P=e,this.T=n,this.I=r}getToken(){return Promise.resolve(new wS(this.P,this.T,this.I))}start(e,n){e.enqueueRetryable(()=>n(nt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class dg{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class xS{constructor(e,n){this.V=n,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Nt(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,n){he(this.o===void 0,3512);const r=i=>{i.error!=null&&$("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.m;return this.m=i.token,$("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>r(i))};const s=i=>{$("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?s(i):$("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new dg(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(he(typeof n.token=="string",44558,{tokenResult:n}),this.m=n.token,new dg(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function TS(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class of{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=TS(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<n&&(r+=e.charAt(s[i]%62))}return r}}function ae(t,e){return t<e?-1:t>e?1:0}function Oh(t,e){const n=Math.min(t.length,e.length);for(let r=0;r<n;r++){const s=t.charAt(r),i=e.charAt(r);if(s!==i)return Ac(s)===Ac(i)?ae(s,i):Ac(s)?1:-1}return ae(t.length,e.length)}const IS=55296,SS=57343;function Ac(t){const e=t.charCodeAt(0);return e>=IS&&e<=SS}function Ws(t,e,n){return t.length===e.length&&t.every((r,s)=>n(r,e[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fg="__name__";class Yt{constructor(e,n,r){n===void 0?n=0:n>e.length&&Q(637,{offset:n,range:e.length}),r===void 0?r=e.length-n:r>e.length-n&&Q(1746,{length:r,range:e.length-n}),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return Yt.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof Yt?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let s=0;s<r;s++){const i=Yt.compareSegments(e.get(s),n.get(s));if(i!==0)return i}return ae(e.length,n.length)}static compareSegments(e,n){const r=Yt.isNumericId(e),s=Yt.isNumericId(n);return r&&!s?-1:!r&&s?1:r&&s?Yt.extractNumericId(e).compare(Yt.extractNumericId(n)):Oh(e,n)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return dr.fromString(e.substring(4,e.length-2))}}class ve extends Yt{construct(e,n,r){return new ve(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new W(O.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(s=>s.length>0))}return new ve(n)}static emptyPath(){return new ve([])}}const kS=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Ke extends Yt{construct(e,n,r){return new Ke(e,n,r)}static isValidIdentifier(e){return kS.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ke.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===fg}static keyField(){return new Ke([fg])}static fromServerFormat(e){const n=[];let r="",s=0;const i=()=>{if(r.length===0)throw new W(O.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let o=!1;for(;s<e.length;){const l=e[s];if(l==="\\"){if(s+1===e.length)throw new W(O.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new W(O.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,s+=2}else l==="`"?(o=!o,s++):l!=="."||o?(r+=l,s++):(i(),s++)}if(i(),o)throw new W(O.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Ke(n)}static emptyPath(){return new Ke([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K{constructor(e){this.path=e}static fromPath(e){return new K(ve.fromString(e))}static fromName(e){return new K(ve.fromString(e).popFirst(5))}static empty(){return new K(ve.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ve.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return ve.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new K(new ve(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cv(t,e,n){if(!n)throw new W(O.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function AS(t,e,n,r){if(e===!0&&r===!0)throw new W(O.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function pg(t){if(!K.isDocumentKey(t))throw new W(O.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function mg(t){if(K.isDocumentKey(t))throw new W(O.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function hv(t){return typeof t=="object"&&t!==null&&(Object.getPrototypeOf(t)===Object.prototype||Object.getPrototypeOf(t)===null)}function af(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":Q(12329,{type:typeof t})}function fr(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new W(O.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=af(t);throw new W(O.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Me(t,e){const n={typeString:t};return e&&(n.value=e),n}function Oo(t,e){if(!hv(t))throw new W(O.INVALID_ARGUMENT,"JSON must be an object");let n;for(const r in e)if(e[r]){const s=e[r].typeString,i="value"in e[r]?{value:e[r].value}:void 0;if(!(r in t)){n=`JSON missing required field: '${r}'`;break}const o=t[r];if(s&&typeof o!==s){n=`JSON field '${r}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){n=`Expected '${r}' field to equal '${i.value}'`;break}}if(n)throw new W(O.INVALID_ARGUMENT,n);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gg=-62135596800,yg=1e6;class we{static now(){return we.fromMillis(Date.now())}static fromDate(e){return we.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor((e-1e3*n)*yg);return new we(n,r)}constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new W(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new W(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<gg)throw new W(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new W(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/yg}_compareTo(e){return this.seconds===e.seconds?ae(this.nanoseconds,e.nanoseconds):ae(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:we._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Oo(e,we._jsonSchema))return new we(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-gg;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}we._jsonSchemaVersion="firestore/timestamp/1.0",we._jsonSchema={type:Me("string",we._jsonSchemaVersion),seconds:Me("number"),nanoseconds:Me("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J{static fromTimestamp(e){return new J(e)}static min(){return new J(new we(0,0))}static max(){return new J(new we(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xo=-1;function CS(t,e){const n=t.toTimestamp().seconds,r=t.toTimestamp().nanoseconds+1,s=J.fromTimestamp(r===1e9?new we(n+1,0):new we(n,r));return new _r(s,K.empty(),e)}function bS(t){return new _r(t.readTime,t.key,xo)}class _r{constructor(e,n,r){this.readTime=e,this.documentKey=n,this.largestBatchId=r}static min(){return new _r(J.min(),K.empty(),xo)}static max(){return new _r(J.max(),K.empty(),xo)}}function RS(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=K.comparator(t.documentKey,e.documentKey),n!==0?n:ae(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PS="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class NS{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ii(t){if(t.code!==O.FAILED_PRECONDITION||t.message!==PS)throw t;$("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&Q(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new M((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(n,i).next(r,s)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof M?n:M.resolve(n)}catch(n){return M.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):M.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):M.reject(n)}static resolve(e){return new M((n,r)=>{n(e)})}static reject(e){return new M((n,r)=>{r(e)})}static waitFor(e){return new M((n,r)=>{let s=0,i=0,o=!1;e.forEach(l=>{++s,l.next(()=>{++i,o&&i===s&&n()},u=>r(u))}),o=!0,i===s&&n()})}static or(e){let n=M.resolve(!1);for(const r of e)n=n.next(s=>s?M.resolve(s):r());return n}static forEach(e,n){const r=[];return e.forEach((s,i)=>{r.push(n.call(this,s,i))}),this.waitFor(r)}static mapArray(e,n){return new M((r,s)=>{const i=e.length,o=new Array(i);let l=0;for(let u=0;u<i;u++){const h=u;n(e[h]).next(p=>{o[h]=p,++l,l===i&&r(o)},p=>s(p))}})}static doWhile(e,n){return new M((r,s)=>{const i=()=>{e()===!0?n().next(()=>{i()},s):r()};i()})}}function DS(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function oi(t){return t.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lu{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=r=>this.ae(r),this.ue=r=>n.writeSequenceNumber(r))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}lu.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lf=-1;function uu(t){return t==null}function Al(t){return t===0&&1/t==-1/0}function VS(t){return typeof t=="number"&&Number.isInteger(t)&&!Al(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dv="";function MS(t){let e="";for(let n=0;n<t.length;n++)e.length>0&&(e=_g(e)),e=OS(t.get(n),e);return _g(e)}function OS(t,e){let n=e;const r=t.length;for(let s=0;s<r;s++){const i=t.charAt(s);switch(i){case"\0":n+="";break;case dv:n+="";break;default:n+=i}}return n}function _g(t){return t+dv+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vg(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function Ar(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function fv(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke{constructor(e,n){this.comparator=e,this.root=n||Ge.EMPTY}insert(e,n){return new ke(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,Ge.BLACK,null,null))}remove(e){return new ke(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Ge.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return n+r.left.size;s<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Ta(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Ta(this.root,e,this.comparator,!1)}getReverseIterator(){return new Ta(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Ta(this.root,e,this.comparator,!0)}}class Ta{constructor(e,n,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=n?r(e.key,n):1,n&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Ge{constructor(e,n,r,s,i){this.key=e,this.value=n,this.color=r??Ge.RED,this.left=s??Ge.EMPTY,this.right=i??Ge.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,s,i){return new Ge(e??this.key,n??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,n,r),null):i===0?s.copy(null,n,null,null,null):s.copy(null,null,null,null,s.right.insert(e,n,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Ge.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,s=this;if(n(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,n),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),n(e,s.key)===0){if(s.right.isEmpty())return Ge.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,n))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Ge.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Ge.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw Q(43730,{key:this.key,value:this.value});if(this.right.isRed())throw Q(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw Q(27949);return e+(this.isRed()?0:1)}}Ge.EMPTY=null,Ge.RED=!0,Ge.BLACK=!1;Ge.EMPTY=new class{constructor(){this.size=0}get key(){throw Q(57766)}get value(){throw Q(16141)}get color(){throw Q(16727)}get left(){throw Q(29726)}get right(){throw Q(36894)}copy(e,n,r,s,i){return this}insert(e,n,r){return new Ge(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze{constructor(e){this.comparator=e,this.data=new ke(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;n(s.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new wg(this.data.getIterator())}getIteratorFrom(e){return new wg(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof ze)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const s=n.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new ze(this.comparator);return n.data=e,n}}class wg{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St{constructor(e){this.fields=e,e.sort(Ke.comparator)}static empty(){return new St([])}unionWith(e){let n=new ze(Ke.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new St(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return Ws(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pv extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new pv("Invalid base64 string: "+i):i}}(e);return new Ye(n)}static fromUint8Array(e){const n=function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i}(e);return new Ye(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let s=0;s<n.length;s++)r[s]=n.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ae(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ye.EMPTY_BYTE_STRING=new Ye("");const LS=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function vr(t){if(he(!!t,39018),typeof t=="string"){let e=0;const n=LS.exec(t);if(he(!!n,46558,{timestamp:t}),n[1]){let s=n[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:be(t.seconds),nanos:be(t.nanos)}}function be(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function wr(t){return typeof t=="string"?Ye.fromBase64String(t):Ye.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mv="server_timestamp",gv="__type__",yv="__previous_value__",_v="__local_write_time__";function uf(t){var n,r;return((r=(((n=t==null?void 0:t.mapValue)==null?void 0:n.fields)||{})[gv])==null?void 0:r.stringValue)===mv}function cu(t){const e=t.mapValue.fields[yv];return uf(e)?cu(e):e}function To(t){const e=vr(t.mapValue.fields[_v].timestampValue);return new we(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jS{constructor(e,n,r,s,i,o,l,u,h,p){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=u,this.useFetchStreams=h,this.isUsingEmulator=p}}const Cl="(default)";class Io{constructor(e,n){this.projectId=e,this.database=n||Cl}static empty(){return new Io("","")}get isDefaultDatabase(){return this.database===Cl}isEqual(e){return e instanceof Io&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vv="__type__",FS="__max__",Ia={mapValue:{}},wv="__vector__",bl="value";function Er(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?uf(t)?4:zS(t)?9007199254740991:US(t)?10:11:Q(28295,{value:t})}function un(t,e){if(t===e)return!0;const n=Er(t);if(n!==Er(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return To(t).isEqual(To(e));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const o=vr(s.timestampValue),l=vr(i.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(s,i){return wr(s.bytesValue).isEqual(wr(i.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(s,i){return be(s.geoPointValue.latitude)===be(i.geoPointValue.latitude)&&be(s.geoPointValue.longitude)===be(i.geoPointValue.longitude)}(t,e);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return be(s.integerValue)===be(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const o=be(s.doubleValue),l=be(i.doubleValue);return o===l?Al(o)===Al(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return Ws(t.arrayValue.values||[],e.arrayValue.values||[],un);case 10:case 11:return function(s,i){const o=s.mapValue.fields||{},l=i.mapValue.fields||{};if(vg(o)!==vg(l))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(l[u]===void 0||!un(o[u],l[u])))return!1;return!0}(t,e);default:return Q(52216,{left:t})}}function So(t,e){return(t.values||[]).find(n=>un(n,e))!==void 0}function Gs(t,e){if(t===e)return 0;const n=Er(t),r=Er(e);if(n!==r)return ae(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return ae(t.booleanValue,e.booleanValue);case 2:return function(i,o){const l=be(i.integerValue||i.doubleValue),u=be(o.integerValue||o.doubleValue);return l<u?-1:l>u?1:l===u?0:isNaN(l)?isNaN(u)?0:-1:1}(t,e);case 3:return Eg(t.timestampValue,e.timestampValue);case 4:return Eg(To(t),To(e));case 5:return Oh(t.stringValue,e.stringValue);case 6:return function(i,o){const l=wr(i),u=wr(o);return l.compareTo(u)}(t.bytesValue,e.bytesValue);case 7:return function(i,o){const l=i.split("/"),u=o.split("/");for(let h=0;h<l.length&&h<u.length;h++){const p=ae(l[h],u[h]);if(p!==0)return p}return ae(l.length,u.length)}(t.referenceValue,e.referenceValue);case 8:return function(i,o){const l=ae(be(i.latitude),be(o.latitude));return l!==0?l:ae(be(i.longitude),be(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return xg(t.arrayValue,e.arrayValue);case 10:return function(i,o){var g,A,b,R;const l=i.fields||{},u=o.fields||{},h=(g=l[bl])==null?void 0:g.arrayValue,p=(A=u[bl])==null?void 0:A.arrayValue,m=ae(((b=h==null?void 0:h.values)==null?void 0:b.length)||0,((R=p==null?void 0:p.values)==null?void 0:R.length)||0);return m!==0?m:xg(h,p)}(t.mapValue,e.mapValue);case 11:return function(i,o){if(i===Ia.mapValue&&o===Ia.mapValue)return 0;if(i===Ia.mapValue)return 1;if(o===Ia.mapValue)return-1;const l=i.fields||{},u=Object.keys(l),h=o.fields||{},p=Object.keys(h);u.sort(),p.sort();for(let m=0;m<u.length&&m<p.length;++m){const g=Oh(u[m],p[m]);if(g!==0)return g;const A=Gs(l[u[m]],h[p[m]]);if(A!==0)return A}return ae(u.length,p.length)}(t.mapValue,e.mapValue);default:throw Q(23264,{he:n})}}function Eg(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return ae(t,e);const n=vr(t),r=vr(e),s=ae(n.seconds,r.seconds);return s!==0?s:ae(n.nanos,r.nanos)}function xg(t,e){const n=t.values||[],r=e.values||[];for(let s=0;s<n.length&&s<r.length;++s){const i=Gs(n[s],r[s]);if(i)return i}return ae(n.length,r.length)}function Ks(t){return Lh(t)}function Lh(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const r=vr(n);return`time(${r.seconds},${r.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return wr(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return K.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let r="[",s=!0;for(const i of n.values||[])s?s=!1:r+=",",r+=Lh(i);return r+"]"}(t.arrayValue):"mapValue"in t?function(n){const r=Object.keys(n.fields||{}).sort();let s="{",i=!0;for(const o of r)i?i=!1:s+=",",s+=`${o}:${Lh(n.fields[o])}`;return s+"}"}(t.mapValue):Q(61005,{value:t})}function $a(t){switch(Er(t)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=cu(t);return e?16+$a(e):16;case 5:return 2*t.stringValue.length;case 6:return wr(t.bytesValue).approximateByteSize();case 7:return t.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((s,i)=>s+$a(i),0)}(t.arrayValue);case 10:case 11:return function(r){let s=0;return Ar(r.fields,(i,o)=>{s+=i.length+$a(o)}),s}(t.mapValue);default:throw Q(13486,{value:t})}}function jh(t){return!!t&&"integerValue"in t}function cf(t){return!!t&&"arrayValue"in t}function Tg(t){return!!t&&"nullValue"in t}function Ig(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Ha(t){return!!t&&"mapValue"in t}function US(t){var n,r;return((r=(((n=t==null?void 0:t.mapValue)==null?void 0:n.fields)||{})[vv])==null?void 0:r.stringValue)===wv}function Yi(t){if(t.geoPointValue)return{geoPointValue:{...t.geoPointValue}};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:{...t.timestampValue}};if(t.mapValue){const e={mapValue:{fields:{}}};return Ar(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=Yi(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Yi(t.arrayValue.values[n]);return e}return{...t}}function zS(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue===FS}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt{constructor(e){this.value=e}static empty(){return new yt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!Ha(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Yi(n)}setAll(e){let n=Ke.emptyPath(),r={},s=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const u=this.getFieldsMap(n);this.applyChanges(u,r,s),r={},s=[],n=l.popLast()}o?r[l.lastSegment()]=Yi(o):s.push(l.lastSegment())});const i=this.getFieldsMap(n);this.applyChanges(i,r,s)}delete(e){const n=this.field(e.popLast());Ha(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return un(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=n.mapValue.fields[e.get(r)];Ha(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=s),n=s}return n.mapValue.fields}applyChanges(e,n,r){Ar(n,(s,i)=>e[s]=i);for(const s of r)delete e[s]}clone(){return new yt(Yi(this.value))}}function Ev(t){const e=[];return Ar(t.fields,(n,r)=>{const s=new Ke([n]);if(Ha(r)){const i=Ev(r.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)}),new St(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st{constructor(e,n,r,s,i,o,l){this.key=e,this.documentType=n,this.version=r,this.readTime=s,this.createTime=i,this.data=o,this.documentState=l}static newInvalidDocument(e){return new st(e,0,J.min(),J.min(),J.min(),yt.empty(),0)}static newFoundDocument(e,n,r,s){return new st(e,1,n,J.min(),r,s,0)}static newNoDocument(e,n){return new st(e,2,n,J.min(),J.min(),yt.empty(),0)}static newUnknownDocument(e,n){return new st(e,3,n,J.min(),J.min(),yt.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(J.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=yt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=yt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=J.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof st&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new st(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rl{constructor(e,n){this.position=e,this.inclusive=n}}function Sg(t,e,n){let r=0;for(let s=0;s<t.position.length;s++){const i=e[s],o=t.position[s];if(i.field.isKeyField()?r=K.comparator(K.fromName(o.referenceValue),n.key):r=Gs(o,n.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function kg(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!un(t.position[n],e.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pl{constructor(e,n="asc"){this.field=e,this.dir=n}}function BS(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xv{}class Fe extends xv{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new HS(e,n,r):n==="array-contains"?new GS(e,r):n==="in"?new KS(e,r):n==="not-in"?new QS(e,r):n==="array-contains-any"?new XS(e,r):new Fe(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new qS(e,r):new WS(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&n.nullValue===void 0&&this.matchesComparison(Gs(n,this.value)):n!==null&&Er(this.value)===Er(n)&&this.matchesComparison(Gs(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Q(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class cn extends xv{constructor(e,n){super(),this.filters=e,this.op=n,this.Pe=null}static create(e,n){return new cn(e,n)}matches(e){return Tv(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Tv(t){return t.op==="and"}function Iv(t){return $S(t)&&Tv(t)}function $S(t){for(const e of t.filters)if(e instanceof cn)return!1;return!0}function Fh(t){if(t instanceof Fe)return t.field.canonicalString()+t.op.toString()+Ks(t.value);if(Iv(t))return t.filters.map(e=>Fh(e)).join(",");{const e=t.filters.map(n=>Fh(n)).join(",");return`${t.op}(${e})`}}function Sv(t,e){return t instanceof Fe?function(r,s){return s instanceof Fe&&r.op===s.op&&r.field.isEqual(s.field)&&un(r.value,s.value)}(t,e):t instanceof cn?function(r,s){return s instanceof cn&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((i,o,l)=>i&&Sv(o,s.filters[l]),!0):!1}(t,e):void Q(19439)}function kv(t){return t instanceof Fe?function(n){return`${n.field.canonicalString()} ${n.op} ${Ks(n.value)}`}(t):t instanceof cn?function(n){return n.op.toString()+" {"+n.getFilters().map(kv).join(" ,")+"}"}(t):"Filter"}class HS extends Fe{constructor(e,n,r){super(e,n,r),this.key=K.fromName(r.referenceValue)}matches(e){const n=K.comparator(e.key,this.key);return this.matchesComparison(n)}}class qS extends Fe{constructor(e,n){super(e,"in",n),this.keys=Av("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class WS extends Fe{constructor(e,n){super(e,"not-in",n),this.keys=Av("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function Av(t,e){var n;return(((n=e.arrayValue)==null?void 0:n.values)||[]).map(r=>K.fromName(r.referenceValue))}class GS extends Fe{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return cf(n)&&So(n.arrayValue,this.value)}}class KS extends Fe{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&So(this.value.arrayValue,n)}}class QS extends Fe{constructor(e,n){super(e,"not-in",n)}matches(e){if(So(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&n.nullValue===void 0&&!So(this.value.arrayValue,n)}}class XS extends Fe{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!cf(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>So(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YS{constructor(e,n=null,r=[],s=[],i=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=o,this.endAt=l,this.Te=null}}function Ag(t,e=null,n=[],r=[],s=null,i=null,o=null){return new YS(t,e,n,r,s,i,o)}function hf(t){const e=Z(t);if(e.Te===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(r=>Fh(r)).join(","),n+="|ob:",n+=e.orderBy.map(r=>function(i){return i.field.canonicalString()+i.dir}(r)).join(","),uu(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(r=>Ks(r)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(r=>Ks(r)).join(",")),e.Te=n}return e.Te}function df(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!BS(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!Sv(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!kg(t.startAt,e.startAt)&&kg(t.endAt,e.endAt)}function Uh(t){return K.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hu{constructor(e,n=null,r=[],s=[],i=null,o="F",l=null,u=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=o,this.startAt=l,this.endAt=u,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function JS(t,e,n,r,s,i,o,l){return new hu(t,e,n,r,s,i,o,l)}function ff(t){return new hu(t)}function Cg(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function ZS(t){return t.collectionGroup!==null}function Ji(t){const e=Z(t);if(e.Ie===null){e.Ie=[];const n=new Set;for(const i of e.explicitOrderBy)e.Ie.push(i),n.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new ze(Ke.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(h=>{h.isInequality()&&(l=l.add(h.field))})}),l})(e).forEach(i=>{n.has(i.canonicalString())||i.isKeyField()||e.Ie.push(new Pl(i,r))}),n.has(Ke.keyField().canonicalString())||e.Ie.push(new Pl(Ke.keyField(),r))}return e.Ie}function tn(t){const e=Z(t);return e.Ee||(e.Ee=e2(e,Ji(t))),e.Ee}function e2(t,e){if(t.limitType==="F")return Ag(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new Pl(s.field,i)});const n=t.endAt?new Rl(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new Rl(t.startAt.position,t.startAt.inclusive):null;return Ag(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}function zh(t,e,n){return new hu(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function du(t,e){return df(tn(t),tn(e))&&t.limitType===e.limitType}function Cv(t){return`${hf(tn(t))}|lt:${t.limitType}`}function cs(t){return`Query(target=${function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map(s=>kv(s)).join(", ")}]`),uu(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map(s=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(s)).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map(s=>Ks(s)).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map(s=>Ks(s)).join(",")),`Target(${r})`}(tn(t))}; limitType=${t.limitType})`}function fu(t,e){return e.isFoundDocument()&&function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):K.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)}(t,e)&&function(r,s){for(const i of Ji(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(t,e)&&function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0}(t,e)&&function(r,s){return!(r.startAt&&!function(o,l,u){const h=Sg(o,l,u);return o.inclusive?h<=0:h<0}(r.startAt,Ji(r),s)||r.endAt&&!function(o,l,u){const h=Sg(o,l,u);return o.inclusive?h>=0:h>0}(r.endAt,Ji(r),s))}(t,e)}function t2(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function bv(t){return(e,n)=>{let r=!1;for(const s of Ji(t)){const i=n2(s,e,n);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function n2(t,e,n){const r=t.field.isKeyField()?K.comparator(e.key,n.key):function(i,o,l){const u=o.data.field(i),h=l.data.field(i);return u!==null&&h!==null?Gs(u,h):Q(42886)}(t.field,e,n);switch(t.dir){case"asc":return r;case"desc":return-1*r;default:return Q(19790,{direction:t.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ns{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,n){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,n]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,n]);s.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[n]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Ar(this.inner,(n,r)=>{for(const[s,i]of r)e(s,i)})}isEmpty(){return fv(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const r2=new ke(K.comparator);function bn(){return r2}const Rv=new ke(K.comparator);function ji(...t){let e=Rv;for(const n of t)e=e.insert(n.key,n);return e}function Pv(t){let e=Rv;return t.forEach((n,r)=>e=e.insert(n,r.overlayedDocument)),e}function Ur(){return Zi()}function Nv(){return Zi()}function Zi(){return new ns(t=>t.toString(),(t,e)=>t.isEqual(e))}const s2=new ke(K.comparator),i2=new ze(K.comparator);function le(...t){let e=i2;for(const n of t)e=e.add(n);return e}const o2=new ze(ae);function a2(){return o2}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pf(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Al(e)?"-0":e}}function Dv(t){return{integerValue:""+t}}function l2(t,e){return VS(e)?Dv(e):pf(t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pu{constructor(){this._=void 0}}function u2(t,e,n){return t instanceof Nl?function(s,i){const o={fields:{[gv]:{stringValue:mv},[_v]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&uf(i)&&(i=cu(i)),i&&(o.fields[yv]=i),{mapValue:o}}(n,e):t instanceof Qs?Mv(t,e):t instanceof ko?Ov(t,e):function(s,i){const o=Vv(s,i),l=bg(o)+bg(s.Ae);return jh(o)&&jh(s.Ae)?Dv(l):pf(s.serializer,l)}(t,e)}function c2(t,e,n){return t instanceof Qs?Mv(t,e):t instanceof ko?Ov(t,e):n}function Vv(t,e){return t instanceof Dl?function(r){return jh(r)||function(i){return!!i&&"doubleValue"in i}(r)}(e)?e:{integerValue:0}:null}class Nl extends pu{}class Qs extends pu{constructor(e){super(),this.elements=e}}function Mv(t,e){const n=Lv(e);for(const r of t.elements)n.some(s=>un(s,r))||n.push(r);return{arrayValue:{values:n}}}class ko extends pu{constructor(e){super(),this.elements=e}}function Ov(t,e){let n=Lv(e);for(const r of t.elements)n=n.filter(s=>!un(s,r));return{arrayValue:{values:n}}}class Dl extends pu{constructor(e,n){super(),this.serializer=e,this.Ae=n}}function bg(t){return be(t.integerValue||t.doubleValue)}function Lv(t){return cf(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h2{constructor(e,n){this.field=e,this.transform=n}}function d2(t,e){return t.field.isEqual(e.field)&&function(r,s){return r instanceof Qs&&s instanceof Qs||r instanceof ko&&s instanceof ko?Ws(r.elements,s.elements,un):r instanceof Dl&&s instanceof Dl?un(r.Ae,s.Ae):r instanceof Nl&&s instanceof Nl}(t.transform,e.transform)}class f2{constructor(e,n){this.version=e,this.transformResults=n}}class nn{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new nn}static exists(e){return new nn(void 0,e)}static updateTime(e){return new nn(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function qa(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class mu{}function jv(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new Uv(t.key,nn.none()):new Lo(t.key,t.data,nn.none());{const n=t.data,r=yt.empty();let s=new ze(Ke.comparator);for(let i of e.fields)if(!s.has(i)){let o=n.field(i);o===null&&i.length>1&&(i=i.popLast(),o=n.field(i)),o===null?r.delete(i):r.set(i,o),s=s.add(i)}return new Cr(t.key,r,new St(s.toArray()),nn.none())}}function p2(t,e,n){t instanceof Lo?function(s,i,o){const l=s.value.clone(),u=Pg(s.fieldTransforms,i,o.transformResults);l.setAll(u),i.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(t,e,n):t instanceof Cr?function(s,i,o){if(!qa(s.precondition,i))return void i.convertToUnknownDocument(o.version);const l=Pg(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(Fv(s)),u.setAll(l),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(t,e,n):function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function eo(t,e,n,r){return t instanceof Lo?function(i,o,l,u){if(!qa(i.precondition,o))return l;const h=i.value.clone(),p=Ng(i.fieldTransforms,u,o);return h.setAll(p),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null}(t,e,n,r):t instanceof Cr?function(i,o,l,u){if(!qa(i.precondition,o))return l;const h=Ng(i.fieldTransforms,u,o),p=o.data;return p.setAll(Fv(i)),p.setAll(h),o.convertToFoundDocument(o.version,p).setHasLocalMutations(),l===null?null:l.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(t,e,n,r):function(i,o,l){return qa(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(t,e,n)}function m2(t,e){let n=null;for(const r of t.fieldTransforms){const s=e.data.field(r.field),i=Vv(r.transform,s||null);i!=null&&(n===null&&(n=yt.empty()),n.set(r.field,i))}return n||null}function Rg(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Ws(r,s,(i,o)=>d2(i,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class Lo extends mu{constructor(e,n,r,s=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Cr extends mu{constructor(e,n,r,s,i=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Fv(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=t.data.field(n);e.set(n,r)}}),e}function Pg(t,e,n){const r=new Map;he(t.length===n.length,32656,{Re:n.length,Ve:t.length});for(let s=0;s<n.length;s++){const i=t[s],o=i.transform,l=e.data.field(i.field);r.set(i.field,c2(o,l,n[s]))}return r}function Ng(t,e,n){const r=new Map;for(const s of t){const i=s.transform,o=n.data.field(s.field);r.set(s.field,u2(i,o,e))}return r}class Uv extends mu{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class g2 extends mu{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y2{constructor(e,n,r,s){this.batchId=e,this.localWriteTime=n,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,n){const r=n.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&p2(i,e,r[s])}}applyToLocalView(e,n){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(n=eo(r,e,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(n=eo(r,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const r=Nv();return this.mutations.forEach(s=>{const i=e.get(s.key),o=i.overlayedDocument;let l=this.applyToLocalView(o,i.mutatedFields);l=n.has(s.key)?null:l;const u=jv(o,l);u!==null&&r.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(J.min())}),r}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),le())}isEqual(e){return this.batchId===e.batchId&&Ws(this.mutations,e.mutations,(n,r)=>Rg(n,r))&&Ws(this.baseMutations,e.baseMutations,(n,r)=>Rg(n,r))}}class mf{constructor(e,n,r,s){this.batch=e,this.commitVersion=n,this.mutationResults=r,this.docVersions=s}static from(e,n,r){he(e.mutations.length===r.length,58842,{me:e.mutations.length,fe:r.length});let s=function(){return s2}();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,r[o].version);return new mf(e,n,r,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _2{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v2{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ne,ue;function w2(t){switch(t){case O.OK:return Q(64938);case O.CANCELLED:case O.UNKNOWN:case O.DEADLINE_EXCEEDED:case O.RESOURCE_EXHAUSTED:case O.INTERNAL:case O.UNAVAILABLE:case O.UNAUTHENTICATED:return!1;case O.INVALID_ARGUMENT:case O.NOT_FOUND:case O.ALREADY_EXISTS:case O.PERMISSION_DENIED:case O.FAILED_PRECONDITION:case O.ABORTED:case O.OUT_OF_RANGE:case O.UNIMPLEMENTED:case O.DATA_LOSS:return!0;default:return Q(15467,{code:t})}}function zv(t){if(t===void 0)return Cn("GRPC error has no .code"),O.UNKNOWN;switch(t){case Ne.OK:return O.OK;case Ne.CANCELLED:return O.CANCELLED;case Ne.UNKNOWN:return O.UNKNOWN;case Ne.DEADLINE_EXCEEDED:return O.DEADLINE_EXCEEDED;case Ne.RESOURCE_EXHAUSTED:return O.RESOURCE_EXHAUSTED;case Ne.INTERNAL:return O.INTERNAL;case Ne.UNAVAILABLE:return O.UNAVAILABLE;case Ne.UNAUTHENTICATED:return O.UNAUTHENTICATED;case Ne.INVALID_ARGUMENT:return O.INVALID_ARGUMENT;case Ne.NOT_FOUND:return O.NOT_FOUND;case Ne.ALREADY_EXISTS:return O.ALREADY_EXISTS;case Ne.PERMISSION_DENIED:return O.PERMISSION_DENIED;case Ne.FAILED_PRECONDITION:return O.FAILED_PRECONDITION;case Ne.ABORTED:return O.ABORTED;case Ne.OUT_OF_RANGE:return O.OUT_OF_RANGE;case Ne.UNIMPLEMENTED:return O.UNIMPLEMENTED;case Ne.DATA_LOSS:return O.DATA_LOSS;default:return Q(39323,{code:t})}}(ue=Ne||(Ne={}))[ue.OK=0]="OK",ue[ue.CANCELLED=1]="CANCELLED",ue[ue.UNKNOWN=2]="UNKNOWN",ue[ue.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ue[ue.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ue[ue.NOT_FOUND=5]="NOT_FOUND",ue[ue.ALREADY_EXISTS=6]="ALREADY_EXISTS",ue[ue.PERMISSION_DENIED=7]="PERMISSION_DENIED",ue[ue.UNAUTHENTICATED=16]="UNAUTHENTICATED",ue[ue.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ue[ue.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ue[ue.ABORTED=10]="ABORTED",ue[ue.OUT_OF_RANGE=11]="OUT_OF_RANGE",ue[ue.UNIMPLEMENTED=12]="UNIMPLEMENTED",ue[ue.INTERNAL=13]="INTERNAL",ue[ue.UNAVAILABLE=14]="UNAVAILABLE",ue[ue.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function E2(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x2=new dr([4294967295,4294967295],0);function Dg(t){const e=E2().encode(t),n=new nv;return n.update(e),new Uint8Array(n.digest())}function Vg(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new dr([n,r],0),new dr([s,i],0)]}class gf{constructor(e,n,r){if(this.bitmap=e,this.padding=n,this.hashCount=r,n<0||n>=8)throw new Fi(`Invalid padding: ${n}`);if(r<0)throw new Fi(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Fi(`Invalid hash count: ${r}`);if(e.length===0&&n!==0)throw new Fi(`Invalid padding when bitmap length is 0: ${n}`);this.ge=8*e.length-n,this.pe=dr.fromNumber(this.ge)}ye(e,n,r){let s=e.add(n.multiply(dr.fromNumber(r)));return s.compare(x2)===1&&(s=new dr([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const n=Dg(e),[r,s]=Vg(n);for(let i=0;i<this.hashCount;i++){const o=this.ye(r,s,i);if(!this.we(o))return!1}return!0}static create(e,n,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new gf(i,s,n);return r.forEach(l=>o.insert(l)),o}insert(e){if(this.ge===0)return;const n=Dg(e),[r,s]=Vg(n);for(let i=0;i<this.hashCount;i++){const o=this.ye(r,s,i);this.Se(o)}}Se(e){const n=Math.floor(e/8),r=e%8;this.bitmap[n]|=1<<r}}class Fi extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gu{constructor(e,n,r,s,i){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,n,r){const s=new Map;return s.set(e,jo.createSynthesizedTargetChangeForCurrentChange(e,n,r)),new gu(J.min(),s,new ke(ae),bn(),le())}}class jo{constructor(e,n,r,s,i){this.resumeToken=e,this.current=n,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,n,r){return new jo(r,n,le(),le(),le())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wa{constructor(e,n,r,s){this.be=e,this.removedTargetIds=n,this.key=r,this.De=s}}class Bv{constructor(e,n){this.targetId=e,this.Ce=n}}class $v{constructor(e,n,r=Ye.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=n,this.resumeToken=r,this.cause=s}}class Mg{constructor(){this.ve=0,this.Fe=Og(),this.Me=Ye.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=le(),n=le(),r=le();return this.Fe.forEach((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:n=n.add(s);break;case 1:r=r.add(s);break;default:Q(38017,{changeType:i})}}),new jo(this.Me,this.xe,e,n,r)}qe(){this.Oe=!1,this.Fe=Og()}Qe(e,n){this.Oe=!0,this.Fe=this.Fe.insert(e,n)}$e(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}Ue(){this.ve+=1}Ke(){this.ve-=1,he(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class T2{constructor(e){this.Ge=e,this.ze=new Map,this.je=bn(),this.Je=Sa(),this.He=Sa(),this.Ye=new ke(ae)}Ze(e){for(const n of e.be)e.De&&e.De.isFoundDocument()?this.Xe(n,e.De):this.et(n,e.key,e.De);for(const n of e.removedTargetIds)this.et(n,e.key,e.De)}tt(e){this.forEachTarget(e,n=>{const r=this.nt(n);switch(e.state){case 0:this.rt(n)&&r.Le(e.resumeToken);break;case 1:r.Ke(),r.Ne||r.qe(),r.Le(e.resumeToken);break;case 2:r.Ke(),r.Ne||this.removeTarget(n);break;case 3:this.rt(n)&&(r.We(),r.Le(e.resumeToken));break;case 4:this.rt(n)&&(this.it(n),r.Le(e.resumeToken));break;default:Q(56790,{state:e.state})}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.ze.forEach((r,s)=>{this.rt(s)&&n(s)})}st(e){const n=e.targetId,r=e.Ce.count,s=this.ot(n);if(s){const i=s.target;if(Uh(i))if(r===0){const o=new K(i.path);this.et(n,o,st.newNoDocument(o,J.min()))}else he(r===1,20013,{expectedCount:r});else{const o=this._t(n);if(o!==r){const l=this.ut(e),u=l?this.ct(l,e,o):1;if(u!==0){this.it(n);const h=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ye=this.Ye.insert(n,h)}}}}}ut(e){const n=e.Ce.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=n;let o,l;try{o=wr(r).toUint8Array()}catch(u){if(u instanceof pv)return qs("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{l=new gf(o,s,i)}catch(u){return qs(u instanceof Fi?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return l.ge===0?null:l}ct(e,n,r){return n.Ce.count===r-this.Pt(e,n.targetId)?0:2}Pt(e,n){const r=this.Ge.getRemoteKeysForTarget(n);let s=0;return r.forEach(i=>{const o=this.Ge.ht(),l=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(l)||(this.et(n,i,null),s++)}),s}Tt(e){const n=new Map;this.ze.forEach((i,o)=>{const l=this.ot(o);if(l){if(i.current&&Uh(l.target)){const u=new K(l.target.path);this.It(u).has(o)||this.Et(o,u)||this.et(o,u,st.newNoDocument(u,e))}i.Be&&(n.set(o,i.ke()),i.qe())}});let r=le();this.He.forEach((i,o)=>{let l=!0;o.forEachWhile(u=>{const h=this.ot(u);return!h||h.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(i))}),this.je.forEach((i,o)=>o.setReadTime(e));const s=new gu(e,n,this.Ye,this.je,r);return this.je=bn(),this.Je=Sa(),this.He=Sa(),this.Ye=new ke(ae),s}Xe(e,n){if(!this.rt(e))return;const r=this.Et(e,n.key)?2:0;this.nt(e).Qe(n.key,r),this.je=this.je.insert(n.key,n),this.Je=this.Je.insert(n.key,this.It(n.key).add(e)),this.He=this.He.insert(n.key,this.dt(n.key).add(e))}et(e,n,r){if(!this.rt(e))return;const s=this.nt(e);this.Et(e,n)?s.Qe(n,1):s.$e(n),this.He=this.He.insert(n,this.dt(n).delete(e)),this.He=this.He.insert(n,this.dt(n).add(e)),r&&(this.je=this.je.insert(n,r))}removeTarget(e){this.ze.delete(e)}_t(e){const n=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}Ue(e){this.nt(e).Ue()}nt(e){let n=this.ze.get(e);return n||(n=new Mg,this.ze.set(e,n)),n}dt(e){let n=this.He.get(e);return n||(n=new ze(ae),this.He=this.He.insert(e,n)),n}It(e){let n=this.Je.get(e);return n||(n=new ze(ae),this.Je=this.Je.insert(e,n)),n}rt(e){const n=this.ot(e)!==null;return n||$("WatchChangeAggregator","Detected inactive target",e),n}ot(e){const n=this.ze.get(e);return n&&n.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new Mg),this.Ge.getRemoteKeysForTarget(e).forEach(n=>{this.et(e,n,null)})}Et(e,n){return this.Ge.getRemoteKeysForTarget(e).has(n)}}function Sa(){return new ke(K.comparator)}function Og(){return new ke(K.comparator)}const I2={asc:"ASCENDING",desc:"DESCENDING"},S2={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},k2={and:"AND",or:"OR"};class A2{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function Bh(t,e){return t.useProto3Json||uu(e)?e:{value:e}}function Vl(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Hv(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function C2(t,e){return Vl(t,e.toTimestamp())}function rn(t){return he(!!t,49232),J.fromTimestamp(function(n){const r=vr(n);return new we(r.seconds,r.nanos)}(t))}function yf(t,e){return $h(t,e).canonicalString()}function $h(t,e){const n=function(s){return new ve(["projects",s.projectId,"databases",s.database])}(t).child("documents");return e===void 0?n:n.child(e)}function qv(t){const e=ve.fromString(t);return he(Xv(e),10190,{key:e.toString()}),e}function Hh(t,e){return yf(t.databaseId,e.path)}function Cc(t,e){const n=qv(e);if(n.get(1)!==t.databaseId.projectId)throw new W(O.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new W(O.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new K(Gv(n))}function Wv(t,e){return yf(t.databaseId,e)}function b2(t){const e=qv(t);return e.length===4?ve.emptyPath():Gv(e)}function qh(t){return new ve(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function Gv(t){return he(t.length>4&&t.get(4)==="documents",29091,{key:t.toString()}),t.popFirst(5)}function Lg(t,e,n){return{name:Hh(t,e),fields:n.value.mapValue.fields}}function R2(t,e){let n;if("targetChange"in e){e.targetChange;const r=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:Q(39313,{state:h})}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=function(h,p){return h.useProto3Json?(he(p===void 0||typeof p=="string",58123),Ye.fromBase64String(p||"")):(he(p===void 0||p instanceof Buffer||p instanceof Uint8Array,16193),Ye.fromUint8Array(p||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(h){const p=h.code===void 0?O.UNKNOWN:zv(h.code);return new W(p,h.message||"")}(o);n=new $v(r,s,i,l||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=Cc(t,r.document.name),i=rn(r.document.updateTime),o=r.document.createTime?rn(r.document.createTime):J.min(),l=new yt({mapValue:{fields:r.document.fields}}),u=st.newFoundDocument(s,i,o,l),h=r.targetIds||[],p=r.removedTargetIds||[];n=new Wa(h,p,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=Cc(t,r.document),i=r.readTime?rn(r.readTime):J.min(),o=st.newNoDocument(s,i),l=r.removedTargetIds||[];n=new Wa([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=Cc(t,r.document),i=r.removedTargetIds||[];n=new Wa([],i,s,null)}else{if(!("filter"in e))return Q(11601,{Rt:e});{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,o=new v2(s,i),l=r.targetId;n=new Bv(l,o)}}return n}function P2(t,e){let n;if(e instanceof Lo)n={update:Lg(t,e.key,e.value)};else if(e instanceof Uv)n={delete:Hh(t,e.key)};else if(e instanceof Cr)n={update:Lg(t,e.key,e.data),updateMask:U2(e.fieldMask)};else{if(!(e instanceof g2))return Q(16599,{Vt:e.type});n={verify:Hh(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(i,o){const l=o.transform;if(l instanceof Nl)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Qs)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof ko)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Dl)return{fieldPath:o.field.canonicalString(),increment:l.Ae};throw Q(20930,{transform:o.transform})}(0,r))),e.precondition.isNone||(n.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:C2(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:Q(27497)}(t,e.precondition)),n}function N2(t,e){return t&&t.length>0?(he(e!==void 0,14353),t.map(n=>function(s,i){let o=s.updateTime?rn(s.updateTime):rn(i);return o.isEqual(J.min())&&(o=rn(i)),new f2(o,s.transformResults||[])}(n,e))):[]}function D2(t,e){return{documents:[Wv(t,e.path)]}}function V2(t,e){const n={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=Wv(t,s);const i=function(h){if(h.length!==0)return Qv(cn.create(h,"and"))}(e.filters);i&&(n.structuredQuery.where=i);const o=function(h){if(h.length!==0)return h.map(p=>function(g){return{field:hs(g.field),direction:L2(g.dir)}}(p))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=Bh(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{ft:n,parent:s}}function M2(t){let e=b2(t.parent);const n=t.structuredQuery,r=n.from?n.from.length:0;let s=null;if(r>0){he(r===1,65062);const p=n.from[0];p.allDescendants?s=p.collectionId:e=e.child(p.collectionId)}let i=[];n.where&&(i=function(m){const g=Kv(m);return g instanceof cn&&Iv(g)?g.getFilters():[g]}(n.where));let o=[];n.orderBy&&(o=function(m){return m.map(g=>function(b){return new Pl(ds(b.field),function(V){switch(V){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(b.direction))}(g))}(n.orderBy));let l=null;n.limit&&(l=function(m){let g;return g=typeof m=="object"?m.value:m,uu(g)?null:g}(n.limit));let u=null;n.startAt&&(u=function(m){const g=!!m.before,A=m.values||[];return new Rl(A,g)}(n.startAt));let h=null;return n.endAt&&(h=function(m){const g=!m.before,A=m.values||[];return new Rl(A,g)}(n.endAt)),JS(e,s,o,i,l,"F",u,h)}function O2(t,e){const n=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Q(28987,{purpose:s})}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function Kv(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=ds(n.unaryFilter.field);return Fe.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=ds(n.unaryFilter.field);return Fe.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=ds(n.unaryFilter.field);return Fe.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=ds(n.unaryFilter.field);return Fe.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return Q(61313);default:return Q(60726)}}(t):t.fieldFilter!==void 0?function(n){return Fe.create(ds(n.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return Q(58110);default:return Q(50506)}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return cn.create(n.compositeFilter.filters.map(r=>Kv(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return Q(1026)}}(n.compositeFilter.op))}(t):Q(30097,{filter:t})}function L2(t){return I2[t]}function j2(t){return S2[t]}function F2(t){return k2[t]}function hs(t){return{fieldPath:t.canonicalString()}}function ds(t){return Ke.fromServerFormat(t.fieldPath)}function Qv(t){return t instanceof Fe?function(n){if(n.op==="=="){if(Ig(n.value))return{unaryFilter:{field:hs(n.field),op:"IS_NAN"}};if(Tg(n.value))return{unaryFilter:{field:hs(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Ig(n.value))return{unaryFilter:{field:hs(n.field),op:"IS_NOT_NAN"}};if(Tg(n.value))return{unaryFilter:{field:hs(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:hs(n.field),op:j2(n.op),value:n.value}}}(t):t instanceof cn?function(n){const r=n.getFilters().map(s=>Qv(s));return r.length===1?r[0]:{compositeFilter:{op:F2(n.op),filters:r}}}(t):Q(54877,{filter:t})}function U2(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function Xv(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class er{constructor(e,n,r,s,i=J.min(),o=J.min(),l=Ye.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=n,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=u}withSequenceNumber(e){return new er(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new er(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new er(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new er(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z2{constructor(e){this.yt=e}}function B2(t){const e=M2({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?zh(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $2{constructor(){this.Cn=new H2}addToCollectionParentIndex(e,n){return this.Cn.add(n),M.resolve()}getCollectionParents(e,n){return M.resolve(this.Cn.getEntries(n))}addFieldIndex(e,n){return M.resolve()}deleteFieldIndex(e,n){return M.resolve()}deleteAllFieldIndexes(e){return M.resolve()}createTargetIndexes(e,n){return M.resolve()}getDocumentsMatchingTarget(e,n){return M.resolve(null)}getIndexType(e,n){return M.resolve(0)}getFieldIndexes(e,n){return M.resolve([])}getNextCollectionGroupToUpdate(e){return M.resolve(null)}getMinOffset(e,n){return M.resolve(_r.min())}getMinOffsetFromCollectionGroup(e,n){return M.resolve(_r.min())}updateCollectionGroup(e,n,r){return M.resolve()}updateIndexEntries(e,n){return M.resolve()}}class H2{constructor(){this.index={}}add(e){const n=e.lastSegment(),r=e.popLast(),s=this.index[n]||new ze(ve.comparator),i=!s.has(r);return this.index[n]=s.add(r),i}has(e){const n=e.lastSegment(),r=e.popLast(),s=this.index[n];return s&&s.has(r)}getEntries(e){return(this.index[e]||new ze(ve.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jg={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Yv=41943040;class mt{static withCacheSize(e){return new mt(e,mt.DEFAULT_COLLECTION_PERCENTILE,mt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,n,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=n,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */mt.DEFAULT_COLLECTION_PERCENTILE=10,mt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,mt.DEFAULT=new mt(Yv,mt.DEFAULT_COLLECTION_PERCENTILE,mt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),mt.DISABLED=new mt(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xs{constructor(e){this.ar=e}next(){return this.ar+=2,this.ar}static ur(){return new Xs(0)}static cr(){return new Xs(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fg="LruGarbageCollector",q2=1048576;function Ug([t,e],[n,r]){const s=ae(t,n);return s===0?ae(e,r):s}class W2{constructor(e){this.Ir=e,this.buffer=new ze(Ug),this.Er=0}dr(){return++this.Er}Ar(e){const n=[e,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(n);else{const r=this.buffer.last();Ug(n,r)<0&&(this.buffer=this.buffer.delete(r).add(n))}}get maxValue(){return this.buffer.last()[0]}}class G2{constructor(e,n,r){this.garbageCollector=e,this.asyncQueue=n,this.localStore=r,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Vr(e){$(Fg,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(n){oi(n)?$(Fg,"Ignoring IndexedDB error during garbage collection: ",n):await ii(n)}await this.Vr(3e5)})}}class K2{constructor(e,n){this.mr=e,this.params=n}calculateTargetCount(e,n){return this.mr.gr(e).next(r=>Math.floor(n/100*r))}nthSequenceNumber(e,n){if(n===0)return M.resolve(lu.ce);const r=new W2(n);return this.mr.forEachTarget(e,s=>r.Ar(s.sequenceNumber)).next(()=>this.mr.pr(e,s=>r.Ar(s))).next(()=>r.maxValue)}removeTargets(e,n,r){return this.mr.removeTargets(e,n,r)}removeOrphanedDocuments(e,n){return this.mr.removeOrphanedDocuments(e,n)}collect(e,n){return this.params.cacheSizeCollectionThreshold===-1?($("LruGarbageCollector","Garbage collection skipped; disabled"),M.resolve(jg)):this.getCacheSize(e).next(r=>r<this.params.cacheSizeCollectionThreshold?($("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),jg):this.yr(e,n))}getCacheSize(e){return this.mr.getCacheSize(e)}yr(e,n){let r,s,i,o,l,u,h;const p=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(m=>(m>this.params.maximumSequenceNumbersToCollect?($("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),s=this.params.maximumSequenceNumbersToCollect):s=m,o=Date.now(),this.nthSequenceNumber(e,s))).next(m=>(r=m,l=Date.now(),this.removeTargets(e,r,n))).next(m=>(i=m,u=Date.now(),this.removeOrphanedDocuments(e,r))).next(m=>(h=Date.now(),us()<=oe.DEBUG&&$("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-p}ms
	Determined least recently used ${s} in `+(l-o)+`ms
	Removed ${i} targets in `+(u-l)+`ms
	Removed ${m} documents in `+(h-u)+`ms
Total Duration: ${h-p}ms`),M.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:m})))}}function Q2(t,e){return new K2(t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X2{constructor(){this.changes=new ns(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,st.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?M.resolve(r):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y2{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J2{constructor(e,n,r,s){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,n){let r=null;return this.documentOverlayCache.getOverlay(e,n).next(s=>(r=s,this.remoteDocumentCache.getEntry(e,n))).next(s=>(r!==null&&eo(r.mutation,s,St.empty(),we.now()),s))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.getLocalViewOfDocuments(e,r,le()).next(()=>r))}getLocalViewOfDocuments(e,n,r=le()){const s=Ur();return this.populateOverlays(e,s,n).next(()=>this.computeViews(e,n,s,r).next(i=>{let o=ji();return i.forEach((l,u)=>{o=o.insert(l,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const r=Ur();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,le()))}populateOverlays(e,n,r){const s=[];return r.forEach(i=>{n.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(e,s).next(i=>{i.forEach((o,l)=>{n.set(o,l)})})}computeViews(e,n,r,s){let i=bn();const o=Zi(),l=function(){return Zi()}();return n.forEach((u,h)=>{const p=r.get(h.key);s.has(h.key)&&(p===void 0||p.mutation instanceof Cr)?i=i.insert(h.key,h):p!==void 0?(o.set(h.key,p.mutation.getFieldMask()),eo(p.mutation,h,p.mutation.getFieldMask(),we.now())):o.set(h.key,St.empty())}),this.recalculateAndSaveOverlays(e,i).next(u=>(u.forEach((h,p)=>o.set(h,p)),n.forEach((h,p)=>l.set(h,new Y2(p,o.get(h)??null))),l))}recalculateAndSaveOverlays(e,n){const r=Zi();let s=new ke((o,l)=>o-l),i=le();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const l of o)l.keys().forEach(u=>{const h=n.get(u);if(h===null)return;let p=r.get(u)||St.empty();p=l.applyToLocalView(h,p),r.set(u,p);const m=(s.get(l.batchId)||le()).add(u);s=s.insert(l.batchId,m)})}).next(()=>{const o=[],l=s.getReverseIterator();for(;l.hasNext();){const u=l.getNext(),h=u.key,p=u.value,m=Nv();p.forEach(g=>{if(!i.has(g)){const A=jv(n.get(g),r.get(g));A!==null&&m.set(g,A),i=i.add(g)}}),o.push(this.documentOverlayCache.saveOverlays(e,h,m))}return M.waitFor(o)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,n,r,s){return function(o){return K.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):ZS(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,r,s):this.getDocumentsMatchingCollectionQuery(e,n,r,s)}getNextDocuments(e,n,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,r,s).next(i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,r.largestBatchId,s-i.size):M.resolve(Ur());let l=xo,u=i;return o.next(h=>M.forEach(h,(p,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),i.get(p)?M.resolve():this.remoteDocumentCache.getEntry(e,p).next(g=>{u=u.insert(p,g)}))).next(()=>this.populateOverlays(e,h,i)).next(()=>this.computeViews(e,u,h,le())).next(p=>({batchId:l,changes:Pv(p)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new K(n)).next(r=>{let s=ji();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(e,n,r,s){const i=n.collectionGroup;let o=ji();return this.indexManager.getCollectionParents(e,i).next(l=>M.forEach(l,u=>{const h=function(m,g){return new hu(g,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(n,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,h,r,s).next(p=>{p.forEach((m,g)=>{o=o.insert(m,g)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,r.largestBatchId).next(o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,r,i,s))).next(o=>{i.forEach((u,h)=>{const p=h.getKey();o.get(p)===null&&(o=o.insert(p,st.newInvalidDocument(p)))});let l=ji();return o.forEach((u,h)=>{const p=i.get(u);p!==void 0&&eo(p.mutation,h,St.empty(),we.now()),fu(n,h)&&(l=l.insert(u,h))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z2{constructor(e){this.serializer=e,this.Lr=new Map,this.kr=new Map}getBundleMetadata(e,n){return M.resolve(this.Lr.get(n))}saveBundleMetadata(e,n){return this.Lr.set(n.id,function(s){return{id:s.id,version:s.version,createTime:rn(s.createTime)}}(n)),M.resolve()}getNamedQuery(e,n){return M.resolve(this.kr.get(n))}saveNamedQuery(e,n){return this.kr.set(n.name,function(s){return{name:s.name,query:B2(s.bundledQuery),readTime:rn(s.readTime)}}(n)),M.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ek{constructor(){this.overlays=new ke(K.comparator),this.qr=new Map}getOverlay(e,n){return M.resolve(this.overlays.get(n))}getOverlays(e,n){const r=Ur();return M.forEach(n,s=>this.getOverlay(e,s).next(i=>{i!==null&&r.set(s,i)})).next(()=>r)}saveOverlays(e,n,r){return r.forEach((s,i)=>{this.St(e,n,i)}),M.resolve()}removeOverlaysForBatchId(e,n,r){const s=this.qr.get(r);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.qr.delete(r)),M.resolve()}getOverlaysForCollection(e,n,r){const s=Ur(),i=n.length+1,o=new K(n.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const u=l.getNext().value,h=u.getKey();if(!n.isPrefixOf(h.path))break;h.path.length===i&&u.largestBatchId>r&&s.set(u.getKey(),u)}return M.resolve(s)}getOverlaysForCollectionGroup(e,n,r,s){let i=new ke((h,p)=>h-p);const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===n&&h.largestBatchId>r){let p=i.get(h.largestBatchId);p===null&&(p=Ur(),i=i.insert(h.largestBatchId,p)),p.set(h.getKey(),h)}}const l=Ur(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((h,p)=>l.set(h,p)),!(l.size()>=s)););return M.resolve(l)}St(e,n,r){const s=this.overlays.get(r.key);if(s!==null){const o=this.qr.get(s.largestBatchId).delete(r.key);this.qr.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new _2(n,r));let i=this.qr.get(n);i===void 0&&(i=le(),this.qr.set(n,i)),this.qr.set(n,i.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tk{constructor(){this.sessionToken=Ye.EMPTY_BYTE_STRING}getSessionToken(e){return M.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,M.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _f{constructor(){this.Qr=new ze($e.$r),this.Ur=new ze($e.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(e,n){const r=new $e(e,n);this.Qr=this.Qr.add(r),this.Ur=this.Ur.add(r)}Wr(e,n){e.forEach(r=>this.addReference(r,n))}removeReference(e,n){this.Gr(new $e(e,n))}zr(e,n){e.forEach(r=>this.removeReference(r,n))}jr(e){const n=new K(new ve([])),r=new $e(n,e),s=new $e(n,e+1),i=[];return this.Ur.forEachInRange([r,s],o=>{this.Gr(o),i.push(o.key)}),i}Jr(){this.Qr.forEach(e=>this.Gr(e))}Gr(e){this.Qr=this.Qr.delete(e),this.Ur=this.Ur.delete(e)}Hr(e){const n=new K(new ve([])),r=new $e(n,e),s=new $e(n,e+1);let i=le();return this.Ur.forEachInRange([r,s],o=>{i=i.add(o.key)}),i}containsKey(e){const n=new $e(e,0),r=this.Qr.firstAfterOrEqual(n);return r!==null&&e.isEqual(r.key)}}class $e{constructor(e,n){this.key=e,this.Yr=n}static $r(e,n){return K.comparator(e.key,n.key)||ae(e.Yr,n.Yr)}static Kr(e,n){return ae(e.Yr,n.Yr)||K.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nk{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.tr=1,this.Zr=new ze($e.$r)}checkEmpty(e){return M.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,r,s){const i=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new y2(i,n,r,s);this.mutationQueue.push(o);for(const l of s)this.Zr=this.Zr.add(new $e(l.key,i)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return M.resolve(o)}lookupMutationBatch(e,n){return M.resolve(this.Xr(n))}getNextMutationBatchAfterBatchId(e,n){const r=n+1,s=this.ei(r),i=s<0?0:s;return M.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return M.resolve(this.mutationQueue.length===0?lf:this.tr-1)}getAllMutationBatches(e){return M.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const r=new $e(n,0),s=new $e(n,Number.POSITIVE_INFINITY),i=[];return this.Zr.forEachInRange([r,s],o=>{const l=this.Xr(o.Yr);i.push(l)}),M.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new ze(ae);return n.forEach(s=>{const i=new $e(s,0),o=new $e(s,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([i,o],l=>{r=r.add(l.Yr)})}),M.resolve(this.ti(r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,s=r.length+1;let i=r;K.isDocumentKey(i)||(i=i.child(""));const o=new $e(new K(i),0);let l=new ze(ae);return this.Zr.forEachWhile(u=>{const h=u.key.path;return!!r.isPrefixOf(h)&&(h.length===s&&(l=l.add(u.Yr)),!0)},o),M.resolve(this.ti(l))}ti(e){const n=[];return e.forEach(r=>{const s=this.Xr(r);s!==null&&n.push(s)}),n}removeMutationBatch(e,n){he(this.ni(n.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Zr;return M.forEach(n.mutations,s=>{const i=new $e(s.key,n.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.Zr=r})}ir(e){}containsKey(e,n){const r=new $e(n,0),s=this.Zr.firstAfterOrEqual(r);return M.resolve(n.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,M.resolve()}ni(e,n){return this.ei(e)}ei(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Xr(e){const n=this.ei(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rk{constructor(e){this.ri=e,this.docs=function(){return new ke(K.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const r=n.key,s=this.docs.get(r),i=s?s.size:0,o=this.ri(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const r=this.docs.get(n);return M.resolve(r?r.document.mutableCopy():st.newInvalidDocument(n))}getEntries(e,n){let r=bn();return n.forEach(s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():st.newInvalidDocument(s))}),M.resolve(r)}getDocumentsMatchingQuery(e,n,r,s){let i=bn();const o=n.path,l=new K(o.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(l);for(;u.hasNext();){const{key:h,value:{document:p}}=u.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||RS(bS(p),r)<=0||(s.has(p.key)||fu(n,p))&&(i=i.insert(p.key,p.mutableCopy()))}return M.resolve(i)}getAllFromCollectionGroup(e,n,r,s){Q(9500)}ii(e,n){return M.forEach(this.docs,r=>n(r))}newChangeBuffer(e){return new sk(this)}getSize(e){return M.resolve(this.size)}}class sk extends X2{constructor(e){super(),this.Nr=e}applyChanges(e){const n=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?n.push(this.Nr.addEntry(e,s)):this.Nr.removeEntry(r)}),M.waitFor(n)}getFromCache(e,n){return this.Nr.getEntry(e,n)}getAllFromCache(e,n){return this.Nr.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ik{constructor(e){this.persistence=e,this.si=new ns(n=>hf(n),df),this.lastRemoteSnapshotVersion=J.min(),this.highestTargetId=0,this.oi=0,this._i=new _f,this.targetCount=0,this.ai=Xs.ur()}forEachTarget(e,n){return this.si.forEach((r,s)=>n(s)),M.resolve()}getLastRemoteSnapshotVersion(e){return M.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return M.resolve(this.oi)}allocateTargetId(e){return this.highestTargetId=this.ai.next(),M.resolve(this.highestTargetId)}setTargetsMetadata(e,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.oi&&(this.oi=n),M.resolve()}Pr(e){this.si.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.ai=new Xs(n),this.highestTargetId=n),e.sequenceNumber>this.oi&&(this.oi=e.sequenceNumber)}addTargetData(e,n){return this.Pr(n),this.targetCount+=1,M.resolve()}updateTargetData(e,n){return this.Pr(n),M.resolve()}removeTargetData(e,n){return this.si.delete(n.target),this._i.jr(n.targetId),this.targetCount-=1,M.resolve()}removeTargets(e,n,r){let s=0;const i=[];return this.si.forEach((o,l)=>{l.sequenceNumber<=n&&r.get(l.targetId)===null&&(this.si.delete(o),i.push(this.removeMatchingKeysForTargetId(e,l.targetId)),s++)}),M.waitFor(i).next(()=>s)}getTargetCount(e){return M.resolve(this.targetCount)}getTargetData(e,n){const r=this.si.get(n)||null;return M.resolve(r)}addMatchingKeys(e,n,r){return this._i.Wr(n,r),M.resolve()}removeMatchingKeys(e,n,r){this._i.zr(n,r);const s=this.persistence.referenceDelegate,i=[];return s&&n.forEach(o=>{i.push(s.markPotentiallyOrphaned(e,o))}),M.waitFor(i)}removeMatchingKeysForTargetId(e,n){return this._i.jr(n),M.resolve()}getMatchingKeysForTargetId(e,n){const r=this._i.Hr(n);return M.resolve(r)}containsKey(e,n){return M.resolve(this._i.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jv{constructor(e,n){this.ui={},this.overlays={},this.ci=new lu(0),this.li=!1,this.li=!0,this.hi=new tk,this.referenceDelegate=e(this),this.Pi=new ik(this),this.indexManager=new $2,this.remoteDocumentCache=function(s){return new rk(s)}(r=>this.referenceDelegate.Ti(r)),this.serializer=new z2(n),this.Ii=new Z2(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new ek,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let r=this.ui[e.toKey()];return r||(r=new nk(n,this.referenceDelegate),this.ui[e.toKey()]=r),r}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(e,n,r){$("MemoryPersistence","Starting transaction:",e);const s=new ok(this.ci.next());return this.referenceDelegate.Ei(),r(s).next(i=>this.referenceDelegate.di(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}Ai(e,n){return M.or(Object.values(this.ui).map(r=>()=>r.containsKey(e,n)))}}class ok extends NS{constructor(e){super(),this.currentSequenceNumber=e}}class vf{constructor(e){this.persistence=e,this.Ri=new _f,this.Vi=null}static mi(e){return new vf(e)}get fi(){if(this.Vi)return this.Vi;throw Q(60996)}addReference(e,n,r){return this.Ri.addReference(r,n),this.fi.delete(r.toString()),M.resolve()}removeReference(e,n,r){return this.Ri.removeReference(r,n),this.fi.add(r.toString()),M.resolve()}markPotentiallyOrphaned(e,n){return this.fi.add(n.toString()),M.resolve()}removeTarget(e,n){this.Ri.jr(n.targetId).forEach(s=>this.fi.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,n.targetId).next(s=>{s.forEach(i=>this.fi.add(i.toString()))}).next(()=>r.removeTargetData(e,n))}Ei(){this.Vi=new Set}di(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return M.forEach(this.fi,r=>{const s=K.fromPath(r);return this.gi(e,s).next(i=>{i||n.removeEntry(s,J.min())})}).next(()=>(this.Vi=null,n.apply(e)))}updateLimboDocument(e,n){return this.gi(e,n).next(r=>{r?this.fi.delete(n.toString()):this.fi.add(n.toString())})}Ti(e){return 0}gi(e,n){return M.or([()=>M.resolve(this.Ri.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Ai(e,n)])}}class Ml{constructor(e,n){this.persistence=e,this.pi=new ns(r=>MS(r.path),(r,s)=>r.isEqual(s)),this.garbageCollector=Q2(this,n)}static mi(e,n){return new Ml(e,n)}Ei(){}di(e){return M.resolve()}forEachTarget(e,n){return this.persistence.getTargetCache().forEachTarget(e,n)}gr(e){const n=this.wr(e);return this.persistence.getTargetCache().getTargetCount(e).next(r=>n.next(s=>r+s))}wr(e){let n=0;return this.pr(e,r=>{n++}).next(()=>n)}pr(e,n){return M.forEach(this.pi,(r,s)=>this.br(e,r,s).next(i=>i?M.resolve():n(s)))}removeTargets(e,n,r){return this.persistence.getTargetCache().removeTargets(e,n,r)}removeOrphanedDocuments(e,n){let r=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.ii(e,o=>this.br(e,o,n).next(l=>{l||(r++,i.removeEntry(o,J.min()))})).next(()=>i.apply(e)).next(()=>r)}markPotentiallyOrphaned(e,n){return this.pi.set(n,e.currentSequenceNumber),M.resolve()}removeTarget(e,n){const r=n.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,n,r){return this.pi.set(r,e.currentSequenceNumber),M.resolve()}removeReference(e,n,r){return this.pi.set(r,e.currentSequenceNumber),M.resolve()}updateLimboDocument(e,n){return this.pi.set(n,e.currentSequenceNumber),M.resolve()}Ti(e){let n=e.key.toString().length;return e.isFoundDocument()&&(n+=$a(e.data.value)),n}br(e,n,r){return M.or([()=>this.persistence.Ai(e,n),()=>this.persistence.getTargetCache().containsKey(e,n),()=>{const s=this.pi.get(n);return M.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wf{constructor(e,n,r,s){this.targetId=e,this.fromCache=n,this.Es=r,this.ds=s}static As(e,n){let r=le(),s=le();for(const i of n.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new wf(e,n.fromCache,r,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ak{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lk{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=function(){return XT()?8:DS(ot())>0?6:4}()}initialize(e,n){this.ps=e,this.indexManager=n,this.Rs=!0}getDocumentsMatchingQuery(e,n,r,s){const i={result:null};return this.ys(e,n).next(o=>{i.result=o}).next(()=>{if(!i.result)return this.ws(e,n,s,r).next(o=>{i.result=o})}).next(()=>{if(i.result)return;const o=new ak;return this.Ss(e,n,o).next(l=>{if(i.result=l,this.Vs)return this.bs(e,n,o,l.size)})}).next(()=>i.result)}bs(e,n,r,s){return r.documentReadCount<this.fs?(us()<=oe.DEBUG&&$("QueryEngine","SDK will not create cache indexes for query:",cs(n),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),M.resolve()):(us()<=oe.DEBUG&&$("QueryEngine","Query:",cs(n),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.gs*s?(us()<=oe.DEBUG&&$("QueryEngine","The SDK decides to create cache indexes for query:",cs(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,tn(n))):M.resolve())}ys(e,n){if(Cg(n))return M.resolve(null);let r=tn(n);return this.indexManager.getIndexType(e,r).next(s=>s===0?null:(n.limit!==null&&s===1&&(n=zh(n,null,"F"),r=tn(n)),this.indexManager.getDocumentsMatchingTarget(e,r).next(i=>{const o=le(...i);return this.ps.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,r).next(u=>{const h=this.Ds(n,l);return this.Cs(n,h,o,u.readTime)?this.ys(e,zh(n,null,"F")):this.vs(e,h,n,u)}))})))}ws(e,n,r,s){return Cg(n)||s.isEqual(J.min())?M.resolve(null):this.ps.getDocuments(e,r).next(i=>{const o=this.Ds(n,i);return this.Cs(n,o,r,s)?M.resolve(null):(us()<=oe.DEBUG&&$("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),cs(n)),this.vs(e,o,n,CS(s,xo)).next(l=>l))})}Ds(e,n){let r=new ze(bv(e));return n.forEach((s,i)=>{fu(e,i)&&(r=r.add(i))}),r}Cs(e,n,r,s){if(e.limit===null)return!1;if(r.size!==n.size)return!0;const i=e.limitType==="F"?n.last():n.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Ss(e,n,r){return us()<=oe.DEBUG&&$("QueryEngine","Using full collection scan to execute query:",cs(n)),this.ps.getDocumentsMatchingQuery(e,n,_r.min(),r)}vs(e,n,r,s){return this.ps.getDocumentsMatchingQuery(e,r,s).next(i=>(n.forEach(o=>{i=i.insert(o.key,o)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ef="LocalStore",uk=3e8;class ck{constructor(e,n,r,s){this.persistence=e,this.Fs=n,this.serializer=s,this.Ms=new ke(ae),this.xs=new ns(i=>hf(i),df),this.Os=new Map,this.Ns=e.getRemoteDocumentCache(),this.Pi=e.getTargetCache(),this.Ii=e.getBundleCache(),this.Bs(r)}Bs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new J2(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.Ms))}}function hk(t,e,n,r){return new ck(t,e,n,r)}async function Zv(t,e){const n=Z(t);return await n.persistence.runTransaction("Handle user change","readonly",r=>{let s;return n.mutationQueue.getAllMutationBatches(r).next(i=>(s=i,n.Bs(e),n.mutationQueue.getAllMutationBatches(r))).next(i=>{const o=[],l=[];let u=le();for(const h of s){o.push(h.batchId);for(const p of h.mutations)u=u.add(p.key)}for(const h of i){l.push(h.batchId);for(const p of h.mutations)u=u.add(p.key)}return n.localDocuments.getDocuments(r,u).next(h=>({Ls:h,removedBatchIds:o,addedBatchIds:l}))})})}function dk(t,e){const n=Z(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=e.batch.keys(),i=n.Ns.newChangeBuffer({trackRemovals:!0});return function(l,u,h,p){const m=h.batch,g=m.keys();let A=M.resolve();return g.forEach(b=>{A=A.next(()=>p.getEntry(u,b)).next(R=>{const V=h.docVersions.get(b);he(V!==null,48541),R.version.compareTo(V)<0&&(m.applyToRemoteDocument(R,h),R.isValidDocument()&&(R.setReadTime(h.commitVersion),p.addEntry(R)))})}),A.next(()=>l.mutationQueue.removeMutationBatch(u,m))}(n,r,e,i).next(()=>i.apply(r)).next(()=>n.mutationQueue.performConsistencyCheck(r)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let u=le();for(let h=0;h<l.mutationResults.length;++h)l.mutationResults[h].transformResults.length>0&&(u=u.add(l.batch.mutations[h].key));return u}(e))).next(()=>n.localDocuments.getDocuments(r,s))})}function ew(t){const e=Z(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Pi.getLastRemoteSnapshotVersion(n))}function fk(t,e){const n=Z(t),r=e.snapshotVersion;let s=n.Ms;return n.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const o=n.Ns.newChangeBuffer({trackRemovals:!0});s=n.Ms;const l=[];e.targetChanges.forEach((p,m)=>{const g=s.get(m);if(!g)return;l.push(n.Pi.removeMatchingKeys(i,p.removedDocuments,m).next(()=>n.Pi.addMatchingKeys(i,p.addedDocuments,m)));let A=g.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?A=A.withResumeToken(Ye.EMPTY_BYTE_STRING,J.min()).withLastLimboFreeSnapshotVersion(J.min()):p.resumeToken.approximateByteSize()>0&&(A=A.withResumeToken(p.resumeToken,r)),s=s.insert(m,A),function(R,V,I){return R.resumeToken.approximateByteSize()===0||V.snapshotVersion.toMicroseconds()-R.snapshotVersion.toMicroseconds()>=uk?!0:I.addedDocuments.size+I.modifiedDocuments.size+I.removedDocuments.size>0}(g,A,p)&&l.push(n.Pi.updateTargetData(i,A))});let u=bn(),h=le();if(e.documentUpdates.forEach(p=>{e.resolvedLimboDocuments.has(p)&&l.push(n.persistence.referenceDelegate.updateLimboDocument(i,p))}),l.push(pk(i,o,e.documentUpdates).next(p=>{u=p.ks,h=p.qs})),!r.isEqual(J.min())){const p=n.Pi.getLastRemoteSnapshotVersion(i).next(m=>n.Pi.setTargetsMetadata(i,i.currentSequenceNumber,r));l.push(p)}return M.waitFor(l).next(()=>o.apply(i)).next(()=>n.localDocuments.getLocalViewOfDocuments(i,u,h)).next(()=>u)}).then(i=>(n.Ms=s,i))}function pk(t,e,n){let r=le(),s=le();return n.forEach(i=>r=r.add(i)),e.getEntries(t,r).next(i=>{let o=bn();return n.forEach((l,u)=>{const h=i.get(l);u.isFoundDocument()!==h.isFoundDocument()&&(s=s.add(l)),u.isNoDocument()&&u.version.isEqual(J.min())?(e.removeEntry(l,u.readTime),o=o.insert(l,u)):!h.isValidDocument()||u.version.compareTo(h.version)>0||u.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(u),o=o.insert(l,u)):$(Ef,"Ignoring outdated watch update for ",l,". Current version:",h.version," Watch version:",u.version)}),{ks:o,qs:s}})}function mk(t,e){const n=Z(t);return n.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=lf),n.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function gk(t,e){const n=Z(t);return n.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return n.Pi.getTargetData(r,e).next(i=>i?(s=i,M.resolve(s)):n.Pi.allocateTargetId(r).next(o=>(s=new er(e,o,"TargetPurposeListen",r.currentSequenceNumber),n.Pi.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=n.Ms.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(n.Ms=n.Ms.insert(r.targetId,r),n.xs.set(e,r.targetId)),r})}async function Wh(t,e,n){const r=Z(t),s=r.Ms.get(e),i=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",i,o=>r.persistence.referenceDelegate.removeTarget(o,s))}catch(o){if(!oi(o))throw o;$(Ef,`Failed to update sequence numbers for target ${e}: ${o}`)}r.Ms=r.Ms.remove(e),r.xs.delete(s.target)}function zg(t,e,n){const r=Z(t);let s=J.min(),i=le();return r.persistence.runTransaction("Execute query","readwrite",o=>function(u,h,p){const m=Z(u),g=m.xs.get(p);return g!==void 0?M.resolve(m.Ms.get(g)):m.Pi.getTargetData(h,p)}(r,o,tn(e)).next(l=>{if(l)return s=l.lastLimboFreeSnapshotVersion,r.Pi.getMatchingKeysForTargetId(o,l.targetId).next(u=>{i=u})}).next(()=>r.Fs.getDocumentsMatchingQuery(o,e,n?s:J.min(),n?i:le())).next(l=>(yk(r,t2(e),l),{documents:l,Qs:i})))}function yk(t,e,n){let r=t.Os.get(e)||J.min();n.forEach((s,i)=>{i.readTime.compareTo(r)>0&&(r=i.readTime)}),t.Os.set(e,r)}class Bg{constructor(){this.activeTargetIds=a2()}zs(e){this.activeTargetIds=this.activeTargetIds.add(e)}js(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Gs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class _k{constructor(){this.Mo=new Bg,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,r){}addLocalQueryTarget(e,n=!0){return n&&this.Mo.zs(e),this.xo[e]||"not-current"}updateQueryState(e,n,r){this.xo[e]=n}removeLocalQueryTarget(e){this.Mo.js(e)}isLocalQueryTarget(e){return this.Mo.activeTargetIds.has(e)}clearQueryState(e){delete this.xo[e]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(e){return this.Mo.activeTargetIds.has(e)}start(){return this.Mo=new Bg,Promise.resolve()}handleUserChange(e,n,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vk{Oo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $g="ConnectivityMonitor";class Hg{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(e){this.qo.push(e)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){$($g,"Network connectivity changed: AVAILABLE");for(const e of this.qo)e(0)}ko(){$($g,"Network connectivity changed: UNAVAILABLE");for(const e of this.qo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ka=null;function Gh(){return ka===null?ka=function(){return 268435456+Math.round(2147483648*Math.random())}():ka++,"0x"+ka.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bc="RestConnection",wk={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class Ek{get $o(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const n=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Uo=n+"://"+e.host,this.Ko=`projects/${r}/databases/${s}`,this.Wo=this.databaseId.database===Cl?`project_id=${r}`:`project_id=${r}&database_id=${s}`}Go(e,n,r,s,i){const o=Gh(),l=this.zo(e,n.toUriEncodedString());$(bc,`Sending RPC '${e}' ${o}:`,l,r);const u={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(u,s,i);const{host:h}=new URL(l),p=ni(h);return this.Jo(e,l,u,r,p).then(m=>($(bc,`Received RPC '${e}' ${o}: `,m),m),m=>{throw qs(bc,`RPC '${e}' ${o} failed with error: `,m,"url: ",l,"request:",r),m})}Ho(e,n,r,s,i,o){return this.Go(e,n,r,s,i)}jo(e,n,r){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+si}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((s,i)=>e[i]=s),r&&r.headers.forEach((s,i)=>e[i]=s)}zo(e,n){const r=wk[e];return`${this.Uo}/v1/${n}:${r}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xk{constructor(e){this.Yo=e.Yo,this.Zo=e.Zo}Xo(e){this.e_=e}t_(e){this.n_=e}r_(e){this.i_=e}onMessage(e){this.s_=e}close(){this.Zo()}send(e){this.Yo(e)}o_(){this.e_()}__(){this.n_()}a_(e){this.i_(e)}u_(e){this.s_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tt="WebChannelConnection";class Tk extends Ek{constructor(e){super(e),this.c_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Jo(e,n,r,s,i){const o=Gh();return new Promise((l,u)=>{const h=new rv;h.setWithCredentials(!0),h.listenOnce(sv.COMPLETE,()=>{try{switch(h.getLastErrorCode()){case Ba.NO_ERROR:const m=h.getResponseJson();$(tt,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(m)),l(m);break;case Ba.TIMEOUT:$(tt,`RPC '${e}' ${o} timed out`),u(new W(O.DEADLINE_EXCEEDED,"Request time out"));break;case Ba.HTTP_ERROR:const g=h.getStatus();if($(tt,`RPC '${e}' ${o} failed with status:`,g,"response text:",h.getResponseText()),g>0){let A=h.getResponseJson();Array.isArray(A)&&(A=A[0]);const b=A==null?void 0:A.error;if(b&&b.status&&b.message){const R=function(I){const _=I.toLowerCase().replace(/_/g,"-");return Object.values(O).indexOf(_)>=0?_:O.UNKNOWN}(b.status);u(new W(R,b.message))}else u(new W(O.UNKNOWN,"Server responded with status "+h.getStatus()))}else u(new W(O.UNAVAILABLE,"Connection failed."));break;default:Q(9055,{l_:e,streamId:o,h_:h.getLastErrorCode(),P_:h.getLastError()})}}finally{$(tt,`RPC '${e}' ${o} completed.`)}});const p=JSON.stringify(s);$(tt,`RPC '${e}' ${o} sending request:`,s),h.send(n,"POST",p,r,15)})}T_(e,n,r){const s=Gh(),i=[this.Uo,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=av(),l=ov(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(u.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(u.useFetchStreams=!0),this.jo(u.initMessageHeaders,n,r),u.encodeInitMessageHeaders=!0;const p=i.join("");$(tt,`Creating RPC '${e}' stream ${s}: ${p}`,u);const m=o.createWebChannel(p,u);this.I_(m);let g=!1,A=!1;const b=new xk({Yo:V=>{A?$(tt,`Not sending because RPC '${e}' stream ${s} is closed:`,V):(g||($(tt,`Opening RPC '${e}' stream ${s} transport.`),m.open(),g=!0),$(tt,`RPC '${e}' stream ${s} sending:`,V),m.send(V))},Zo:()=>m.close()}),R=(V,I,_)=>{V.listen(I,k=>{try{_(k)}catch(D){setTimeout(()=>{throw D},0)}})};return R(m,Li.EventType.OPEN,()=>{A||($(tt,`RPC '${e}' stream ${s} transport opened.`),b.o_())}),R(m,Li.EventType.CLOSE,()=>{A||(A=!0,$(tt,`RPC '${e}' stream ${s} transport closed`),b.a_(),this.E_(m))}),R(m,Li.EventType.ERROR,V=>{A||(A=!0,qs(tt,`RPC '${e}' stream ${s} transport errored. Name:`,V.name,"Message:",V.message),b.a_(new W(O.UNAVAILABLE,"The operation could not be completed")))}),R(m,Li.EventType.MESSAGE,V=>{var I;if(!A){const _=V.data[0];he(!!_,16349);const k=_,D=(k==null?void 0:k.error)||((I=k[0])==null?void 0:I.error);if(D){$(tt,`RPC '${e}' stream ${s} received error:`,D);const j=D.status;let U=function(E){const T=Ne[E];if(T!==void 0)return zv(T)}(j),x=D.message;U===void 0&&(U=O.INTERNAL,x="Unknown error status: "+j+" with message "+D.message),A=!0,b.a_(new W(U,x)),m.close()}else $(tt,`RPC '${e}' stream ${s} received:`,_),b.u_(_)}}),R(l,iv.STAT_EVENT,V=>{V.stat===Mh.PROXY?$(tt,`RPC '${e}' stream ${s} detected buffering proxy`):V.stat===Mh.NOPROXY&&$(tt,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{b.__()},0),b}terminate(){this.c_.forEach(e=>e.close()),this.c_=[]}I_(e){this.c_.push(e)}E_(e){this.c_=this.c_.filter(n=>n===e)}}function Rc(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yu(t){return new A2(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tw{constructor(e,n,r=1e3,s=1.5,i=6e4){this.Mi=e,this.timerId=n,this.d_=r,this.A_=s,this.R_=i,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(e){this.cancel();const n=Math.floor(this.V_+this.y_()),r=Math.max(0,Date.now()-this.f_),s=Math.max(0,n-r);s>0&&$("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,s,()=>(this.f_=Date.now(),e())),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qg="PersistentStream";class nw{constructor(e,n,r,s,i,o,l,u){this.Mi=e,this.S_=r,this.b_=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=u,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new tw(e,n)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,()=>this.k_()))}q_(e){this.Q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,n){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():n&&n.code===O.RESOURCE_EXHAUSTED?(Cn(n.toString()),Cn("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):n&&n.code===O.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.K_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.r_(n)}K_(){}auth(){this.state=1;const e=this.W_(this.D_),n=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.D_===n&&this.G_(r,s)},r=>{e(()=>{const s=new W(O.UNKNOWN,"Fetching auth token failed: "+r.message);return this.z_(s)})})}G_(e,n){const r=this.W_(this.D_);this.stream=this.j_(e,n),this.stream.Xo(()=>{r(()=>this.listener.Xo())}),this.stream.t_(()=>{r(()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.t_()))}),this.stream.r_(s=>{r(()=>this.z_(s))}),this.stream.onMessage(s=>{r(()=>++this.F_==1?this.J_(s):this.onNext(s))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(e){return $(qg,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return n=>{this.Mi.enqueueAndForget(()=>this.D_===e?n():($(qg,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Ik extends nw{constructor(e,n,r,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,r,s,o),this.serializer=i}j_(e,n){return this.connection.T_("Listen",e,n)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const n=R2(this.serializer,e),r=function(i){if(!("targetChange"in i))return J.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?J.min():o.readTime?rn(o.readTime):J.min()}(e);return this.listener.H_(n,r)}Y_(e){const n={};n.database=qh(this.serializer),n.addTarget=function(i,o){let l;const u=o.target;if(l=Uh(u)?{documents:D2(i,u)}:{query:V2(i,u).ft},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=Hv(i,o.resumeToken);const h=Bh(i,o.expectedCount);h!==null&&(l.expectedCount=h)}else if(o.snapshotVersion.compareTo(J.min())>0){l.readTime=Vl(i,o.snapshotVersion.toTimestamp());const h=Bh(i,o.expectedCount);h!==null&&(l.expectedCount=h)}return l}(this.serializer,e);const r=O2(this.serializer,e);r&&(n.labels=r),this.q_(n)}Z_(e){const n={};n.database=qh(this.serializer),n.removeTarget=e,this.q_(n)}}class Sk extends nw{constructor(e,n,r,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,r,s,o),this.serializer=i}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(e,n){return this.connection.T_("Write",e,n)}J_(e){return he(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,he(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){he(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const n=N2(e.writeResults,e.commitTime),r=rn(e.commitTime);return this.listener.na(r,n)}ra(){const e={};e.database=qh(this.serializer),this.q_(e)}ea(e){const n={streamToken:this.lastStreamToken,writes:e.map(r=>P2(this.serializer,r))};this.q_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kk{}class Ak extends kk{constructor(e,n,r,s){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=s,this.ia=!1}sa(){if(this.ia)throw new W(O.FAILED_PRECONDITION,"The client has already been terminated.")}Go(e,n,r,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.Go(e,$h(n,r),s,i,o)).catch(i=>{throw i.name==="FirebaseError"?(i.code===O.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new W(O.UNKNOWN,i.toString())})}Ho(e,n,r,s,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Ho(e,$h(n,r),s,o,l,i)).catch(o=>{throw o.name==="FirebaseError"?(o.code===O.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new W(O.UNKNOWN,o.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}class Ck{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(Cn(n),this.aa=!1):$("OnlineStateTracker",n)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jr="RemoteStore";class bk{constructor(e,n,r,s,i){this.localStore=e,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=i,this.Aa.Oo(o=>{r.enqueueAndForget(async()=>{rs(this)&&($(Jr,"Restarting streams for network reachability change."),await async function(u){const h=Z(u);h.Ea.add(4),await Fo(h),h.Ra.set("Unknown"),h.Ea.delete(4),await _u(h)}(this))})}),this.Ra=new Ck(r,s)}}async function _u(t){if(rs(t))for(const e of t.da)await e(!0)}async function Fo(t){for(const e of t.da)await e(!1)}function rw(t,e){const n=Z(t);n.Ia.has(e.targetId)||(n.Ia.set(e.targetId,e),Sf(n)?If(n):ai(n).O_()&&Tf(n,e))}function xf(t,e){const n=Z(t),r=ai(n);n.Ia.delete(e),r.O_()&&sw(n,e),n.Ia.size===0&&(r.O_()?r.L_():rs(n)&&n.Ra.set("Unknown"))}function Tf(t,e){if(t.Va.Ue(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(J.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}ai(t).Y_(e)}function sw(t,e){t.Va.Ue(e),ai(t).Z_(e)}function If(t){t.Va=new T2({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),At:e=>t.Ia.get(e)||null,ht:()=>t.datastore.serializer.databaseId}),ai(t).start(),t.Ra.ua()}function Sf(t){return rs(t)&&!ai(t).x_()&&t.Ia.size>0}function rs(t){return Z(t).Ea.size===0}function iw(t){t.Va=void 0}async function Rk(t){t.Ra.set("Online")}async function Pk(t){t.Ia.forEach((e,n)=>{Tf(t,e)})}async function Nk(t,e){iw(t),Sf(t)?(t.Ra.ha(e),If(t)):t.Ra.set("Unknown")}async function Dk(t,e,n){if(t.Ra.set("Online"),e instanceof $v&&e.state===2&&e.cause)try{await async function(s,i){const o=i.cause;for(const l of i.targetIds)s.Ia.has(l)&&(await s.remoteSyncer.rejectListen(l,o),s.Ia.delete(l),s.Va.removeTarget(l))}(t,e)}catch(r){$(Jr,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Ol(t,r)}else if(e instanceof Wa?t.Va.Ze(e):e instanceof Bv?t.Va.st(e):t.Va.tt(e),!n.isEqual(J.min()))try{const r=await ew(t.localStore);n.compareTo(r)>=0&&await function(i,o){const l=i.Va.Tt(o);return l.targetChanges.forEach((u,h)=>{if(u.resumeToken.approximateByteSize()>0){const p=i.Ia.get(h);p&&i.Ia.set(h,p.withResumeToken(u.resumeToken,o))}}),l.targetMismatches.forEach((u,h)=>{const p=i.Ia.get(u);if(!p)return;i.Ia.set(u,p.withResumeToken(Ye.EMPTY_BYTE_STRING,p.snapshotVersion)),sw(i,u);const m=new er(p.target,u,h,p.sequenceNumber);Tf(i,m)}),i.remoteSyncer.applyRemoteEvent(l)}(t,n)}catch(r){$(Jr,"Failed to raise snapshot:",r),await Ol(t,r)}}async function Ol(t,e,n){if(!oi(e))throw e;t.Ea.add(1),await Fo(t),t.Ra.set("Offline"),n||(n=()=>ew(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{$(Jr,"Retrying IndexedDB access"),await n(),t.Ea.delete(1),await _u(t)})}function ow(t,e){return e().catch(n=>Ol(t,n,e))}async function vu(t){const e=Z(t),n=xr(e);let r=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:lf;for(;Vk(e);)try{const s=await mk(e.localStore,r);if(s===null){e.Ta.length===0&&n.L_();break}r=s.batchId,Mk(e,s)}catch(s){await Ol(e,s)}aw(e)&&lw(e)}function Vk(t){return rs(t)&&t.Ta.length<10}function Mk(t,e){t.Ta.push(e);const n=xr(t);n.O_()&&n.X_&&n.ea(e.mutations)}function aw(t){return rs(t)&&!xr(t).x_()&&t.Ta.length>0}function lw(t){xr(t).start()}async function Ok(t){xr(t).ra()}async function Lk(t){const e=xr(t);for(const n of t.Ta)e.ea(n.mutations)}async function jk(t,e,n){const r=t.Ta.shift(),s=mf.from(r,e,n);await ow(t,()=>t.remoteSyncer.applySuccessfulWrite(s)),await vu(t)}async function Fk(t,e){e&&xr(t).X_&&await async function(r,s){if(function(o){return w2(o)&&o!==O.ABORTED}(s.code)){const i=r.Ta.shift();xr(r).B_(),await ow(r,()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s)),await vu(r)}}(t,e),aw(t)&&lw(t)}async function Wg(t,e){const n=Z(t);n.asyncQueue.verifyOperationInProgress(),$(Jr,"RemoteStore received new credentials");const r=rs(n);n.Ea.add(3),await Fo(n),r&&n.Ra.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.Ea.delete(3),await _u(n)}async function Uk(t,e){const n=Z(t);e?(n.Ea.delete(2),await _u(n)):e||(n.Ea.add(2),await Fo(n),n.Ra.set("Unknown"))}function ai(t){return t.ma||(t.ma=function(n,r,s){const i=Z(n);return i.sa(),new Ik(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(t.datastore,t.asyncQueue,{Xo:Rk.bind(null,t),t_:Pk.bind(null,t),r_:Nk.bind(null,t),H_:Dk.bind(null,t)}),t.da.push(async e=>{e?(t.ma.B_(),Sf(t)?If(t):t.Ra.set("Unknown")):(await t.ma.stop(),iw(t))})),t.ma}function xr(t){return t.fa||(t.fa=function(n,r,s){const i=Z(n);return i.sa(),new Sk(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(t.datastore,t.asyncQueue,{Xo:()=>Promise.resolve(),t_:Ok.bind(null,t),r_:Fk.bind(null,t),ta:Lk.bind(null,t),na:jk.bind(null,t)}),t.da.push(async e=>{e?(t.fa.B_(),await vu(t)):(await t.fa.stop(),t.Ta.length>0&&($(Jr,`Stopping write stream with ${t.Ta.length} pending writes`),t.Ta=[]))})),t.fa}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kf{constructor(e,n,r,s,i){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new $r,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,s,i){const o=Date.now()+r,l=new kf(e,n,o,s,i);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new W(O.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Af(t,e){if(Cn("AsyncQueue",`${e}: ${t}`),oi(t))return new W(O.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ns{static emptySet(e){return new Ns(e.comparator)}constructor(e){this.comparator=e?(n,r)=>e(n,r)||K.comparator(n.key,r.key):(n,r)=>K.comparator(n.key,r.key),this.keyedMap=ji(),this.sortedSet=new ke(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,r)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof Ns)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;n.hasNext();){const s=n.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const r=new Ns;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=n,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gg{constructor(){this.ga=new ke(K.comparator)}track(e){const n=e.doc.key,r=this.ga.get(n);r?e.type!==0&&r.type===3?this.ga=this.ga.insert(n,e):e.type===3&&r.type!==1?this.ga=this.ga.insert(n,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.ga=this.ga.insert(n,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.ga=this.ga.insert(n,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.ga=this.ga.remove(n):e.type===1&&r.type===2?this.ga=this.ga.insert(n,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.ga=this.ga.insert(n,{type:2,doc:e.doc}):Q(63341,{Rt:e,pa:r}):this.ga=this.ga.insert(n,e)}ya(){const e=[];return this.ga.inorderTraversal((n,r)=>{e.push(r)}),e}}class Ys{constructor(e,n,r,s,i,o,l,u,h){this.query=e,this.docs=n,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=u,this.hasCachedResults=h}static fromInitialDocuments(e,n,r,s,i){const o=[];return n.forEach(l=>{o.push({type:0,doc:l})}),new Ys(e,n,Ns.emptySet(n),o,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&du(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,r=e.docChanges;if(n.length!==r.length)return!1;for(let s=0;s<n.length;s++)if(n[s].type!==r[s].type||!n[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zk{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some(e=>e.Da())}}class Bk{constructor(){this.queries=Kg(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(n,r){const s=Z(n),i=s.queries;s.queries=Kg(),i.forEach((o,l)=>{for(const u of l.Sa)u.onError(r)})})(this,new W(O.ABORTED,"Firestore shutting down"))}}function Kg(){return new ns(t=>Cv(t),du)}async function $k(t,e){const n=Z(t);let r=3;const s=e.query;let i=n.queries.get(s);i?!i.ba()&&e.Da()&&(r=2):(i=new zk,r=e.Da()?0:1);try{switch(r){case 0:i.wa=await n.onListen(s,!0);break;case 1:i.wa=await n.onListen(s,!1);break;case 2:await n.onFirstRemoteStoreListen(s)}}catch(o){const l=Af(o,`Initialization of query '${cs(e.query)}' failed`);return void e.onError(l)}n.queries.set(s,i),i.Sa.push(e),e.va(n.onlineState),i.wa&&e.Fa(i.wa)&&Cf(n)}async function Hk(t,e){const n=Z(t),r=e.query;let s=3;const i=n.queries.get(r);if(i){const o=i.Sa.indexOf(e);o>=0&&(i.Sa.splice(o,1),i.Sa.length===0?s=e.Da()?0:1:!i.ba()&&e.Da()&&(s=2))}switch(s){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function qk(t,e){const n=Z(t);let r=!1;for(const s of e){const i=s.query,o=n.queries.get(i);if(o){for(const l of o.Sa)l.Fa(s)&&(r=!0);o.wa=s}}r&&Cf(n)}function Wk(t,e,n){const r=Z(t),s=r.queries.get(e);if(s)for(const i of s.Sa)i.onError(n);r.queries.delete(e)}function Cf(t){t.Ca.forEach(e=>{e.next()})}var Kh,Qg;(Qg=Kh||(Kh={})).Ma="default",Qg.Cache="cache";class Gk{constructor(e,n,r){this.query=e,this.xa=n,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=r||{}}Fa(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new Ys(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),n=!0):this.La(e,this.onlineState)&&(this.ka(e),n=!0),this.Na=e,n}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let n=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),n=!0),n}La(e,n){if(!e.fromCache||!this.Da())return!0;const r=n!=="Offline";return(!this.options.qa||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}Ba(e){if(e.docChanges.length>0)return!0;const n=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}ka(e){e=Ys.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==Kh.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uw{constructor(e){this.key=e}}class cw{constructor(e){this.key=e}}class Kk{constructor(e,n){this.query=e,this.Ya=n,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=le(),this.mutatedKeys=le(),this.eu=bv(e),this.tu=new Ns(this.eu)}get nu(){return this.Ya}ru(e,n){const r=n?n.iu:new Gg,s=n?n.tu:this.tu;let i=n?n.mutatedKeys:this.mutatedKeys,o=s,l=!1;const u=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,h=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((p,m)=>{const g=s.get(p),A=fu(this.query,m)?m:null,b=!!g&&this.mutatedKeys.has(g.key),R=!!A&&(A.hasLocalMutations||this.mutatedKeys.has(A.key)&&A.hasCommittedMutations);let V=!1;g&&A?g.data.isEqual(A.data)?b!==R&&(r.track({type:3,doc:A}),V=!0):this.su(g,A)||(r.track({type:2,doc:A}),V=!0,(u&&this.eu(A,u)>0||h&&this.eu(A,h)<0)&&(l=!0)):!g&&A?(r.track({type:0,doc:A}),V=!0):g&&!A&&(r.track({type:1,doc:g}),V=!0,(u||h)&&(l=!0)),V&&(A?(o=o.add(A),i=R?i.add(p):i.delete(p)):(o=o.delete(p),i=i.delete(p)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const p=this.query.limitType==="F"?o.last():o.first();o=o.delete(p.key),i=i.delete(p.key),r.track({type:1,doc:p})}return{tu:o,iu:r,Cs:l,mutatedKeys:i}}su(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,r,s){const i=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const o=e.iu.ya();o.sort((p,m)=>function(A,b){const R=V=>{switch(V){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Q(20277,{Rt:V})}};return R(A)-R(b)}(p.type,m.type)||this.eu(p.doc,m.doc)),this.ou(r),s=s??!1;const l=n&&!s?this._u():[],u=this.Xa.size===0&&this.current&&!s?1:0,h=u!==this.Za;return this.Za=u,o.length!==0||h?{snapshot:new Ys(this.query,e.tu,i,o,e.mutatedKeys,u===0,h,!1,!!r&&r.resumeToken.approximateByteSize()>0),au:l}:{au:l}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new Gg,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(e){return!this.Ya.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach(n=>this.Ya=this.Ya.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ya=this.Ya.delete(n)),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Xa;this.Xa=le(),this.tu.forEach(r=>{this.uu(r.key)&&(this.Xa=this.Xa.add(r.key))});const n=[];return e.forEach(r=>{this.Xa.has(r)||n.push(new cw(r))}),this.Xa.forEach(r=>{e.has(r)||n.push(new uw(r))}),n}cu(e){this.Ya=e.Qs,this.Xa=le();const n=this.ru(e.documents);return this.applyChanges(n,!0)}lu(){return Ys.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Za===0,this.hasCachedResults)}}const bf="SyncEngine";class Qk{constructor(e,n,r){this.query=e,this.targetId=n,this.view=r}}class Xk{constructor(e){this.key=e,this.hu=!1}}class Yk{constructor(e,n,r,s,i,o){this.localStore=e,this.remoteStore=n,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Pu={},this.Tu=new ns(l=>Cv(l),du),this.Iu=new Map,this.Eu=new Set,this.du=new ke(K.comparator),this.Au=new Map,this.Ru=new _f,this.Vu={},this.mu=new Map,this.fu=Xs.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function Jk(t,e,n=!0){const r=gw(t);let s;const i=r.Tu.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.lu()):s=await hw(r,e,n,!0),s}async function Zk(t,e){const n=gw(t);await hw(n,e,!0,!1)}async function hw(t,e,n,r){const s=await gk(t.localStore,tn(e)),i=s.targetId,o=t.sharedClientState.addLocalQueryTarget(i,n);let l;return r&&(l=await eA(t,e,i,o==="current",s.resumeToken)),t.isPrimaryClient&&n&&rw(t.remoteStore,s),l}async function eA(t,e,n,r,s){t.pu=(m,g,A)=>async function(R,V,I,_){let k=V.view.ru(I);k.Cs&&(k=await zg(R.localStore,V.query,!1).then(({documents:x})=>V.view.ru(x,k)));const D=_&&_.targetChanges.get(V.targetId),j=_&&_.targetMismatches.get(V.targetId)!=null,U=V.view.applyChanges(k,R.isPrimaryClient,D,j);return Yg(R,V.targetId,U.au),U.snapshot}(t,m,g,A);const i=await zg(t.localStore,e,!0),o=new Kk(e,i.Qs),l=o.ru(i.documents),u=jo.createSynthesizedTargetChangeForCurrentChange(n,r&&t.onlineState!=="Offline",s),h=o.applyChanges(l,t.isPrimaryClient,u);Yg(t,n,h.au);const p=new Qk(e,n,o);return t.Tu.set(e,p),t.Iu.has(n)?t.Iu.get(n).push(e):t.Iu.set(n,[e]),h.snapshot}async function tA(t,e,n){const r=Z(t),s=r.Tu.get(e),i=r.Iu.get(s.targetId);if(i.length>1)return r.Iu.set(s.targetId,i.filter(o=>!du(o,e))),void r.Tu.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Wh(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),n&&xf(r.remoteStore,s.targetId),Qh(r,s.targetId)}).catch(ii)):(Qh(r,s.targetId),await Wh(r.localStore,s.targetId,!0))}async function nA(t,e){const n=Z(t),r=n.Tu.get(e),s=n.Iu.get(r.targetId);n.isPrimaryClient&&s.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),xf(n.remoteStore,r.targetId))}async function rA(t,e,n){const r=cA(t);try{const s=await function(o,l){const u=Z(o),h=we.now(),p=l.reduce((A,b)=>A.add(b.key),le());let m,g;return u.persistence.runTransaction("Locally write mutations","readwrite",A=>{let b=bn(),R=le();return u.Ns.getEntries(A,p).next(V=>{b=V,b.forEach((I,_)=>{_.isValidDocument()||(R=R.add(I))})}).next(()=>u.localDocuments.getOverlayedDocuments(A,b)).next(V=>{m=V;const I=[];for(const _ of l){const k=m2(_,m.get(_.key).overlayedDocument);k!=null&&I.push(new Cr(_.key,k,Ev(k.value.mapValue),nn.exists(!0)))}return u.mutationQueue.addMutationBatch(A,h,I,l)}).next(V=>{g=V;const I=V.applyToLocalDocumentSet(m,R);return u.documentOverlayCache.saveOverlays(A,V.batchId,I)})}).then(()=>({batchId:g.batchId,changes:Pv(m)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),function(o,l,u){let h=o.Vu[o.currentUser.toKey()];h||(h=new ke(ae)),h=h.insert(l,u),o.Vu[o.currentUser.toKey()]=h}(r,s.batchId,n),await Uo(r,s.changes),await vu(r.remoteStore)}catch(s){const i=Af(s,"Failed to persist write");n.reject(i)}}async function dw(t,e){const n=Z(t);try{const r=await fk(n.localStore,e);e.targetChanges.forEach((s,i)=>{const o=n.Au.get(i);o&&(he(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.hu=!0:s.modifiedDocuments.size>0?he(o.hu,14607):s.removedDocuments.size>0&&(he(o.hu,42227),o.hu=!1))}),await Uo(n,r,e)}catch(r){await ii(r)}}function Xg(t,e,n){const r=Z(t);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const s=[];r.Tu.forEach((i,o)=>{const l=o.view.va(e);l.snapshot&&s.push(l.snapshot)}),function(o,l){const u=Z(o);u.onlineState=l;let h=!1;u.queries.forEach((p,m)=>{for(const g of m.Sa)g.va(l)&&(h=!0)}),h&&Cf(u)}(r.eventManager,e),s.length&&r.Pu.H_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function sA(t,e,n){const r=Z(t);r.sharedClientState.updateQueryState(e,"rejected",n);const s=r.Au.get(e),i=s&&s.key;if(i){let o=new ke(K.comparator);o=o.insert(i,st.newNoDocument(i,J.min()));const l=le().add(i),u=new gu(J.min(),new Map,new ke(ae),o,l);await dw(r,u),r.du=r.du.remove(i),r.Au.delete(e),Rf(r)}else await Wh(r.localStore,e,!1).then(()=>Qh(r,e,n)).catch(ii)}async function iA(t,e){const n=Z(t),r=e.batch.batchId;try{const s=await dk(n.localStore,e);pw(n,r,null),fw(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await Uo(n,s)}catch(s){await ii(s)}}async function oA(t,e,n){const r=Z(t);try{const s=await function(o,l){const u=Z(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let p;return u.mutationQueue.lookupMutationBatch(h,l).next(m=>(he(m!==null,37113),p=m.keys(),u.mutationQueue.removeMutationBatch(h,m))).next(()=>u.mutationQueue.performConsistencyCheck(h)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(h,p,l)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,p)).next(()=>u.localDocuments.getDocuments(h,p))})}(r.localStore,e);pw(r,e,n),fw(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await Uo(r,s)}catch(s){await ii(s)}}function fw(t,e){(t.mu.get(e)||[]).forEach(n=>{n.resolve()}),t.mu.delete(e)}function pw(t,e,n){const r=Z(t);let s=r.Vu[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(n?i.reject(n):i.resolve(),s=s.remove(e)),r.Vu[r.currentUser.toKey()]=s}}function Qh(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const r of t.Iu.get(e))t.Tu.delete(r),n&&t.Pu.yu(r,n);t.Iu.delete(e),t.isPrimaryClient&&t.Ru.jr(e).forEach(r=>{t.Ru.containsKey(r)||mw(t,r)})}function mw(t,e){t.Eu.delete(e.path.canonicalString());const n=t.du.get(e);n!==null&&(xf(t.remoteStore,n),t.du=t.du.remove(e),t.Au.delete(n),Rf(t))}function Yg(t,e,n){for(const r of n)r instanceof uw?(t.Ru.addReference(r.key,e),aA(t,r)):r instanceof cw?($(bf,"Document no longer in limbo: "+r.key),t.Ru.removeReference(r.key,e),t.Ru.containsKey(r.key)||mw(t,r.key)):Q(19791,{wu:r})}function aA(t,e){const n=e.key,r=n.path.canonicalString();t.du.get(n)||t.Eu.has(r)||($(bf,"New document in limbo: "+n),t.Eu.add(r),Rf(t))}function Rf(t){for(;t.Eu.size>0&&t.du.size<t.maxConcurrentLimboResolutions;){const e=t.Eu.values().next().value;t.Eu.delete(e);const n=new K(ve.fromString(e)),r=t.fu.next();t.Au.set(r,new Xk(n)),t.du=t.du.insert(n,r),rw(t.remoteStore,new er(tn(ff(n.path)),r,"TargetPurposeLimboResolution",lu.ce))}}async function Uo(t,e,n){const r=Z(t),s=[],i=[],o=[];r.Tu.isEmpty()||(r.Tu.forEach((l,u)=>{o.push(r.pu(u,e,n).then(h=>{var p;if((h||n)&&r.isPrimaryClient){const m=h?!h.fromCache:(p=n==null?void 0:n.targetChanges.get(u.targetId))==null?void 0:p.current;r.sharedClientState.updateQueryState(u.targetId,m?"current":"not-current")}if(h){s.push(h);const m=wf.As(u.targetId,h);i.push(m)}}))}),await Promise.all(o),r.Pu.H_(s),await async function(u,h){const p=Z(u);try{await p.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>M.forEach(h,g=>M.forEach(g.Es,A=>p.persistence.referenceDelegate.addReference(m,g.targetId,A)).next(()=>M.forEach(g.ds,A=>p.persistence.referenceDelegate.removeReference(m,g.targetId,A)))))}catch(m){if(!oi(m))throw m;$(Ef,"Failed to update sequence numbers: "+m)}for(const m of h){const g=m.targetId;if(!m.fromCache){const A=p.Ms.get(g),b=A.snapshotVersion,R=A.withLastLimboFreeSnapshotVersion(b);p.Ms=p.Ms.insert(g,R)}}}(r.localStore,i))}async function lA(t,e){const n=Z(t);if(!n.currentUser.isEqual(e)){$(bf,"User change. New user:",e.toKey());const r=await Zv(n.localStore,e);n.currentUser=e,function(i,o){i.mu.forEach(l=>{l.forEach(u=>{u.reject(new W(O.CANCELLED,o))})}),i.mu.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Uo(n,r.Ls)}}function uA(t,e){const n=Z(t),r=n.Au.get(e);if(r&&r.hu)return le().add(r.key);{let s=le();const i=n.Iu.get(e);if(!i)return s;for(const o of i){const l=n.Tu.get(o);s=s.unionWith(l.view.nu)}return s}}function gw(t){const e=Z(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=dw.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=uA.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=sA.bind(null,e),e.Pu.H_=qk.bind(null,e.eventManager),e.Pu.yu=Wk.bind(null,e.eventManager),e}function cA(t){const e=Z(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=iA.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=oA.bind(null,e),e}class Ll{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=yu(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,n){return null}Mu(e,n){return null}vu(e){return hk(this.persistence,new lk,e.initialUser,this.serializer)}Cu(e){return new Jv(vf.mi,this.serializer)}Du(e){return new _k}async terminate(){var e,n;(e=this.gcScheduler)==null||e.stop(),(n=this.indexBackfillerScheduler)==null||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ll.provider={build:()=>new Ll};class hA extends Ll{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,n){he(this.persistence.referenceDelegate instanceof Ml,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new G2(r,e.asyncQueue,n)}Cu(e){const n=this.cacheSizeBytes!==void 0?mt.withCacheSize(this.cacheSizeBytes):mt.DEFAULT;return new Jv(r=>Ml.mi(r,n),this.serializer)}}class Xh{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Xg(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=lA.bind(null,this.syncEngine),await Uk(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new Bk}()}createDatastore(e){const n=yu(e.databaseInfo.databaseId),r=function(i){return new Tk(i)}(e.databaseInfo);return function(i,o,l,u){return new Ak(i,o,l,u)}(e.authCredentials,e.appCheckCredentials,r,n)}createRemoteStore(e){return function(r,s,i,o,l){return new bk(r,s,i,o,l)}(this.localStore,this.datastore,e.asyncQueue,n=>Xg(this.syncEngine,n,0),function(){return Hg.v()?new Hg:new vk}())}createSyncEngine(e,n){return function(s,i,o,l,u,h,p){const m=new Yk(s,i,o,l,u,h);return p&&(m.gu=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(s){const i=Z(s);$(Jr,"RemoteStore shutting down."),i.Ea.add(5),await Fo(i),i.Aa.shutdown(),i.Ra.set("Unknown")}(this.remoteStore),(e=this.datastore)==null||e.terminate(),(n=this.eventManager)==null||n.terminate()}}Xh.provider={build:()=>new Xh};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dA{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):Cn("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tr="FirestoreClient";class fA{constructor(e,n,r,s,i){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=r,this.databaseInfo=s,this.user=nt.UNAUTHENTICATED,this.clientId=of.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,async o=>{$(Tr,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(r,o=>($(Tr,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new $r;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const r=Af(n,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function Pc(t,e){t.asyncQueue.verifyOperationInProgress(),$(Tr,"Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let r=n.initialUser;t.setCredentialChangeListener(async s=>{r.isEqual(s)||(await Zv(e.localStore,s),r=s)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function Jg(t,e){t.asyncQueue.verifyOperationInProgress();const n=await pA(t);$(Tr,"Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(r=>Wg(e.remoteStore,r)),t.setAppCheckTokenChangeListener((r,s)=>Wg(e.remoteStore,s)),t._onlineComponents=e}async function pA(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){$(Tr,"Using user provided OfflineComponentProvider");try{await Pc(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(s){return s.name==="FirebaseError"?s.code===O.FAILED_PRECONDITION||s.code===O.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(n))throw n;qs("Error using user provided cache. Falling back to memory cache: "+n),await Pc(t,new Ll)}}else $(Tr,"Using default OfflineComponentProvider"),await Pc(t,new hA(void 0));return t._offlineComponents}async function yw(t){return t._onlineComponents||(t._uninitializedComponentsProvider?($(Tr,"Using user provided OnlineComponentProvider"),await Jg(t,t._uninitializedComponentsProvider._online)):($(Tr,"Using default OnlineComponentProvider"),await Jg(t,new Xh))),t._onlineComponents}function mA(t){return yw(t).then(e=>e.syncEngine)}async function Zg(t){const e=await yw(t),n=e.eventManager;return n.onListen=Jk.bind(null,e.syncEngine),n.onUnlisten=tA.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=Zk.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=nA.bind(null,e.syncEngine),n}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _w(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ey=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vw="firestore.googleapis.com",ty=!0;class ny{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new W(O.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=vw,this.ssl=ty}else this.host=e.host,this.ssl=e.ssl??ty;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Yv;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<q2)throw new W(O.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}AS("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=_w(e.experimentalLongPollingOptions??{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new W(O.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new W(O.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new W(O.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class wu{constructor(e,n,r,s){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ny({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new W(O.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new W(O.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ny(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new yS;switch(r.type){case"firstParty":return new ES(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new W(O.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=ey.get(n);r&&($("ComponentProvider","Removing Datastore"),ey.delete(n),r.terminate())}(this),Promise.resolve()}}function gA(t,e,n,r={}){var h;t=fr(t,wu);const s=ni(e),i=t._getSettings(),o={...i,emulatorOptions:t._getEmulatorOptions()},l=`${e}:${n}`;s&&(Q0(`https://${l}`),X0("Firestore",!0)),i.host!==vw&&i.host!==l&&qs("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u={...i,host:l,ssl:s,emulatorOptions:r};if(!yr(u,o)&&(t._setSettings(u),r.mockUserToken)){let p,m;if(typeof r.mockUserToken=="string")p=r.mockUserToken,m=nt.MOCK_USER;else{p=zT(r.mockUserToken,(h=t._app)==null?void 0:h.options.projectId);const g=r.mockUserToken.sub||r.mockUserToken.user_id;if(!g)throw new W(O.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");m=new nt(g)}t._authCredentials=new _S(new uv(p,m))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eu{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Eu(this.firestore,e,this._query)}}class Oe{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new pr(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Oe(this.firestore,e,this._key)}toJSON(){return{type:Oe._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,n,r){if(Oo(n,Oe._jsonSchema))return new Oe(e,r||null,new K(ve.fromString(n.referencePath)))}}Oe._jsonSchemaVersion="firestore/documentReference/1.0",Oe._jsonSchema={type:Me("string",Oe._jsonSchemaVersion),referencePath:Me("string")};class pr extends Eu{constructor(e,n,r){super(e,n,ff(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Oe(this.firestore,null,new K(e))}withConverter(e){return new pr(this.firestore,e,this._path)}}function vn(t,e,...n){if(t=at(t),cv("collection","path",e),t instanceof wu){const r=ve.fromString(e,...n);return mg(r),new pr(t,null,r)}{if(!(t instanceof Oe||t instanceof pr))throw new W(O.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(ve.fromString(e,...n));return mg(r),new pr(t.firestore,null,r)}}function wn(t,e,...n){if(t=at(t),arguments.length===1&&(e=of.newId()),cv("doc","path",e),t instanceof wu){const r=ve.fromString(e,...n);return pg(r),new Oe(t,null,new K(r))}{if(!(t instanceof Oe||t instanceof pr))throw new W(O.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(ve.fromString(e,...n));return pg(r),new Oe(t.firestore,t instanceof pr?t.converter:null,new K(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ry="AsyncQueue";class sy{constructor(e=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new tw(this,"async_queue_retry"),this._c=()=>{const r=Rc();r&&$(ry,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=e;const n=Rc();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const n=Rc();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise(()=>{});const n=new $r;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Xu.push(e),this.lc()))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(e){if(!oi(e))throw e;$(ry,"Operation failed with retryable error: "+e)}this.Xu.length>0&&this.M_.p_(()=>this.lc())}}cc(e){const n=this.ac.then(()=>(this.rc=!0,e().catch(r=>{throw this.nc=r,this.rc=!1,Cn("INTERNAL UNHANDLED ERROR: ",iy(r)),r}).then(r=>(this.rc=!1,r))));return this.ac=n,n}enqueueAfterDelay(e,n,r){this.uc(),this.oc.indexOf(e)>-1&&(n=0);const s=kf.createAndSchedule(this,e,n,r,i=>this.hc(i));return this.tc.push(s),s}uc(){this.nc&&Q(47125,{Pc:iy(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(const n of this.tc)if(n.timerId===e)return!0;return!1}Ec(e){return this.Tc().then(()=>{this.tc.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this.tc)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.Tc()})}dc(e){this.oc.push(e)}hc(e){const n=this.tc.indexOf(e);this.tc.splice(n,1)}}function iy(t){let e=t.message||"";return t.stack&&(e=t.stack.includes(t.message)?t.stack:t.message+`
`+t.stack),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oy(t){return function(n,r){if(typeof n!="object"||n===null)return!1;const s=n;for(const i of r)if(i in s&&typeof s[i]=="function")return!0;return!1}(t,["next","error","complete"])}class Ao extends wu{constructor(e,n,r,s){super(e,n,r,s),this.type="firestore",this._queue=new sy,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new sy(e),this._firestoreClient=void 0,await e}}}function yA(t,e){const n=typeof t=="object"?t:rf(),r=typeof t=="string"?t:Cl,s=nf(n,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=FT("firestore");i&&gA(s,...i)}return s}function ww(t){if(t._terminated)throw new W(O.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||_A(t),t._firestoreClient}function _A(t){var r,s,i;const e=t._freezeSettings(),n=function(l,u,h,p){return new jS(l,u,h,p.host,p.ssl,p.experimentalForceLongPolling,p.experimentalAutoDetectLongPolling,_w(p.experimentalLongPollingOptions),p.useFetchStreams,p.isUsingEmulator)}(t._databaseId,((r=t._app)==null?void 0:r.options.appId)||"",t._persistenceKey,e);t._componentsProvider||(s=e.localCache)!=null&&s._offlineComponentProvider&&((i=e.localCache)!=null&&i._onlineComponentProvider)&&(t._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),t._firestoreClient=new fA(t._authCredentials,t._appCheckCredentials,t._queue,n,t._componentsProvider&&function(l){const u=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(u),_online:u}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Dt(Ye.fromBase64String(e))}catch(n){throw new W(O.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Dt(Ye.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Dt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Oo(e,Dt._jsonSchema))return Dt.fromBase64String(e.bytes)}}Dt._jsonSchemaVersion="firestore/bytes/1.0",Dt._jsonSchema={type:Me("string",Dt._jsonSchemaVersion),bytes:Me("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xu{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new W(O.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ke(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tu{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sn{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new W(O.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new W(O.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return ae(this._lat,e._lat)||ae(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:sn._jsonSchemaVersion}}static fromJSON(e){if(Oo(e,sn._jsonSchema))return new sn(e.latitude,e.longitude)}}sn._jsonSchemaVersion="firestore/geoPoint/1.0",sn._jsonSchema={type:Me("string",sn._jsonSchemaVersion),latitude:Me("number"),longitude:Me("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class on{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0}(this._values,e._values)}toJSON(){return{type:on._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Oo(e,on._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(n=>typeof n=="number"))return new on(e.vectorValues);throw new W(O.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}on._jsonSchemaVersion="firestore/vectorValue/1.0",on._jsonSchema={type:Me("string",on._jsonSchemaVersion),vectorValues:Me("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vA=/^__.*__$/;class wA{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new Cr(e,this.data,this.fieldMask,n,this.fieldTransforms):new Lo(e,this.data,n,this.fieldTransforms)}}class Ew{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return new Cr(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function xw(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Q(40011,{Ac:t})}}class Iu{constructor(e,n,r,s,i,o){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.Rc(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(e){return new Iu({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(e){var s;const n=(s=this.path)==null?void 0:s.child(e),r=this.Vc({path:n,fc:!1});return r.gc(e),r}yc(e){var s;const n=(s=this.path)==null?void 0:s.child(e),r=this.Vc({path:n,fc:!1});return r.Rc(),r}wc(e){return this.Vc({path:void 0,fc:!0})}Sc(e){return jl(e,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}Rc(){if(this.path)for(let e=0;e<this.path.length;e++)this.gc(this.path.get(e))}gc(e){if(e.length===0)throw this.Sc("Document fields must not be empty");if(xw(this.Ac)&&vA.test(e))throw this.Sc('Document fields cannot begin and end with "__"')}}class EA{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||yu(e)}Cc(e,n,r,s=!1){return new Iu({Ac:e,methodName:n,Dc:r,path:Ke.emptyPath(),fc:!1,bc:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Tw(t){const e=t._freezeSettings(),n=yu(t._databaseId);return new EA(t._databaseId,!!e.ignoreUndefinedProperties,n)}function xA(t,e,n,r,s,i={}){const o=t.Cc(i.merge||i.mergeFields?2:0,e,n,s);Nf("Data must be an object, but it was:",o,r);const l=Iw(r,o);let u,h;if(i.merge)u=new St(o.fieldMask),h=o.fieldTransforms;else if(i.mergeFields){const p=[];for(const m of i.mergeFields){const g=Yh(e,m,n);if(!o.contains(g))throw new W(O.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);kw(p,g)||p.push(g)}u=new St(p),h=o.fieldTransforms.filter(m=>u.covers(m.field))}else u=null,h=o.fieldTransforms;return new wA(new yt(l),u,h)}class Su extends Tu{_toFieldTransform(e){if(e.Ac!==2)throw e.Ac===1?e.Sc(`${this._methodName}() can only appear at the top level of your update data`):e.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Su}}function TA(t,e,n){return new Iu({Ac:3,Dc:e.settings.Dc,methodName:t._methodName,fc:n},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class Pf extends Tu{constructor(e,n){super(e),this.vc=n}_toFieldTransform(e){const n=TA(this,e,!0),r=this.vc.map(i=>zo(i,n)),s=new Qs(r);return new h2(e.path,s)}isEqual(e){return e instanceof Pf&&yr(this.vc,e.vc)}}function IA(t,e,n,r){const s=t.Cc(1,e,n);Nf("Data must be an object, but it was:",s,r);const i=[],o=yt.empty();Ar(r,(u,h)=>{const p=Df(e,u,n);h=at(h);const m=s.yc(p);if(h instanceof Su)i.push(p);else{const g=zo(h,m);g!=null&&(i.push(p),o.set(p,g))}});const l=new St(i);return new Ew(o,l,s.fieldTransforms)}function SA(t,e,n,r,s,i){const o=t.Cc(1,e,n),l=[Yh(e,r,n)],u=[s];if(i.length%2!=0)throw new W(O.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<i.length;g+=2)l.push(Yh(e,i[g])),u.push(i[g+1]);const h=[],p=yt.empty();for(let g=l.length-1;g>=0;--g)if(!kw(h,l[g])){const A=l[g];let b=u[g];b=at(b);const R=o.yc(A);if(b instanceof Su)h.push(A);else{const V=zo(b,R);V!=null&&(h.push(A),p.set(A,V))}}const m=new St(h);return new Ew(p,m,o.fieldTransforms)}function zo(t,e){if(Sw(t=at(t)))return Nf("Unsupported field value:",e,t),Iw(t,e);if(t instanceof Tu)return function(r,s){if(!xw(s.Ac))throw s.Sc(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Sc(`${r._methodName}() is not currently supported inside arrays`);const i=r._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.fc&&e.Ac!==4)throw e.Sc("Nested arrays are not supported");return function(r,s){const i=[];let o=0;for(const l of r){let u=zo(l,s.wc(o));u==null&&(u={nullValue:"NULL_VALUE"}),i.push(u),o++}return{arrayValue:{values:i}}}(t,e)}return function(r,s){if((r=at(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return l2(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const i=we.fromDate(r);return{timestampValue:Vl(s.serializer,i)}}if(r instanceof we){const i=new we(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Vl(s.serializer,i)}}if(r instanceof sn)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Dt)return{bytesValue:Hv(s.serializer,r._byteString)};if(r instanceof Oe){const i=s.databaseId,o=r.firestore._databaseId;if(!o.isEqual(i))throw s.Sc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:yf(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof on)return function(o,l){return{mapValue:{fields:{[vv]:{stringValue:wv},[bl]:{arrayValue:{values:o.toArray().map(h=>{if(typeof h!="number")throw l.Sc("VectorValues must only contain numeric values.");return pf(l.serializer,h)})}}}}}}(r,s);throw s.Sc(`Unsupported field value: ${af(r)}`)}(t,e)}function Iw(t,e){const n={};return fv(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Ar(t,(r,s)=>{const i=zo(s,e.mc(r));i!=null&&(n[r]=i)}),{mapValue:{fields:n}}}function Sw(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof we||t instanceof sn||t instanceof Dt||t instanceof Oe||t instanceof Tu||t instanceof on)}function Nf(t,e,n){if(!Sw(n)||!hv(n)){const r=af(n);throw r==="an object"?e.Sc(t+" a custom object"):e.Sc(t+" "+r)}}function Yh(t,e,n){if((e=at(e))instanceof xu)return e._internalPath;if(typeof e=="string")return Df(t,e);throw jl("Field path arguments must be of type string or ",t,!1,void 0,n)}const kA=new RegExp("[~\\*/\\[\\]]");function Df(t,e,n){if(e.search(kA)>=0)throw jl(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new xu(...e.split("."))._internalPath}catch{throw jl(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function jl(t,e,n,r,s){const i=r&&!r.isEmpty(),o=s!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${r}`),o&&(u+=` in document ${s}`),u+=")"),new W(O.INVALID_ARGUMENT,l+t+u)}function kw(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Aw{constructor(e,n,r,s,i){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Oe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new AA(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(Cw("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class AA extends Aw{data(){return super.data()}}function Cw(t,e){return typeof e=="string"?Df(t,e):e instanceof xu?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function CA(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new W(O.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class bA{convertValue(e,n="none"){switch(Er(e)){case 0:return null;case 1:return e.booleanValue;case 2:return be(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(wr(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw Q(62114,{value:e})}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const r={};return Ar(e,(s,i)=>{r[s]=this.convertValue(i,n)}),r}convertVectorValue(e){var r,s,i;const n=(i=(s=(r=e.fields)==null?void 0:r[bl].arrayValue)==null?void 0:s.values)==null?void 0:i.map(o=>be(o.doubleValue));return new on(n)}convertGeoPoint(e){return new sn(be(e.latitude),be(e.longitude))}convertArray(e,n){return(e.values||[]).map(r=>this.convertValue(r,n))}convertServerTimestamp(e,n){switch(n){case"previous":const r=cu(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(To(e));default:return null}}convertTimestamp(e){const n=vr(e);return new we(n.seconds,n.nanos)}convertDocumentKey(e,n){const r=ve.fromString(e);he(Xv(r),9688,{name:e});const s=new Io(r.get(1),r.get(3)),i=new K(r.popFirst(5));return s.isEqual(n)||Cn(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function RA(t,e,n){let r;return r=t?t.toFirestore(e):e,r}class Ui{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Hr extends Aw{constructor(e,n,r,s,i,o){super(e,n,r,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new Ga(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const r=this._document.data.field(Cw("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new W(O.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,n={};return n.type=Hr._jsonSchemaVersion,n.bundle="",n.bundleSource="DocumentSnapshot",n.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?n:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),n.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),n)}}Hr._jsonSchemaVersion="firestore/documentSnapshot/1.0",Hr._jsonSchema={type:Me("string",Hr._jsonSchemaVersion),bundleSource:Me("string","DocumentSnapshot"),bundleName:Me("string"),bundle:Me("string")};class Ga extends Hr{data(e={}){return super.data(e)}}class Ds{constructor(e,n,r,s){this._firestore=e,this._userDataWriter=n,this._snapshot=s,this.metadata=new Ui(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(r=>{e.call(n,new Ga(this._firestore,this._userDataWriter,r.key,r,new Ui(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new W(O.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map(l=>{const u=new Ga(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Ui(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(l=>i||l.type!==3).map(l=>{const u=new Ga(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Ui(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);let h=-1,p=-1;return l.type!==0&&(h=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),p=o.indexOf(l.doc.key)),{type:PA(l.type),doc:u,oldIndex:h,newIndex:p}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new W(O.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Ds._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=of.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const n=[],r=[],s=[];return this.docs.forEach(i=>{i._document!==null&&(n.push(i._document),r.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function PA(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Q(61501,{type:t})}}Ds._jsonSchemaVersion="firestore/querySnapshot/1.0",Ds._jsonSchema={type:Me("string",Ds._jsonSchemaVersion),bundleSource:Me("string","QuerySnapshot"),bundleName:Me("string"),bundle:Me("string")};class bw extends bA{constructor(e){super(),this.firestore=e}convertBytes(e){return new Dt(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new Oe(this.firestore,null,n)}}function Jh(t,e,n){t=fr(t,Oe);const r=fr(t.firestore,Ao),s=RA(t.converter,e);return Rw(r,[xA(Tw(r),"setDoc",t._key,s,t.converter!==null,n).toMutation(t._key,nn.none())])}function Vf(t,e,n,...r){t=fr(t,Oe);const s=fr(t.firestore,Ao),i=Tw(s);let o;return o=typeof(e=at(e))=="string"||e instanceof xu?SA(i,"updateDoc",t._key,e,n,r):IA(i,"updateDoc",t._key,e),Rw(s,[o.toMutation(t._key,nn.exists(!0))])}function ku(t,...e){var u,h,p;t=at(t);let n={includeMetadataChanges:!1,source:"default"},r=0;typeof e[r]!="object"||oy(e[r])||(n=e[r++]);const s={includeMetadataChanges:n.includeMetadataChanges,source:n.source};if(oy(e[r])){const m=e[r];e[r]=(u=m.next)==null?void 0:u.bind(m),e[r+1]=(h=m.error)==null?void 0:h.bind(m),e[r+2]=(p=m.complete)==null?void 0:p.bind(m)}let i,o,l;if(t instanceof Oe)o=fr(t.firestore,Ao),l=ff(t._key.path),i={next:m=>{e[r]&&e[r](NA(o,t,m))},error:e[r+1],complete:e[r+2]};else{const m=fr(t,Eu);o=fr(m.firestore,Ao),l=m._query;const g=new bw(o);i={next:A=>{e[r]&&e[r](new Ds(o,g,m,A))},error:e[r+1],complete:e[r+2]},CA(t._query)}return function(g,A,b,R){const V=new dA(R),I=new Gk(A,V,b);return g.asyncQueue.enqueueAndForget(async()=>$k(await Zg(g),I)),()=>{V.Nu(),g.asyncQueue.enqueueAndForget(async()=>Hk(await Zg(g),I))}}(ww(o),l,s,i)}function Rw(t,e){return function(r,s){const i=new $r;return r.asyncQueue.enqueueAndForget(async()=>rA(await mA(r),s,i)),i.promise}(ww(t),e)}function NA(t,e,n){const r=n.docs.get(e._key),s=new bw(t);return new Hr(t,s,e._key,r,new Ui(n.hasPendingWrites,n.fromCache),e.converter)}function DA(...t){return new Pf("arrayUnion",t)}(function(e,n=!0){(function(s){si=s})(ri),Hs(new Xr("firestore",(r,{instanceIdentifier:s,options:i})=>{const o=r.getProvider("app").getImmediate(),l=new Ao(new vS(r.getProvider("auth-internal")),new xS(o,r.getProvider("app-check-internal")),function(h,p){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new W(O.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Io(h.options.projectId,p)}(o,s),o);return i={useFetchStreams:n,...i},l._setSettings(i),l},"PUBLIC").setMultipleInstances(!0)),hr(cg,hg,e),hr(cg,hg,"esm2020")})();function Pw(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const VA=Pw,Nw=new Vo("auth","Firebase",Pw());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fl=new ef("@firebase/auth");function MA(t,...e){Fl.logLevel<=oe.WARN&&Fl.warn(`Auth (${ri}): ${t}`,...e)}function Ka(t,...e){Fl.logLevel<=oe.ERROR&&Fl.error(`Auth (${ri}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rn(t,...e){throw Mf(t,...e)}function an(t,...e){return Mf(t,...e)}function Dw(t,e,n){const r={...VA(),[e]:n};return new Vo("auth","Firebase",r).create(e,{appName:t.name})}function En(t){return Dw(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Mf(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return Nw.create(t,...e)}function Y(t,e,...n){if(!t)throw Mf(e,...n)}function gn(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Ka(e),new Error(e)}function Pn(t,e){t||gn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zh(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function OA(){return ay()==="http:"||ay()==="https:"}function ay(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function LA(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(OA()||GT()||"connection"in navigator)?navigator.onLine:!0}function jA(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bo{constructor(e,n){this.shortDelay=e,this.longDelay=n,Pn(n>e,"Short delay should be less than long delay!"),this.isMobile=HT()||KT()}get(){return LA()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Of(t,e){Pn(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vw{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;gn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;gn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;gn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FA={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const UA=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],zA=new Bo(3e4,6e4);function $o(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function li(t,e,n,r,s={}){return Mw(t,s,async()=>{let i={},o={};r&&(e==="GET"?o=r:i={body:JSON.stringify(r)});const l=Mo({key:t.config.apiKey,...o}).slice(1),u=await t._getAdditionalHeaders();u["Content-Type"]="application/json",t.languageCode&&(u["X-Firebase-Locale"]=t.languageCode);const h={method:e,headers:u,...i};return WT()||(h.referrerPolicy="no-referrer"),t.emulatorConfig&&ni(t.emulatorConfig.host)&&(h.credentials="include"),Vw.fetch()(await Ow(t,t.config.apiHost,n,l),h)})}async function Mw(t,e,n){t._canInitEmulator=!1;const r={...FA,...e};try{const s=new BA(t),i=await Promise.race([n(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw Aa(t,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const l=i.ok?o.errorMessage:o.error.message,[u,h]=l.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw Aa(t,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw Aa(t,"email-already-in-use",o);if(u==="USER_DISABLED")throw Aa(t,"user-disabled",o);const p=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw Dw(t,p,h);Rn(t,p)}}catch(s){if(s instanceof Vn)throw s;Rn(t,"network-request-failed",{message:String(s)})}}async function Lf(t,e,n,r,s={}){const i=await li(t,e,n,r,s);return"mfaPendingCredential"in i&&Rn(t,"multi-factor-auth-required",{_serverResponse:i}),i}async function Ow(t,e,n,r){const s=`${e}${n}?${r}`,i=t,o=i.config.emulator?Of(t.config,s):`${t.config.apiScheme}://${s}`;return UA.includes(n)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}class BA{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(an(this.auth,"network-request-failed")),zA.get())})}}function Aa(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const s=an(t,e,r);return s.customData._tokenResponse=n,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $A(t,e){return li(t,"POST","/v1/accounts:delete",e)}async function Ul(t,e){return li(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function to(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function HA(t,e=!1){const n=at(t),r=await n.getIdToken(e),s=jf(r);Y(s&&s.exp&&s.auth_time&&s.iat,n.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:to(Nc(s.auth_time)),issuedAtTime:to(Nc(s.iat)),expirationTime:to(Nc(s.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function Nc(t){return Number(t)*1e3}function jf(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Ka("JWT malformed, contained fewer than 3 sections"),null;try{const s=q0(n);return s?JSON.parse(s):(Ka("Failed to decode base64 JWT payload"),null)}catch(s){return Ka("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function ly(t){const e=jf(t);return Y(e,"internal-error"),Y(typeof e.exp<"u","internal-error"),Y(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Co(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Vn&&qA(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function qA({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WA{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ed{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=to(this.lastLoginAt),this.creationTime=to(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zl(t){var m;const e=t.auth,n=await t.getIdToken(),r=await Co(t,Ul(e,{idToken:n}));Y(r==null?void 0:r.users.length,e,"internal-error");const s=r.users[0];t._notifyReloadListener(s);const i=(m=s.providerUserInfo)!=null&&m.length?Lw(s.providerUserInfo):[],o=KA(t.providerData,i),l=t.isAnonymous,u=!(t.email&&s.passwordHash)&&!(o!=null&&o.length),h=l?u:!1,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new ed(s.createdAt,s.lastLoginAt),isAnonymous:h};Object.assign(t,p)}async function GA(t){const e=at(t);await zl(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function KA(t,e){return[...t.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function Lw(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function QA(t,e){const n=await Mw(t,{},async()=>{const r=Mo({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=t.config,o=await Ow(t,s,"/v1/token",`key=${i}`),l=await t._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";const u={method:"POST",headers:l,body:r};return t.emulatorConfig&&ni(t.emulatorConfig.host)&&(u.credentials="include"),Vw.fetch()(o,u)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function XA(t,e){return li(t,"POST","/v2/accounts:revokeToken",$o(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vs{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Y(e.idToken,"internal-error"),Y(typeof e.idToken<"u","internal-error"),Y(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):ly(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){Y(e.length!==0,"internal-error");const n=ly(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(Y(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:s,expiresIn:i}=await QA(e,n);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:s,expirationTime:i}=n,o=new Vs;return r&&(Y(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),s&&(Y(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(Y(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Vs,this.toJSON())}_performRefresh(){return gn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $n(t,e){Y(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class $t{constructor({uid:e,auth:n,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new WA(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new ed(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const n=await Co(this,this.stsTokenManager.getToken(this.auth,e));return Y(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return HA(this,e)}reload(){return GA(this)}_assign(e){this!==e&&(Y(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new $t({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){Y(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await zl(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Nt(this.auth.app))return Promise.reject(En(this.auth));const e=await this.getIdToken();return await Co(this,$A(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,s=n.email??void 0,i=n.phoneNumber??void 0,o=n.photoURL??void 0,l=n.tenantId??void 0,u=n._redirectEventId??void 0,h=n.createdAt??void 0,p=n.lastLoginAt??void 0,{uid:m,emailVerified:g,isAnonymous:A,providerData:b,stsTokenManager:R}=n;Y(m&&R,e,"internal-error");const V=Vs.fromJSON(this.name,R);Y(typeof m=="string",e,"internal-error"),$n(r,e.name),$n(s,e.name),Y(typeof g=="boolean",e,"internal-error"),Y(typeof A=="boolean",e,"internal-error"),$n(i,e.name),$n(o,e.name),$n(l,e.name),$n(u,e.name),$n(h,e.name),$n(p,e.name);const I=new $t({uid:m,auth:e,email:s,emailVerified:g,displayName:r,isAnonymous:A,photoURL:o,phoneNumber:i,tenantId:l,stsTokenManager:V,createdAt:h,lastLoginAt:p});return b&&Array.isArray(b)&&(I.providerData=b.map(_=>({..._}))),u&&(I._redirectEventId=u),I}static async _fromIdTokenResponse(e,n,r=!1){const s=new Vs;s.updateFromServerResponse(n);const i=new $t({uid:n.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await zl(i),i}static async _fromGetAccountInfoResponse(e,n,r){const s=n.users[0];Y(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?Lw(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),l=new Vs;l.updateFromIdToken(r);const u=new $t({uid:s.localId,auth:e,stsTokenManager:l,isAnonymous:o}),h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new ed(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(u,h),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uy=new Map;function yn(t){Pn(t instanceof Function,"Expected a class definition");let e=uy.get(t);return e?(Pn(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,uy.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jw{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}jw.type="NONE";const cy=jw;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qa(t,e,n){return`firebase:${t}:${e}:${n}`}class Ms{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=Qa(this.userKey,s.apiKey,i),this.fullPersistenceKey=Qa("persistence",s.apiKey,i),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await Ul(this.auth,{idToken:e}).catch(()=>{});return n?$t._fromGetAccountInfoResponse(this.auth,n,e):null}return $t._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new Ms(yn(cy),e,r);const s=(await Promise.all(n.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let i=s[0]||yn(cy);const o=Qa(r,e.config.apiKey,e.name);let l=null;for(const h of n)try{const p=await h._get(o);if(p){let m;if(typeof p=="string"){const g=await Ul(e,{idToken:p}).catch(()=>{});if(!g)break;m=await $t._fromGetAccountInfoResponse(e,g,p)}else m=$t._fromJSON(e,p);h!==i&&(l=m),i=h;break}}catch{}const u=s.filter(h=>h._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new Ms(i,e,r):(i=u[0],l&&await i._set(o,l.toJSON()),await Promise.all(n.map(async h=>{if(h!==i)try{await h._remove(o)}catch{}})),new Ms(i,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hy(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Bw(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Fw(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Hw(e))return"Blackberry";if(qw(e))return"Webos";if(Uw(e))return"Safari";if((e.includes("chrome/")||zw(e))&&!e.includes("edge/"))return"Chrome";if($w(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Fw(t=ot()){return/firefox\//i.test(t)}function Uw(t=ot()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function zw(t=ot()){return/crios\//i.test(t)}function Bw(t=ot()){return/iemobile/i.test(t)}function $w(t=ot()){return/android/i.test(t)}function Hw(t=ot()){return/blackberry/i.test(t)}function qw(t=ot()){return/webos/i.test(t)}function Ff(t=ot()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function YA(t=ot()){var e;return Ff(t)&&!!((e=window.navigator)!=null&&e.standalone)}function JA(){return QT()&&document.documentMode===10}function Ww(t=ot()){return Ff(t)||$w(t)||qw(t)||Hw(t)||/windows phone/i.test(t)||Bw(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gw(t,e=[]){let n;switch(t){case"Browser":n=hy(ot());break;case"Worker":n=`${hy(ot())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${ri}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZA{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=i=>new Promise((o,l)=>{try{const u=e(i);o(u)}catch(u){l(u)}});r.onAbort=n,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const s of n)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eC(t,e={}){return li(t,"GET","/v2/passwordPolicy",$o(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tC=6;class nC{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??tC,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),s&&(n.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rC{constructor(e,n,r,s){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new dy(this),this.idTokenSubscription=new dy(this),this.beforeStateQueue=new ZA(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Nw,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=yn(n)),this._initializationPromise=this.queue(async()=>{var r,s,i;if(!this._deleted&&(this.persistenceManager=await Ms.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((i=this.currentUser)==null?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Ul(this,{idToken:e}),r=await $t._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var i;if(Nt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(i=this.redirectUser)==null?void 0:i._redirectEventId,l=r==null?void 0:r._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===l)&&(u!=null&&u.user)&&(r=u.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return Y(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await zl(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=jA()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Nt(this.app))return Promise.reject(En(this));const n=e?at(e):null;return n&&Y(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&Y(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Nt(this.app)?Promise.reject(En(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Nt(this.app)?Promise.reject(En(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(yn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await eC(this),n=new nC(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Vo("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await XA(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&yn(e)||this._popupRedirectResolver;Y(n,this,"argument-error"),this.redirectPersistenceManager=await Ms.create(this,[yn(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,s){if(this._deleted)return()=>{};const i=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(Y(l,this,"internal-error"),l.then(()=>{o||i(this.currentUser)}),typeof n=="function"){const u=e.addObserver(n,r,s);return()=>{o=!0,u()}}else{const u=e.addObserver(n);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Y(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Gw(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(Nt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&MA(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Ho(t){return at(t)}class dy{constructor(e){this.auth=e,this.observer=null,this.addObserver=rI(n=>this.observer=n)}get next(){return Y(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Uf={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function sC(t){Uf=t}function iC(t){return Uf.loadJS(t)}function oC(){return Uf.gapiScript}function aC(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lC(t,e){const n=nf(t,"auth");if(n.isInitialized()){const s=n.getImmediate(),i=n.getOptions();if(yr(i,e??{}))return s;Rn(s,"already-initialized")}return n.initialize({options:e})}function uC(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(yn);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function cC(t,e,n){const r=Ho(t);Y(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=Kw(e),{host:o,port:l}=hC(e),u=l===null?"":`:${l}`,h={url:`${i}//${o}${u}/`},p=Object.freeze({host:o,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){Y(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),Y(yr(h,r.config.emulator)&&yr(p,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=h,r.emulatorConfig=p,r.settings.appVerificationDisabledForTesting=!0,ni(o)?(Q0(`${i}//${o}${u}`),X0("Auth",!0)):dC()}function Kw(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function hC(t){const e=Kw(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:fy(r.substr(i.length+1))}}else{const[i,o]=r.split(":");return{host:i,port:fy(o)}}}function fy(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function dC(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qw{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return gn("not implemented")}_getIdTokenResponse(e){return gn("not implemented")}_linkToIdToken(e,n){return gn("not implemented")}_getReauthenticationResolver(e){return gn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Os(t,e){return Lf(t,"POST","/v1/accounts:signInWithIdp",$o(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fC="http://localhost";class Zr extends Qw{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Zr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):Rn("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...i}=n;if(!r||!s)return null;const o=new Zr(r,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return Os(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,Os(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Os(e,n)}buildRequest(){const e={requestUri:fC,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Mo(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xw{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qo extends Xw{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kn extends qo{constructor(){super("facebook.com")}static credential(e){return Zr._fromParams({providerId:Kn.PROVIDER_ID,signInMethod:Kn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Kn.credentialFromTaggedObject(e)}static credentialFromError(e){return Kn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Kn.credential(e.oauthAccessToken)}catch{return null}}}Kn.FACEBOOK_SIGN_IN_METHOD="facebook.com";Kn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qn extends qo{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Zr._fromParams({providerId:Qn.PROVIDER_ID,signInMethod:Qn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Qn.credentialFromTaggedObject(e)}static credentialFromError(e){return Qn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return Qn.credential(n,r)}catch{return null}}}Qn.GOOGLE_SIGN_IN_METHOD="google.com";Qn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xn extends qo{constructor(){super("github.com")}static credential(e){return Zr._fromParams({providerId:Xn.PROVIDER_ID,signInMethod:Xn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Xn.credentialFromTaggedObject(e)}static credentialFromError(e){return Xn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Xn.credential(e.oauthAccessToken)}catch{return null}}}Xn.GITHUB_SIGN_IN_METHOD="github.com";Xn.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yn extends qo{constructor(){super("twitter.com")}static credential(e,n){return Zr._fromParams({providerId:Yn.PROVIDER_ID,signInMethod:Yn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Yn.credentialFromTaggedObject(e)}static credentialFromError(e){return Yn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Yn.credential(n,r)}catch{return null}}}Yn.TWITTER_SIGN_IN_METHOD="twitter.com";Yn.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pC(t,e){return Lf(t,"POST","/v1/accounts:signUp",$o(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,s=!1){const i=await $t._fromIdTokenResponse(e,r,s),o=py(r);return new Nn({user:i,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const s=py(r);return new Nn({user:e,providerId:s,_tokenResponse:r,operationType:n})}}function py(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mC(t){var s;if(Nt(t.app))return Promise.reject(En(t));const e=Ho(t);if(await e._initializationPromise,(s=e.currentUser)!=null&&s.isAnonymous)return new Nn({user:e.currentUser,providerId:null,operationType:"signIn"});const n=await pC(e,{returnSecureToken:!0}),r=await Nn._fromIdTokenResponse(e,"signIn",n,!0);return await e._updateCurrentUser(r.user),r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bl extends Vn{constructor(e,n,r,s){super(n.code,n.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Bl.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,s){return new Bl(e,n,r,s)}}function Yw(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Bl._fromErrorAndOperation(t,i,e,r):i})}async function gC(t,e,n=!1){const r=await Co(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Nn._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yC(t,e,n=!1){const{auth:r}=t;if(Nt(r.app))return Promise.reject(En(r));const s="reauthenticate";try{const i=await Co(t,Yw(r,s,e,t),n);Y(i.idToken,r,"internal-error");const o=jf(i.idToken);Y(o,r,"internal-error");const{sub:l}=o;return Y(t.uid===l,r,"user-mismatch"),Nn._forOperation(t,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&Rn(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _C(t,e,n=!1){if(Nt(t.app))return Promise.reject(En(t));const r="signIn",s=await Yw(t,r,e),i=await Nn._fromIdTokenResponse(t,r,s);return n||await t._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vC(t,e){return Lf(t,"POST","/v1/accounts:signInWithCustomToken",$o(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wC(t,e){if(Nt(t.app))return Promise.reject(En(t));const n=Ho(t),r=await vC(n,{token:e,returnSecureToken:!0}),s=await Nn._fromIdTokenResponse(n,"signIn",r);return await n._updateCurrentUser(s.user),s}function EC(t,e,n,r){return at(t).onIdTokenChanged(e,n,r)}function xC(t,e,n){return at(t).beforeAuthStateChanged(e,n)}function TC(t,e,n,r){return at(t).onAuthStateChanged(e,n,r)}const $l="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jw{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem($l,"1"),this.storage.removeItem($l),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const IC=1e3,SC=10;class Zw extends Jw{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Ww(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),s=this.localCache[n];r!==s&&e(n,s,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,u)=>{this.notifyListeners(o,u)});return}const r=e.key;n?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},i=this.storage.getItem(r);JA()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,SC):s()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},IC)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Zw.type="LOCAL";const kC=Zw;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e1 extends Jw{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}e1.type="SESSION";const t1=e1;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AC(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Au{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(s=>s.isListeningto(e));if(n)return n;const r=new Au(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:s,data:i}=n.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const l=Array.from(o).map(async h=>h(n.origin,i)),u=await AC(l);n.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:u})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Au.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zf(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CC{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((l,u)=>{const h=zf("",20);s.port1.start();const p=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:s,onMessage(m){const g=m;if(g.data.eventId===h)switch(g.data.status){case"ack":clearTimeout(p),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(g.data.response);break;default:clearTimeout(p),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:h,data:n},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ln(){return window}function bC(t){ln().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function n1(){return typeof ln().WorkerGlobalScope<"u"&&typeof ln().importScripts=="function"}async function RC(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function PC(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function NC(){return n1()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const r1="firebaseLocalStorageDb",DC=1,Hl="firebaseLocalStorage",s1="fbase_key";class Wo{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Cu(t,e){return t.transaction([Hl],e?"readwrite":"readonly").objectStore(Hl)}function VC(){const t=indexedDB.deleteDatabase(r1);return new Wo(t).toPromise()}function td(){const t=indexedDB.open(r1,DC);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(Hl,{keyPath:s1})}catch(s){n(s)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(Hl)?e(r):(r.close(),await VC(),e(await td()))})})}async function my(t,e,n){const r=Cu(t,!0).put({[s1]:e,value:n});return new Wo(r).toPromise()}async function MC(t,e){const n=Cu(t,!1).get(e),r=await new Wo(n).toPromise();return r===void 0?null:r.value}function gy(t,e){const n=Cu(t,!0).delete(e);return new Wo(n).toPromise()}const OC=800,LC=3;class i1{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await td(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>LC)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return n1()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Au._getInstance(NC()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await RC(),!this.activeServiceWorker)return;this.sender=new CC(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||PC()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await td();return await my(e,$l,"1"),await gy(e,$l),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>my(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>MC(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>gy(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=Cu(s,!1).getAll();return new Wo(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),n.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),n.push(s));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),OC)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}i1.type="LOCAL";const jC=i1;new Bo(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function FC(t,e){return e?yn(e):(Y(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bf extends Qw{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Os(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Os(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Os(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function UC(t){return _C(t.auth,new Bf(t),t.bypassAuthState)}function zC(t){const{auth:e,user:n}=t;return Y(n,e,"internal-error"),yC(n,new Bf(t),t.bypassAuthState)}async function BC(t){const{auth:e,user:n}=t;return Y(n,e,"internal-error"),gC(n,new Bf(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o1{constructor(e,n,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:s,tenantId:i,error:o,type:l}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:n,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(u))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return UC;case"linkViaPopup":case"linkViaRedirect":return BC;case"reauthViaPopup":case"reauthViaRedirect":return zC;default:Rn(this.auth,"internal-error")}}resolve(e){Pn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Pn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $C=new Bo(2e3,1e4);class Ss extends o1{constructor(e,n,r,s,i){super(e,n,s,i),this.provider=r,this.authWindow=null,this.pollId=null,Ss.currentPopupAction&&Ss.currentPopupAction.cancel(),Ss.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Y(e,this.auth,"internal-error"),e}async onExecution(){Pn(this.filter.length===1,"Popup operations only handle one event");const e=zf();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(an(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(an(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Ss.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(an(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,$C.get())};e()}}Ss.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const HC="pendingRedirect",Xa=new Map;class qC extends o1{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Xa.get(this.auth._key());if(!e){try{const r=await WC(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Xa.set(this.auth._key(),e)}return this.bypassAuthState||Xa.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function WC(t,e){const n=QC(e),r=KC(t);if(!await r._isAvailable())return!1;const s=await r._get(n)==="true";return await r._remove(n),s}function GC(t,e){Xa.set(t._key(),e)}function KC(t){return yn(t._redirectPersistence)}function QC(t){return Qa(HC,t.config.apiKey,t.name)}async function XC(t,e,n=!1){if(Nt(t.app))return Promise.reject(En(t));const r=Ho(t),s=FC(r,e),o=await new qC(r,s,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const YC=10*60*1e3;class JC{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!ZC(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!a1(e)){const s=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(an(this.auth,s))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=YC&&this.cachedEventUids.clear(),this.cachedEventUids.has(yy(e))}saveEventToCache(e){this.cachedEventUids.add(yy(e)),this.lastProcessedEventTime=Date.now()}}function yy(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function a1({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function ZC(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return a1(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eb(t,e={}){return li(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tb=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,nb=/^https?/;async function rb(t){if(t.config.emulator)return;const{authorizedDomains:e}=await eb(t);for(const n of e)try{if(sb(n))return}catch{}Rn(t,"unauthorized-domain")}function sb(t){const e=Zh(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!nb.test(n))return!1;if(tb.test(t))return r===t;const s=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ib=new Bo(3e4,6e4);function _y(){const t=ln().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function ob(t){return new Promise((e,n)=>{var s,i,o;function r(){_y(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{_y(),n(an(t,"network-request-failed"))},timeout:ib.get()})}if((i=(s=ln().gapi)==null?void 0:s.iframes)!=null&&i.Iframe)e(gapi.iframes.getContext());else if((o=ln().gapi)!=null&&o.load)r();else{const l=aC("iframefcb");return ln()[l]=()=>{gapi.load?r():n(an(t,"network-request-failed"))},iC(`${oC()}?onload=${l}`).catch(u=>n(u))}}).catch(e=>{throw Ya=null,e})}let Ya=null;function ab(t){return Ya=Ya||ob(t),Ya}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lb=new Bo(5e3,15e3),ub="__/auth/iframe",cb="emulator/auth/iframe",hb={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},db=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function fb(t){const e=t.config;Y(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Of(e,cb):`https://${t.config.authDomain}/${ub}`,r={apiKey:e.apiKey,appName:t.name,v:ri},s=db.get(t.config.apiHost);s&&(r.eid=s);const i=t._getFrameworks();return i.length&&(r.fw=i.join(",")),`${n}?${Mo(r).slice(1)}`}async function pb(t){const e=await ab(t),n=ln().gapi;return Y(n,t,"internal-error"),e.open({where:document.body,url:fb(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:hb,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const o=an(t,"network-request-failed"),l=ln().setTimeout(()=>{i(o)},lb.get());function u(){ln().clearTimeout(l),s(r)}r.ping(u).then(u,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mb={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},gb=500,yb=600,_b="_blank",vb="http://localhost";class vy{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function wb(t,e,n,r=gb,s=yb){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const u={...mb,width:r.toString(),height:s.toString(),top:i,left:o},h=ot().toLowerCase();n&&(l=zw(h)?_b:n),Fw(h)&&(e=e||vb,u.scrollbars="yes");const p=Object.entries(u).reduce((g,[A,b])=>`${g}${A}=${b},`,"");if(YA(h)&&l!=="_self")return Eb(e||"",l),new vy(null);const m=window.open(e||"",l,p);Y(m,t,"popup-blocked");try{m.focus()}catch{}return new vy(m)}function Eb(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xb="__/auth/handler",Tb="emulator/auth/handler",Ib=encodeURIComponent("fac");async function wy(t,e,n,r,s,i){Y(t.config.authDomain,t,"auth-domain-config-required"),Y(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:ri,eventId:s};if(e instanceof Xw){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",nI(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[p,m]of Object.entries({}))o[p]=m}if(e instanceof qo){const p=e.getScopes().filter(m=>m!=="");p.length>0&&(o.scopes=p.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const p of Object.keys(l))l[p]===void 0&&delete l[p];const u=await t._getAppCheckToken(),h=u?`#${Ib}=${encodeURIComponent(u)}`:"";return`${Sb(t)}?${Mo(l).slice(1)}${h}`}function Sb({config:t}){return t.emulator?Of(t,Tb):`https://${t.authDomain}/${xb}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dc="webStorageSupport";class kb{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=t1,this._completeRedirectFn=XC,this._overrideRedirectResult=GC}async _openPopup(e,n,r,s){var o;Pn((o=this.eventManagers[e._key()])==null?void 0:o.manager,"_initialize() not called before _openPopup()");const i=await wy(e,n,r,Zh(),s);return wb(e,i,zf())}async _openRedirect(e,n,r,s){await this._originValidation(e);const i=await wy(e,n,r,Zh(),s);return bC(i),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:s,promise:i}=this.eventManagers[n];return s?Promise.resolve(s):(Pn(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await pb(e),r=new JC(e);return n.register("authEvent",s=>(Y(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Dc,{type:Dc},s=>{var o;const i=(o=s==null?void 0:s[0])==null?void 0:o[Dc];i!==void 0&&n(!!i),Rn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=rb(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Ww()||Uw()||Ff()}}const Ab=kb;var Ey="@firebase/auth",xy="1.11.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cb{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){Y(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bb(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Rb(t){Hs(new Xr("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=r.options;Y(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Gw(t)},h=new rC(r,s,i,u);return uC(h,n),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Hs(new Xr("auth-internal",e=>{const n=Ho(e.getProvider("auth").getImmediate());return(r=>new Cb(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),hr(Ey,xy,bb(t)),hr(Ey,xy,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pb=5*60,Nb=K0("authIdTokenMaxAge")||Pb;let Ty=null;const Db=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Nb)return;const s=n==null?void 0:n.token;Ty!==s&&(Ty=s,await fetch(t,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function Vb(t=rf()){const e=nf(t,"auth");if(e.isInitialized())return e.getImmediate();const n=lC(t,{popupRedirectResolver:Ab,persistence:[jC,kC,t1]}),r=K0("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const o=Db(i.toString());xC(n,o,()=>o(n.currentUser)),EC(n,l=>o(l))}}const s=W0("auth");return s&&cC(n,`http://${s}`),n}function Mb(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}sC({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=s=>{const i=an("internal-error");i.customData=s,n(i)},r.type="text/javascript",r.charset="UTF-8",Mb().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Rb("Browser");const Ob={apiKey:"AIzaSyC16Iwrjd9ZhVa979MHGh-P4cQMCBUfePE",authDomain:"life-skills-suite.firebaseapp.com",projectId:"life-skills-suite",storageBucket:"life-skills-suite.firebasestorage.app",messagingSenderId:"674230711374",appId:"1:674230711374:web:e92f3a210d7d3c6367bf1f"};let De=null,Ja=null;const xn="lifeskills-default";try{const t=sS().length===0?Z0(Ob):rf();De=yA(t),Ja=Vb(t),console.log("🔥 Firebase connesso.")}catch(t){console.error("Errore inizializzazione Firebase:",t)}const Ca={emotions:[{id:1,text:"Il professore consegna le verifiche. Tu hai studiato ogni pomeriggio, prendi 5. Il compagno accanto, che ha copiato, prende 8.",tags:["scuola"]},{id:2,text:"Vedi una foto su Instagram di tutti i tuoi amici a cena fuori. Nessuno ti ha invitato.",tags:["esclusione"]},{id:3,text:"Torni a casa e trovi tua madre che piange in cucina. Appena ti vede, smette e finge nulla.",tags:["famiglia"]},{id:4,text:"Passa la persona che ti piace, ti guarda un secondo e poi distoglie lo sguardo parlando con altri.",tags:["relazioni"]},{id:5,text:"Un amico fa una battuta pesante su di te davanti agli altri. Tutti ridono, lui incluso.",tags:["amicizia"]}],decisions_cold:[{id:1,text:"Devi scegliere le superiori: i tuoi vogliono il Classico, tu l'Artistico. La tua famiglia ha problemi economici e l'Artistico costa molto.",tags:["futuro"]}],decisions_hot:[{id:1,text:"Sei in auto. Chi guida ha bevuto e corre troppo. C'è una curva avanti.",tags:["pericolo"]}],emotion_narratives:[{id:1,text:"Vulnerabile",tags:[]},{id:2,text:"Disperato",tags:[]},{id:3,text:"Colpevole",tags:[]},{id:4,text:"Depresso",tags:[]}],affectivity_sexuality:[{id:1,text:"Siete in intimità. Il partner prova a fare qualcosa di nuovo senza chiedertelo.",tags:["consenso"]}],feedback_sets:[{id:"default_1",title:"Riflessione Emotiva Base",questions:[{id:1,text:"Come ti senti in questo momento?",imgUrl:""},{id:2,text:"Qual è la tua opinione su quanto abbiamo visto?",imgUrl:""}]}],poll_sets:[{id:"poll_1",title:"Gradimento Attività",question:"Quanto ti è piaciuta questa attività?",options:["Moltissimo","Abbastanza","Poco","Per nulla"],allowMultiple:!1}]},Lb=()=>f.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:f.jsx("polygon",{points:"5 3 19 12 5 21 5 3"})}),Za=({className:t})=>{const[e,n]=H.useState(!1);H.useEffect(()=>{const s=()=>n(!!document.fullscreenElement);return document.addEventListener("fullscreenchange",s),()=>document.removeEventListener("fullscreenchange",s)},[]);const r=()=>{document.fullscreenElement?document.exitFullscreen&&document.exitFullscreen():document.documentElement.requestFullscreen().catch(s=>console.error(s))};return f.jsx("button",{onClick:r,className:`p-2 bg-gray-100 rounded-xl hover:bg-gray-200 border-2 border-gray-200 text-gray-600 transition-all ${t}`,title:e?"Esci da Schermo Intero":"Schermo Intero",children:e?f.jsx(xT,{size:20}):f.jsx(ET,{size:20})})},ls=({title:t,icon:e,color:n,onClick:r,description:s,subtitle:i})=>{const o=t.length>20?"text-xl":"text-2xl";return f.jsxs("button",{onClick:r,className:`w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-left border-4 border-black flex flex-col justify-between h-64 ${n}`,children:[f.jsxs("div",{children:[f.jsx("div",{className:"bg-white w-14 h-14 rounded-full flex items-center justify-center border-4 border-black mb-4",children:f.jsx(e,{size:28,className:"text-black"})}),f.jsx("h3",{className:`${o} font-black text-black uppercase leading-tight mb-2 break-words`,children:t}),f.jsx("span",{className:"inline-block px-2 py-1 bg-black text-white text-xs font-bold uppercase rounded-md",children:i})]}),f.jsx("p",{className:"text-sm font-bold text-black/70 mt-2",children:s})]})},jb=({responses:t,options:e})=>{const n={};e.forEach(i=>n[i]=0);let r=0;t.forEach(i=>{i.visible!==!1&&(Array.isArray(i.text)?i.text:[i.text]).forEach(l=>{n[l]!==void 0&&n[l]++,r++})});const s=Math.max(...Object.values(n),1);return f.jsxs("div",{className:"w-full h-full flex flex-col justify-center gap-4 p-4 max-w-3xl mx-auto",children:[e.map((i,o)=>f.jsxs("div",{className:"w-full",children:[f.jsxs("div",{className:"flex justify-between mb-1 font-bold text-gray-700",children:[f.jsx("span",{children:i}),f.jsx("span",{children:n[i]})]}),f.jsx("div",{className:"w-full bg-white rounded-full h-8 border-2 border-gray-200 overflow-hidden shadow-inner",children:f.jsx("div",{className:"bg-green-500 h-full transition-all duration-1000 ease-out",style:{width:`${s>0?n[i]/s*100:0}%`}})})]},o)),f.jsxs("div",{className:"text-center text-gray-400 text-sm mt-4",children:["Voti totali: ",r]})]})},Fb=({responses:t})=>{const e={};t.forEach(r=>{if(r.visible!==!1){const i=(Array.isArray(r.text)?r.text.join(" "):r.text).trim().toLowerCase();i&&(e[i]=(e[i]||0)+1)}});const n=Object.keys(e).map(r=>({text:r,count:e[r]}));return n.sort((r,s)=>s.count-r.count),f.jsxs("div",{className:"flex flex-wrap justify-center items-center gap-4 p-8 h-full content-center",children:[n.map((r,s)=>{const i=Math.min(2+r.count*.5,8);return f.jsx("span",{className:"font-black transition-all duration-500 leading-none capitalize",style:{fontSize:`${i}rem`,opacity:.7+Math.min(r.count,5)*.05,color:`hsl(${s*60%360}, 70%, 45%)`},children:r.text},s)}),n.length===0&&f.jsx("span",{className:"text-gray-400 text-2xl font-bold uppercase opacity-50",children:"In attesa..."})]})},Ub=({polls:t,onUpdate:e,onClose:n})=>{const[r,s]=H.useState(t||[]),[i,o]=H.useState(""),[l,u]=H.useState(""),[h,p]=H.useState(""),[m,g]=H.useState(!1),A=()=>{if(!i||!l||!h)return;const R={id:Date.now().toString(),title:i,question:l,options:h.split(",").map(I=>I.trim()).filter(I=>I),allowMultiple:m},V=[...r,R];s(V),e(V),o(""),u(""),p(""),g(!1)},b=R=>{const V=r.filter(I=>I.id!==R);s(V),e(V)};return f.jsxs("div",{className:"fixed inset-0 bg-white z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300",children:[f.jsxs("div",{className:"p-6 border-b-4 border-black flex justify-between items-center bg-green-50",children:[f.jsx("div",{children:f.jsx("h2",{className:"text-3xl font-black uppercase text-green-900",children:"Gestione Sondaggi"})}),f.jsx("button",{onClick:n,className:"p-3 bg-black text-white rounded-full",children:f.jsx(ti,{size:24})})]}),f.jsxs("div",{className:"flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8",children:[f.jsxs("div",{className:"bg-white p-6 rounded-3xl border-4 border-green-100",children:[f.jsx("h3",{className:"text-xl font-black mb-4 text-green-800",children:"Crea Nuovo Sondaggio"}),f.jsxs("div",{className:"space-y-3",children:[f.jsx("input",{value:i,onChange:R=>o(R.target.value),placeholder:"Titolo (es. Gradimento)",className:"w-full p-3 rounded-xl border-2 border-gray-200 outline-none font-bold"}),f.jsx("input",{value:l,onChange:R=>u(R.target.value),placeholder:"Domanda...",className:"w-full p-3 rounded-xl border-2 border-gray-200 outline-none"}),f.jsx("textarea",{value:h,onChange:R=>p(R.target.value),placeholder:"Opzioni (separate da virgola)",className:"w-full p-3 rounded-xl border-2 border-gray-200 outline-none h-24"}),f.jsxs("label",{className:"flex items-center gap-2 font-bold text-gray-700 cursor-pointer",children:[f.jsx("input",{type:"checkbox",checked:m,onChange:R=>g(R.target.checked),className:"w-5 h-5 accent-green-500"}),"Consenti risposta multipla"]}),f.jsx("button",{onClick:A,disabled:!i||!l||!h,className:"w-full bg-green-500 text-white py-3 rounded-xl font-bold uppercase disabled:opacity-50",children:"Salva Sondaggio"})]})]}),f.jsxs("div",{className:"space-y-4",children:[f.jsx("h3",{className:"font-bold text-gray-400 uppercase tracking-widest text-xs",children:"Sondaggi Salvati"}),r.map(R=>f.jsxs("div",{className:"bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center group",children:[f.jsxs("div",{children:[f.jsx("p",{className:"font-bold text-gray-800",children:R.title}),f.jsx("p",{className:"text-xs text-gray-400",children:R.question}),R.allowMultiple&&f.jsx("span",{className:"text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold",children:"Multipla"})]}),f.jsx("button",{onClick:()=>b(R.id),className:"text-red-300 hover:text-red-500 p-2",children:f.jsx(Sl,{size:18})})]},R.id))]})]})]})},zb=({sets:t,onUpdate:e,onClose:n})=>{const[r,s]=H.useState(t||[]),[i,o]=H.useState(null),[l,u]=H.useState(""),[h,p]=H.useState(""),[m,g]=H.useState(""),A=()=>{if(!l.trim())return;const _={id:Date.now().toString(),title:l,questions:[]},k=[...r,_];s(k),e(k),u(""),o(_.id)},b=_=>{if(!window.confirm("Eliminare questo set e tutte le sue domande?"))return;const k=r.filter(D=>D.id!==_);s(k),e(k),i===_&&o(null)},R=()=>{if(!h.trim())return;const _=r.map(k=>k.id===i?{...k,questions:[...k.questions,{id:Date.now(),text:h,imgUrl:m}]}:k);s(_),e(_),p(""),g("")},V=(_,k)=>{const D=r.map(j=>j.id===_?{...j,questions:j.questions.filter(U=>U.id!==k)}:j);s(D),e(D)},I=r.find(_=>_.id===i);return f.jsxs("div",{className:"fixed inset-0 bg-white z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300",children:[f.jsxs("div",{className:"p-6 border-b-4 border-black flex justify-between items-center bg-yellow-50",children:[f.jsxs("div",{children:[f.jsx("h2",{className:"text-3xl font-black uppercase",children:"Gestione Set Domande"}),f.jsx("p",{className:"uppercase text-sm font-bold text-gray-500",children:"Crea pacchetti per le tue lezioni"})]}),f.jsx("button",{onClick:n,className:"p-3 bg-black text-white rounded-full",children:f.jsx(ti,{size:24})})]}),f.jsxs("div",{className:"flex-1 overflow-hidden flex flex-col md:flex-row max-w-7xl mx-auto w-full",children:[f.jsxs("div",{className:"w-full md:w-1/3 p-6 border-r-4 border-gray-100 bg-white flex flex-col overflow-y-auto",children:[f.jsxs("div",{className:"mb-6",children:[f.jsx("h4",{className:"font-bold text-gray-400 uppercase tracking-widest text-xs mb-2",children:"Nuovo Set"}),f.jsxs("div",{className:"flex gap-2",children:[f.jsx("input",{value:l,onChange:_=>u(_.target.value),placeholder:"Es. Cyberbullismo...",className:"flex-1 p-3 rounded-xl border-2 border-gray-200 outline-none"}),f.jsx("button",{onClick:A,className:"bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600",children:f.jsx(IT,{})})]})]}),f.jsx("div",{className:"space-y-3 mb-6",children:r.map(_=>f.jsxs("div",{onClick:()=>o(_.id),className:`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${i===_.id?"border-blue-500 bg-blue-50":"border-gray-200 hover:border-blue-300"}`,children:[f.jsx("span",{className:"font-bold text-gray-700",children:_.title}),f.jsx("button",{onClick:k=>{k.stopPropagation(),b(_.id)},className:"text-red-300 hover:text-red-500",children:f.jsx(Sl,{size:18})})]},_.id))})]}),f.jsx("div",{className:"flex-1 p-6 bg-gray-50 flex flex-col overflow-y-auto",children:I?f.jsxs(f.Fragment,{children:[f.jsxs("div",{className:"bg-white p-6 rounded-3xl border-4 border-blue-100 mb-6 relative",children:[f.jsx("div",{className:"flex justify-between items-start mb-4",children:f.jsxs("h3",{className:"text-xl font-black text-blue-900 flex items-center gap-2",children:[f.jsx(TT,{size:20})," Modifica: ",I.title]})}),f.jsxs("div",{className:"space-y-3",children:[f.jsx("input",{value:h,onChange:_=>p(_.target.value),placeholder:"Scrivi la domanda...",className:"w-full p-3 rounded-xl border-2 border-gray-200 outline-none"}),f.jsxs("div",{className:"flex gap-2",children:[f.jsx("input",{value:m,onChange:_=>g(_.target.value),placeholder:"URL Immagine (Opzionale)...",className:"flex-1 p-3 rounded-xl border-2 border-gray-200 outline-none text-sm font-mono"}),f.jsx("button",{onClick:R,disabled:!h.trim(),className:"bg-green-500 text-white px-6 rounded-xl font-bold uppercase disabled:opacity-50",children:"Aggiungi"})]}),m&&f.jsx("img",{src:m,alt:"Preview",className:"h-20 w-auto rounded-lg border-2 border-gray-200 object-cover",onError:_=>_.target.style.display="none"})]})]}),f.jsxs("div",{className:"space-y-3",children:[I.questions.length===0&&f.jsx("p",{className:"text-center text-gray-400 italic",children:"Nessuna domanda in questo set. Aggiungine una o importale."}),I.questions.map((_,k)=>f.jsxs("div",{className:"bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4 items-start",children:[f.jsxs("span",{className:"font-bold text-blue-200 text-xl",children:["#",k+1]}),_.imgUrl&&f.jsx("img",{src:_.imgUrl,alt:"Stimolo",className:"w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0"}),f.jsx("p",{className:"flex-1 font-medium text-gray-800",children:_.text}),f.jsx("button",{onClick:()=>V(I.id,_.id),className:"text-red-300 hover:text-red-500",children:f.jsx(Sl,{size:18})})]},_.id))]})]}):f.jsx("div",{className:"flex-1 flex items-center justify-center text-gray-400 font-medium",children:"Seleziona un set a sinistra per modificarlo."})})]})]})},Bb=({sessionCode:t,user:e})=>{const[n,r]=H.useState(null);H.useEffect(()=>{if(!De||!e)return;const i=wn(vn(De,"artifacts",xn,"public","data","feedback_sessions"),t),o=ku(i,l=>{l.exists()&&r(l.data())});return()=>o()},[t,e]);const s=async(i,o)=>{if(!n)return;const l=[...n.responses],u=o!==!1;l[i]={...l[i],visible:!u};const h=wn(vn(De,"artifacts",xn,"public","data","feedback_sessions"),t);await Vf(h,{responses:l})};return n?f.jsxs("div",{className:"min-h-screen bg-gray-900 text-white p-4",children:[f.jsxs("h2",{className:"text-xl font-bold mb-4 flex items-center gap-2",children:[f.jsx(z0,{})," Moderazione ",t]}),f.jsx("div",{className:"space-y-3",children:n.responses.slice().reverse().map((i,o)=>{const l=n.responses.length-1-o,u=i.visible!==!1,h=Array.isArray(i.text)?i.text.join(", "):i.text;return f.jsxs("div",{className:`p-4 rounded-xl border flex justify-between items-center ${u?"bg-gray-800 border-gray-700":"bg-red-900/30 border-red-500 opacity-70"}`,children:[f.jsxs("div",{children:[f.jsx("p",{className:"font-bold text-lg",children:h}),f.jsx("p",{className:"text-xs text-gray-400",children:new Date(i.timestamp).toLocaleTimeString()})]}),f.jsx("button",{onClick:()=>s(l,i.visible),className:`p-3 rounded-full ${u?"bg-red-600":"bg-green-600"}`,children:u?f.jsx(Jd,{size:20}):f.jsx(Zd,{size:20})})]},o)})})]}):f.jsx("div",{className:"p-8 text-center text-white",children:"Caricamento..."})},$b=({onClose:t,feedbackSets:e,pollSets:n,onUpdateSets:r,onUpdatePolls:s,user:i})=>{const[o,l]=H.useState(null),[u,h]=H.useState({active:!1,responses:[],type:"qa",pollOptions:[],allowMultiple:!1}),[p,m]=H.useState(!1),[g,A]=H.useState("config"),[b,R]=H.useState("qa"),[V,I]=H.useState(""),[_,k]=H.useState(""),[D,j]=H.useState(!1),[U,x]=H.useState(""),[v,E]=H.useState(""),[T,S]=H.useState(!1),[C,w]=H.useState(!1);H.useEffect(()=>{if(v&&n){const L=n.find(te=>te.id===v);L&&(k(L.question),I(L.options.join(", ")),j(L.allowMultiple))}},[v,n]);const re=async()=>{if(!De)return alert("Database non disponibile.");if(b==="poll"&&(!_||!V))return alert("Inserisci domanda e opzioni.");m(!0);let L=[];if(b==="qa"&&U){const Pe=e.find(hn=>hn.id===U);Pe&&(L=Pe.questions)}const te=Math.random().toString(36).substring(2,6).toUpperCase(),pe=wn(vn(De,"artifacts",xn,"public","data","feedback_sessions"),te),pt=b==="poll"?V.split(",").map(Pe=>Pe.trim()).filter(Pe=>Pe):[];await Jh(pe,{active:!0,createdAt:new Date().toISOString(),responses:[],type:b,question:_,options:pt,allowMultiple:D,questions:L}),l(te),A("qr"),m(!1)},X=async()=>{if(!De||!o)return;const L=wn(vn(De,"artifacts",xn,"public","data","feedback_sessions"),o);await Vf(L,{active:!u.active})};H.useEffect(()=>{if(!De||!o||!i)return;const L=wn(vn(De,"artifacts",xn,"public","data","feedback_sessions"),o),te=ku(L,pe=>{pe.exists()&&h(pe.data())});return()=>te()},[o,i]);const ee=()=>{const L=u.responses.map(pt=>`- ${Array.isArray(pt.text)?pt.text.join(", "):pt.text} (${new Date(pt.timestamp).toLocaleTimeString()})`).join(`
`),te=document.createElement("a"),pe=new Blob([L],{type:"text/plain"});te.href=URL.createObjectURL(pe),te.download=`feedback_${o}.txt`,document.body.appendChild(te),te.click()},de=()=>window.print();if(C==="questions")return f.jsx(zb,{sets:e,onUpdate:r,onClose:()=>w(null)});if(C==="polls")return f.jsx(Ub,{polls:n,onUpdate:s,onClose:()=>w(null)});if(!o)return f.jsxs("div",{className:"flex flex-col items-center justify-center h-full p-8 bg-yellow-50 rounded-3xl border-4 border-yellow-200",children:[f.jsx("div",{className:"bg-yellow-100 p-6 rounded-full mb-6 border-4 border-yellow-300",children:f.jsx(za,{size:64,className:"text-yellow-600"})}),f.jsx("h2",{className:"text-4xl font-black mb-2 text-yellow-900",children:"Feedback Anonimo"}),f.jsx("p",{className:"text-gray-600 mb-8 max-w-md",children:"Scegli un'attività e proietta il QR."}),f.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full max-w-4xl",children:[f.jsxs("button",{onClick:()=>R("qa"),className:`p-6 rounded-2xl border-4 flex flex-col items-center gap-3 transition-all ${b==="qa"?"bg-yellow-200 border-yellow-500 scale-105 shadow-xl":"bg-white border-gray-200 hover:border-yellow-300 text-gray-500"}`,children:[f.jsx(za,{size:40}),f.jsx("span",{className:"font-black text-lg",children:"Domande & Risposte"}),f.jsx("span",{className:"text-xs",children:"Post-it anonimi"})]}),f.jsxs("button",{onClick:()=>R("wordcloud"),className:`p-6 rounded-2xl border-4 flex flex-col items-center gap-3 transition-all ${b==="wordcloud"?"bg-blue-200 border-blue-500 scale-105 shadow-xl":"bg-white border-gray-200 hover:border-blue-300 text-gray-500"}`,children:[f.jsx(F0,{size:40}),f.jsx("span",{className:"font-black text-lg",children:"Brainstorming"}),f.jsx("span",{className:"text-xs",children:"Word Cloud"})]}),f.jsxs("button",{onClick:()=>R("poll"),className:`p-6 rounded-2xl border-4 flex flex-col items-center gap-3 transition-all ${b==="poll"?"bg-green-200 border-green-500 scale-105 shadow-xl":"bg-white border-gray-200 hover:border-green-300 text-gray-500"}`,children:[f.jsx(fT,{size:40}),f.jsx("span",{className:"font-black text-lg",children:"Sondaggio"}),f.jsx("span",{className:"text-xs",children:"Grafico a barre"})]})]}),b==="qa"&&f.jsxs("div",{className:"w-full max-w-md bg-white p-4 rounded-2xl shadow-sm border-2 border-yellow-100 mb-6 flex gap-2",children:[f.jsxs("div",{className:"flex-1 relative",children:[f.jsxs("select",{className:"w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 appearance-none font-bold text-gray-700 outline-none focus:border-yellow-400",value:U,onChange:L=>x(L.target.value),children:[f.jsx("option",{value:"",children:"-- Risposte Libere (Nessuna Domanda) --"}),e&&e.map(L=>f.jsx("option",{value:L.id,children:L.title},L.id))]}),f.jsx(j0,{className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none",size:16})]}),f.jsx("button",{onClick:()=>w("questions"),className:"p-3 bg-gray-100 rounded-xl border-2 border-gray-200 hover:bg-gray-200 text-gray-600",title:"Gestisci Set",children:f.jsx(bh,{size:20})})]}),b==="poll"&&f.jsxs("div",{className:"w-full max-w-lg bg-white p-6 rounded-2xl border-2 border-green-200 mb-8 animate-in slide-in-from-top-4 relative",children:[f.jsx("button",{onClick:()=>w("polls"),className:"absolute top-4 right-4 text-gray-400 hover:text-black",children:f.jsx(bh,{size:20})}),f.jsxs("div",{className:"mb-4",children:[f.jsx("label",{className:"block text-xs font-bold text-gray-400 uppercase mb-1",children:"Preset Salvati"}),f.jsxs("select",{className:"w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm",value:v,onChange:L=>E(L.target.value),children:[f.jsx("option",{value:"",children:"-- Nuovo Sondaggio --"}),n&&n.map(L=>f.jsx("option",{value:L.id,children:L.title},L.id))]})]}),f.jsx("input",{value:_,onChange:L=>k(L.target.value),placeholder:"Domanda del sondaggio...",className:"w-full p-3 mb-3 rounded-xl border-2 border-gray-200 font-bold outline-none focus:border-green-500"}),f.jsx("textarea",{value:V,onChange:L=>I(L.target.value),placeholder:"Opzioni (separate da virgola). Es: Sì, No, Forse",className:"w-full p-3 rounded-xl border-2 border-gray-200 outline-none focus:border-green-500 h-24 mb-3"}),f.jsxs("label",{className:"flex items-center gap-2 font-bold text-gray-700 cursor-pointer",children:[f.jsx("input",{type:"checkbox",checked:D,onChange:L=>j(L.target.checked),className:"w-5 h-5 accent-green-500"}),"Consenti risposta multipla"]})]}),f.jsxs("button",{onClick:re,disabled:p,className:"bg-black text-white px-12 py-5 rounded-2xl font-black text-2xl hover:scale-105 transition-transform flex items-center gap-3 shadow-xl",children:[p?f.jsx(Il,{className:"animate-spin"}):f.jsx(Lb,{})," AVVIA SESSIONE"]})]});const z=`${window.location.href.split("?")[0]}?session=${o}`,G=`${window.location.href.split("?")[0]}?mode=moderator&session=${o}`;return f.jsxs("div",{className:"flex flex-col h-full relative",children:[f.jsxs("div",{className:"bg-white p-3 rounded-2xl border-b-4 border-black mb-4 flex flex-col md:flex-row justify-between items-center shadow-md gap-4",children:[f.jsxs("div",{className:"flex items-center gap-3",children:[f.jsx("span",{className:"bg-black text-white px-3 py-1 rounded-lg font-mono font-bold text-xl",children:o}),f.jsx("button",{onClick:X,className:`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-2 border-2 ${u.active?"bg-green-100 text-green-700 border-green-300":"bg-red-100 text-red-700 border-red-300"}`,children:u.active?"APERTA":"CHIUSA"})]}),f.jsxs("div",{className:"flex-1 text-center font-bold text-gray-500 uppercase text-sm",children:[u.type==="qa"&&"Domande & Risposte",u.type==="wordcloud"&&"Brainstorming",u.type==="poll"&&"Sondaggio"]}),f.jsxs("div",{className:"flex gap-2",children:[f.jsxs("button",{onClick:()=>S(!T),className:"bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl font-bold flex items-center gap-2 border-2 border-gray-200",title:"Telecomando Moderatore",children:[f.jsx(z0,{size:18})," ",f.jsx("span",{className:"hidden lg:inline",children:"Moderazione"})]}),f.jsx("button",{onClick:()=>A(g==="qr"?"responses":"qr"),className:"bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border-2 border-blue-200 transition-all",children:g==="qr"?f.jsxs(f.Fragment,{children:[f.jsx(za,{size:18})," VEDI RISULTATI (",u.responses.length,")"]}):f.jsxs(f.Fragment,{children:[f.jsx(ST,{size:18})," MOSTRA QR"]})}),f.jsx("button",{onClick:de,className:"p-2 bg-gray-100 rounded-xl hover:bg-gray-200 border-2 border-gray-200 text-gray-600",title:"Stampa/PDF",children:f.jsx(Yd,{size:20})}),f.jsx("button",{onClick:ee,className:"p-2 bg-gray-100 rounded-xl hover:bg-gray-200 border-2 border-gray-200 text-gray-600",title:"Esporta TXT",children:f.jsx(yT,{size:20})}),f.jsx("button",{onClick:()=>l(null),className:"p-2 bg-red-100 rounded-xl hover:bg-red-200 border-2 border-red-200 text-red-600",children:f.jsx(ti,{size:20})})]})]}),T&&f.jsxs("div",{className:"absolute top-20 right-4 z-50 bg-white p-6 rounded-2xl shadow-2xl border-4 border-gray-800 animate-in zoom-in origin-top-right",children:[f.jsxs("h4",{className:"font-bold text-center mb-4",children:["Scansiona col tuo telefono",f.jsx("br",{}),"per moderare"]}),f.jsx("img",{src:`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(G)}`,alt:"Mod QR",className:"rounded-lg border-2 border-gray-100 mx-auto"}),f.jsx("button",{onClick:()=>S(!1),className:"mt-4 w-full bg-gray-100 py-2 rounded-lg font-bold text-sm",children:"Chiudi"})]}),g==="qr"&&f.jsxs("div",{className:"flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300",children:[f.jsx("div",{className:"bg-white p-6 rounded-3xl shadow-2xl border-4 border-black mb-8 transform hover:scale-105 transition-transform",children:f.jsx("img",{src:`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(z)}`,alt:"QR",className:"w-64 h-64 md:w-96 md:h-96 object-contain"})}),f.jsxs("div",{className:"text-center bg-white/80 backdrop-blur px-8 py-4 rounded-2xl shadow-sm border border-gray-200",children:[f.jsx("p",{className:"text-gray-500 font-bold text-sm uppercase tracking-widest mb-1",children:"Entra senza fotocamera"}),f.jsxs("p",{className:"text-2xl md:text-4xl font-black text-gray-800 break-all",children:[window.location.host,"/?session=",f.jsx("span",{className:"text-blue-600",children:o})]})]}),u.type==="poll"&&f.jsx("div",{className:"mt-8 text-2xl font-bold text-green-700",children:u.question}),u.questions&&u.questions.length>0&&f.jsx("div",{className:"w-full max-w-5xl px-4 text-center mt-8 grid grid-cols-1 md:grid-cols-2 gap-6",children:u.questions.map(L=>f.jsxs("div",{className:"bg-white/90 backdrop-blur-sm border-l-8 border-yellow-400 p-6 rounded-r-2xl shadow-lg text-left flex flex-col",children:[L.imgUrl&&f.jsx("div",{className:"mb-4 rounded-xl overflow-hidden border-2 border-gray-100 h-48 w-full",children:f.jsx("img",{src:L.imgUrl,alt:"Stimolo",className:"w-full h-full object-cover"})}),f.jsx("h2",{className:"text-2xl font-black text-gray-800",children:L.text})]},L.id))})]}),g==="responses"&&f.jsxs("div",{className:"flex-1 bg-yellow-50 rounded-3xl border-4 border-yellow-200 p-6 overflow-y-auto relative animate-in slide-in-from-right duration-300",children:[u.type==="qa"&&(u.responses.filter(L=>L.visible!==!1).length===0?f.jsx("div",{className:"absolute inset-0 flex items-center justify-center text-yellow-300 font-black text-4xl uppercase opacity-40",children:"In attesa..."}):f.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:u.responses.slice().reverse().map((L,te)=>L.visible!==!1&&f.jsx("div",{className:"bg-white p-6 rounded-xl shadow-md border-b-4 border-gray-200 hover:-translate-y-1 transition-transform",children:f.jsxs("p",{className:"font-bold text-gray-800 text-xl leading-relaxed",children:['"',L.text,'"']})},te))})),u.type==="wordcloud"&&f.jsx(Fb,{responses:u.responses}),u.type==="poll"&&f.jsx(jb,{responses:u.responses,options:u.options})]})]})},Hb=({sessionCode:t,onExit:e,user:n})=>{const[r,s]=H.useState(""),[i,o]=H.useState([]),[l,u]=H.useState("loading"),[h,p]=H.useState(null),[m,g]=H.useState(!1),[A,b]=H.useState(!1);H.useEffect(()=>{if(!De||!n)return;const I=wn(vn(De,"artifacts",xn,"public","data","feedback_sessions"),t),_=ku(I,k=>{if(!k.exists())u("not_found");else{const D=k.data();p(D),u(D.active?"active":"closed")}});return()=>_()},[t,n]);const R=I=>{h.allowMultiple?i.includes(I)?o(i.filter(_=>_!==I)):o([...i,I]):o([I])},V=async I=>{I.preventDefault();let _;if(h.type==="poll"?_=i:_=r,!(!_||typeof _=="string"&&!_.trim()||Array.isArray(_)&&_.length===0)){if(g(!0),l!=="active"){alert("Sessione chiusa."),g(!1);return}try{const k=wn(vn(De,"artifacts",xn,"public","data","feedback_sessions"),t);await Vf(k,{responses:DA({text:_,timestamp:new Date().toISOString(),visible:!0})}),b(!0),s(""),o([]),h.type!=="poll"&&setTimeout(()=>{b(!1)},3e3)}catch(k){console.error(k),alert("Errore.")}g(!1)}};return l==="loading"?f.jsx("div",{className:"p-8 text-center",children:f.jsx(Il,{className:"animate-spin mx-auto"})}):l==="not_found"?f.jsx("div",{className:"p-8 text-center text-red-500 font-bold",children:"Sessione non trovata."}):f.jsx("div",{className:"max-w-md mx-auto p-6 min-h-screen flex flex-col justify-center",children:f.jsxs("div",{className:"bg-white rounded-3xl shadow-xl border-4 border-black p-6",children:[f.jsxs("div",{className:"text-center mb-6",children:[f.jsxs("span",{className:"bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",children:["Sessione ",t]}),f.jsx("h1",{className:"text-2xl font-black mt-2",children:"Feedback Anonimo"}),l==="closed"?f.jsxs("div",{className:"mt-4 bg-red-50 text-red-500 p-3 rounded-xl font-bold flex items-center justify-center gap-2",children:[f.jsx(vT,{size:18})," Sessione Terminata"]}):f.jsx("p",{className:"text-gray-500 text-sm mt-2",children:"La tua risposta sarà visualizzata alla lavagna in forma anonima."})]}),A?f.jsxs("div",{className:"bg-green-50 text-green-600 p-8 rounded-2xl text-center animate-in zoom-in",children:[f.jsx(Xd,{size:48,className:"mx-auto mb-2"}),f.jsx("h3",{className:"font-bold text-xl",children:"Inviato!"}),h.type!=="poll"&&f.jsx("p",{className:"text-sm",children:"Puoi inviarne un altro."})]}):l==="active"&&f.jsxs("form",{onSubmit:V,children:[h.type==="poll"?f.jsxs("div",{className:"space-y-3 mb-6",children:[f.jsx("h3",{className:"font-bold text-lg text-center mb-4",children:h.question}),h.options.map(I=>{const _=i.includes(I);return f.jsxs("button",{type:"button",onClick:()=>R(I),className:`w-full p-4 rounded-xl border-2 font-bold transition-all flex items-center justify-between ${_?"bg-blue-500 text-white border-blue-600":"bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`,children:[I,h.allowMultiple&&_&&f.jsx(mT,{size:20})]},I)}),h.allowMultiple&&f.jsx("p",{className:"text-center text-xs text-gray-400",children:"Puoi selezionare più risposte"})]}):f.jsx("textarea",{value:r,onChange:I=>s(I.target.value),placeholder:h.type==="wordcloud"?"Scrivi una parola...":"Scrivi il tuo pensiero...",className:"w-full p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none min-h-[150px] text-lg mb-4"}),f.jsx("button",{type:"submit",disabled:m||(h.type==="poll"?i.length===0:!r.trim()),className:"w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",children:m?f.jsx(Il,{className:"animate-spin"}):"INVIA"})]}),f.jsx("button",{onClick:e,className:"w-full mt-4 text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-black",children:"Esci dalla sessione"})]})})},qb=({view:t,currentScenario:e,generateScenario:n,theme:r})=>f.jsxs("main",{className:"max-w-4xl mx-auto w-full flex-1 flex flex-col",children:[f.jsxs("h2",{className:`text-center text-3xl font-black uppercase tracking-tight mb-8 ${r.accent} drop-shadow-sm`,children:[t==="emotions"&&"Gestione Emozioni",t==="emotion_narratives"&&"Narrazione Emotiva",t==="affectivity_sexuality"&&"Affettività e Sessualità",t==="decisions_cold"&&"Decisioni a Freddo",t==="decisions_hot"&&"Decisioni a Caldo"]}),f.jsx("div",{className:"flex-1 flex flex-col relative",children:f.jsxs("div",{className:"bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,0.05)] border-8 border-white flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden transition-all",children:[e?f.jsxs("div",{className:"w-full flex flex-col h-full animate-fade-in z-10",children:[f.jsxs("div",{className:"flex justify-end items-start mb-6",children:[f.jsx("button",{onClick:n,className:`p-3 rounded-xl text-white shadow-lg hover:scale-110 active:scale-90 transition-all ${r.button}`,title:"Prossimo elemento",children:f.jsx(Ym,{size:20})}),f.jsx(Za,{className:"ml-2"})]}),f.jsx("div",{className:"flex-1 flex items-center justify-center py-4",children:f.jsx("h3",{className:`text-4xl md:text-6xl font-black text-gray-800 leading-tight text-center ${t==="emotion_narratives"?"uppercase tracking-tighter":""}`,children:e.text})}),t!=="affectivity_sexuality"&&f.jsxs("div",{className:`mt-8 p-6 rounded-2xl ${r.light} bg-opacity-60 border-2 border-white/50`,children:[f.jsxs("h4",{className:`text-xs font-black uppercase tracking-widest mb-3 ${r.accent} flex items-center gap-2 opacity-80`,children:[f.jsx(L0,{size:14})," ",t==="emotion_narratives"?"Spunti per il racconto":"Spunti per la discussione"]}),f.jsxs("ul",{className:"grid md:grid-cols-3 gap-4 text-gray-700 font-bold text-sm",children:[t==="emotions"&&f.jsxs(f.Fragment,{children:[f.jsx("li",{className:"bg-white/80 p-3 rounded-xl text-center",children:"Che emozione provi?"}),f.jsx("li",{className:"bg-white/80 p-3 rounded-xl text-center",children:"Dove la senti nel corpo?"}),f.jsx("li",{className:"bg-white/80 p-3 rounded-xl text-center",children:"Intensità (1-10)?"})]}),t==="emotion_narratives"&&f.jsxs(f.Fragment,{children:[f.jsx("li",{className:"bg-white/80 p-3 rounded-xl text-center",children:"Quando è successo?"}),f.jsx("li",{className:"bg-white/80 p-3 rounded-xl text-center",children:"Cosa l'ha innescata?"}),f.jsx("li",{className:"bg-white/80 p-3 rounded-xl text-center",children:"Come hai reagito?"})]}),(t==="decisions_cold"||t==="decisions_hot")&&f.jsxs(f.Fragment,{children:[f.jsx("li",{className:"bg-white/80 p-3 rounded-xl text-center",children:"Cosa fai subito?"}),f.jsx("li",{className:"bg-white/80 p-3 rounded-xl text-center",children:"Conseguenze?"}),f.jsx("li",{className:"bg-white/80 p-3 rounded-xl text-center",children:"Alternative?"})]})]})]})]}):f.jsxs("div",{className:"flex flex-col items-center z-10 animate-fade-in",children:[f.jsx("div",{className:`w-32 h-32 ${r.light} rounded-full flex items-center justify-center mb-6 animate-pulse`,children:f.jsx(Ym,{size:48,className:r.accent})}),f.jsx("h3",{className:"text-2xl font-black text-gray-400 uppercase mb-6",children:"Nessun elemento attivo"}),f.jsxs("button",{onClick:n,className:`px-10 py-5 rounded-2xl text-white font-black text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-b-8 active:border-b-0 active:translate-y-2 ${r.button}`,children:["ESTRAI ",t==="emotion_narratives"?"EMOZIONE":"SCENARIO"]})]}),f.jsx("div",{className:`absolute top-0 right-0 w-64 h-64 ${r.light} rounded-bl-[100%] opacity-30 pointer-events-none`}),f.jsx("div",{className:`absolute bottom-0 left-0 w-40 h-40 ${r.light} rounded-tr-[100%] opacity-30 pointer-events-none`})]})})]}),Wb=({isOpen:t,onClose:e,targetEmotion:n,targetCoordinates:r,isMappingMode:s,onMapCoordinate:i,onNextEmotion:o,allScenarios:l,onSelectEmotion:u})=>{const[h,p]=H.useState({show:!1,x:0,y:0,width:0,height:0}),[m,g]=H.useState("ruota_.png"),[A,b]=H.useState(1.5),[R,V]=H.useState(!1),[I,_]=H.useState(!1),k=H.useRef(null);H.useEffect(()=>{t||(p(w=>({...w,show:!1})),V(!1),_(!1))},[t]);const D=w=>{i(w),_(!0),setTimeout(()=>_(!1),1500)};if(!t)return null;const j=(w,re)=>{if(!k.current)return;const{left:X,top:ee,width:de,height:z}=k.current.getBoundingClientRect(),G=w-X,L=re-ee;if(G<-20||L<-20||G>de+20||L>z+20){p(te=>({...te,show:!1}));return}p({show:!0,x:G,y:L,width:de,height:z})},U=w=>!s&&j(w.clientX,w.clientY),x=w=>{if(s)return;const re=w.touches[0];j(re.clientX,re.clientY)},v=w=>{if(!s||!i)return;const re=k.current.getBoundingClientRect(),X=w.clientX-re.left,ee=w.clientY-re.top,de=X/re.width*100,z=ee/re.height*100;D({x:de,y:z})},E=w=>{w.stopPropagation(),b(re=>Math.min(re+.5,5))},T=w=>{w.stopPropagation(),b(re=>Math.max(re-.5,1.5))},S=w=>{if(!w)return 0;const re=w.x-50,X=w.y-50;return Math.atan2(X,re)*(180/Math.PI)},C=330;return f.jsx("div",{className:"fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200",onClick:e,children:f.jsxs("div",{className:`bg-white rounded-3xl p-4 max-w-3xl w-full max-h-[95vh] flex flex-col border-4 ${s?"border-blue-500":"border-black"} shadow-[12px_12px_0px_0px_rgba(0,0,0,0.5)]`,onClick:w=>w.stopPropagation(),children:[f.jsxs("div",{className:"flex justify-between items-center mb-4 px-2",children:[f.jsxs("div",{className:"flex flex-col items-start gap-1 w-full mr-4",children:[f.jsxs("h3",{className:"text-2xl font-black uppercase text-pink-500 flex items-center gap-2",children:[f.jsx(Ah,{className:"fill-pink-500"})," Ruota delle Emozioni"]}),n&&f.jsxs("div",{className:"flex flex-wrap items-center gap-2 mt-1 w-full",children:[f.jsx("span",{className:"text-sm font-bold text-gray-600",children:"Target:"}),s?f.jsxs("div",{className:"relative",children:[f.jsx("select",{className:"appearance-none bg-red-50 text-red-600 font-black border border-red-200 rounded-lg px-3 py-1 pr-8 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500",value:n,onChange:w=>u(w.target.value),children:l&&l.map(w=>f.jsx("option",{value:w.text,children:w.text},w.id))}),f.jsx(j0,{size:14,className:"absolute right-2 top-1/2 transform -translate-y-1/2 text-red-400 pointer-events-none"})]}):f.jsx("span",{className:"text-red-500 bg-red-50 px-3 py-1 rounded-lg border border-red-200 font-black shadow-sm text-sm",children:n}),f.jsxs("div",{className:"flex items-center gap-2 ml-auto",children:[s&&f.jsxs(f.Fragment,{children:[I&&f.jsxs("span",{className:"text-green-600 font-bold text-xs animate-pulse flex items-center gap-1",children:[f.jsx(Xd,{size:14})," Salvato!"]}),f.jsxs("button",{onClick:()=>V(!R),className:`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all border ${R?"bg-indigo-100 text-indigo-700 border-indigo-300":"bg-gray-100 text-gray-600 border-gray-200"}`,title:"Mostra/Nascondi tutti i mappati",children:[R?f.jsx(Zd,{size:14}):f.jsx(Jd,{size:14})," ",f.jsx("span",{className:"hidden sm:inline",children:"Mappati"})]})]}),o&&f.jsxs("button",{onClick:o,className:"flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200 border border-blue-300 transition-all shadow-sm",title:"Estrai prossima emozione",children:[f.jsx(kT,{size:14})," Prossima"]})]})]})]}),f.jsx("button",{onClick:e,className:"p-2 hover:bg-gray-100 rounded-full border-2 border-transparent hover:border-black transition-all self-start mt-1",children:f.jsx(ti,{size:24})})]}),f.jsxs("div",{className:"flex-1 bg-gray-50 rounded-xl p-4 flex items-center justify-center border-2 border-dashed border-gray-300 min-h-[300px] relative z-10",children:[f.jsxs("div",{className:`relative inline-block ${s?"cursor-crosshair":"cursor-zoom-in"}`,onMouseEnter:()=>!s&&p(w=>({...w,show:!0})),onMouseLeave:()=>p(w=>({...w,show:!1})),onMouseMove:U,onTouchStart:()=>!s&&p(w=>({...w,show:!0})),onTouchMove:x,onTouchEnd:()=>p(w=>({...w,show:!1})),onClick:v,children:[f.jsx("img",{ref:k,src:m,alt:"Ruota delle Emozioni",className:"max-w-full max-h-[60vh] object-contain shadow-lg rounded-full animate-in zoom-in duration-300 touch-none select-none",onError:()=>{g("https://placehold.co/600x600/FF69B4/FFFFFF?text=Inserisci+ruota_.png")}}),s&&R&&l&&l.map(w=>w.coordinates&&w.text!==n?f.jsx("div",{className:"absolute border-2 border-indigo-600 bg-indigo-500/20 pointer-events-none",style:{left:`${w.coordinates.x}%`,top:`${w.coordinates.y}%`,width:"18%",height:"6%",borderRadius:"50%",transform:`translate(-50%, -50%) rotate(${S(w.coordinates)}deg)`},title:w.text},w.id):null),r&&f.jsx("div",{className:"absolute border-4 border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.6)] pointer-events-none",style:{left:`${r.x}%`,top:`${r.y}%`,width:"18%",height:"6%",borderRadius:"50%",transform:`translate(-50%, -50%) rotate(${S(r)}deg)`}}),h.show&&!s&&f.jsxs("div",{style:{position:"absolute",left:h.x-C/2,top:h.y-C/2,width:C,height:C,borderRadius:"50%",border:"6px solid white",boxShadow:"0 10px 40px rgba(0,0,0,0.5)",backgroundImage:`url(${m})`,backgroundRepeat:"no-repeat",backgroundColor:"white",backgroundSize:`${h.width*A}px ${h.height*A}px`,backgroundPositionX:-(h.x*A-C/2),backgroundPositionY:-(h.y*A-C/2),pointerEvents:"none",zIndex:50,overflow:"hidden"},children:[r&&f.jsx("div",{style:{position:"absolute",left:`${r.x/100*h.width*A-h.x*A+C/2}px`,top:`${r.y/100*h.height*A-h.y*A+C/2}px`,width:`${18/100*h.width*A}px`,height:`${6/100*h.height*A}px`,borderRadius:"50%",border:"4px solid red",transform:`translate(-50%, -50%) rotate(${S(r)}deg)`}}),R&&l&&l.map(w=>w.coordinates&&w.text!==n?f.jsx("div",{style:{position:"absolute",left:`${w.coordinates.x/100*h.width*A-h.x*A+C/2}px`,top:`${w.coordinates.y/100*h.height*A-h.y*A+C/2}px`,width:`${18/100*h.width*A}px`,height:`${6/100*h.height*A}px`,borderRadius:"50%",border:"2px solid indigo",backgroundColor:"rgba(75, 0, 130, 0.2)",transform:`translate(-50%, -50%) rotate(${S(w.coordinates)}deg)`}},`lens-${w.id}`):null)]})]}),!s&&f.jsxs("div",{className:"absolute bottom-4 right-4 flex flex-col gap-2 z-[60] bg-white/90 p-2 rounded-2xl border-2 border-gray-200 shadow-xl backdrop-blur-sm",children:[f.jsx("button",{onClick:E,className:"p-2 rounded-xl hover:bg-pink-50 text-pink-600 transition-colors",title:"Zoom In",children:f.jsx(bT,{size:24})}),f.jsxs("div",{className:"text-xs font-black text-center text-gray-500 py-1 border-t border-b border-gray-100",children:[A,"x"]}),f.jsx("button",{onClick:T,className:"p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors",title:"Zoom Out",children:f.jsx(RT,{size:24})})]})]}),f.jsx("p",{className:"text-center mt-2 text-gray-400 font-medium text-xs",children:s?f.jsx("span",{className:"text-blue-600 font-bold",children:"🎯 Clicca sulla ruota per mappare. Salvataggio Cloud (se attivo)."}):f.jsx("span",{children:"🔍 Passa il cursore o tocca per ingrandire."})})]})})},Gb=({isOpen:t,onClose:e,history:n,theme:r})=>f.jsxs(f.Fragment,{children:[t&&f.jsx("div",{className:"fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity",onClick:e}),f.jsx("div",{className:`fixed top-0 right-0 h-full w-full md:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out border-l-4 border-black ${t?"translate-x-0":"translate-x-full"}`,children:f.jsxs("div",{className:"p-6 h-full flex flex-col",children:[f.jsxs("div",{className:"flex justify-between items-center mb-8",children:[f.jsxs("h3",{className:"text-2xl font-black uppercase flex items-center gap-2",children:[f.jsx(U0,{className:"text-gray-400"})," Cronologia"]}),f.jsx("button",{onClick:e,className:"p-2 hover:bg-gray-100 rounded-full",children:f.jsx(ti,{size:24})})]}),f.jsx("div",{className:"flex-1 overflow-y-auto custom-scrollbar pr-2",children:n.length===0?f.jsxs("div",{className:"text-center text-gray-400 mt-20",children:[f.jsx(gT,{size:48,className:"mx-auto mb-4 opacity-50"}),f.jsx("p",{children:"Nessuno scenario generato."})]}):f.jsx("div",{className:"space-y-4",children:n.map((s,i)=>{var o;return f.jsxs("div",{className:"p-4 bg-gray-50 rounded-xl border-2 border-transparent hover:border-gray-200 transition-colors",children:[f.jsxs("div",{className:"flex justify-between items-center mb-2",children:[f.jsxs("span",{className:`text-[10px] font-black uppercase px-2 rounded-full ${r.light} ${r.accent}`,children:["#",n.length-i]}),f.jsx("span",{className:"text-[10px] text-gray-400",children:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})]}),f.jsx("p",{className:"text-sm text-gray-700 font-medium",children:s.text}),f.jsxs("div",{className:"mt-2 flex gap-1 flex-wrap",children:[(o=s.tags)==null?void 0:o.map(l=>f.jsx("span",{className:"text-[10px] bg-white border border-gray-200 px-1 rounded text-gray-500 uppercase",children:l},l)),s.coordinates&&f.jsxs("span",{className:"text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold flex items-center gap-1",children:[f.jsx(Ch,{size:10})," Mappato"]})]})]},`${s.id}-${i}`)})})})]})})]}),Iy=({scenarios:t,onUpdate:e,onClose:n,type:r,fullData:s,onFullUpdate:i,mappingMode:o,setMappingMode:l})=>{const[u,h]=H.useState(t||[]),[p,m]=H.useState(""),[g,A]=H.useState(""),[b,R]=H.useState("create"),[V,I]=H.useState(null),_=H.useRef(null);H.useEffect(()=>{h(t||[])},[t]);const k=E=>{if(window.confirm("Eliminare elemento?")){const T=u.filter(C=>C.id!==E),S={...s,[r]:T};i(S)}},D=E=>{const T=u.map(C=>C.id===E?{...C,hidden:!C.hidden}:C);h(T);const S={...s,[r]:T};i(S)},j=()=>{if(!p.trim())return;const T=[{id:Date.now(),text:p,tags:["custom"]},...u],S={...s,[r]:T};i(S),m(""),I("Aggiunto!"),setTimeout(()=>I(null),2e3)},U=()=>{if(!g.trim())return;let E=[];try{const T=JSON.parse(g);Array.isArray(T)&&(E=T.map(S=>({id:Date.now()+Math.random(),text:S.text||S,tags:S.tags||["importato"]})))}catch{E=g.split(`
`).filter(S=>S.trim().length>0).map(S=>({id:Date.now()+Math.random(),text:S.trim(),tags:["importato"]}))}if(E.length>0){const T=[...E,...u],S={...s,[r]:T};i(S),A(""),I(`Importati ${E.length}!`)}setTimeout(()=>I(null),2e3)},x=()=>{const E="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(s,null,2)),T=document.createElement("a");T.setAttribute("href",E),T.setAttribute("download","life_skills_db.json"),document.body.appendChild(T),T.click(),T.remove()},v=E=>{const T=E.target.files[0];if(!T)return;const S=new FileReader;S.onload=C=>{try{const w=JSON.parse(C.target.result);w&&typeof w=="object"&&(i(w),alert("Database importato con successo! Salvato in memoria (e cloud se attivo)."),n())}catch{alert("Errore nel file JSON.")}},S.readAsText(T)};return f.jsxs("div",{className:"fixed inset-0 bg-white z-40 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300",children:[f.jsxs("div",{className:"p-6 border-b-4 border-black flex justify-between items-center bg-yellow-50",children:[f.jsxs("div",{children:[f.jsx("h2",{className:"text-3xl font-black uppercase",children:"Gestione Dati"}),f.jsx("p",{className:"uppercase text-sm font-bold text-gray-500",children:r.replace("_"," ")})]}),f.jsx("button",{onClick:n,className:"p-3 bg-black text-white rounded-full",children:f.jsx(ti,{size:24})})]}),f.jsxs("div",{className:"flex-1 overflow-hidden flex flex-col md:flex-row max-w-7xl mx-auto w-full",children:[f.jsxs("div",{className:"w-full md:w-1/3 p-6 border-b-4 md:border-r-4 border-gray-100 bg-white flex flex-col overflow-y-auto",children:[r==="emotion_narratives"&&f.jsxs("div",{className:"bg-blue-50 border-2 border-blue-200 p-4 rounded-2xl mb-6 flex items-center justify-between",children:[f.jsxs("div",{children:[f.jsxs("h4",{className:"font-bold text-blue-900 flex items-center gap-2",children:[f.jsx(Ch,{size:18})," Mappatura Ruota"]}),f.jsx("p",{className:"text-xs text-blue-600",children:"Salva posizione sulla ruota."})]}),f.jsx("button",{onClick:()=>l(!o),className:`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ml-4 ${o?"bg-blue-500":"bg-gray-300"}`,children:f.jsx("div",{className:`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${o?"left-7":"left-1"}`})})]}),f.jsxs("div",{className:"flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl",children:[f.jsx("button",{onClick:()=>R("create"),className:`flex-1 py-2 font-bold rounded-lg text-sm transition-all ${b==="create"?"bg-white shadow text-black":"text-gray-500"}`,children:"Nuovo"}),f.jsx("button",{onClick:()=>R("import"),className:`flex-1 py-2 font-bold rounded-lg text-sm transition-all ${b==="import"?"bg-white shadow text-black":"text-gray-500"}`,children:"Testo"})]}),f.jsxs("div",{className:`flex-1 flex flex-col p-6 rounded-3xl border-4 transition-colors mb-8 ${b==="create"?"bg-blue-50 border-blue-200":"bg-green-50 border-green-200"}`,children:[b==="create"?f.jsxs(f.Fragment,{children:[f.jsx("textarea",{value:p,onChange:E=>m(E.target.value),placeholder:"Aggiungi nuovo elemento...",className:"w-full flex-1 p-4 rounded-xl border-2 border-blue-200 outline-none resize-none mb-4 bg-white"}),f.jsx("button",{onClick:j,disabled:!p.trim(),className:"w-full bg-blue-500 text-white py-3 rounded-xl font-black uppercase border-b-4 border-blue-700 active:border-b-0 active:translate-y-1",children:"Aggiungi"})]}):f.jsxs(f.Fragment,{children:[f.jsx("textarea",{value:g,onChange:E=>A(E.target.value),placeholder:"Incolla elenco...",className:"w-full flex-1 p-4 rounded-xl border-2 border-green-200 outline-none resize-none mb-4 bg-white font-mono text-xs"}),f.jsx("button",{onClick:U,disabled:!g.trim(),className:"w-full bg-green-500 text-white py-3 rounded-xl font-black uppercase border-b-4 border-green-700 active:border-b-0 active:translate-y-1",children:"Importa"})]}),V&&f.jsxs("div",{className:"mt-4 p-3 bg-white rounded-xl shadow-sm border border-green-200 text-green-700 font-bold flex items-center gap-2",children:[f.jsx(Xd,{size:16})," ",V]})]}),f.jsxs("div",{className:"mt-auto border-t-2 border-gray-100 pt-6",children:[f.jsx("h4",{className:"font-black text-gray-400 uppercase tracking-widest text-xs mb-3",children:"Area Docente / Backup"}),f.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[f.jsxs("button",{onClick:x,className:"flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-400 transition-all text-xs font-bold text-gray-600",children:[f.jsx(Yd,{size:20,className:"mb-1 text-gray-400"})," Esporta JSON"]}),f.jsxs("label",{className:"flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-400 transition-all text-xs font-bold text-gray-600 cursor-pointer",children:[f.jsx(B0,{size:20,className:"mb-1 text-gray-400"})," Importa JSON ",f.jsx("input",{type:"file",accept:".json",onChange:v,className:"hidden",ref:_})]})]})]})]}),f.jsx("div",{className:"flex-1 p-6 overflow-y-auto bg-gray-50",children:f.jsx("div",{className:"space-y-4",children:u.map((E,T)=>{var S;return f.jsxs("div",{className:`group flex gap-4 p-5 bg-white border-2 ${E.hidden?"border-gray-100 bg-gray-50 opacity-60":"border-gray-200 hover:border-black"} rounded-2xl shadow-sm items-center transition-all`,children:[f.jsxs("span",{className:"font-black text-gray-300",children:["#",T+1]}),f.jsxs("div",{className:"flex-1",children:[f.jsx("p",{className:`font-medium text-lg ${E.hidden?"line-through text-gray-400":""}`,children:E.text}),f.jsxs("div",{className:"flex gap-2 mt-2 flex-wrap",children:[(S=E.tags)==null?void 0:S.map(C=>f.jsx("span",{className:"text-[10px] bg-gray-100 px-2 py-1 rounded uppercase font-bold text-gray-400",children:C},C)),E.coordinates&&f.jsxs("span",{className:"text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold flex items-center gap-1",children:[f.jsx(Ch,{size:10})," Mappato"]})]})]}),f.jsx("button",{onClick:()=>D(E.id),className:`p-2 rounded-lg transition-colors ${E.hidden?"text-gray-400 hover:text-gray-600":"text-blue-300 hover:text-blue-500"}`,title:E.hidden?"Riattiva":"Nascondi",children:E.hidden?f.jsx(Jd,{size:20}):f.jsx(Zd,{size:20})}),f.jsx("button",{onClick:()=>k(E.id),className:"text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity",children:f.jsx(Sl,{})})]},E.id)})})})]})]})};function Kb(){const[t,e]=H.useState("dashboard"),[n,r]=H.useState(null),[s,i]=H.useState(null),[o,l]=H.useState(null),[u,h]=H.useState([]),[p,m]=H.useState(!1),[g,A]=H.useState(!1),[b,R]=H.useState(!1),[V,I]=H.useState(!1),[_,k]=H.useState(null),[D,j]=H.useState(null);if(H.useEffect(()=>{const X=new URLSearchParams(window.location.search),ee=X.get("session"),de=X.get("mode");ee&&(de==="moderator"?j(ee):k(ee)),(async()=>{if(De){try{if(typeof __initial_auth_token<"u"&&__initial_auth_token)await wC(Ja,__initial_auth_token);else throw new Error("No token")}catch{await mC(Ja)}TC(Ja,i)}else r(Ca)})()},[]),H.useEffect(()=>{if(!De||!s||_||D)return;const X=wn(vn(De,"artifacts",xn,"public","data","lifeskills"),"main_db"),ee=ku(X,de=>{de.exists()?r(de.data()):(Jh(X,Ca),r(Ca))},de=>r(Ca));return()=>ee()},[s,_,D]),_)return f.jsx(Hb,{sessionCode:_,onExit:()=>{window.history.pushState({},document.title,window.location.pathname),k(null),window.location.reload()},user:s});if(D)return f.jsx(Bb,{sessionCode:D,user:s});const U=async X=>{if(r(X),De&&s){const ee=wn(vn(De,"artifacts",xn,"public","data","lifeskills"),"main_db");await Jh(ee,X)}},x=X=>U(X),v=X=>{e(X),l(null),h([]),R(!1)},E=()=>{switch(t){case"emotions":return{bg:"bg-[#FFF0F5]",accent:"text-pink-500",border:"border-pink-500",button:"bg-pink-500 hover:bg-pink-400 border-pink-700",light:"bg-pink-100",cardBorder:"border-pink-200"};case"decisions_cold":return{bg:"bg-[#F0F8FF]",accent:"text-blue-600",border:"border-blue-500",button:"bg-blue-500 hover:bg-blue-400 border-blue-700",light:"bg-blue-100",cardBorder:"border-blue-200"};case"decisions_hot":return{bg:"bg-[#FFF5EE]",accent:"text-orange-600",border:"border-orange-500",button:"bg-orange-500 hover:bg-orange-400 border-orange-700",light:"bg-orange-100",cardBorder:"border-orange-200"};case"emotion_narratives":return{bg:"bg-[#F3E8FF]",accent:"text-purple-600",border:"border-purple-500",button:"bg-purple-500 hover:bg-purple-400 border-purple-700",light:"bg-purple-100",cardBorder:"border-purple-200"};case"affectivity_sexuality":return{bg:"bg-[#FFE4E6]",accent:"text-rose-600",border:"border-rose-500",button:"bg-rose-500 hover:bg-rose-400 border-rose-700",light:"bg-rose-100",cardBorder:"border-rose-200"};default:return{bg:"bg-gray-50"}}},T=X=>{U({...n,poll_sets:X})},S=X=>{U({...n,feedback_sets:X})},C=()=>{const X=n[t];if(!X)return;const ee=X.filter(L=>!L.hidden);if(ee.length===0)return alert("Tutti gli scenari nascosti.");const de=new Set(u.map(L=>L.id)),z=ee.filter(L=>!de.has(L.id));let G=z.length>0?z[Math.floor(Math.random()*z.length)]:ee[Math.floor(Math.random()*ee.length)];l(G),h(L=>[G,...L])},w=X=>{const ee=n[t].find(de=>de.text===X);ee&&(l(ee),h(de=>[ee,...de]))},re=X=>{if(!o)return;const ee={...o,coordinates:X};l(ee);const de=n[t].map(z=>z.id===o.id?ee:z);U({...n,[t]:de})};return!n&&!_?f.jsx("div",{className:"min-h-screen flex items-center justify-center bg-yellow-50",children:f.jsx(Il,{className:"animate-spin text-orange-500"})}):t==="dashboard"?f.jsxs("div",{className:"min-h-screen bg-yellow-50 p-6 font-sans selection:bg-yellow-200",children:[f.jsxs("header",{className:"max-w-6xl mx-auto mb-16 text-center pt-10",children:[f.jsxs("div",{className:"inline-block relative",children:[f.jsx("div",{className:"absolute -inset-1 bg-black rounded-full blur-sm opacity-20 transform rotate-2"}),f.jsx("div",{className:"relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 px-12 rounded-full mb-8 transform -rotate-1",children:f.jsxs("h1",{className:"text-4xl md:text-6xl font-black tracking-tighter text-gray-900",children:["LIFE SKILLS ",f.jsx("span",{className:"text-yellow-500 relative inline-block",children:"SUITE"})]})})]}),f.jsxs("div",{className:"flex justify-center gap-4 mt-4",children:[f.jsxs("div",{className:"flex items-center gap-1 text-xs font-bold text-gray-400",children:[De?f.jsx(F0,{size:14,className:"text-green-500"}):f.jsx(AT,{size:14}),De?"Cloud Attivo":"Locale"]}),f.jsxs("button",{onClick:()=>{const X=prompt("Inserisci codice sessione:");X&&k(X.toUpperCase())},className:"flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100",children:[f.jsx(wT,{size:14})," Studente: Partecipa"]}),f.jsxs("div",{className:"absolute top-4 right-4 flex gap-2",children:[f.jsx(Za,{className:""}),f.jsx("button",{onClick:()=>{const X="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(n,null,2)),ee=document.createElement("a");ee.setAttribute("href",X),ee.setAttribute("download","lifeskills_FULL_BACKUP.json"),document.body.appendChild(ee),ee.click(),ee.remove()},className:"p-2 bg-gray-200 rounded-full hover:bg-gray-300 opacity-50 hover:opacity-100 transition-opacity",title:"Backup Completo",children:f.jsx(Yd,{size:16})}),f.jsxs("label",{className:"p-2 bg-gray-200 rounded-full hover:bg-gray-300 opacity-50 hover:opacity-100 transition-opacity cursor-pointer",title:"Ripristina Backup",children:[f.jsx(B0,{size:16}),f.jsx("input",{type:"file",accept:".json",className:"hidden",onChange:X=>{const ee=X.target.files[0];if(!ee)return;const de=new FileReader;de.onload=z=>{try{x(JSON.parse(z.target.result)),alert("Ripristinato!")}catch{alert("File non valido")}},de.readAsText(ee)}})]})]})]})]}),f.jsxs("main",{className:"max-w-6xl mx-auto flex flex-wrap justify-center gap-8 pb-10",children:[f.jsx(ls,{title:"Gestione Emozioni",subtitle:"Identificazione",icon:Ah,color:"bg-pink-200",description:"Scenari per identificare e verbalizzare il vissuto emotivo.",onClick:()=>v("emotions")}),f.jsx(ls,{title:"Narrazione Emotiva",subtitle:"Storytelling",icon:pT,color:"bg-purple-200",description:"Estrai un'emozione e racconta un episodio personale.",onClick:()=>v("emotion_narratives")}),f.jsx(ls,{title:"Affettività e Sessualità",subtitle:"Relazioni",icon:_T,color:"bg-rose-200",description:"Dinamiche di coppia, consenso, confini e identità.",onClick:()=>v("affectivity_sexuality")}),f.jsx(ls,{title:"Decisioni a Freddo",subtitle:"Razionalità",icon:L0,color:"bg-blue-200",description:"Scelte complesse e pianificazione.",onClick:()=>v("decisions_cold")}),f.jsx(ls,{title:"Decisioni a Caldo",subtitle:"Impulsività",icon:CT,color:"bg-orange-200",description:"Gestione del rischio e reazioni immediate.",onClick:()=>v("decisions_hot")}),f.jsx(ls,{title:"Feedback & Sondaggi",subtitle:"Interattivo",icon:za,color:"bg-yellow-200",description:"Q&A, Brainstorming e Sondaggi anonimi in tempo reale.",onClick:()=>v("feedback_session")})]})]}):t==="feedback_session"?f.jsxs("div",{className:"min-h-screen bg-yellow-50 p-4 md:p-8 font-sans flex flex-col",children:[f.jsxs("div",{className:"max-w-6xl mx-auto w-full mb-6 flex justify-between items-center",children:[f.jsxs("button",{onClick:()=>e("dashboard"),className:"flex items-center gap-2 font-bold text-gray-700 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md border border-transparent hover:border-black",children:[f.jsx(Xm,{size:18})," Dashboard"]}),f.jsx(Za,{className:""})]}),f.jsx("div",{className:"flex-1 max-w-6xl mx-auto w-full",children:f.jsx($b,{onClose:()=>e("dashboard"),feedbackSets:n.feedback_sets||[],pollSets:n.poll_sets||[],onUpdateSets:S,onUpdatePolls:T,user:s})}),g&&f.jsx(Iy,{scenarios:n[t],type:t,fullData:n,onFullUpdate:x,mappingMode:V,setMappingMode:I,onClose:()=>A(!1)})]}):f.jsxs("div",{className:`min-h-screen ${E().bg} p-4 md:p-8 font-sans transition-colors duration-500 flex flex-col`,children:[f.jsxs("div",{className:"max-w-4xl mx-auto w-full flex items-center justify-between mb-6",children:[f.jsxs("button",{onClick:()=>e("dashboard"),className:"flex items-center gap-2 font-bold text-gray-700 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-black",children:[f.jsx(Xm,{size:18})," Dashboard"]}),f.jsxs("div",{className:"flex gap-2",children:[["emotions","emotion_narratives"].includes(t)&&f.jsxs("button",{onClick:()=>m(!0),className:"flex items-center gap-2 px-4 py-2 bg-white text-pink-500 rounded-xl shadow-sm border border-pink-100 hover:border-pink-500 font-bold text-sm transition-all",children:[f.jsx(Ah,{size:18,className:"fill-pink-500"})," Ruota Emozioni"]}),f.jsxs("button",{onClick:()=>A(!0),className:"p-2 bg-white text-gray-700 rounded-xl shadow-sm hover:bg-gray-100 border border-transparent hover:border-gray-300 relative",children:[f.jsx(bh,{size:20}),V&&f.jsx("span",{className:"absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white"})]}),f.jsxs("button",{onClick:()=>R(!0),className:"p-2 bg-white text-gray-700 rounded-xl shadow-sm hover:bg-gray-100 border border-transparent hover:border-gray-300 relative",children:[f.jsx(U0,{size:20}),u.length>0&&f.jsx("span",{className:"absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"})]}),f.jsx(Za,{className:""})]})]}),f.jsx(qb,{view:t,currentScenario:o,generateScenario:C,theme:E()}),f.jsx(Gb,{isOpen:b,onClose:()=>R(!1),history:u,theme:E()}),f.jsx(Wb,{isOpen:p,onClose:()=>m(!1),targetEmotion:o?o.text:null,targetCoordinates:o==null?void 0:o.coordinates,isMappingMode:V,onMapCoordinate:re,onNextEmotion:C,allScenarios:n[t],onSelectEmotion:w}),g&&f.jsx(Iy,{scenarios:n[t],type:t,fullData:n,onFullUpdate:x,mappingMode:V,setMappingMode:I,onClose:()=>A(!1)}),f.jsx("style",{children:"@keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } } @keyframes ping-slow { 0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; } 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; } } .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; } .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; } .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 20px; }"})]})}Vc.createRoot(document.getElementById("root")).render(f.jsx(Z1.StrictMode,{children:f.jsx(Kb,{})}));
