"use strict";(self.__LOADABLE_LOADED_CHUNKS__=self.__LOADABLE_LOADED_CHUNKS__||[]).push([[6575],{3808:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(667294),i=n(616550),r=n(741983),o=n(340523),s=n(5859),l=n(149722),m=n(961550),u=n(408998),p=n(995026);function c(){let e=(0,l.Z)(),t=(0,o.F)(),{isRTL:n}=(0,s.B)(),c=(0,i.TH)(),d=(0,i.k6)(),_=c.search,h=(0,p.Z)(c)&&!n&&e.isAuth&&!e.isPartner&&!(0,r.OK)(c);return(0,a.useEffect)(()=>{_.includes("enable_vertical_nav")&&((0,u.M)(),d.push("/"),window.location.reload())},[_,d]),{enabled:h&&t.checkExperiment("web_vertical_nav").anyEnabled,group:h?t.checkExperiment("web_vertical_nav").group:m.lR.NONE}}},922719:(e,t,n)=>{n.d(t,{CC:()=>i,Ll:()=>o,XF:()=>r});let a=(e,t,n)=>({x:Math.floor(e*Math.cos(n)),y:Math.floor(t*Math.sin(n))}),i=(e,t)=>a(t/2,e/2,2*Math.random()*Math.PI),r=(e,t)=>Math.floor(Math.random()*(t-e+1))+e,o=e=>["@-webkit-keyframes","@keyframes"].map(t=>e.map(e=>t+" "+e).join("\n")).join("\n")},775089:(e,t,n)=>{n.r(t),n.d(t,{default:()=>M});var a=n(667294),i=n(883119),r=n(214877),o=n(103322);function s(e,t,n){var a;return(t="symbol"==typeof(a=function(e,t){if("object"!=typeof e||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=typeof a)return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"))?a:String(a))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}let l={},m=e=>{let t=e.__id||e.id;return"string"==typeof t&&t||null};class u{constructor(){s(this,"idMap",new Map),s(this,"objMap",new WeakMap)}get(e){let t=m(e);return this.objMap.get(e)??(t?this.idMap.get(t):void 0)}has(e){let t=m(e);return this.objMap.has(e)??(!!t&&this.idMap.has(t))}set(e,t){let n=m(e);n&&this.idMap.set(n,t),this.objMap.set(e,t)}reset(){this.idMap=new Map,this.objMap=new WeakMap}}var p=n(401111),c=n(547643),d=n(667677),_=n(213377),h=n(406893),b=n(340523),f=n(5859),w=n(554786),y=n(953565),v=n(84768),g=n(785893);function x({analyticsData:e,children:t,idx:n,isMeasuring:i,masonryV2ExpName:r,masonryV2ExpGroup:s}){let l=(0,w.ZP)(),{isAuthenticated:m}=(0,f.B)(),u=(0,v.MM)();return(0,a.useEffect)(()=>{if(e.current[n]){let{fetchTimestamp:t,measureTimestamp:a,hasRendered:o,pageCount:p}=e.current[n]??{},c={deviceType:l,experimentName:r,experimentGroup:s,handlerId:u,isAuthenticated:m,pageCount:p};i&&!a&&(e.current[n].measureTimestamp=Date.now(),(0,y.LY)("webapp.masonry.itemMeasureStart",Date.now()-t,{tags:c})),i||o||((0,y.LY)("webapp.masonry.itemRenderStart",Date.now()-a,{tags:c}),e.current[n].hasRendered=!0)}},[i]),(0,g.jsx)(o.Z,{name:"MasonryItem",children:t})}function M(e){let{align:t,cacheKey:n,id:s,isGridCentered:m=!0,items:M,layout:E,loadItems:C,masonryRef:S,optOutFluidGridExperiment:$=!1,renderItem:k,scrollContainerRef:O,virtualize:N=!0,_getColumnSpanConfig:R,_dynamicHeights:j,useLoadingState:I}=e,T=(0,w.ZP)(),{isAuthenticated:A,isRTL:L}=(0,f.B)(),{logContextEvent:W}=(0,r.v)(),D=(0,b.F)(),Z="desktop"===T,P=(0,v.MM)(),B=(0,a.useRef)(M.map(()=>({fetchTimestamp:Date.now(),measureTimestamp:Date.now(),hasRendered:!1,pageCount:0}))),{_loadingStateItems:F,_renderLoadingStateItems:V}=(0,d.Z)({useLoadingState:I}),{experimentalColumnWidth:G,experimentalGutter:H,anyEnabled:z}=(0,p.Z)("flexible"!==E&&!$),Y=e.serverRender??!!Z,U="flexible"===E||"desktop"!==T||z,X=Y?"serverRenderedFlexible":"flexible",J=e.columnWidth??G??_.yF;U&&(J=Math.floor(J));let K=e.gutterWidth??H??(Z?_.oX:1),Q=e.minCols??_.yc,q=(0,a.useRef)(0),ee=J+K,et=function(e){if(null==e)return;let t=function(e){let t=l[e];return t&&t.screenWidth===window.innerWidth||(l[e]={screenWidth:window.innerWidth}),l[e]}(e);return t.measurementCache||(t.measurementCache=new u),t.measurementCache}(n),en=(0,a.useCallback)(()=>O?.current||window,[O]),ea=(0,a.useRef)(!0),{anyEnabled:ei}=D.checkExperiment("web_masonry_ssr_container_query"),{group:er}=R?D.checkExperiment("web_masonry_early_bailout"):{group:""},eo=er.match(/enabled_([\d]+)_gutter/),es=eo?parseInt(eo[1],10):void 0,el=es?K*es:void 0,em=m&&ea.current?"centered":"",{className:eu,styles:ep}=function(e){let t=`m_${Object.keys(e).reduce((t,n)=>{let a=e[n];return null==a||"object"==typeof a||"function"==typeof a?t:"boolean"==typeof a?t+(a?"t":"f"):t+a},"").replace(/\:/g,"\\:")}`,{flexible:n,gutterWidth:a,isRTL:i,itemWidth:r,maxColumns:o,minColumns:s,items:l,_getColumnSpanConfig:m}=e,u=m?l.map((e,t)=>({index:t,columnSpanConfig:m(e)??1})).filter(e=>1!==e.columnSpanConfig):[],p=r+a,c=Array.from({length:o+1-s},(e,t)=>t+s).map(e=>{let l=e===s?0:e*p,m=e===o?null:(e+1)*p-.01,{styles:c,numberOfVisibleItems:d}=u.reduce((i,o)=>{let{columnSpanConfig:s}=o,l=Math.min(function({columnCount:e,columnSpanConfig:t}){return"number"==typeof t?t:t[e<=2?"sm":e<=4?"md":e<=8?"lg":"xl"]??1}({columnCount:e,columnSpanConfig:s}),e),m=null!=o.index&&i.numberOfVisibleItems>=l+o.index,u=n?100/e*l:r*l+a*(l-1),{numberOfVisibleItems:p}=i;return m?p-=l-1:o.index<p&&(p+=1),{styles:i.styles.concat(function({className:e,index:t,columnSpanConfig:n,visible:a,width:i,flexible:r}){let o="number"==typeof n?n:btoa(JSON.stringify(n));return r?`
      .${e} .static[data-column-span="${o}"]:nth-child(${t+1}) {
        visibility: ${a?"visible":"hidden"} !important;
        position: ${a?"inherit":"absolute"} !important;
        width: ${i}% !important;
      }`:`
      .${e} .static[data-column-span="${o}"]:nth-child(${t+1}) {
        visibility: ${a?"visible":"hidden"} !important;
        position: ${a?"inherit":"absolute"} !important;
        width: ${i}px !important;
      }`}({className:t,index:o.index,columnSpanConfig:s,visible:m,width:u,flexible:n})),numberOfVisibleItems:p}},{styles:"",numberOfVisibleItems:e}),_=n?`
      .${t} .static {
        box-sizing: border-box;
        width: calc(100% / ${e}) !important;
      }
    `:`
      .${t} {
        max-width: ${e*p}px;
      }

      .${t} .static {
        width: ${r}px !important;
      }
    `;return{minWidth:l,maxWidth:m,styles:`
      .${t} .static:nth-child(-n+${d}) {
        position: static !important;
        visibility: visible !important;
        float: ${i?"right":"left"};
        display: block;
      }

      .${t} .static {
        padding: 0 ${a/2}px;
      }

      ${_}

      ${c}
    `}}),d=c.map(({minWidth:e,maxWidth:t,styles:n})=>`
    @container (min-width: ${e}px) ${t?`and (max-width: ${t}px)`:""} {
      ${n}
    }
  `),_=c.map(({minWidth:e,maxWidth:t,styles:n})=>`
    @media (min-width: ${e}px) ${t?`and (max-width: ${t}px)`:""} {
      ${n}
    }
  `),h=e.enableContainerQuery?`
    ${d.join("")}
    @supports not (container-type: inline-size) {
      ${_.join("")}
    }
  `:_.join("");return{className:t,styles:`
    .masonryContainer {
      container-type: inline-size;
    }

    .masonryContainer > .centered {
      margin-left: auto;
      margin-right: auto;
    }

    .${t} .static {
      position: absolute !important;
      visibility: hidden !important;
    }

    ${h}
  `}}({gutterWidth:K,flexible:U,items:M,isRTL:L,itemWidth:J,maxColumns:e.maxColumns??Math.max(M.length,_.g5),minColumns:Q,enableContainerQuery:ei||z,_getColumnSpanConfig:R}),ec=`${em} ${eu}`.trim(),{anyEnabled:ed,expName:e_,group:eh,isMeasureAllEnabled:eb}=(0,c.Z)(),ef=(0,a.useMemo)(()=>!et||M.every(e=>!et.has(e)),[]),ew=eh&&ef,ey=(0,a.useRef)(),ev=(0,a.useRef)(M.length),eg=(0,a.useRef)(0);(0,a.useEffect)(()=>{ew&&M.forEach((e,t)=>{B.current[t]||(B.current[t]={fetchTimestamp:Date.now(),measureTimestamp:0,hasRendered:!1,pageCount:eg.current})}),ev.current=M.length,eg.current+=1},[M]),(0,a.useEffect)(()=>{ea.current&&(ea.current=!1)},[]),(0,a.useEffect)(()=>{let e=()=>q.current+=1;return ew&&(ey.current=Date.now(),window.addEventListener("scroll",e)),()=>{if(ew){let t=B.current;window.removeEventListener("scroll",e);let n=t.filter(e=>!!e.measureTimestamp).length,a=t.filter(e=>e.hasRendered).length,i=ev.current,r={deviceType:T,experimentName:e_,experimentGroup:eh,handlerId:P,isAuthenticated:A};(0,y.LY)("webapp.masonry.timeSpent",ey.current?Date.now()-ey.current:0,{tags:r}),(0,y.S0)("webapp.masonry.itemsFetched",i,{tags:r}),(0,y.S0)("webapp.masonry.itemsMeasured",n,{tags:r}),(0,y.S0)("webapp.masonry.itemsMeasuredPercentage",Math.floor(n/i*100),{tags:r}),(0,y.S0)("webapp.masonry.itemsRendered",a,{tags:r}),(0,y.S0)("webapp.masonry.itemsRenderedPercentage",Math.floor(a/i*100),{tags:r}),(0,y.S0)("webapp.masonry.scrollCount",q.current,{tags:r})}}},[]);let ex=(0,a.useCallback)(e=>ew?(0,g.jsx)(x,{analyticsData:B,idx:e.itemIdx,isMeasuring:e.isMeasuring,masonryV2ExpGroup:eh,masonryV2ExpName:e_,children:(0,g.jsx)(o.Z,{name:"MasonryItem",children:k(e)})}):(0,g.jsx)(o.Z,{name:"MasonryItem",children:k(e)}),[k]);return(0,g.jsx)("div",{className:"masonryContainer","data-test-id":"masonry-container",id:s,style:z?{padding:`0 ${K/2}px`}:void 0,children:(0,g.jsxs)("div",{className:ec,children:[Y&&ea.current?(0,g.jsx)(h.Z,{"data-test-id":"masonry-ssr-styles",unsafeCSS:ep}):null,(0,g.jsx)(i.xu,{"data-test-id":"max-width-container",marginBottom:0,marginEnd:"auto",marginStart:"auto",marginTop:0,maxWidth:e.maxColumns?ee*e.maxColumns:void 0,children:ed?(0,g.jsx)(i.GX,{ref:e=>{S&&(S.current=e)},_dynamicHeights:j,_getColumnSpanConfig:R,_loadingStateItems:F,_logTwoColWhitespace:(e,t,n)=>{let a=e.reduce((e,t)=>e+t),i=a/e.length;(0,y.S0)("webapp.masonry.twoColWhitespace",i,{sampleRate:1,tags:{columnWidth:J,minCols:Q}}),er&&(0,y.S0)("webapp.masonry.graphIterations",t,{sampleRate:1,tags:{columnSpan:n,exprimentGroup:er}}),W({event_type:15878,component:14468,aux_data:{total_whitespace_px:a}}),W({event_type:16062,component:14468,aux_data:{average_whitespace_px:i}}),W({event_type:16063,component:14468,aux_data:{max_whitespace_px:Math.max(...e)}}),e.forEach(e=>{e>=50&&W({event_type:16261,component:14468}),e>=100&&W({event_type:16262,component:14468})})},_measureAll:eb,_renderLoadingStateItems:V,_whitespaceThreshold:el,align:t,columnWidth:J,gutterWidth:K,items:M,layout:U?X:E??"basic",loadItems:C,measurementStore:et,minCols:Q,renderItem:ex,scrollContainer:en,virtualBufferFactor:.3,virtualize:N}):(0,g.jsx)(i.Rk,{ref:e=>{S&&(S.current=e)},_dynamicHeights:j,_getColumnSpanConfig:R,_loadingStateItems:F,_logTwoColWhitespace:(e,t,n)=>{let a=e.reduce((e,t)=>e+t),i=a/e.length;(0,y.S0)("webapp.masonry.twoColWhitespace",i,{sampleRate:1,tags:{columnWidth:J,minCols:Q}}),er&&(0,y.S0)("webapp.masonry.graphIterations",t,{sampleRate:1,tags:{columnSpan:n,exprimentGroup:er}}),W({event_type:15878,component:14468,aux_data:{total_whitespace_px:a,average_whitespace_px:i,max_whitespace_px:Math.max(...e),min_whitespace_px:Math.min(...e)}})},_renderLoadingStateItems:V,_whitespaceThreshold:el,align:t,columnWidth:J,gutterWidth:K,items:M,layout:U?X:E??"basic",loadItems:C,measurementStore:et,minCols:Q,renderItem:ex,scrollContainer:en,virtualBufferFactor:.3,virtualize:N})})]})})}},401111:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(3808),i=n(340523),r=n(5859),o=n(554786);let s=({isEligible:e})=>{let t=(0,o.ZP)(),{isAuthenticated:n}=(0,r.B)(),s=(0,i.F)(),{enabled:l}=(0,a.Z)();return"desktop"===t&&e?l?{anyEnabled:!0,group:"enabled_221_16"}:s.checkExperiment(n?"web_fluid_grid_desktop_auth":"web_fluid_grid_desktop_unauth"):{group:"",anyEnabled:!1}};function l(e=!0){let{group:t,anyEnabled:n}=s({isEligible:e}),a=t.match(/enabled_([\d]+)_([\d]+)/),i=a?parseInt(a[1],10):void 0,r=a?parseInt(a[2],10):void 0,o=r?Math.floor(r/4):void 0;return{anyEnabled:n,group:t,experimentalColumnWidth:i,experimentalGutter:r,experimentalGutterBoints:o}}},547643:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(340523),i=n(5859),r=n(84768);function o(e){let{isAuthenticated:t}=(0,i.B)(),{expName:n,anyEnabled:o,group:s}=function({experimentsClient:e,handlerId:t,isAuthenticated:n,skipActivation:a}){let{checkExperiment:i}=e,r=i(n?"web_masonry_v2_auth":"web_masonry_v2_unauth",{dangerouslySkipActivation:a});return r.group?{expName:n?"web_masonry_v2_auth":"web_masonry_v2_unauth",...r}:"www/[username]/[slug].js"!==t||n?"www/pin/[id].js"!==t||n?{expName:"",anyEnabled:!1,group:""}:{expName:"web_masonry_v2_unauth_pin",...i("web_masonry_v2_unauth_pin",{dangerouslySkipActivation:a})}:{expName:"web_masonry_v2_unauth_board",...i("web_masonry_v2_unauth_board",{dangerouslySkipActivation:a})}}({experimentsClient:(0,a.F)(),handlerId:(0,r.MM)(),isAuthenticated:t,skipActivation:e?.skipActivation??!1});return{expName:n,anyEnabled:o,group:s,isMeasureAllEnabled:"enabled_measure_all"===s||"enabled_measure_all_impression_fix"===s,isImpressionFixEnabled:"control_impression_fix"===s||"enabled_impression_fix"===s||"enabled_measure_all_impression_fix"===s}}},667677:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(667294),i=n(883119),r=n(876594),o=n(922719),s=n(406893),l=n(785893);let m=`pulsing {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
}`,u={backgroundColor:r._VP,animation:"pulsing 2s ease-out 0.5s infinite",borderRadius:r.Ev2};function p({data:e}){let{height:t}=e;return(0,l.jsxs)(a.Fragment,{children:[(0,l.jsx)(s.Z,{unsafeCSS:(0,o.Ll)([m])}),(0,l.jsx)(i.xu,{dangerouslySetInlineStyle:{__style:u},"data-test-id":"skeleton-pin",children:(0,l.jsx)(i.xu,{height:t})})]})}function c({useLoadingState:e,numOfPins:t=50}){let n=(0,a.useMemo)(()=>Array.from({length:t}).reduce((e,t,n)=>[...e,{height:n%2==0?356:236}],[]),[t]);return{_loadingStateItems:e?n:void 0,_renderLoadingStateItems:e?({data:e})=>(0,l.jsx)(p,{data:e}):void 0}}},961550:(e,t,n)=>{n.d(t,{BO:()=>x,GC:()=>$,GJ:()=>b,L7:()=>_,Lc:()=>p,Mh:()=>m,Qf:()=>u,Qq:()=>S,Un:()=>k,X$:()=>C,Z7:()=>d,bT:()=>y,bd:()=>w,df:()=>c,iz:()=>N,kl:()=>f,lR:()=>O,m6:()=>M,mT:()=>g,pS:()=>v,uW:()=>E,zz:()=>h});var a,i,r=n(883119),o=n(876594),s=n(898518),l=n(983983);let m="right",u=72,p="VerticalNavContent",c=24,d="lg",_=16,h=16,b=392,f=12,w=o.mJW,y=o.Kuk,v=new r.H3([l.NW]),g=new r.Ry(l.fe-3),x=new r.H3([v,s.kl]),M=new r.H3([x]),E=2,C=8,S=3,$=12,k=((a={}).PINTEREST_LOGO="web.vertical_nav.pinterest_logo.click",a.HOME="web.vertical_nav.home.click",a.TODAY="web.vertical_nav.today.click",a.CREATE="web.vertical_nav.create.click",a.NEWS="web.vertical_nav.news.click",a.CONVERSATIONS="web.vertical_nav.conversations.click",a.AVATAR="web.vertical_nav.avatar.click",a.ACCOUNT_SWITCHER="web.vertical_nav.account_switcher.click",a.MORE_OPTIONS_OPT_OUT="web.vertical_nav.more_options.opt_out",a.MORE_OPTIONS="web.vertical_nav.more_options.click",a),O=((i={}).CONTROL="control",i.EMPLOYEES="employees",i.ENABLED="enabled",i.ENABLED_HOME_BUTTON="enabled_home_button",i.ENABLED_HOME_AND_LOGO="enabled_home_and_logo",i.NONE="",i),N=e=>({tags:{experimentGroup:e}})},408998:(e,t,n)=>{n.d(t,{M:()=>r,f:()=>i});var a=n(658583);let i=()=>{a.t8({name:"forced_experiments",purpose:"personalization",httpOnly:!1,duration:"30d"},JSON.stringify({web_vertical_nav:!1}))},r=()=>{a.zN("forced_experiments")}},995026:(e,t,n)=>{n.d(t,{Z:()=>i});var a=n(741983);function i(e){return!((0,a.Gl)(e)||(0,a.PY)(e)||(0,a.jC)(e)||(0,a.Xn)(e)||(0,a.b_)(e)||(0,a.oF)(e)||(0,a.dt)(e)||(0,a.x7)(e)||(0,a.cY)(e)||(0,a.bb)(e))}},898518:(e,t,n)=>{n.d(t,{CZ:()=>o,Db:()=>l,Lu:()=>r,kl:()=>a,sb:()=>s,t3:()=>i,to:()=>m});let a=new(n(883119)).Ry(700),i="defaultInboxView",r="newMessageView",o="newMessageSelectRecipientsView",s="invitesRequestsView",l="followInviteEducationView",m=64}}]);
//# sourceMappingURL=https://sm.pinimg.com/webapp/6575-25ce2b4075e0a38d.mjs.map