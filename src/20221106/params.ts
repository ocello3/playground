import { TabApi } from "tweakpane";

export const set = () => {
  const alignments = ["right", "right", "left", "left"];
  return {
    marginRate: 0.2,
    alignments,
    boxIntervalRate: 0.005,
    boxHeightRate: 0.5 / alignments.length,
    playbackRateMin: 0.3,
    playbackRateMax: 3.5,
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
