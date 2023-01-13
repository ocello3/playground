import * as Tone from "tone";
import { setSe } from "../../util/controller";
import * as Params from "../params";
import * as SketchData from "./sketchData";

export type type = {
  se: Tone.Sampler;
  pans: Tone.Panner[];
  oscs: Tone.Oscillator[];
};

export const set = async (params: Params.type): Promise<type> => {
  const se = await setSe();
  const pans = Array.from(Array(params.object.count), () =>
    new Tone.Panner().toDestination()
  );
  const oscs = pans.map((pan) => new Tone.Oscillator().connect(pan).start());
  oscs.forEach((osc) => (osc.volume.value = -60));
  return {
    se,
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
