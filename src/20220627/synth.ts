import * as Tone from "tone";
import { TabApi } from "tweakpane";
import { dataType as flooderDataType } from "./flooder";

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

const setTapSampler = () => {
  const tapSampler = new Tone.Sampler({
    urls: {
      A1: "../src/20220627/sound/toggle_on.wav",
      A2: "../src/20220627/sound/toggle_off.wav",
    },
  }).toDestination();
  return tapSampler;
};

const setSynth = () => {
  return {
    tapSampler: setTapSampler(),
  };
};
const thisSynth = setSynth();
type synthType = typeof thisSynth;

const playSynth = (flooderData: flooderDataType, synth: synthType) => {
  flooderData.flooders.forEach((flooder) => {
    if (flooder.isAttached) {
      synth.tapSampler.triggerAttackRelease("A1", 0.5);
    }
  });
};

export const synth = { setParams, setGui, setSynth, playSynth };
