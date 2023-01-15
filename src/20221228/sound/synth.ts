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
  const dist = new Tone.Distortion(0.8).connect(freeverb);
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

export const play = (
  synth: type,
  sketchData: SketchData.type,
  params: Params.type
) => {
  synth.freeverb.dampening = params.freeverb.dampening; // frequency
  synth.freeverb.roomSize.value = params.freeverb.roomSize; // 0 - 1
  synth.freeverb.wet.value = params.freeverb.wet; // 0 - 1
  synth.dist.distortion = params.dist.distortion; // 0 - 1
  synth.dist.wet.value = params.dist.wet; // 0 - 1
  synth.pans.forEach((pan, index) => (pan.pan.value = sketchData.pans[index]));
  synth.oscs.forEach((osc, index) => {
    osc.frequency.value = sketchData.freqs[index];
    osc.volume.value = sketchData.vols[index];
  });
  return;
};
