import * as Params from "../params";

export type type = {
  seq: string[];
  adsrs: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  }[];
};

export const get = (params: Params.type, pre?: type): type => {
  const isInit = pre === undefined;
  if (!isInit) return pre;
  const seq = Array.from(Array(params.count), (_, index) => `C${index}`);
  const adsrs = seq.map((_, index) => {
    const attack = params.adsr.attack * Math.pow(0.5, index);
    const decay = params.adsr.decay;
    const sustain = params.adsr.sustain;
    const release = params.adsr.release;
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
  };
};
