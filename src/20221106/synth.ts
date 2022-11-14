import * as Tone from "tone";
import { ToneAudioBuffer } from "tone";
import { setSe } from "../util/controller";
import { TabApi } from "tweakpane";
import track_1 from "./track_1.mp3";
import track_2 from "./track_2.mp3";

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

const getBuffer = async (url: string) => {
  const buffer = new ToneAudioBuffer();
  await buffer.load(url);
  return buffer;
};

const getDurations = (buffer: ToneAudioBuffer) => {
  const duration = buffer.duration;
  return duration;
};

const setPlayer = (buffer: ToneAudioBuffer, duration: number) => {
  const player = new Tone.GrainPlayer(buffer).toDestination();
  player.volume.value = -5;
  player.loop = true;
  player.loopStart = 0;
  player.loopEnd = duration;
  return player;
};

export const setSynth = async () => {
  const se = await setSe();
  const buffers = [await getBuffer(track_1), await getBuffer(track_2)];
  const durations = [getDurations(buffers[0]), getDurations(buffers[1])];
  const players = [
    setPlayer(buffers[0], durations[0]),
    setPlayer(buffers[1], durations[1]),
  ];
  return {
    se,
    players,
    data: {
      durations,
    },
  };
};
const thisSynth = await setSynth();
export type synthType = typeof thisSynth;
export type synthDataType = typeof thisSynth.data;

const playSynth = (synth: synthType, params: paramsType) => {
  console.log(params);
  synth.players[0].start();
  synth.players[1].start();
  return;
};

export const synth = { setParams, setGui, setSynth, playSynth };
