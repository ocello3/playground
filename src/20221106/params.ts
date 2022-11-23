import { TabApi } from "tweakpane";

export const set = () => {
  return {
    marginRate: 0.2,
    alignments: ["right", "right", "left", "left"],
  };
};
export const obj = set();
export type type = typeof obj;

export const gui = (params: type, tab: TabApi) => {
  const _tab = tab.pages[1];
  _tab.addInput(params, "marginRate", { step: 0.1, min: 0.1, max: 1.0 });
};
