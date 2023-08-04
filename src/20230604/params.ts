import { TabApi } from "tweakpane";

export const set = () => {
  return {
    // common
    count: 4,
    // sketch
    hMargin: 0.06,
    vMargin: 0.04,
    hExpand: 1,
    // synth
    maxVolume: -10,
    adsr: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 2.8,
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
  sound.addInput(params, "maxVolume", { step: 1, min: -60, max: 0 });
};
