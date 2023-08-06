import { TabApi } from "tweakpane";

export const set = () => {
  return {
    // common
    count: 3,
    // sketch
    hMargin: 0.06,
    vMargin: 0.04,
    hExpand: 1,
    hRect: 0.01,
    // seq
    bpm: 40,
    currentSeqId: 0,
    // synth
    pitch: "B5",
    adsr: {
      attack: 0.2,
      decay: 0.1,
      sustain: 0.3,
      release: 0.3,
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
  sound.addInput(params.adsr, "release", { step: 0.01, min: 0.01, max: 1 });
};
