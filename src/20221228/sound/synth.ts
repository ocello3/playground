import * as Tone from "tone";
import { setSe } from "../../util/controller";
import * as Params from "../params";
import * as SketchData from "./sketchData";

export type type = {
  se: Tone.Sampler;
  freeverb: Tone.Freeverb;
  dist: Tone.Distortion;
  pans: Tone.Panner[];
  oscs: Tone.Oscillator[];
};

export const set = async (params: Params.type): Promise<type> => {
  const se = await setSe();
  const freeverb = new Tone.Freeverb().toDestination();
  freeverb.dampening = 1000; // frequency
  freeverb.roomSize.value = 0.8; // 0 - 1
  freeverb.wet.value = 0.8; // 0 - 1
  const dist = new Tone.Distortion().connect(freeverb);
  dist.distortion = 0.8; // 0 - 1
  dist.wet.value = 0.8; // 0 - 1
  const pans = Array.from(Array(params.object.count), () =>
    new Tone.Panner().connect(dist)
  );
  const oscs = pans.map((pan) => new Tone.Oscillator().connect(pan).start());
  Tone.Destination.mute = true;
  return {
    se,
    freeverb,
    dist,
    pans,
    oscs,
  };
};

export const play = (synth: type, sketchData: SketchData.type) => {
  synth.pans.forEach((pan, index) => (pan.pan.value = sketchData.pans[index]));
  synth.oscs.forEach((osc, index) => {
    osc.frequency.value = sketchData.freqs[index];
    osc.volume.value = sketchData.vols[index];
  });
  return;
};
