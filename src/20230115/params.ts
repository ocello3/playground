import { TabApi } from "tweakpane";

export const set = () => {
  return {
    euclid: {
      dividend: 79,
      divisor: 3,
      thr: 10,
    },
  };
};
const obj = set();
export type type = typeof obj;

export const gui = (params: type, tab: TabApi) => {
  // sketch
  const sketch = tab.pages[1];
  sketch.addInput(params.euclid, "dividend", { step: 1, min: 2, max: 1000 });
  sketch.addInput(params.euclid, "divisor", { step: 1, min: 2, max: 1000 });
  sketch.addInput(params.euclid, "thr", { step: 1, min: 2, max: 20 });
  // synth
  // const sound = tab.pages[2];
  // sound.addInput(params, "maxVolume", { step: 1, min: -60, max: 0 });
};
