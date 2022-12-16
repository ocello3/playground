import p5 from "p5";
import * as Params from "../params";
import * as Seq from "../sound/sequence";
import * as Loop from "./loop";

export type type = {
  size: p5.Vector;
  counts: number[];
};

export const get = (
  params: Params.type,
  canvasSize: number,
  seq: Seq.type,
  loop: Loop.type,
  pre?: type
) => {
  const isInit = pre === undefined;
  const size = new p5.Vector(
    canvasSize * params.boxIntervalRate,
    canvasSize * params.boxHeightRate
  );
  const counts: type["counts"] = loop.startPositions.map(
    (loopStartPosition, index) => {
      if (!isInit && !seq.loopIsSwitches[index]) return pre.counts[index];
      const diff = loopStartPosition.x - loop.endPositions[index].x;
      return Math.ceil(Math.abs(diff / size.x));
    }
  );
  return {
    size,
    counts,
  };
};
