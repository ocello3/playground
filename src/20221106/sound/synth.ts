import * as Tone from "tone";
import { ToneAudioBuffer } from "tone";
import { tools } from "../../util/tools";
import { setSe } from "../../util/controller";
import track_1 from "./track_1.mp3";
import track_2 from "./track_2.mp3";
import * as Ctrl from "./controller";
import * as SketchData from "./sketchData";
import * as Params from "../params";

const getBuffer = async (url: string) => {
  const buffer = new ToneAudioBuffer();
  await buffer.load(url);
  return buffer;
};

const getDurations = (buffer: ToneAudioBuffer) => {
  const duration = buffer.duration;
  return duration;
};

const setPlayer = (
  buffer: ToneAudioBuffer,
  duration: number,
  panner: Tone.Panner
) => {
  const player = new Tone.GrainPlayer(buffer).connect(panner);
  player.volume.value = -5;
  player.loop = true;
  player.loopStart = 0;
  player.grainSize = duration;
  return player;
};

const setAMSynth = (panner: Tone.Panner) => {
  const amSynth = new Tone.AMSynth();
  amSynth.connect(panner);
  return amSynth;
};

export const set = async () => {
  const se = await setSe();
  const buffers = [await getBuffer(track_1), await getBuffer(track_2)];
  const durations = [
    getDurations(buffers[0]),
    getDurations(buffers[1]),
    getDurations(buffers[0]),
    getDurations(buffers[1]),
  ];
  const panners = durations.map(() => new Tone.Panner().toDestination());
  panners.forEach((panner, index) => {
    panner.set({ pan: tools.map(index, 0, durations.length, -1, 1) });
  });
  const players = durations.map((duration, index) =>
    setPlayer(buffers[index % 2], duration, panners[index])
  );
  const amSynths = durations.map((_, index) => setAMSynth(panners[index]));
  return {
    se,
    panners,
    players,
    amSynths,
    data: {
      durations,
    },
  };
};
export const obj = await set();
export type type = typeof obj;

export const play = (
  synth: type,
  ctrl: Ctrl.type,
  sketchData: SketchData.type,
  params: Params.type,
  frameCount: number
) => {
  // play granular
  if (frameCount == 2) synth.players.forEach((player) => player.start());
  ctrl.loopRetentionFrames.forEach((loopRetentionFrame, index) => {
    synth.players[index].volume.value = sketchData.amplitudes[index];
    if (loopRetentionFrame === 0) {
      synth.panners[index].pan.value = sketchData.panValues[index];
      synth.players[index].reverse = ctrl.loopIsReverses[index];
      synth.players[index].loopStart = ctrl.loopStartTimes[index];
      synth.players[index].grainSize = ctrl.loopGrainSizes[index];
      synth.players[index].playbackRate = ctrl.playbackRates[index];
    }
  });
  // play amSynth
  ctrl.loopIsSwitches.forEach((loopIsSwitch, index) => {
    if (loopIsSwitch === true) {
      const volume = tools.map(
        ctrl.playbackRates[index],
        params.playbackRateMin,
        params.playbackRateMax,
        params.amSynthVolumeMin,
        params.amSynthVolumeMax
      );
      synth.amSynths[index].volume.value = volume;
      synth.amSynths[index].triggerAttackRelease(
        params.amSynthNote[index],
        "16n"
      );
    }
  });
  return;
};
