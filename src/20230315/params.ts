import { TabApi } from "tweakpane";

export const set = () => {
  return {
    // sketch
    font: {
      str: "バタン",
      baseScaleRates: [0.08, 0.04, 0.05],
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
