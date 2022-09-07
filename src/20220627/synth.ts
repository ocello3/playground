import * as Tone from "tone";
import { TabApi } from "tweakpane";
import { paramsType as flooderParamsType } from "./flooder";
import { dataType as flooderDataType } from "./flooder";
import { tools } from "../util/tools";

const setParams = () => {
  return {
    maxVolume: -10,
    minVolume: -40,
    minPitch: -20,
    maxPitch: 20,
  };
};
const thisParams = setParams();
type paramsType = typeof thisParams;

const setGui = (params: paramsType, tab: TabApi) => {
  const _tab = tab.pages[2];
  _tab.addInput(params, "maxVolume", { step: 1, min: -60, max: 0 });
};

const setTapSampler = () => {
  const pitchShift = new Tone.PitchShift().toDestination();
  const tapSampler = new Tone.Sampler({
    urls: {
      A1: "../src/20220627/sound/toggle_on.wav",
      A2: "../src/20220627/sound/toggle_off.wav",
    },
  }).connect(pitchShift);
  return {
    pitchShift: pitchShift,
    tapSampler: tapSampler,
  };
};

const setSynth = () => {
  const tapSampler = setTapSampler();
  return { ...tapSampler };
};
const thisSynth = setSynth();
type synthType = typeof thisSynth;

const playSynth = (
  flooderData: flooderDataType,
  flooderParams: flooderParamsType,
  synthParams: paramsType,
  synth: synthType
) => {
  flooderData.flooders.forEach((flooder, index) => {
    if (flooder.isAttached) {
      const volume = tools.map(
        flooder.m,
        flooderParams.mMin,
        flooderParams.mMax,
        synthParams.maxVolume,
        synthParams.minVolume
      );
      const pitch = tools.map(
        flooderParams.mMax - flooder.m,
        flooderParams.mMin,
        flooderParams.mMax,
        synthParams.minPitch,
        synthParams.maxPitch
      );
      const sound = index % 2 === 0 ? "A1" : "A2";
      synth.pitchShift.pitch = pitch;
      synth.tapSampler.volume.value = volume;
      synth.tapSampler.triggerAttackRelease(sound, 0.1);
    }
  });
};

export const synth = { setParams, setGui, setSynth, playSynth };
