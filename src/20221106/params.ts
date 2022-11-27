import { TabApi } from "tweakpane";

export const set = () => {
  const alignments = ["right", "right", "left", "left"];
  return {
    marginRate: 0.2,
    alignments,
    boxIntervalRate: 0.015,
    boxHeightRate: 0.5 / alignments.length,
    alphaMin: 20,
  };
};
export const obj = set();
export type type = typeof obj;

export const gui = (params: type, tab: TabApi) => {
  const _tab = tab.pages[1];
  _tab.addInput(params, "marginRate", { step: 0.1, min: 0.1, max: 1.0 });
};
