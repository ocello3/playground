import { TabApi } from "tweakpane";

export const set = () => {
  return {
    // sketch
    circle: {
      count: 3,
      baseRadiusRate: 0.28,
      radiusReducRate: 0.0002,
      radiusIncreRate: 0.005,
      centerXRate: 0.65,
      centerYRate: 0.2,
      bpm: 30,
      sizeRate: 0.015,
      trackArrayResolution: 85,
      rattlings: [
        { prob: 0.2, rattlingRate: 0.1 },
        { prob: 0.4, rattlingRate: 0.3 },
        { prob: 0.6, rattlingRate: 0.5 },
        { prob: 0.8, rattlingRate: 0.7 },
      ],
      color: {
        min: 0,
        max: 180,
      },
    },
    cum: {
      distRate: 0.35,
      posesLength: 85,
      rattlingSize: 1.5,
    },
    // synth
    circleOsc: [
      {
        volume: {
          base: -20,
          range: 8,
        },
        freq: {
          min: 100,
          max: 880,
        },
      },
      {
        volume: {
          base: -25,
          range: 7,
        },
        freq: {
          min: 80,
          max: 220,
        },
      },
      {
        volume: {
          base: -30,
          range: 6,
        },
        freq: {
          min: 660,
          max: 1600,
        },
      },
    ],
    cumNoise: [
      {
        volume: {
          min: -40,
          max: -20,
        },
      },
      {
        volume: {
          min: -45,
          max: -25,
        },
      },
      {
        volume: {
          min: -50,
          max: -30,
        },
      },
    ],
  };
};
const obj = set();
export type type = typeof obj;

export const gui = (params: type, tab: TabApi) => {
  // sketch
  const sketch = tab.pages[1];
  const circle = sketch.addFolder({ title: "circle" });
  circle.addBinding(params.circle, "baseRadiusRate", {
    step: 0.1,
    min: 0.1,
    max: 1.0,
  });
  circle.addBinding(params.circle, "trackArrayResolution", {
    step: 1,
    min: 1,
    max: 100,
  });
  // synth
  // const sound = tab.pages[2];
  // sound.addBinding(params, "maxVolume", { step: 1, min: -60, max: 0 });
};
