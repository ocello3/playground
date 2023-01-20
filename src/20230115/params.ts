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
    synth: {
      count: 15,
      baseFreq: 1000,
      volume_min: -30,
      volume_max: -10,
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
  const sound = tab.pages[2];
  sound.addInput(params.synth, "baseFreq", { step: 1, min: 100, max: 2000 });
  sound.addInput(params.synth, "volume_min", { step: 1, min: -60, max: -20 });
  sound.addInput(params.synth, "volume_max", { step: 1, min: -20, max: -5 });
};
