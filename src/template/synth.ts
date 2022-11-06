import * as Tone from "tone";
import { setSe } from "../util/controller";
import { TabApi } from "tweakpane";

const setParams = () => {
  return {
    maxVolume: -10,
  };
};
const thisParams = setParams();
type paramsType = typeof thisParams;

const setGui = (params: paramsType, tab: TabApi) => {
  const _tab = tab.pages[2];
  _tab.addInput(params, "maxVolume", { step: 1, min: -60, max: 0 });
};

const setSynth = async () => {
  const se = await setSe();
  console.log(Tone.Destination.get());
  return {
    se,
  };
};
const thisSynth = await setSynth();
export type synthType = typeof thisSynth;

const playSynth = (synth: synthType, params: paramsType) => {
  console.log(synth.se.get());
  console.log(params);
  return;
};

export const synth = { setParams, setGui, setSynth, playSynth };
