import { TabApi } from "tweakpane";

export const set = () => {
  return {
    euclid: {
      dividend: 79,
      divisor: 3,
      thr: 10,
    },
    rect: {
      canvasRate: 0.7,
      scale: 0.1, // * canvasSize * scale
    },
  };
};
const obj = set();
export type type = typeof obj;

export const gui = (params: type, tab: TabApi) => {
  // sketch
  const sketch = tab.pages[1];
  const euclid = sketch.addFolder({ title: "euclid" });
  euclid.addInput(params.euclid, "dividend", { step: 1, min: 2, max: 1000 });
  euclid.addInput(params.euclid, "divisor", { step: 1, min: 2, max: 1000 });
  euclid.addInput(params.euclid, "thr", { step: 1, min: 2, max: 20 });
  const rect = sketch.addFolder({ title: "rect" });
  rect.addInput(params.rect, "scale", { min: 0, max: 1 });
  // synth
  // const sound = tab.pages[2];
  // sound.addInput(params, "maxVolume", { step: 1, min: -60, max: 0 });
};
