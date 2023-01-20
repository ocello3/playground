import { TabApi } from "tweakpane";

export const set = () => {
  return {
    euclid: {
      dividend: 37,
      divisor: 27,
      thr: 10,
    },
    rect: {
      h_min: 190,
      h_max: 220,
      s_min: 15,
      s_max: 35,
      b_min: 40,
      b_max: 80,
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
  rect.addInput(params.rect, "h_min", { step: 1, min: 0, max: 255 });
  rect.addInput(params.rect, "h_max", { step: 1, min: 0, max: 255 });
  rect.addInput(params.rect, "s_min", { step: 1, min: 0, max: 255 });
  rect.addInput(params.rect, "s_max", { step: 1, min: 0, max: 255 });
  rect.addInput(params.rect, "b_min", { step: 1, min: 0, max: 255 });
  rect.addInput(params.rect, "b_max", { step: 1, min: 0, max: 255 });
  // synth
  // const sound = tab.pages[2];
  // sound.addInput(params, "maxVolume", { step: 1, min: -60, max: 0 });
};
