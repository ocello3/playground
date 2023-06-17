import { TabApi } from "tweakpane";

export const set = () => {
  return {
    // sketch
    rate: 0.5,
    // synth
    maxVolume: -10,
  };
};
const obj = set();
export type type = typeof obj;

export const gui = (params: type, tab: TabApi) => {
  // sketch
  const sketch = tab.pages[1];
  sketch.addInput(params, "rate", { step: 0.1, min: 0.1, max: 1.0 });
  // synth
  const sound = tab.pages[2];
  sound.addInput(params, "maxVolume", { step: 1, min: -60, max: 0 });
};
