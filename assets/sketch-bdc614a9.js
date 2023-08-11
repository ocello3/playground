import{o as y,W as k,t as u,s as A,h as I,O as B,D as S,d as j,c as x}from"./tools-c877827f.js";import{p as h}from"./index-be582c09.js";import{F as q}from"./Freeverb-5bea2c87.js";import{E as _}from"./Effect-00161deb.js";import"./CrossFade-960fb31d.js";import"./Split-3e1ffd80.js";class f extends _{constructor(){super(y(f.getDefaults(),arguments,["distortion"])),this.name="Distortion";const n=y(f.getDefaults(),arguments,["distortion"]);this._shaper=new k({context:this.context,length:4096}),this._distortion=n.distortion,this.connectEffect(this._shaper),this.distortion=n.distortion,this.oversample=n.oversample}static getDefaults(){return Object.assign(_.getDefaults(),{distortion:.4,oversample:"none"})}get distortion(){return this._distortion}set distortion(n){this._distortion=n;const a=n*100,t=Math.PI/180;this._shaper.setMap(s=>Math.abs(s)<.001?0:(3+a)*s*20*t/(Math.PI+a*Math.abs(s)))}get oversample(){return this._shaper.oversample}set oversample(n){this._shaper.oversample=n}dispose(){return super.dispose(),this._shaper.dispose(),this}}const D=()=>({light:{speed:.005,shadowDistRate:100,lightDistRate:.25},boader:{speed:.001},object:{count:10,speed_min:.1,speed_max:1,lengthRate_min:.1,lengthRate_max:.5},shadow:{colorRate:.7,alpha:35},background:{shadowColor:240,shadowAlpha:220,lightColor:100,lightAlpha:255},synth:{volReducRate:.7,vol_min:-45,vol_max:-15,freq_min:280,freq_max:920}}),P=(e,n)=>{const a=n.pages[1],t=a.addFolder({title:"light"});t.addBinding(e.light,"speed",{step:.001,min:.001,max:.1}),t.addBinding(e.light,"shadowDistRate",{step:.1,min:1,max:1e3}),t.addBinding(e.light,"lightDistRate",{step:.01,min:.01,max:2}),a.addFolder({title:"boader"}).addBinding(e.boader,"speed",{min:1e-4,max:.01});const r=a.addFolder({title:"object"});r.addBinding(e.object,"speed_min",{min:.01,max:1}),r.addBinding(e.object,"speed_max",{min:.1,max:10}),r.addBinding(e.object,"lengthRate_min",{min:.01,max:.3}),r.addBinding(e.object,"lengthRate_max",{min:.3,max:1});const o=a.addFolder({title:"shadow"});o.addBinding(e.shadow,"alpha",{step:1,min:10,max:250}),o.addBinding(e.shadow,"colorRate",{step:.01,min:.1,max:1});const i=n.pages[2].addFolder({title:"synth"});i.addBinding(e.synth,"volReducRate",{step:.1,min:.1,max:10}),i.addBinding(e.synth,"vol_min",{step:1,min:-60,max:-30}),i.addBinding(e.synth,"vol_max",{step:1,min:-30,max:-0}),i.addBinding(e.synth,"freq_min",{step:1,min:30,max:500}),i.addBinding(e.synth,"freq_max",{step:1,min:500,max:1500})},R=(e,n,a,t)=>{const s=t===void 0,r=(()=>{if(s)return Math.PI+e.angle;const l=t.angle+n.light.speed;return l>Math.PI*2?l-Math.PI*2:l})(),o=(()=>{const l=r<=e.angle,m=r>=Math.PI+e.angle;return l||m})(),d=s?!0:o!=t.isShadow,i=(()=>{const l=r/(Math.PI*2)-e.angle/(Math.PI*2),m=l<0?1+l:l;if(o){const w=m-.5;return u.map(Math.abs(w-.25),0,.25,1,0)}return u.map(Math.abs(m-.25),0,.25,1,0)})(),c=s?new h.Vector(a*.5,a*.5):t.start,g=(()=>{const l=m=>{const w=new h.Vector(0,0);return h.Vector.dist(c,w)*m};return d||s?l(o?n.light.shadowDistRate:n.light.lightDistRate):t.length})(),p=h.Vector.fromAngle(-1*r),v=h.Vector.add(c,h.Vector.mult(p,g));return{start:c,length:g,angle:r,angleRate:i,vec:p,end:v,isShadow:o,isSwitch:d}},b=(e,n,a)=>{const t=a===void 0,s=(()=>{if(t)return Math.PI;const p=a.angle-e.boader.speed;return p<0?Math.PI:p})(),r=h.Vector.fromAngle(s),o=n*Math.sqrt(2),d=new h.Vector(n*.5,n*.5),i=new h.Vector(o*.5*Math.cos(s),o*.5*Math.sin(s)),c=h.Vector.sub(d,i),g=h.Vector.add(d,i);return{vec:r,length:o,start:c,end:g,angle:s}},M=(e,n,a,t)=>{const s=t===void 0,r=(()=>s?Array.from(Array(n.object.count),()=>Math.random()):t.rates.map((l,m)=>t.isOvers[m]?Math.random():l))(),o=r.map(l=>u.map(l,0,1,n.object.speed_min,n.object.speed_max)),d=(()=>s?Array.from(Array(n.object.count),()=>Math.random()*e.length):t.intervals.map((l,m)=>t.isOvers[m]?0:l+o[m]))(),i=d.map(l=>h.Vector.add(e.start,h.Vector.mult(e.vec,l))),c=d.map(()=>h.Vector.fromAngle(e.angle+Math.PI*.5)),g=(()=>s?d.map(()=>Math.random()*a*.5):r.map(m=>u.map(m,0,1,n.object.lengthRate_max,n.object.lengthRate_min)).map(m=>a*m))(),p=i.map((l,m)=>h.Vector.add(l,h.Vector.mult(c[m],g[m]))),v=d.map(l=>l>e.length);return{rates:r,speeds:o,intervals:d,starts:i,vecs:c,lengths:g,ends:p,isOvers:v}},V=(e,n,a)=>{const t=a.starts,s=t.map((c,g)=>u.getIntersection(c,e.end,e.end,a.ends[g])),r=a.ends.map((c,g)=>u.getIntersection(c,s[g],n.start,n.end)),o=t.map((c,g)=>h.Vector.sub(s[g],c)),d=o.map(c=>h.Vector.normalize(c)),i=o.map(c=>h.Vector.mag(c));return{starts:t,ends:s,intersections:r,vecs:d,lengths:i}},F=(e,n,a,t,s)=>{const r=n.starts.map(i=>u.constrain(u.map(i.x,0,s,-1,1),-1,1)),o=n.rates.map(i=>u.map(e.isShadow?i/t.object.count:i*t.synth.volReducRate/t.object.count,0,1,t.synth.vol_min,t.synth.vol_max)),d=a.lengths.map(i=>u.constrain(u.map(i/s,0,72,t.synth.freq_min,t.synth.freq_max),t.synth.freq_min,t.synth.freq_max));return{pans:r,vols:o,freqs:d}},C=async e=>{const n=await A(),a=new q().toDestination();a.dampening=1e3,a.roomSize.value=.8,a.wet.value=.8;const t=new f().connect(a);t.distortion=.3,t.wet.value=.3;const s=Array.from(Array(e.object.count),()=>new I().connect(t)),r=s.map(o=>new B().connect(o).start());return S.mute=!0,{se:n,freeverb:a,dist:t,pans:s,oscs:r}},E=(e,n)=>{e.pans.forEach((a,t)=>a.pan.value=n.pans[t]),e.oscs.forEach((a,t)=>{a.frequency.value=n.freqs[t],a.volume.value=n.vols[t]})},O=(e,n,a,t,s,r,o)=>{e.isShadow&&o.background(s.background.shadowColor,s.background.shadowAlpha*e.angleRate),e.isShadow||o.background(s.background.lightColor,s.background.lightAlpha*e.angleRate),o.push(),o.stroke("black"),o.line(n.start.x,n.start.y,n.end.x,n.end.y),o.pop(),o.push(),o.stroke("black"),a.starts.forEach((d,i)=>{const c=a.ends[i];o.line(d.x,d.y,c.x,c.y)}),o.pop(),o.push(),o.noStroke(),t.starts.forEach((d,i)=>{const c=t.ends[i],g=t.intersections[i];o.fill(0,s.shadow.alpha*e.angleRate),o.triangle(d.x,d.y,c.x,c.y,a.ends[i].x,a.ends[i].y);const p=e.isShadow?0:s.background.shadowColor*s.shadow.colorRate;o.fill(p,s.background.shadowAlpha*e.angleRate),o.triangle(d.x,d.y,c.x,c.y,g.x,g.y)}),o.pop(),j(o,r)},K=e=>{const n=u.setSize("sketch");let a=x.setController();const t=D();let s,r,o,d,i,c;e.setup=async()=>{c=await C(t),r=b(t,n),s=R(r,t,n),o=M(r,t,n),d=V(s,r,o),e.createCanvas(n,n);const g=x.setGui(e,a,c.se,!1);P(t,g),e.noLoop()},e.draw=()=>{if(c===void 0){e.noLoop();return}x.updateController(e,a),r=b(t,n,r),s=R(r,t,n,s),o=M(r,t,n,o),d=V(s,r,o),O(s,r,o,d,t,n,e),i=F(s,o,d,t,n),E(c,i)}};export{K as sketch};