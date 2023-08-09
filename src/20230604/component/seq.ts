import * as Params from "../params";
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
};

export const get = (params: Params.type, synth?: Synth.type): type => {
  const isInit = synth === undefined;
  const adsrLength = 60 / params.bpm;
  const seq = Array.from(Array(params.count), (_, index) => `C${index}`);
  const adsrs = seq.map((_, index) => {
    const attack = params.base.attack * Math.pow(params.mod.attack, index);
    const decay = params.base.decay * Math.pow(params.mod.decay, index);
    const sustain = params.base.sustain * Math.pow(params.mod.sustain, index);
    const release = params.base.release * Math.pow(params.mod.release, index);
    const shortenRate = adsrLength / (attack + decay + release);
    const correctedShortenRate = shortenRate < 1 ? shortenRate : 1;
    return {
      attack: attack * correctedShortenRate,
      decay: decay * correctedShortenRate,
      sustain: sustain * correctedShortenRate,
      release: release * correctedShortenRate,
    };
  });
  // update synth directly
  const id = params.currentSeqId === -1 ? 0 : params.currentSeqId;
  const nextId = id + 1 > params.count - 1 ? 0 : id + 1;
  if (!isInit) {
    synth.am.envelope.set(adsrs[nextId]);
  }
  return {
    seq,
    adsrs,
    adsrLength,
  };
};
