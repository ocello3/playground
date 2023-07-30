import * as Tone from "tone";
import { setSe } from "../../util/controller";
import * as Params from "../params";

export type type = {
  se: Tone.Sampler;
  am: Tone.AMSynth;
  seq: Tone.Sequence;
};

const setAm = (): Tone.AMSynth => {
  const am = new Tone.AMSynth();
  am.toDestination();
  return am;
};

const setSeq = (am: Tone.AMSynth): Tone.Sequence => {
  const seq = new Tone.Sequence(
    (time, note) => {
      const adsr = {
        attack: 0.1,
        decay: 0.2,
        sustain: 1.0,
        release: 0.8,
      };
      am.envelope.set(adsr);
      am.triggerAttackRelease(note, 0.1, time);
    },
    ["C4", "B4", "F#4", "B4"]
  );
  seq.loop = true;
  seq.start(0);
  Tone.Transport.bpm.value = 72;
  return seq;
};
export const set = async (): Promise<type> => {
  const se = await setSe();
  const am = setAm();
  const seq = setSeq(am);
  return {
    se,
    am,
    seq,
  };
};

export const play = (synth: type, params: Params.type) => {
  console.log(synth.se.get());
  console.log(params);
  return;
};
