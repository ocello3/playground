import{l as h,o as l,k as p,C as u,n as c,m as d,i as _,p as i,q as f}from"./tools-c877827f.js";class a extends h{constructor(){super(l(a.getDefaults(),arguments,["url","onload"])),this.name="GrainPlayer",this._loopStart=0,this._loopEnd=0,this._activeSources=[];const t=l(a.getDefaults(),arguments,["url","onload"]);this.buffer=new p({onload:t.onload,onerror:t.onerror,reverse:t.reverse,url:t.url}),this._clock=new u({context:this.context,callback:this._tick.bind(this),frequency:1/t.grainSize}),this._playbackRate=t.playbackRate,this._grainSize=t.grainSize,this._overlap=t.overlap,this.detune=t.detune,this.overlap=t.overlap,this.loop=t.loop,this.playbackRate=t.playbackRate,this.grainSize=t.grainSize,this.loopStart=t.loopStart,this.loopEnd=t.loopEnd,this.reverse=t.reverse,this._clock.on("stop",this._onstop.bind(this))}static getDefaults(){return Object.assign(h.getDefaults(),{onload:c,onerror:c,overlap:.1,grainSize:.2,playbackRate:1,detune:0,loop:!1,loopStart:0,loopEnd:0,reverse:!1})}_start(t,e,s){e=f(e,0),e=this.toSeconds(e),t=this.toSeconds(t);const r=1/this._clock.frequency.getValueAtTime(t);this._clock.start(t,e/r),s&&this.stop(t+this.toSeconds(s))}restart(t,e,s){return super.restart(t,e,s),this}_restart(t,e,s){this._stop(t),this._start(t,e,s)}_stop(t){this._clock.stop(t)}_onstop(t){this._activeSources.forEach(e=>{e.fadeOut=0,e.stop(t)}),this.onstop(this)}_tick(t){const e=this._clock.getTicksAtTime(t),s=e*this._grainSize;if(this.log("offset",s),!this.loop&&s>this.buffer.duration){this.stop(t);return}const r=s<this._overlap?0:this._overlap,o=new d({context:this.context,url:this.buffer,fadeIn:r,fadeOut:this._overlap,loop:this.loop,loopStart:this._loopStart,loopEnd:this._loopEnd,playbackRate:_(this.detune/100)}).connect(this.output);o.start(t,this._grainSize*e),o.stop(t+this._grainSize/this.playbackRate),this._activeSources.push(o),o.onended=()=>{const n=this._activeSources.indexOf(o);n!==-1&&this._activeSources.splice(n,1)}}get playbackRate(){return this._playbackRate}set playbackRate(t){i(t,.001),this._playbackRate=t,this.grainSize=this._grainSize}get loopStart(){return this._loopStart}set loopStart(t){this.buffer.loaded&&i(this.toSeconds(t),0,this.buffer.duration),this._loopStart=this.toSeconds(t)}get loopEnd(){return this._loopEnd}set loopEnd(t){this.buffer.loaded&&i(this.toSeconds(t),0,this.buffer.duration),this._loopEnd=this.toSeconds(t)}get reverse(){return this.buffer.reverse}set reverse(t){this.buffer.reverse=t}get grainSize(){return this._grainSize}set grainSize(t){this._grainSize=this.toSeconds(t),this._clock.frequency.setValueAtTime(this._playbackRate/this._grainSize,this.now())}get overlap(){return this._overlap}set overlap(t){const e=this.toSeconds(t);i(e,0),this._overlap=e}get loaded(){return this.buffer.loaded}dispose(){return super.dispose(),this.buffer.dispose(),this._clock.dispose(),this._activeSources.forEach(t=>t.dispose()),this}}export{a as G};
