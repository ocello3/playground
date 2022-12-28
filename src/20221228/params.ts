import { TabApi } from "tweakpane";

export const set = () => {
  return {
    light: {
      speed: 0.01,
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
  // synth
  const sound = tab.pages[2];
  sound.addInput(params, "maxVolume", { step: 1, min: -60, max: 0 });
};
