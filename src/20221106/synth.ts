import * as Tone from "tone";
import { ToneAudioBuffer } from "tone";
import { setSe } from "../util/controller";
import { TabApi } from "tweakpane";
import track_1 from "./track_1.mp3";

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

const setSampler = async () => {
  const track_1_buffer = new ToneAudioBuffer();
  await track_1_buffer.load(track_1);
  const sampler = new Tone.Sampler({
    urls: {
      A1: track_1_buffer,
    },
  }).toDestination();
  sampler.volume.value = -5;
  return sampler;
};

const setSynth = async () => {
  const se = await setSe();
  const sampler = await setSampler();
  return {
    se,
    sampler,
  };
};
const thisSynth = await setSynth();
export type synthType = typeof thisSynth;

const playSynth = (synth: synthType, params: paramsType) => {
  console.log(params);
  synth.sampler.triggerAttackRelease("A1", 1);
  return;
};

export const synth = { setParams, setGui, setSynth, playSynth };
