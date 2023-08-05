import * as Params from "../params";

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

export const get = (params: Params.type): type => {
  const adsrLength = 60 / params.bpm;
  const seq = Array.from(Array(params.count), (_, index) => `C${index}`);
  const adsrs = seq.map((_, index) => {
    const attack = params.adsr.attack * Math.pow(0.3, index);
    const decay = params.adsr.decay;
    const sustain = params.adsr.sustain;
    const release = adsrLength - (attack + decay);
    return {
      attack,
      decay,
      sustain,
      release,
    };
  });
  return {
    seq,
    adsrs,
    adsrLength,
  };
};
