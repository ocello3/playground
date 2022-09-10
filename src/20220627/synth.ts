import * as Tone from "tone";
import { TabApi } from "tweakpane";
import { paramsType as flooderParamsType } from "./flooder";
import { dataType as flooderDataType } from "./flooder";
import { tools } from "../util/tools";

const setParams = () => {
  return {
    maxVolume: -15,
    minVolume: -40,
    grainMaxVolume: -23,
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
    instrument: tapSampler,
  };
};

const setGrainPlayer = () => {
  const grainPlayer = new Tone.GrainPlayer({
    url: "../src/20220627/sound/toggle_off.wav",
    loop: true,
    grainSize: 0.06,
    overlap: 0.1,
    playbackRate: 2.5,
    onload: () => {
      grainPlayer.volume.value = -60;
      grainPlayer.toDestination().start();
    },
  });
  return {
    source: grainPlayer,
  };
};

const setSynth = () => {
  const tapSampler = setTapSampler();
  const grainPlayer = setGrainPlayer();
  Tone.Destination.mute = true;
  return { tapSampler, grainPlayer };
};
const thisSynth = setSynth();
type synthType = typeof thisSynth;

const playTapSampler = (
  flooderData: flooderDataType,
  flooderParams: flooderParamsType,
  synthParams: paramsType,
  synth: synthType
) => {
  flooderData.flooders.forEach((flooder, index) => {
    if (flooder.isAttached) {
      // for tapSampler
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
      synth.tapSampler.pitchShift.pitch = pitch;
      synth.tapSampler.instrument.volume.value = volume;
      synth.tapSampler.instrument.triggerAttackRelease(sound, 0.1);
    }
  });
};

const playGrainPlayer = (
  flooderData: flooderDataType,
  synthParams: paramsType,
  synth: synthType
) => {
  const { progressRateInWater } = flooderData;
  const volume = tools.map(
    1 - progressRateInWater,
    0,
    1,
    -35,
    synthParams.grainMaxVolume
  );
  if (progressRateInWater === 0) {
    synth.grainPlayer.source.mute = true;
  } else {
    synth.grainPlayer.source.volume.value = volume;
  }
};

const playSynth = (
  flooderData: flooderDataType,
  flooderParams: flooderParamsType,
  synthParams: paramsType,
  synth: synthType
) => {
  playTapSampler(flooderData, flooderParams, synthParams, synth);
  playGrainPlayer(flooderData, synthParams, synth);
};

export const synth = { setParams, setGui, setSynth, playSynth };
