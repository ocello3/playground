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

export const get = (params: Params.type, pre?: type): type => {
  const isInit = pre === undefined;
  const adsrLength = 60 / params.bpm;
  const seq = Array.from(Array(params.count), (_, index) => `C${index}`);
  const adsrs = seq.map((_, index) => {
    const attack = params.adsr.attack * Math.pow(0.3, index);
    const decay = params.adsr.decay;
    const sustain = params.adsr.sustain;
    const release = params.adsr.release;
    const shortenRate = adsrLength / (attack + decay + release);
    const correctedShortenRate = shortenRate < 1 ? shortenRate : 1;
    return {
      attack: attack * correctedShortenRate,
      decay: decay * correctedShortenRate,
      sustain: sustain * correctedShortenRate,
      release: release * correctedShortenRate,
    };
  });
  // update params directly
  const preSeqId =
    params.currentSeqId === 0 ? params.count - 1 : params.currentSeqId - 1;
  params.currentAdsr = isInit ? params.adsr : adsrs[preSeqId];
  return {
    seq,
    adsrs,
    adsrLength,
  };
};
