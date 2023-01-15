import { TabApi } from "tweakpane";

export const set = () => {
  return {
    light: {
      speed: 0.005,
      shadowDistRate: 100,
      lightDistRate: 0.25,
    },
    boader: {
      speed: 0.001,
    },
    object: {
      count: 10,
      speed_min: 0.1,
      speed_max: 1,
      lengthRate_min: 0.1,
      lengthRate_max: 0.5,
    },
    shadow: {
      colorRate: 0.7,
      alpha: 35,
    },
    background: {
      shadowColor: 240,
      shadowAlpha: 220,
      lightColor: 100,
      lightAlpha: 255,
    },
    // synth
    synth: {
      volReducRate: 0.7,
      vol_min: -30,
      vol_max: -10,
      freq_min: 280,
      freq_max: 920,
    },
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
  light.addInput(params.light, "shadowDistRate", {
    step: 0.1,
    min: 1,
    max: 1000,
  });
  light.addInput(params.light, "lightDistRate", {
    step: 0.01,
    min: 0.01,
    max: 2,
  });
  const boader = sketch.addFolder({
    title: "boader",
  });
  boader.addInput(params.boader, "speed", { min: 0.0001, max: 0.01 });
  const object = sketch.addFolder({
    title: "object",
  });
  object.addInput(params.object, "speed_min", { min: 0.01, max: 1 });
  object.addInput(params.object, "speed_max", { min: 0.1, max: 10 });
  object.addInput(params.object, "lengthRate_min", { min: 0.01, max: 0.3 });
  object.addInput(params.object, "lengthRate_max", { min: 0.3, max: 1 });
  const shadow = sketch.addFolder({
    title: "shadow",
  });
  shadow.addInput(params.shadow, "alpha", { step: 1, min: 10, max: 250 });
  shadow.addInput(params.shadow, "colorRate", { step: 0.01, min: 0.1, max: 1 });
  // synth
  const sound = tab.pages[2];
  const synth = sound.addFolder({ title: "synth" });
  synth.addInput(params.synth, "volReducRate", {
    step: 0.1,
    min: 0.1,
    max: 10,
  });
  synth.addInput(params.synth, "vol_min", { step: 1, min: -60, max: -30 });
  synth.addInput(params.synth, "vol_max", { step: 1, min: -30, max: -0 });
  synth.addInput(params.synth, "freq_min", { step: 1, min: 30, max: 500 });
  synth.addInput(params.synth, "freq_max", { step: 1, min: 500, max: 1500 });
};
