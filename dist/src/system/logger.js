var v=Object.defineProperty;var E=(e,r)=>v(e,"name",{value:r,configurable:!0});var u=(e,r,t)=>{if(!r.has(e))throw TypeError("Cannot "+t)};var i=(e,r,t)=>(u(e,r,"read from private field"),t?t.call(e):r.get(e)),d=(e,r,t)=>{if(r.has(e))throw TypeError("Cannot add the same private member more than once");r instanceof WeakSet?r.add(e):r.set(e,t)},R=(e,r,t,s)=>(u(e,r,"write to private field"),s?s.call(e,t):r.set(e,t),t);var c=(e,r,t)=>(u(e,r,"access private method"),t);var n,a,g;const h={ERROR:"error",WARN:"warn",INFO:"info",DEBUG:"debug"},w={message:"",context:"",data:null,date:null};class O extends EventTarget{constructor(){super(...arguments);d(this,a);d(this,n,[])}get logs(){return i(this,n)}get errors(){return i(this,n).filter(t=>t.level===h.ERROR)}error(t,s,l){c(this,a,g).call(this,h.ERROR,t,s,l),this.dispatchEvent(new CustomEvent("error",{detail:{message:t,context:s,data:l}}))}warn(t,s,l){c(this,a,g).call(this,h.WARN,t,s,l)}info(t,s,l){c(this,a,g).call(this,h.INFO,t,s,l)}debug(t,s,l){c(this,a,g).call(this,h.DEBUG,t,s,l)}clear(){R(this,n,[])}clearErrors(){R(this,n,i(this,n).filter(t=>t.level!==h.ERROR))}clearContext(t){R(this,n,i(this,n).filter(s=>s.context!==t))}clearData(t,s){R(this,n,i(this,n).filter(l=>l.context!==t&&l.data!==s))}}E(O,"Logger"),n=new WeakMap,a=new WeakSet,g=E(function(t,s="",l="",f=null){const o=structuredClone(w);o.message=s,o.context=l,o.data=f,o.date=new Date().toISOString(),o.level=t,i(this,n).push(o)},"#log"),globalThis.logger=new O;
//# sourceMappingURL=logger.js.map
