import{T as s,o as e}from"./tools.8ba16a64.js";class t extends s{constructor(){super(e(t.getDefaults(),arguments,["channels"])),this.name="Split";const n=e(t.getDefaults(),arguments,["channels"]);this._splitter=this.input=this.output=this.context.createChannelSplitter(n.channels),this._internalChannels=[this._splitter]}static getDefaults(){return Object.assign(s.getDefaults(),{channels:2})}dispose(){return super.dispose(),this._splitter.disconnect(),this}}export{t as S};
