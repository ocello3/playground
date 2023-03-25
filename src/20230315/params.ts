import { TabApi } from "tweakpane";

export const set = () => {
  return {
    // sketch
    font: {
      count: 4,
      str: "バタン",
      baseScaleRates: [0.08, 0.04, 0.05],
      rate_1: {
        waiting: { min: 15, max: 25 },
        sustain_1: { min: 1, max: 3 },
        sustain_2: { min: 25, max: 35 },
        min: 0.1,
        max: 1,
        base: 0.333,
      },
    },
    // synth
    maxVolume: -10,
  };
};
const obj = set();
export type type = typeof obj;

export const gui = (params: type, tab: TabApi) => {
  // sketch
  // const sketch = tab.pages[1];
  // synth
  const sound = tab.pages[2];
  sound.addInput(params, "maxVolume", { step: 1, min: -60, max: 0 });
};
