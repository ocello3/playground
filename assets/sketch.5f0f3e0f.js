import{t as y,s as I,D as j,c as P,d as M}from"./tools.9e20a38a.js";import{p as c}from"./index.93009947.js";const b=()=>({num:10,gravity:9.8,windF:5,massMin:10,massMax:20,velXmax:5,velYmax:5,bufferRate:.95,bufferRateMin:.9,fontSizeRate:.007}),D=b(),C=(t,e)=>{const s=e.pages[1];s.addInput(t,"windF",{min:0,max:10}),s.addInput(t,"bufferRate",{min:t.bufferRateMin,max:1.1})},A=(t,e)=>{const{num:s,gravity:a,massMin:u,massMax:d,velXmax:o,velYmax:r}=t;return{movers:Array.from(Array(s),()=>{const n=y.map(Math.random(),0,1,u,d),w=(()=>{const i=Math.random()*o,m=Math.random()*r;return new c.Vector().set(i,m)})();return{mass:n,gravityAcc:new c.Vector().set(0,a/n),initVel:w,acc:new c.Vector().set(0,0),windAcc:new c.Vector().set(0,0),vel:w,pos:(()=>{const i=Math.random()*e,m=Math.random()*e;return new c.Vector().set(i,m)})()}})}};A(D,100);const X=(t,e,s)=>{const{windF:a,bufferRate:u}=e,d={...t};return d.movers=t.movers.map(o=>{const r={...o};r.windAcc=new c.Vector(a/o.mass,0),r.acc=(()=>{const l=o.gravityAcc,i=r.windAcc;return c.Vector.add(l,i)})();const n=l=>c.Vector.add(o.pos,l),w=(l,i)=>{const m=c.Vector.add(o.vel,r.acc),f=l?m.x*-1*u:m.x,x=i?m.y*-1*u:m.y;return new c.Vector().set(f,x)};return r.vel=(()=>{const l=w(!1,!1),i=n(l),m=i.x<0||i.x>s,f=i.y>s;return w(m,f)})(),r.pos=(()=>{const l=n(r.vel),i=m=>m==="x"&&l[m]<0?0:l[m]>s?s:l[m];return new c.Vector().set(i("x"),i("y"))})(),r}),d},Y=(t,e,s,a)=>{const{fontSizeRate:u}=e;a.push();let d=0;for(const o of t.movers){const{pos:r,mass:n}=o;a.textSize(s*u*n),a.text(d,r.x,r.y),d++}a.pop()},h={setParams:b,setGui:C,setData:A,updateData:X,draw:Y},G=t=>({num:t.num,lengthMin:10,lengthMax:30,gravityRate:2,windRate:10,bufferAdjustRate:5,bufferBaseRate:.1}),B=G(D),L=(t,e)=>{e.pages[1].addInput(t,"gravityRate",{step:.5,min:1,max:5})},S=(t,e)=>{const{num:s,lengthMin:a,lengthMax:u}=t;return{winds:Array.from(Array(s),()=>{const d=(()=>{const r=Math.random()*e,n=Math.random()*e;return new c.Vector().set(r,n)})();return{length:y.map(Math.random(),0,1,a,u),vec:new c.Vector().set(0,0),startPos:d,endPos:d,isReset:!1}})}};S(B,100);const O=(t,e,s,a,u)=>{const d={...t};return d.winds=t.winds.map((o,r)=>{const n={...o},w=e.movers[r],{lengthMin:l,lengthMax:i,gravityRate:m,windRate:f,bufferAdjustRate:x,bufferBaseRate:k}=s,{bufferRate:p,bufferRateMin:_}=a;return n.vec=(()=>{const g=(p-_+k)*x,V=c.Vector.mult(w.acc,p*g),F=new c.Vector().set(f,m);return c.Vector.mult(V,F)})(),n.length=(()=>o.isReset?y.map(Math.random(),0,1,l,i):o.length-c.Vector.mag(n.vec))(),n.isReset=(()=>o.isReset?!1:n.length<0)(),n.startPos=(()=>{if(n.isReset){const g=Math.random()*u,V=Math.random()*u;return new c.Vector().set(g,V)}return o.startPos})(),n.endPos=(()=>n.isReset?n.startPos:c.Vector.add(o.endPos,n.vec))(),n}),d},q=(t,e)=>{e.push(),e.strokeWeight(3),e.stroke(0,60);for(const s of t.winds){const{startPos:a,endPos:u}=s;e.line(a.x,a.y,u.x,u.y)}e.pop()},v={setParams:G,setGui:L,setData:S,updateData:O,draw:q},E=()=>({maxVolume:-10}),H=(t,e)=>{e.pages[2].addInput(t,"maxVolume",{step:1,min:-60,max:0})},$=async()=>{const t=await I();return console.log(j.get()),{se:t}};await $();const J=(t,e)=>{console.log(t.se.get()),console.log(e)},R={setParams:E,setGui:H,setSynth:$,playSynth:J},Q=t=>{const e=y.setSize("sketch");let s=P.setController();const a=h.setParams(),u=v.setParams(a),d=R.setParams();let o=h.setData(a,e),r=v.setData(u,e),n;t.setup=async()=>{t.createCanvas(e,e),n=await R.setSynth();const w=P.setGui(t,s,n.se,!1);h.setGui(a,w),v.setGui(u,w),R.setGui(d,w),t.noLoop(),M(t,e)},t.draw=()=>{n===void 0&&t.noLoop(),t.background(255),P.updateController(t,s),o=h.updateData(o,a,e),r=v.updateData(r,o,u,a,e),h.draw(o,a,e,t),v.draw(r,t),M(t,e)}};export{Q as sketch};