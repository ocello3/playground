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

const setADSR = (note: string, params: Params.type): void => {
  switch (note) {
    case "C4":
      params.adsr.attack = 0.1;
      break;
    default:
      params.adsr.attack *= 0.5;
  }
};

const setSeq = (am: Tone.AMSynth, params: Params.type): Tone.Sequence => {
  const seq = new Tone.Sequence(
    (time, note) => {
      setADSR(note, params);
      am.envelope.set(params.adsr);
      am.triggerAttackRelease("C5", 0.1, time);
    },
    ["C4", "B4", "F#4", "B4"]
  );
  seq.loop = true;
  seq.start(0);
  Tone.Transport.bpm.value = 42;
  return seq;
};
export const set = async (params: Params.type): Promise<type> => {
  const se = await setSe();
  const am = setAm();
  const seq = setSeq(am, params);
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
