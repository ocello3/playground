import * as Tone from "tone";
import { ToneAudioBuffer } from "tone";
import { tools } from "../util/tools";
import { setSe } from "../util/controller";
import track_1 from "./track_1.mp3";
import track_2 from "./track_2.mp3";
import * as Buffer from "./buffer";

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
  return {
    se,
    players,
    data: {
      durations,
    },
  };
};
export const obj = await set();
export type type = typeof obj;

export const play = (synth: type, buffer: Buffer.type, frameCount: number) => {
  if (frameCount == 2) synth.players.forEach((player) => player.start());
  buffer.loopRetentionFrames.forEach((loopRetentionFrame, index) => {
    if (loopRetentionFrame === 0) {
      synth.players[index].reverse = buffer.loopIsReverse[index];
      synth.players[index].loopStart = buffer.loopStartTimes[index];
      synth.players[index].grainSize = buffer.loopGrainSizes[index];
    }
  });
  return;
};
