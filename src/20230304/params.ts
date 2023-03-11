import { TabApi } from "tweakpane";

export const set = () => {
  return {
    // sketch
    circle: {
      baseRadiusRate: 0.28,
      radiusReducRate: 0.0002,
      radiusIncreRate: 0.005,
      centerXRate: 0.65,
      bpm: 30,
      sizeRate: 0.02,
      trackArrayResolution: 80,
      rattlingProbability: 0.3,
    },
    cum: {
      distRate: 0.35,
      posesLength: 50,
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
  circle.addInput(params.circle, "trackArrayResolution", {
    step: 1,
    min: 1,
    max: 100,
  });
  circle.addInput(params.circle, "rattlingProbability", {
    min: 0,
    max: 0.5,
  });
  // synth
  const sound = tab.pages[2];
  sound.addInput(params, "maxVolume", { step: 1, min: -60, max: 0 });
};
