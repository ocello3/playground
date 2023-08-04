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
    const p0 = new p5.Vector(0, size.y);
    const p1 = new p5.Vector(
      (adsr.attack / seq.adsrLengths[index]) * adjustedSize,
      0
    );
    const p2 = new p5.Vector(
      p1.x + (adsr.decay / seq.adsrLengths[index]) * adjustedSize,
      size.y - size.y * adsr.sustain
    );
    const p3 = new p5.Vector(
      adjustedSize - adsr.release / seq.adsrLengths[index],
      size.y
    );
    const p4 = new p5.Vector(adjustedSize, size.y);
    return {
      points: [p0, p1, p2, p3, p4],
    };
  });
  return { envs };
};
