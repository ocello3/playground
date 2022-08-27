import * as Tone from "tone";
import { TabApi } from "tweakpane";
import { dataType as libDataType } from "./lib";
import { tools } from "../util/tools";

const setParams = () => {
  return {
    maxVolume: -5,
  };
};
const thisParams = setParams();
type paramsType = typeof thisParams;

const setGui = (params: paramsType, tab: TabApi) => {
  const _tab = tab.pages[2];
  _tab.addInput(params, "maxVolume", { step: 1, min: -60, max: 0 });
};

const setOcillator = () => {
  const oscillator = new Tone.AMOscillator(
    400,
    "sine",
    "square"
  ).toDestination();
  oscillator.volume.value = -60;
  oscillator.start(0);
  Tone.Destination.mute = true;
  return oscillator;
};

const setSynth = () => {
  return {
    oscillator: setOcillator(),
  };
};
const thisSynth = setSynth();
type synthType = typeof thisSynth;

const playSynth = (
  libData: libDataType,
  synth: synthType,
  params: paramsType,
  size: number
) => {
  const volume = tools.map(
    libData.radius,
    0,
    size * 0.5,
    -30,
    params.maxVolume
  );
  const freq = tools.map(libData.radius, 0, size * 0.5, 100, 600);
  synth.oscillator.volume.value = volume;
  synth.oscillator.frequency.value = freq;
};

export const synth = { setParams, setGui, setSynth, playSynth };
