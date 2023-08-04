import p5 from "p5";
import * as InnerFrame from "./innerFrame";
import * as Progress from "./progress";
import * as Params from "../params";

export type type = {
  isDraws: boolean[];
  points: p5.Vector[];
  lengths: number[];
};

export const get = (
  innerFrame: InnerFrame.type,
  progress: Progress.type,
  params: Params.type
): type => {
  const isDraws = Array.from(
    Array(params.count),
    (_, index) => index === params.currentSeqId
  );
  const points = isDraws.map((isDraw, index) => {
    const xInc = isDraw ? innerFrame.sizes[index].x * progress.progress : 0;
    const x = xInc;
    const y = 0;
    return new p5.Vector(x, y);
  });
  const lengths = innerFrame.sizes.map((size) => size.y);
  return {
    isDraws,
    points,
    lengths,
  };
};
