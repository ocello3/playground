import{t as M,s as G,D as S,c as p,d as h}from"./tools-c877827f.js";import{p as n}from"./index-be582c09.js";const R=()=>({status:"update",num:7,mMinRate:.005,mMaxRate:.01,originMRate:.015,g:.4,sizeRate:5,color:[[188,150,230],[216,180,226],[174,117,159]]}),k=R(),C=(t,o)=>{const e=o.pages[1];e.addBinding(t,"originMRate",{step:.01,min:.01,max:.1}),e.addBinding(t,"num",{step:1,min:2,max:15}),e.addBinding(t,"status",{readonly:!0}),e.addButton({title:"orbit",label:"reset"}).on("click",()=>{t.status="reset"})},V=(t,o)=>{const{num:e,mMinRate:c,mMaxRate:l,originMRate:i}=t;return{attractors:Array.from(Array(e),(u,a)=>({v:new n.Vector().set(0,0),pos:(()=>{if(a===0)return new n.Vector().set(o*.5,o*.5);const r=Math.random()*o,m=Math.random()*o;return new n.Vector().set(r,m)})(),m:(()=>{if(a===0)return o*i;const r=o*c,m=o*l;return M.map(Math.random(),0,1,r,m)})(),f:new n.Vector().set(0,0),color:(()=>{const r=a%t.color.length;return t.color[r]})(),a:new n.Vector().set(0,0)}))}};V(k,100);const _=(t,o,e)=>{const{g:c,originMRate:l,status:i}=o;if(i==="reset")return o.status="update",V(o,e);const u={...t};return u.attractors=t.attractors.map((a,r,m)=>{const s={...a};return r===0&&(s.m=l*e),s.f=m.reduce((f,w,x)=>{if(x===r)return n.Vector.add(f,new n.Vector().set(0,0));const y=n.Vector.sub(w.pos,s.pos),D=n.Vector.normalize(y),P=n.Vector.mag(y),v=c*s.m*w.m/P,B=n.Vector.mult(D,v);return n.Vector.add(B,f)},new n.Vector().set(0,0)),s.a=n.Vector.div(s.f,s.m),s.v=n.Vector.add(a.v,s.a),s.pos=(()=>r===0?a.pos:n.Vector.add(a.pos,s.v))(),s}),u},F=(t,o,e)=>{const{attractors:c}=t,{sizeRate:l}=o;e.push(),e.noStroke();for(const i of c){e.push();const{pos:u,m:a,color:r}=i;e.fill(r[0],r[1],r[2]),e.circle(u.x,u.y,a*l),e.pop()}e.pop()},d={setParams:R,setGui:C,setData:V,updateData:_,draw:F},L=()=>({maxVolume:-10}),$=(t,o)=>{o.pages[2].addBinding(t,"maxVolume",{step:1,min:-60,max:0})},b=async()=>{const t=await G();return console.log(S.get()),{se:t}};await b();const U=(t,o)=>{console.log(t.se.get()),console.log(o)},g={setParams:L,setGui:$,setSynth:b,playSynth:U},E=t=>{const o=M.setSize("sketch");let e=p.setController();const c=d.setParams(),l=g.setParams();let i=d.setData(c,o),u;t.setup=async()=>{t.createCanvas(o,o),u=await g.setSynth();const a=p.setGui(t,e,u.se,!1);d.setGui(c,a),g.setGui(l,a),t.noLoop(),h(t,o)},t.draw=()=>{u===void 0&&t.noLoop(),t.background(33,11,44,200),p.updateController(t,e),i=d.updateData(i,c,o),d.draw(i,c,t),h(t,o),p.updateController(t,e)}};export{E as sketch};
