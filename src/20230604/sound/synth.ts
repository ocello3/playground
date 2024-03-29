import * as Tone from "tone";
import { setSe } from "../../util/controller";
import * as Params from "../params";
import * as Seq from "../component/seq";

export type type = {
  se: Tone.Sampler;
  am: Tone.AMSynth;
  meter: Tone.Meter;
  toneSeq: Tone.Sequence;
};

const setAm = (): Tone.AMSynth => {
  const am = new Tone.AMSynth();
  am.toDestination();
  return am;
};

const setMeter = (am: Tone.AMSynth): Tone.Meter => {
  const meter = new Tone.Meter();
  am.connect(meter);
  return meter;
};

const setToneSeq = (
  am: Tone.AMSynth,
  seq: Seq.type,
  params: Params.type
): Tone.Sequence => {
  const toneSeq = new Tone.Sequence((time) => {
    Tone.Draw.schedule(() => {
      // const index = seq.seq.indexOf(note);
      const inc = 1;
      const newIndex = params.currentSeqId + inc;
      const index =
        newIndex > params.count - 1 || params.currentSeqId < 0 ? 0 : newIndex;
      params.currentSeqId = index;
    }, time);
    am.triggerAttackRelease(params.pitch, "32n", time);
  }, seq.seq);
  toneSeq.loop = true;
  Tone.Transport.bpm.value = params.bpm / 2;
  toneSeq.start(0);
  return toneSeq;
};

export const set = async (
  seq: Seq.type,
  params: Params.type
): Promise<type> => {
  const se = await setSe();
  const am = setAm();
  const meter = setMeter(am);
  const toneSeq = setToneSeq(am, seq, params);
  return {
    se,
    am,
    meter,
    toneSeq,
  };
};

/*
export const play = (synth: type, params: Params.type, seq: Seq.type) => {
  if (params.isAdsrUpdate === true)
    synth.am.envelope.set(seq.adsrs[params.currentSeqId]);
  return;
};
*/
