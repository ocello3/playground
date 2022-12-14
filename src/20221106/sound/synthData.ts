import * as Tone from "tone";
import * as Synth from "./synth";

export type type = {
  durations: number[];
  volumes: Tone.Meter[];
};

export const get = (synth: Synth.type) => {
  const durations = synth.data.durations;
  const volumes = durations.map(() => new Tone.Meter());
  synth.players.forEach((player, index) => player.connect(volumes[index]));
  return {
    durations,
    volumes,
  };
};
