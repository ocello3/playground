import{s as S,D as v,t as w,c as d,d as y}from"./tools.dbab5185.js";import{p}from"./index.95ce4ac5.js";const h=e=>typeof e=="string"||typeof e=="number"||typeof e=="boolean"||e instanceof p.Vector,A=e=>typeof e=="object"&&!(e instanceof p.Vector),D=(e,t,s,o)=>{const n=s<e.length?s:e.length-1,a=(()=>t===null?e.length:n+t>e.length?e.length-n:t)(),r=e.slice(n,n+a);return h(r[0])?l(" - ",r,o):r.forEach((u,b)=>{o.push(`- index ${b+n}<br>`),u instanceof p.Vector?l(" - ",u,o):m(u,t,s,o)}),o},m=(e,t,s,o)=>{for(const n in e)Array.isArray(e[n])?(o.push(`-- ${n}:<br>`),D(e[n],t,s,o)):h(e[n])?l(n,e[n],o):A(e[n])&&m(e[n],t,s,o);return o},l=(e,t,s)=>{Array.isArray(t)?t[0]instanceof p.Vector?(s.push("["),t.forEach((o,n)=>{n===t.length-1?s.push(`${o}`):s.push(`${o},<br>`)}),s.push("]<br>")):(s.push("["),t.forEach((o,n)=>{n===t.length-1?s.push(`${o}`):s.push(`${o}, `)}),s.push("]<br>")):s.push(`${e}: ${t}<br>`)},x=(e,t=null,s=0)=>{const o="// debug result<br>",n=[];Array.isArray(e)?D(e,t,s,n):h(e)?l(" - ",e,n):m(e,t,s,n),document.getElementById("debug").innerHTML=o.concat(...n)},G=()=>({rate:.5}),I=(e,t)=>{t.pages[1].addInput(e,"rate",{step:.1,min:.1,max:1})},P=(e,t)=>{const{rate:s}=e;return{radius:t*.5*s}},V=(e,t,s)=>{const{rate:o}=t,n={...e};return n.radius=s*.5*o,n},T=(e,t)=>{const{radius:s}=e;t.push(),t.circle(100,100,s),t.pop()},i={setParams:G,setGui:I,setData:P,updateData:V,draw:T},k=()=>({maxVolume:-10}),E=(e,t)=>{t.pages[2].addInput(e,"maxVolume",{step:1,min:-60,max:0})},$=async()=>{const e=await S();return console.log(v.get()),{se:e}};await $();const _=(e,t)=>{console.log(e.se.get()),console.log(t)},f={setParams:k,setGui:E,setSynth:$,playSynth:_},j=e=>{const t=w.setSize("sketch");let s=d.setController();const o=i.setParams(),n=f.setParams();let c,a;e.setup=async()=>{e.createCanvas(t,t),c=i.setData(o,t),a=await f.setSynth();const r=d.setGui(e,s,a.se,!1);i.setGui(o,r),f.setGui(n,r),e.noLoop(),y(e,t)},e.draw=()=>{a===void 0&&e.noLoop(),x(c),e.background(255),d.updateController(e,s),c=i.updateData(c,o,t),i.draw(c,e),y(e,t)}};export{j as sketch};
