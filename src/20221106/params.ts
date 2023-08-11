import { TabApi } from "tweakpane";

export const set = () => {
  const alignments = ["right", "right", "left", "left"];
  const boxIntervalRate = 0.01;
  const boxHeightRate = 0.5 / alignments.length;
  return {
    // position
    marginRate: 0.2,
    loopRangeLineYPosRate: 1.1,
    alignments,
    boxIntervalRate,
    boxHeightRate,
    easingFMin: 0.05,
    easingFMax: 0.5,
    // controller
    // buffer
    playbackRateMin: 0.3,
    playbackRateMax: 3.5,
    loopRetentionFrameRateMin: 0.3,
    loopRetentionFrameRateMax: 2.5,
    // synth
    amSynthVolumeMin: -40,
    amSynthVolumeMax: -10,
    amSynthNote: ["G6", "D7", "C7", "E7"],
    granularVolumeMin: -15,
    granularVolumeMax: -3,
    // color
    hues: [357, 237],
    saturations: [68, 68],
    brightnesses: [80, 80],
    saturationRange: 15,
    brightnessRange: 65,
    // wave
    ampRateMin: 0.1,
    ampRateMax: 0.9,
    waveLengthRateMin: 0.01,
    waveLengthRateMax: 1,
    waveSpeedRateMin: 0.00001,
    waveSpeedRateMax: 0.0001,
  };
};
export const obj = set();
export type type = typeof obj;

export const gui = (params: type, tab: TabApi) => {
  const _tab = tab.pages[1];
  _tab.addBinding(params, "marginRate", { step: 0.1, min: 0.1, max: 1.0 });
};
