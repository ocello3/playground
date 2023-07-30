import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Params from "../params";

export type type = {
  totalDuration: number;
  points: p5.Vector[];
};

export const get = (params: Params.type, size: number): type => {
  // const isInit = pre === undefined; // add "pre?: type"
  const adjustedSize = size * params.hExpand;
  const totalDuration =
    params.adsr.attack + params.adsr.decay + params.adsr.release;
  const p0 = new p5.Vector(0, size);
  const p1 = new p5.Vector(
    (params.adsr.attack / totalDuration) * adjustedSize,
    0
  );
  const p2 = new p5.Vector(
    p1.x + (params.adsr.decay / totalDuration) * adjustedSize,
    size - size * params.adsr.sustain
  );
  const p3 = new p5.Vector(
    adjustedSize - params.adsr.release / totalDuration,
    size
  );
  const p4 = new p5.Vector(adjustedSize, size);
  return {
    totalDuration,
    points: [p0, p1, p2, p3, p4],
  };
};
