import { TabApi } from "tweakpane";

export const set = () => {
  return {
    light: {
      speed: 0.01,
      distRate: 4,
    },
    boader: {
      angle: 0.45,
    },
    object: {
      count: 10,
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
  const light = sketch.addFolder({
    title: "light",
  });
  light.addInput(params.light, "speed", { step: 0.001, min: 0.001, max: 0.1 });
  light.addInput(params.light, "distRate", { step: 0.1, min: 1, max: 1000 });
  const boader = sketch.addFolder({
    title: "boader",
  });
  boader.addInput(params.boader, "angle", { step: 0.01, min: 0.01, max: 1.1 });
  // synth
  const sound = tab.pages[2];
  sound.addInput(params, "maxVolume", { step: 1, min: -60, max: 0 });
};
