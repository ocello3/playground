import { tools } from "../../util/tools";
import * as Params from "../params";
import * as Progress from "./progress";
import * as Synth from "../sound/synth";

export type type = {
  seq: string[];
  adsrLength: number;
  adsrs: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  }[];
  amParams: {
    harmonicity: number;
  }[];
};

export const get = (
  progress: Progress.type,
  params: Params.type,
  synth?: Synth.type
): type => {
  const isInit = synth === undefined;
  const adsrLength = 60 / params.bpm;
  const seq = Array.from(Array(params.count), (_, index) => `C${index}`);
  const maxVol =
    params.base.sustain * Math.pow(params.mod.release, params.count - 1);
  const adsrs = seq.map((_, index) => {
    const attack = params.base.attack * Math.pow(params.mod.attack, index);
    const decay = params.base.decay * Math.pow(params.mod.decay, index);
    const sustain = params.base.sustain * Math.pow(params.mod.sustain, index);
    const release = params.base.release * Math.pow(params.mod.release, index);
    const shortenRate = adsrLength / (attack + decay + release);
    const correctedShortenRate = shortenRate < 1 ? shortenRate : 1;
    const correctedSustain = maxVol < 1 ? sustain : sustain / maxVol;
    return {
      attack: tools.constrain(attack * correctedShortenRate, 0, 2),
      decay: tools.constrain(decay * correctedShortenRate, 0, 2),
      sustain: tools.constrain(correctedSustain, 0, 1),
      release: tools.constrain(release * correctedShortenRate, 0, 2),
    };
  });
  const amParams = seq.map((_, index) => {
    const harmonicity =
      params.base.harmonicity * Math.pow(params.mod.harmonicity, index);
    const constrainedHarmonicity = tools.constrain(harmonicity, 0.01, 2);
    return {
      harmonicity: constrainedHarmonicity,
    };
  });
  // update synth directly
  const id = params.currentSeqId === -1 ? 0 : params.currentSeqId;
  const nextId = id + 1 > params.count - 1 ? 0 : id + 1;
  if (!isInit && progress.isIdChanged) {
    synth.am.envelope.set(adsrs[nextId]);
    synth.am.harmonicity.value = amParams[nextId].harmonicity;
  }
  return {
    seq,
    adsrs,
    amParams,
    adsrLength,
  };
};
