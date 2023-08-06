import p5 from "p5";
// import { tools } from "../../util/tools";
import * as InnerFrame from "./innerFrame";
import * as Seq from "./seq";
import * as Params from "../params";

export type type = {
  envs: {
    points: p5.Vector[];
  }[];
};

export const get = (
  innerFrame: InnerFrame.type,
  seq: Seq.type,
  params: Params.type
): type => {
  // const isInit = pre === undefined; // add "pre?: type"
  const size = innerFrame.sizes[0];
  const adjustedSize = size.x * params.hExpand;
  const envs = Array.from(Array(params.count), (_, index) => {
    const adsr = seq.adsrs[index];
    const startPos = new p5.Vector(0, size.y);
    const attackedPos = new p5.Vector(
      (adsr.attack / seq.adsrLength) * adjustedSize,
      0
    );
    const decayedPos = new p5.Vector(
      attackedPos.x + (adsr.decay / seq.adsrLength) * adjustedSize,
      size.y - size.y * adsr.sustain
    );
    const sustainedPos = new p5.Vector(
      adjustedSize - (adsr.release / seq.adsrLength) * adjustedSize,
      size.y - size.y * adsr.sustain
    );
    const endPos = new p5.Vector(adjustedSize, size.y);
    return {
      points: [startPos, attackedPos, decayedPos, sustainedPos, endPos],
    };
  });
  return { envs };
};
