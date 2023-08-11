import { TabApi } from "tweakpane";
import * as Tone from "tone";

export const set = () => {
  return {
    // common
    count: 4,
    // sketch
    hMargin: 0.06,
    vMargin: 0.04,
    hExpand: 1,
    rectWidth: 0.015,
    // seq
    bpm: 32,
    currentSeqId: -1,
    // synth
    pitch: "B4",
    base: {
      attack: 0.4,
      decay: 0.2,
      sustain: 0.6,
      release: 0.7,
    },
    mod: {
      attack: 0.5,
      decay: 0.5,
      sustain: 0.5,
      release: 0.5,
    },
  };
};
const obj = set();
export type type = typeof obj;

export const gui = (params: type, tab: TabApi) => {
  // sketch
  const sketch = tab.pages[1];
  sketch.addInput(params, "hExpand", { step: 1, min: 1, max: 10 });
  // synth
  const sound = tab.pages[2];
  sound
    .addInput(params, "bpm", { step: 1, min: 20, max: 200 })
    .on("change", (env) => (Tone.Transport.bpm.value = env.value / 2));
  sound.addInput(params.base, "attack", {
    label: "base_a",
    step: 0.01,
    min: 0.01,
    max: 1,
  });
  sound.addInput(params.base, "decay", {
    label: "base_d",
    step: 0.01,
    min: 0.01,
    max: 1,
  });
  sound.addInput(params.base, "sustain", {
    label: "base_s",
    step: 0.01,
    min: 0.01,
    max: 1,
  });
  sound.addInput(params.base, "release", {
    label: "base_r",
    step: 0.01,
    min: 0.01,
    max: 1,
  });
  sound.addInput(params.mod, "attack", {
    label: "mod_a",
    step: 0.1,
    min: 0.1,
    max: 2,
  });
  sound.addInput(params.mod, "decay", {
    label: "mod_d",
    step: 0.1,
    min: 0.1,
    max: 2,
  });
  sound.addInput(params.mod, "sustain", {
    label: "mod_s",
    step: 0.1,
    min: 0.1,
    max: 2,
  });
  sound.addInput(params.mod, "release", {
    label: "mod_r",
    step: 0.1,
    min: 0.1,
    max: 2,
  });
};
