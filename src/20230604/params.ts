import { TabApi } from "tweakpane";

export const set = () => {
  return {
    // common
    count: 3,
    // sketch
    hMargin: 0.06,
    vMargin: 0.04,
    hExpand: 1,
    // seq
    bpm: 60,
    currentSeqId: 0,
    // synth
    pitch: "B5",
    adsr: {
      attack: 0.4,
      decay: 0.2,
      sustain: 0.5,
    },
  };
};
const obj = set();
export type type = typeof obj;

export const gui = (params: type, tab: TabApi) => {
  // sketch
  const sketch = tab.pages[1];
  sketch.addInput(params, "hExpand", { step: 1, min: 1, max: 10 });
  // synth
  const sound = tab.pages[2];
  sound.addInput(params.adsr, "attack", { step: 0.01, min: 0.01, max: 1 });
  sound.addInput(params.adsr, "decay", { step: 0.01, min: 0.01, max: 1 });
  sound.addInput(params.adsr, "sustain", { step: 0.01, min: 0.01, max: 1 });
};
