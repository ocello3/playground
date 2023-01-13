import{t as g,s as _,h as b,O as V,d as M,c as x}from"./tools.67f27e6a.js";import{p as h}from"./index.02762181.js";const k=()=>({light:{speed:.005,shadowDistRate:100,lightDistRate:.25},boader:{speed:.001},object:{count:10,speed_min:.1,speed_max:1,lengthRate_min:.1,lengthRate_max:.5},shadow:{colorRate:.7,alpha:35},background:{shadowColor:240,shadowAlpha:220,lightColor:100,lightAlpha:255},synth:{volReducRate:8,vol_min:-50,vol_max:-10,freq_min:280,freq_max:920}}),A=(t,o)=>{const s=o.pages[1],n=s.addFolder({title:"light"});n.addInput(t.light,"speed",{step:.001,min:.001,max:.1}),n.addInput(t.light,"shadowDistRate",{step:.1,min:1,max:1e3}),n.addInput(t.light,"lightDistRate",{step:.01,min:.01,max:2}),s.addFolder({title:"boader"}).addInput(t.boader,"speed",{min:1e-4,max:.01});const r=s.addFolder({title:"object"});r.addInput(t.object,"speed_min",{min:.01,max:1}),r.addInput(t.object,"speed_max",{min:.1,max:10}),r.addInput(t.object,"lengthRate_min",{min:.01,max:.3}),r.addInput(t.object,"lengthRate_max",{min:.3,max:1});const e=s.addFolder({title:"shadow"});e.addInput(t.shadow,"alpha",{step:1,min:10,max:250}),e.addInput(t.shadow,"colorRate",{step:.01,min:.1,max:1});const c=o.pages[2];c.addInput(t.synth,"volReducRate",{step:.1,min:.1,max:10}),c.addInput(t.synth,"vol_min",{step:1,min:-60,max:-30}),c.addInput(t.synth,"vol_max",{step:1,min:-30,max:-0}),c.addInput(t.synth,"freq_min",{step:1,min:30,max:500}),c.addInput(t.synth,"freq_max",{step:1,min:500,max:1500})},v=(t,o,s,n)=>{const a=n===void 0,r=(()=>{if(a)return Math.PI+t.angle;const i=n.angle+o.light.speed;return i>Math.PI*2?i-Math.PI*2:i})(),e=(()=>{const i=r<=t.angle,m=r>=Math.PI+t.angle;return i||m})(),c=a?!0:e!=n.isShadow,d=(()=>{const i=r/(Math.PI*2)-t.angle/(Math.PI*2),m=i<0?1+i:i;if(e){const w=m-.5;return g.map(Math.abs(w-.25),0,.25,1,0)}return g.map(Math.abs(m-.25),0,.25,1,0)})(),l=a?new h.Vector(s*.5,s*.5):n.start,u=(()=>{const i=m=>{const w=new h.Vector(0,0);return h.Vector.dist(l,w)*m};return c||a?i(e?o.light.shadowDistRate:o.light.lightDistRate):n.length})(),p=h.Vector.fromAngle(-1*r),f=h.Vector.add(l,h.Vector.mult(p,u));return{start:l,length:u,angle:r,angleRate:d,vec:p,end:f,isShadow:e,isSwitch:c}},y=(t,o,s)=>{const n=s===void 0,a=(()=>{if(n)return Math.PI;const p=s.angle-t.boader.speed;return p<0?Math.PI:p})(),r=h.Vector.fromAngle(a),e=o*Math.sqrt(2),c=new h.Vector(o*.5,o*.5),d=new h.Vector(e*.5*Math.cos(a),e*.5*Math.sin(a)),l=h.Vector.sub(c,d),u=h.Vector.add(c,d);return{vec:r,length:e,start:l,end:u,angle:a}},R=(t,o,s,n)=>{const a=n===void 0,r=(()=>a?Array.from(Array(o.object.count),()=>Math.random()):n.rates.map((i,m)=>n.isOvers[m]?Math.random():i))(),e=r.map(i=>g.map(i,0,1,o.object.speed_min,o.object.speed_max)),c=(()=>a?Array.from(Array(o.object.count),()=>Math.random()*t.length):n.intervals.map((i,m)=>n.isOvers[m]?0:i+e[m]))(),d=c.map(i=>h.Vector.add(t.start,h.Vector.mult(t.vec,i))),l=c.map(()=>h.Vector.fromAngle(t.angle+Math.PI*.5)),u=(()=>a?c.map(()=>Math.random()*s*.5):r.map(m=>g.map(m,0,1,o.object.lengthRate_max,o.object.lengthRate_min)).map(m=>s*m))(),p=d.map((i,m)=>h.Vector.add(i,h.Vector.mult(l[m],u[m]))),f=c.map(i=>i>t.length);return{rates:r,speeds:e,intervals:c,starts:d,vecs:l,lengths:u,ends:p,isOvers:f}},I=(t,o,s)=>{const n=s.starts,a=n.map((l,u)=>g.getIntersection(l,t.end,t.end,s.ends[u])),r=s.ends.map((l,u)=>g.getIntersection(l,a[u],o.start,o.end)),e=n.map((l,u)=>h.Vector.sub(a[u],l)),c=e.map(l=>h.Vector.normalize(l)),d=e.map(l=>h.Vector.mag(l));return{starts:n,ends:a,intersections:r,vecs:c,lengths:d}},q=(t,o,s,n,a)=>{const r=o.starts.map(d=>g.constrain(g.map(d.x,0,a,-1,1),-1,1)),e=o.rates.map(d=>g.map(t.isShadow?d:d*n.synth.volReducRate,0,1,n.synth.vol_min,n.synth.vol_max)/n.object.count),c=s.lengths.map(d=>g.constrain(g.map(d/a,0,72,n.synth.freq_min,n.synth.freq_max),n.synth.freq_min,n.synth.freq_max));return{pans:r,vols:e,freqs:c}},S=async t=>{const o=await _(),s=Array.from(Array(t.object.count),()=>new b().toDestination()),n=s.map(a=>new V().connect(a).start());return n.forEach(a=>a.volume.value=-60),{se:o,pans:s,oscs:n}},j=(t,o)=>{t.pans.forEach((s,n)=>s.pan.value=o.pans[n]),t.oscs.forEach((s,n)=>{s.frequency.value=o.freqs[n],s.volume.value=o.vols[n]})},P=(t,o,s,n,a,r,e)=>{t.isShadow&&e.background(a.background.shadowColor,a.background.shadowAlpha*t.angleRate),t.isShadow||e.background(a.background.lightColor,a.background.lightAlpha*t.angleRate),e.push(),e.stroke("black"),e.line(o.start.x,o.start.y,o.end.x,o.end.y),e.pop(),e.push(),e.stroke("black"),s.starts.forEach((c,d)=>{const l=s.ends[d];e.line(c.x,c.y,l.x,l.y)}),e.pop(),e.push(),e.noStroke(),n.starts.forEach((c,d)=>{const l=n.ends[d],u=n.intersections[d];e.fill(0,a.shadow.alpha*t.angleRate),e.triangle(c.x,c.y,l.x,l.y,s.ends[d].x,s.ends[d].y);const p=t.isShadow?0:a.background.shadowColor*a.shadow.colorRate;e.fill(p,a.background.shadowAlpha*t.angleRate),e.triangle(c.x,c.y,l.x,l.y,u.x,u.y)}),e.pop(),M(e,r)},E=t=>{const o=g.setSize("sketch");let s=x.setController();const n=k();let a,r,e,c,d,l;t.setup=async()=>{l=await S(n),r=y(n,o),a=v(r,n,o),e=R(r,n,o),c=I(a,r,e),t.createCanvas(o,o);const u=x.setGui(t,s,l.se,!1);A(n,u),t.noLoop()},t.draw=()=>{if(l===void 0){t.noLoop();return}x.updateController(t,s),r=y(n,o,r),a=v(r,n,o,a),e=R(r,n,o,e),c=I(a,r,e),P(a,r,e,c,n,o,t),d=q(a,e,c,n,o),j(l,d)}};export{E as sketch};
