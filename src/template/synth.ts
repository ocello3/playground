import * as Tone from "tone";
import { TabApi } from "tweakpane";
import { dataType as libDataType } from "./lib";

const setParams = () => {
  return {
    maxVolume: 0.7,
  };
};
const thisParams = setParams();
type paramsType = typeof thisParams;

const setGui = (params: paramsType, tab: TabApi) => {
  const _tab = tab.pages[2];
  _tab.addInput(params, "maxVolume", { step: 0.1, min: 0.3, max: 1.0 });
};

const setOcillatorArray = () => {
  return new Tone.AMOscillator(400, "sine", "square").toDestination();
};
