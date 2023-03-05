import * as Tone from "tone";
import { setSe } from "../../util/controller";
import * as Params from "../params";

export type type = {
  se: Tone.Sampler;
};

export const set = async () => {
  const se = await setSe();
  console.log(Tone.Destination.get());
  return {
    se,
  };
};

export const play = (synth: type, params: Params.type) => {
  console.log(synth.se.get());
  console.log(params);
  return;
};
