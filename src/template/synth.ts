import * as Tone from "tone";
import { TabApi } from "tweakpane";
import toggle_on from "../util/toggle_on.wav";
import toggle_off from "../util/toggle_off.wav";

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

const setSe = () => {
  const se = new Tone.Sampler({
    urls: {
      A1: toggle_on,
      A2: toggle_off,
    },
  }).toDestination();
  return se;
};

const setSynth = () => {
  return {
    se: setSe(),
  };
};
const thisSynth = setSynth();
type synthType = typeof thisSynth;

const playSynth = (synth: synthType, params: paramsType) => {
  console.log(synth.se.get());
  console.log(params);
  return;
};

export const synth = { setParams, setGui, setSynth, playSynth };
