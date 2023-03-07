import { TabApi } from "tweakpane";

export const set = () => {
  return {
    // sketch
    circle: {
      baseRadiusRate: 0.3,
      centerXRate: 0.7,
      bpm: 40,
      sizeRate: 0.025,
    },
    cum: {
      distRate: 0.4,
    },
    // synth
    maxVolume: -10,
  };
};
const obj = set();
export type type = typeof obj;

export const gui = (params: type, tab: TabApi) => {
  // sketch
  const sketch = tab.pages[1];
  const circle = sketch.addFolder({ title: "circle" });
  circle.addInput(params.circle, "baseRadiusRate", {
    step: 0.1,
    min: 0.1,
    max: 1.0,
  });
  // synth
  const sound = tab.pages[2];
  sound.addInput(params, "maxVolume", { step: 1, min: -60, max: 0 });
};
