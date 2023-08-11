import{B as I,o as E,E as M,n as $,F as R,H as p,I as j,q as w,z as O,J as N,K as A,L as U,N as W,Q as F,R as H,t as x,U as P,s as G,V as J,d as K,c as z}from"./tools-c877827f.js";import{d as Q}from"./debug-07cea505.js";import{p as S}from"./index-be582c09.js";import{A as X,M as Y}from"./Meter-239951ee.js";import"./Split-3e1ffd80.js";class m extends I{constructor(){super(E(m.getDefaults(),arguments,["callback","value"])),this.name="ToneEvent",this._state=new M("stopped"),this._startOffset=0;const t=E(m.getDefaults(),arguments,["callback","value"]);this._loop=t.loop,this.callback=t.callback,this.value=t.value,this._loopStart=this.toTicks(t.loopStart),this._loopEnd=this.toTicks(t.loopEnd),this._playbackRate=t.playbackRate,this._probability=t.probability,this._humanize=t.humanize,this.mute=t.mute,this._playbackRate=t.playbackRate,this._state.increasing=!0,this._rescheduleEvents()}static getDefaults(){return Object.assign(I.getDefaults(),{callback:$,humanize:!1,loop:!1,loopEnd:"1m",loopStart:0,mute:!1,playbackRate:1,probability:1,value:null})}_rescheduleEvents(t=-1){this._state.forEachFrom(t,e=>{let s;if(e.state==="started"){e.id!==-1&&this.context.transport.clear(e.id);const i=e.time+Math.round(this.startOffset/this._playbackRate);if(this._loop===!0||R(this._loop)&&this._loop>1){s=1/0,R(this._loop)&&(s=this._loop*this._getLoopDuration());const n=this._state.getAfter(i);n!==null&&(s=Math.min(s,n.time-i)),s!==1/0&&(this._state.setStateAtTime("stopped",i+s+1,{id:-1}),s=new p(this.context,s));const a=new p(this.context,this._getLoopDuration());e.id=this.context.transport.scheduleRepeat(this._tick.bind(this),a,new p(this.context,i),s)}else e.id=this.context.transport.schedule(this._tick.bind(this),new p(this.context,i))}})}get state(){return this._state.getValueAtTime(this.context.transport.ticks)}get startOffset(){return this._startOffset}set startOffset(t){this._startOffset=t}get probability(){return this._probability}set probability(t){this._probability=t}get humanize(){return this._humanize}set humanize(t){this._humanize=t}start(t){const e=this.toTicks(t);return this._state.getValueAtTime(e)==="stopped"&&(this._state.add({id:-1,state:"started",time:e}),this._rescheduleEvents(e)),this}stop(t){this.cancel(t);const e=this.toTicks(t);if(this._state.getValueAtTime(e)==="started"){this._state.setStateAtTime("stopped",e,{id:-1});const s=this._state.getBefore(e);let i=e;s!==null&&(i=s.time),this._rescheduleEvents(i)}return this}cancel(t){t=w(t,-1/0);const e=this.toTicks(t);return this._state.forEachFrom(e,s=>{this.context.transport.clear(s.id)}),this._state.cancel(e),this}_tick(t){const e=this.context.transport.getTicksAtTime(t);if(!this.mute&&this._state.getValueAtTime(e)==="started"){if(this.probability<1&&Math.random()>this.probability)return;if(this.humanize){let s=.02;j(this.humanize)||(s=this.toSeconds(this.humanize)),t+=(Math.random()*2-1)*s}this.callback(t,this.value)}}_getLoopDuration(){return Math.round((this._loopEnd-this._loopStart)/this._playbackRate)}get loop(){return this._loop}set loop(t){this._loop=t,this._rescheduleEvents()}get playbackRate(){return this._playbackRate}set playbackRate(t){this._playbackRate=t,this._rescheduleEvents()}get loopEnd(){return new p(this.context,this._loopEnd).toSeconds()}set loopEnd(t){this._loopEnd=this.toTicks(t),this._loop&&this._rescheduleEvents()}get loopStart(){return new p(this.context,this._loopStart).toSeconds()}set loopStart(t){this._loopStart=this.toTicks(t),this._loop&&this._rescheduleEvents()}get progress(){if(this._loop){const t=this.context.transport.ticks,e=this._state.get(t);if(e!==null&&e.state==="started"){const s=this._getLoopDuration();return(t-e.time)%s/s}else return 0}else return 0}dispose(){return super.dispose(),this.cancel(),this._state.dispose(),this}}class v extends m{constructor(){super(E(v.getDefaults(),arguments,["callback","events"])),this.name="Part",this._state=new M("stopped"),this._events=new Set;const t=E(v.getDefaults(),arguments,["callback","events"]);this._state.increasing=!0,t.events.forEach(e=>{O(e)?this.add(e[0],e[1]):this.add(e)})}static getDefaults(){return Object.assign(m.getDefaults(),{events:[]})}start(t,e){const s=this.toTicks(t);if(this._state.getValueAtTime(s)!=="started"){e=w(e,this._loop?this._loopStart:0),this._loop?e=w(e,this._loopStart):e=w(e,0);const i=this.toTicks(e);this._state.add({id:-1,offset:i,state:"started",time:s}),this._forEach(n=>{this._startNote(n,s,i)})}return this}_startNote(t,e,s){e-=s,this._loop?t.startOffset>=this._loopStart&&t.startOffset<this._loopEnd?(t.startOffset<s&&(e+=this._getLoopDuration()),t.start(new p(this.context,e))):t.startOffset<this._loopStart&&t.startOffset>=s&&(t.loop=!1,t.start(new p(this.context,e))):t.startOffset>=s&&t.start(new p(this.context,e))}get startOffset(){return this._startOffset}set startOffset(t){this._startOffset=t,this._forEach(e=>{e.startOffset+=this._startOffset})}stop(t){const e=this.toTicks(t);return this._state.cancel(e),this._state.setStateAtTime("stopped",e),this._forEach(s=>{s.stop(t)}),this}at(t,e){const s=new N(this.context,t).toTicks(),i=new p(this.context,1).toSeconds(),n=this._events.values();let a=n.next();for(;!a.done;){const r=a.value;if(Math.abs(s-r.startOffset)<i)return A(e)&&(r.value=e),r;a=n.next()}return A(e)?(this.add(t,e),this.at(t)):null}add(t,e){t instanceof Object&&Reflect.has(t,"time")&&(e=t,t=e.time);const s=this.toTicks(t);let i;return e instanceof m?(i=e,i.callback=this._tick.bind(this)):i=new m({callback:this._tick.bind(this),context:this.context,value:e}),i.startOffset=s,i.set({humanize:this.humanize,loop:this.loop,loopEnd:this.loopEnd,loopStart:this.loopStart,playbackRate:this.playbackRate,probability:this.probability}),this._events.add(i),this._restartEvent(i),this}_restartEvent(t){this._state.forEach(e=>{e.state==="started"?this._startNote(t,e.time,e.offset):t.stop(new p(this.context,e.time))})}remove(t,e){return U(t)&&t.hasOwnProperty("time")&&(e=t,t=e.time),t=this.toTicks(t),this._events.forEach(s=>{s.startOffset===t&&(W(e)||A(e)&&s.value===e)&&(this._events.delete(s),s.dispose())}),this}clear(){return this._forEach(t=>t.dispose()),this._events.clear(),this}cancel(t){return this._forEach(e=>e.cancel(t)),this._state.cancel(this.toTicks(t)),this}_forEach(t){return this._events&&this._events.forEach(e=>{e instanceof v?e._forEach(t):t(e)}),this}_setAll(t,e){this._forEach(s=>{s[t]=e})}_tick(t,e){this.mute||this.callback(t,e)}_testLoopBoundries(t){this._loop&&(t.startOffset<this._loopStart||t.startOffset>=this._loopEnd)?t.cancel(0):t.state==="stopped"&&this._restartEvent(t)}get probability(){return this._probability}set probability(t){this._probability=t,this._setAll("probability",t)}get humanize(){return this._humanize}set humanize(t){this._humanize=t,this._setAll("humanize",t)}get loop(){return this._loop}set loop(t){this._loop=t,this._forEach(e=>{e.loopStart=this.loopStart,e.loopEnd=this.loopEnd,e.loop=t,this._testLoopBoundries(e)})}get loopEnd(){return new p(this.context,this._loopEnd).toSeconds()}set loopEnd(t){this._loopEnd=this.toTicks(t),this._loop&&this._forEach(e=>{e.loopEnd=t,this._testLoopBoundries(e)})}get loopStart(){return new p(this.context,this._loopStart).toSeconds()}set loopStart(t){this._loopStart=this.toTicks(t),this._loop&&this._forEach(e=>{e.loopStart=this.loopStart,this._testLoopBoundries(e)})}get playbackRate(){return this._playbackRate}set playbackRate(t){this._playbackRate=t,this._setAll("playbackRate",t)}get length(){return this._events.size}dispose(){return super.dispose(),this.clear(),this}}class T extends m{constructor(){super(E(T.getDefaults(),arguments,["callback","events","subdivision"])),this.name="Sequence",this._part=new v({callback:this._seqCallback.bind(this),context:this.context}),this._events=[],this._eventsArray=[];const t=E(T.getDefaults(),arguments,["callback","events","subdivision"]);this._subdivision=this.toTicks(t.subdivision),this.events=t.events,this.loop=t.loop,this.loopStart=t.loopStart,this.loopEnd=t.loopEnd,this.playbackRate=t.playbackRate,this.probability=t.probability,this.humanize=t.humanize,this.mute=t.mute,this.playbackRate=t.playbackRate}static getDefaults(){return Object.assign(F(m.getDefaults(),["value"]),{events:[],loop:!0,loopEnd:0,loopStart:0,subdivision:"8n"})}_seqCallback(t,e){e!==null&&this.callback(t,e)}get events(){return this._events}set events(t){this.clear(),this._eventsArray=t,this._events=this._createSequence(this._eventsArray),this._eventsUpdated()}start(t,e){return this._part.start(t,e&&this._indexTime(e)),this}stop(t){return this._part.stop(t),this}get subdivision(){return new p(this.context,this._subdivision).toSeconds()}_createSequence(t){return new Proxy(t,{get:(e,s)=>e[s],set:(e,s,i)=>(H(s)&&isFinite(parseInt(s,10))&&O(i)?e[s]=this._createSequence(i):e[s]=i,this._eventsUpdated(),!0)})}_eventsUpdated(){this._part.clear(),this._rescheduleSequence(this._eventsArray,this._subdivision,this.startOffset),this.loopEnd=this.loopEnd}_rescheduleSequence(t,e,s){t.forEach((i,n)=>{const a=n*e+s;if(O(i))this._rescheduleSequence(i,e/i.length,a);else{const r=new p(this.context,a,"i").toSeconds();this._part.add(r,i)}})}_indexTime(t){return new p(this.context,t*this._subdivision+this.startOffset).toSeconds()}clear(){return this._part.clear(),this}dispose(){return super.dispose(),this._part.dispose(),this}get loop(){return this._part.loop}set loop(t){this._part.loop=t}get loopStart(){return this._loopStart}set loopStart(t){this._loopStart=t,this._part.loopStart=this._indexTime(t)}get loopEnd(){return this._loopEnd}set loopEnd(t){this._loopEnd=t,t===0?this._part.loopEnd=this._indexTime(this._eventsArray.length):this._part.loopEnd=this._indexTime(t)}get startOffset(){return this._part.startOffset}set startOffset(t){this._part.startOffset=t}get playbackRate(){return this._part.playbackRate}set playbackRate(t){this._part.playbackRate=t}get probability(){return this._part.probability}set probability(t){this._part.probability=t}get progress(){return this._part.progress}get humanize(){return this._part.humanize}set humanize(t){this._part.humanize=t}get length(){return this._part.length}}const Z=(o,t,e)=>{if(!(e===void 0))return e;const i=t*o.hMargin,n=t*o.vMargin,a=i*2,r=n*(o.count+1),h=t-a,c=(t-r)/o.count,d=Array.from(Array(o.count),(u,f)=>{const b=i,l=n*(f+1)+c*f;return new S.Vector(b,l)}),_=d.map(()=>new S.Vector(h,c));return{coordinates:d,sizes:_}},B=(o,t,e)=>{const s=e===void 0,i=60/t.bpm,n=Array.from(Array(t.count),(d,_)=>`C${_}`),a=t.base.sustain*Math.pow(t.mod.release,t.count-1),r=n.map((d,_)=>{const u=t.base.attack*Math.pow(t.mod.attack,_),f=t.base.decay*Math.pow(t.mod.decay,_),b=t.base.sustain*Math.pow(t.mod.sustain,_),l=t.base.release*Math.pow(t.mod.release,_),g=i/(u+f+l),y=g<1?g:1,k=a<1?b:b/a;return{attack:x.constrain(u*y,0,2),decay:x.constrain(f*y,0,2),sustain:x.constrain(k,0,1),release:x.constrain(l*y,0,2)}}),h=t.currentSeqId===-1?0:t.currentSeqId,c=h+1>t.count-1?0:h+1;return!s&&o.isIdChanged&&(e.am.envelope.set(r[c]),console.log("setADSR")),{seq:n,adsrs:r,adsrLength:i}},q=(o,t,e,s)=>{const i=s===void 0,n=o.sizes[0],a=n.x*e.hExpand,r=d=>d/t.adsrLength*a;return{envs:(i?Array.from(Array(e.count),()=>({startPos:new S.Vector(0,n.y),attackedPos:new S.Vector(0,0),decayedPos:new S.Vector(0,0),sustainedPos:new S.Vector(0,0),endPos:new S.Vector(a,n.y)})):s.envs).map((d,_)=>{const u={...d},f=t.adsrs[_],b={attack:r(f.attack),decay:r(f.decay),sustain:n.y*f.sustain,release:r(f.release)};return u.attackedPos.x=b.attack,u.decayedPos.x=u.attackedPos.x+b.decay,u.decayedPos.y=n.y-b.sustain,u.sustainedPos.x=a-b.release,u.sustainedPos.y=n.y-b.sustain,u})}},D=(o,t,e,s)=>{const i=s===void 0,n=e.currentSeqId===-1?0:e.currentSeqId,a=n!==s?.preSeqId,r=(()=>i?0:a?t.toneSec:s.timeStamp)(),h=t.toneSec-r,c=h/o.adsrLength;return{isIdChanged:a,timeStamp:r,elapsedTime:h,progress:c,preSeqId:n}},tt=(o,t,e,s,i)=>{const n=i===void 0,a=e.currentSeqId===-1?0:e.currentSeqId,r=Array.from(Array(e.count),(l,g)=>g===a),h=n?o.sizes.map((l,g)=>{const y=o.sizes[g].x*e.rectWidth;return new S.Vector(y,l.y)}):i.rectSizes,c=n?r.map((l,g)=>{const y=Math.ceil(1/e.rectWidth);return Array.from(Array(y),(ct,V)=>{const C=h[g].x*V,L=0;return new S.Vector(C,L)})}):i.pointArrays,d=(()=>{const l=r.findIndex(k=>k===!0),g=o.sizes[l].x*t.progress,y=c[l].findIndex(k=>k.x<g&&g<k.x+h[l].x);return{arrayIndex:l,rectIndex:y}})(),_=n?!1:a===0&&i.preSeqId===e.count-1,u=x.map(s.getValue(),-200,0,0,o.sizes[0].y),f=n||_?c.map(l=>l.map(()=>0)):i.heightArrays.map((l,g)=>r[g]?l.map((y,k)=>i.currentRectId.rectIndex<k&&k<=d.rectIndex?u:y):l);return{isDraws:r,pointArrays:c,currentRectId:d,heightArrays:f,rectSizes:h,preSeqId:a}},et=()=>({count:4,hMargin:.06,vMargin:.04,hExpand:1,rectWidth:.015,bpm:32,currentSeqId:-1,pitch:"B4",base:{attack:.4,decay:.2,sustain:.6,release:.7},mod:{attack:.5,decay:.5,sustain:.5,release:.5}}),st=(o,t)=>{t.pages[1].addBinding(o,"hExpand",{step:1,min:1,max:10});const s=t.pages[2];s.addBinding(o,"bpm",{step:1,min:20,max:200}).on("change",i=>P.bpm.value=i.value/2),s.addBinding(o,"pitch",{view:"list",label:"pitch",options:[{text:"B0",value:"B0"},{text:"B1",value:"B1"},{text:"B2",value:"B2"},{text:"B3",value:"B3"},{text:"B4",value:"B4"},{text:"B5",value:"B5"},{text:"B6",value:"B6"},{text:"B7",value:"B7"}],value:"B4"}),s.addBinding(o.base,"attack",{label:"base_a",step:.01,min:.01,max:1}),s.addBinding(o.base,"decay",{label:"base_d",step:.01,min:.01,max:1}),s.addBinding(o.base,"sustain",{label:"base_s",step:.01,min:.01,max:1}),s.addBinding(o.base,"release",{label:"base_r",step:.01,min:.01,max:1}),s.addBinding(o.mod,"attack",{label:"mod_a",step:.1,min:.1,max:2}),s.addBinding(o.mod,"decay",{label:"mod_d",step:.1,min:.1,max:2}),s.addBinding(o.mod,"sustain",{label:"mod_s",step:.1,min:.1,max:2}),s.addBinding(o.mod,"release",{label:"mod_r",step:.1,min:.1,max:2})},it=()=>{const o=new X;return o.toDestination(),o},ot=o=>{const t=new Y;return o.connect(t),t},nt=(o,t,e)=>{const s=new T((i,n)=>{J.schedule(()=>{const r=e.currentSeqId+1,h=r>e.count-1||e.currentSeqId<0?0:r;e.currentSeqId=h,console.log(`note: ${n}, index: ${e.currentSeqId}, actualAttack: ${o.get().envelope.attack}`)},i),o.triggerAttackRelease(e.pitch,"32n",i)},t.seq);return s.loop=!0,P.bpm.value=e.bpm/2,s.start(0),s},at=async(o,t)=>{const e=await G(),s=it(),i=ot(s),n=nt(s,o,t);return{se:e,am:s,meter:i,toneSeq:n}},rt=(o,t,e,s,i)=>{o.coordinates.forEach((n,a)=>{const r=o.sizes[a].x,h=o.sizes[a].y;i.push(),i.translate(n.x,n.y),i.stroke(1),i.push(),i.noStroke(),i.fill(150,120),i.beginShape();const c=t.envs[a];i.vertex(c.startPos.x,c.startPos.y),i.vertex(c.attackedPos.x,c.attackedPos.y),i.vertex(c.decayedPos.x,c.decayedPos.y),i.vertex(c.sustainedPos.x,c.sustainedPos.y),i.vertex(c.endPos.x,c.endPos.y),i.endShape(),i.pop(),i.push(),i.noStroke();const d=e.pointArrays[a],_=e.heightArrays[a];d.forEach((u,f)=>{i.push(),i.fill(50,150);const b=h-_[f];i.rect(u.x,u.y+b,e.rectSizes[a].x,e.rectSizes[a].y-b),i.pop()}),i.pop(),i.push(),i.stroke(70,150),i.strokeWeight(s*.005),i.strokeCap(i.ROUND),i.line(0,h,r,h),i.pop(),i.pop()}),K(i,s)},_t=o=>{const t=x.setSize("sketch");let e=z.setController();const s=et();let i,n,a,r,h,c;o.setup=async()=>{i=Z(s,t),n=B(r,s),a=q(i,n,s),r=D(n,e,s),c=await at(n,s),o.createCanvas(t,t);const d=z.setGui(o,e,c.se,!0);st(s,d),o.noLoop()},o.draw=()=>{if(c===void 0){o.noLoop();return}o.frameCount%5===0&&Q({currentSeqId:s.currentSeqId},10),o.background(255),z.updateController(o,e),n=B(r,s,c),a=q(i,n,s,a),r=D(n,e,s,r),h=tt(i,r,s,c.meter,h),rt(i,a,h,t,o)}};export{_t as sketch};
