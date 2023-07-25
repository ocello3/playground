import * as Tone from "tone";
import { setSe } from "../../util/controller";
import * as Params from "../params";

export type type = {
  se: Tone.Sampler;
  am: Tone.AMSynth;
  part: Tone.Part;
};

const setAms = (): Tone.AMSynth => new Tone.AMSynth().toDestination();

const setPart = (am: Tone.AMSynth): Tone.Part =>
  new Tone.Part(
    (time, note) => {
      am.triggerAttackRelease(note, "8n", time);
    },
    [
      [0, "C2"],
      ["0:2", "C3"],
      ["0:3:2", "G2"],
    ]
  ).start(0);
export const set = async (): Promise<type> => {
  const se = await setSe();
  const am = setAms();
  const part = setPart(am);
  return {
    se,
    am,
    part,
  };
};

export const play = (synth: type, params: Params.type) => {
  console.log(synth.se.get());
  console.log(params);
  return;
};
