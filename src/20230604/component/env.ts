import p5 from "p5";
import * as InnerFrame from "./innerFrame";
import * as Seq from "./seq";
import * as Params from "../params";

export type type = {
  envs: {
    startPos: p5.Vector;
    attackedPos: p5.Vector;
    decayedPos: p5.Vector;
    sustainedPos: p5.Vector;
    endPos: p5.Vector;
  }[];
};

export const get = (
  innerFrame: InnerFrame.type,
  seq: Seq.type,
  params: Params.type,
  pre?: type
): type => {
  const isInit = pre === undefined; // add "pre?: type"
  const size = innerFrame.sizes[0];
  const adjustedSize = size.x * params.hExpand;
  const resize = (rate: number): number =>
    (rate / seq.adsrLength) * adjustedSize;
  const baseEnvs = isInit
    ? Array.from(Array(params.count), () => {
        return {
          startPos: new p5.Vector(0, size.y),
          attackedPos: new p5.Vector(0, 0), // tmp for x
          decayedPos: new p5.Vector(0, 0), // tmp
          sustainedPos: new p5.Vector(0, 0), // tmp
          endPos: new p5.Vector(adjustedSize, size.y),
        };
      })
    : pre.envs;
  const envs = baseEnvs.map((baseEnv, index) => {
    const updateEnv = { ...baseEnv };
    const adsr = seq.adsrs[index];
    const adsrSize = {
      attack: resize(adsr.attack),
      decay: resize(adsr.decay),
      sustain: size.y * adsr.sustain,
      release: resize(adsr.release),
    };
    updateEnv.attackedPos.x = adsrSize.attack;
    updateEnv.decayedPos.x = updateEnv.attackedPos.x + adsrSize.decay;
    updateEnv.decayedPos.y = size.y - adsrSize.sustain;
    updateEnv.sustainedPos.x = adjustedSize - adsrSize.release;
    updateEnv.sustainedPos.y = size.y - adsrSize.sustain;
    return updateEnv;
  });
  return { envs };
};
