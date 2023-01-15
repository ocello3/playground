import{t as M,s as S,D as k,c as p,d as y}from"./tools.9e20a38a.js";import{p as a}from"./index.93009947.js";const R=()=>({status:"update",num:7,mMinRate:.005,mMaxRate:.01,originMRate:.015,g:.4,sizeRate:5,color:[[188,150,230],[216,180,226],[174,117,159]]}),C=R(),_=(t,o)=>{const e=o.pages[1];e.addInput(t,"originMRate",{step:.01,min:.01,max:.1}),e.addInput(t,"num",{step:1,min:2,max:15}),e.addMonitor(t,"status"),e.addButton({title:"orbit",label:"reset"}).on("click",()=>{t.status="reset"})},f=(t,o)=>{const{num:e,mMinRate:c,mMaxRate:l,originMRate:m}=t;return{attractors:Array.from(Array(e),(u,n)=>({v:new a.Vector().set(0,0),pos:(()=>{if(n===0)return new a.Vector().set(o*.5,o*.5);const r=Math.random()*o,i=Math.random()*o;return new a.Vector().set(r,i)})(),m:(()=>{if(n===0)return o*m;const r=o*c,i=o*l;return M.map(Math.random(),0,1,r,i)})(),f:new a.Vector().set(0,0),color:(()=>{const r=n%t.color.length;return t.color[r]})(),a:new a.Vector().set(0,0)}))}};f(C,100);const B=(t,o,e)=>{const{g:c,originMRate:l,status:m}=o;if(m==="reset")return o.status="update",f(o,e);const u={...t};return u.attractors=t.attractors.map((n,r,i)=>{const s={...n};return r===0&&(s.m=l*e),s.f=i.reduce((g,w,x)=>{if(x===r)return a.Vector.add(g,new a.Vector().set(0,0));const h=a.Vector.sub(w.pos,s.pos),D=a.Vector.normalize(h),P=a.Vector.mag(h),v=c*s.m*w.m/P,G=a.Vector.mult(D,v);return a.Vector.add(G,g)},new a.Vector().set(0,0)),s.a=a.Vector.div(s.f,s.m),s.v=a.Vector.add(n.v,s.a),s.pos=(()=>r===0?n.pos:a.Vector.add(n.pos,s.v))(),s}),u},F=(t,o,e)=>{const{attractors:c}=t,{sizeRate:l}=o;e.push(),e.noStroke();for(const m of c){e.push();const{pos:u,m:n,color:r}=m;e.fill(r[0],r[1],r[2]),e.circle(u.x,u.y,n*l),e.pop()}e.pop()},d={setParams:R,setGui:_,setData:f,updateData:B,draw:F},I=()=>({maxVolume:-10}),L=(t,o)=>{o.pages[2].addInput(t,"maxVolume",{step:1,min:-60,max:0})},b=async()=>{const t=await S();return console.log(k.get()),{se:t}};await b();const $=(t,o)=>{console.log(t.se.get()),console.log(o)},V={setParams:I,setGui:L,setSynth:b,playSynth:$},q=t=>{const o=M.setSize("sketch");let e=p.setController();const c=d.setParams(),l=V.setParams();let m=d.setData(c,o),u;t.setup=async()=>{t.createCanvas(o,o),u=await V.setSynth();const n=p.setGui(t,e,u.se,!1);d.setGui(c,n),V.setGui(l,n),t.noLoop(),y(t,o)},t.draw=()=>{u===void 0&&t.noLoop(),t.background(33,11,44,200),p.updateController(t,e),m=d.updateData(m,c,o),d.draw(m,c,t),y(t,o),p.updateController(t,e)}};export{q as sketch};