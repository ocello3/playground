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
      volume_min: -25,
      volume_max: -5,
    },
    env: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.8,
      release: 0.8,
    },
    isUpdate: false,
  };
};
const obj = set();
export type type = typeof obj;

export const update = (params: type): void => {
  if (params.isUpdate === true) params.isUpdate = false;
};

export const gui = (params: type, tab: TabApi) => {
  // sketch
  const sketch = tab.pages[1];
  const euclid = sketch.addFolder({ title: "euclid" });
  euclid
    .addBinding(params.euclid, "dividend", { step: 1, min: 2, max: 1000 })
    .on("change", () => (params.isUpdate = true));
  euclid
    .addBinding(params.euclid, "divisor", { step: 1, min: 2, max: 1000 })
    .on("change", () => (params.isUpdate = true));
  euclid.addBinding(params.euclid, "thr", { step: 1, min: 2, max: 20 });
  euclid.addBinding(params, "isUpdate", { readonly: true });
  const rect = sketch.addFolder({ title: "rect" });
  rect.addBinding(params.rect, "h_min", { step: 1, min: 0, max: 255 });
  rect.addBinding(params.rect, "h_max", { step: 1, min: 0, max: 255 });
  rect.addBinding(params.rect, "s_min", { step: 1, min: 0, max: 255 });
  rect.addBinding(params.rect, "s_max", { step: 1, min: 0, max: 255 });
  rect.addBinding(params.rect, "b_min", { step: 1, min: 0, max: 255 });
  rect.addBinding(params.rect, "b_max", { step: 1, min: 0, max: 255 });
  // synth
  const sound = tab.pages[2];
  const synth = sound.addFolder({ title: "synth" });
  synth.addBinding(params.synth, "baseFreq", { step: 1, min: 100, max: 2000 });
  synth.addBinding(params.synth, "volume_min", { step: 1, min: -60, max: -20 });
  synth.addBinding(params.synth, "volume_max", { step: 1, min: -20, max: -5 });
  const env = sound.addFolder({ title: "env" });
  env.addBinding(params.env, "attack", { min: 0.1, max: 0.9 });
  env.addBinding(params.env, "decay", { min: 0.1, max: 0.9 });
  env.addBinding(params.env, "sustain", { min: 0.1, max: 0.9 });
  env.addBinding(params.env, "release", { min: 0.1, max: 0.9 });
};
