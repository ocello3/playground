import { TabApi } from "tweakpane";

export const set = () => {
  const alignments = ["right", "right", "left", "left"];
  return {
    // position
    marginRate: 0.2,
    alignments,
    boxIntervalRate: 0.005,
    boxHeightRate: 0.5 / alignments.length,
    easingFMin: 0.05,
    easingFMax: 0.5,
    // buffer
    playbackRateMin: 0.3,
    playbackRateMax: 3.5,
    loopRetentionFrameRateMin: 0.3,
    loopRetentionFrameRateMax: 2.5,
    // synth
    amSynthVolumeMin: -40,
    amSynthVolumeMax: -10,
    amSynthNote: ["G6", "D7", "C7", "E7"],
    // color
    hues: [357, 237],
    saturations: [68, 68],
    brightnesses: [80, 80],
    saturationRange: 15,
    brightnessRange: 65,
    loopRangeLineYPosRate: 0.65,
  };
};
export const obj = set();
export type type = typeof obj;

export const gui = (params: type, tab: TabApi) => {
  const _tab = tab.pages[1];
  _tab.addInput(params, "marginRate", { step: 0.1, min: 0.1, max: 1.0 });
};
