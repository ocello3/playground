import{Y as n,o,Z as a,S as r,M as p,G as m,r as g,U as t,p as l,_ as u,T as c,$ as h,A as _}from"./tools-380870f1.js";class s extends n{constructor(){super(o(s.getDefaults(),arguments)),this.name="ModulationSynth";const e=o(s.getDefaults(),arguments);this._carrier=new a({context:this.context,oscillator:e.oscillator,envelope:e.envelope,onsilence:()=>this.onsilence(this),volume:-10}),this._modulator=new a({context:this.context,oscillator:e.modulation,envelope:e.modulationEnvelope,volume:-10}),this.oscillator=this._carrier.oscillator,this.envelope=this._carrier.envelope,this.modulation=this._modulator.oscillator,this.modulationEnvelope=this._modulator.envelope,this.frequency=new r({context:this.context,units:"frequency"}),this.detune=new r({context:this.context,value:e.detune,units:"cents"}),this.harmonicity=new p({context:this.context,value:e.harmonicity,minValue:0}),this._modulationNode=new m({context:this.context,gain:0}),g(this,["frequency","harmonicity","oscillator","envelope","modulation","modulationEnvelope","detune"])}static getDefaults(){return Object.assign(n.getDefaults(),{harmonicity:3,oscillator:Object.assign(t(u.getDefaults(),[...Object.keys(l.getDefaults()),"frequency","detune"]),{type:"sine"}),envelope:Object.assign(t(h.getDefaults(),Object.keys(c.getDefaults())),{attack:.01,decay:.01,sustain:1,release:.5}),modulation:Object.assign(t(u.getDefaults(),[...Object.keys(l.getDefaults()),"frequency","detune"]),{type:"square"}),modulationEnvelope:Object.assign(t(h.getDefaults(),Object.keys(c.getDefaults())),{attack:.5,decay:0,sustain:1,release:.5})})}_triggerEnvelopeAttack(e,i){this._carrier._triggerEnvelopeAttack(e,i),this._modulator._triggerEnvelopeAttack(e,i)}_triggerEnvelopeRelease(e){return this._carrier._triggerEnvelopeRelease(e),this._modulator._triggerEnvelopeRelease(e),this}getLevelAtTime(e){return e=this.toSeconds(e),this.envelope.getValueAtTime(e)}dispose(){return super.dispose(),this._carrier.dispose(),this._modulator.dispose(),this.frequency.dispose(),this.detune.dispose(),this.harmonicity.dispose(),this._modulationNode.dispose(),this}}class d extends s{constructor(){super(o(d.getDefaults(),arguments)),this.name="AMSynth",this._modulationScale=new _({context:this.context}),this.frequency.connect(this._carrier.frequency),this.frequency.chain(this.harmonicity,this._modulator.frequency),this.detune.fan(this._carrier.detune,this._modulator.detune),this._modulator.chain(this._modulationScale,this._modulationNode.gain),this._carrier.chain(this._modulationNode,this.output)}dispose(){return super.dispose(),this._modulationScale.dispose(),this}}export{d as A};
