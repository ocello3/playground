import p5 from "p5";
import * as Params from "../params";
import * as Seq from "../sound/sequence";
import * as Loop from "./loop";

export type type = {
  boxSize: p5.Vector;
  boxNumbers: number[];
};

export const get = (
  params: Params.type,
  size: number,
  seq: Seq.type,
  loop: Loop.type,
  pre?: type
) => {
  const isInit = pre === undefined;
  const boxSize = new p5.Vector(
    size * params.boxIntervalRate,
    size * params.boxHeightRate
  );
  const boxNumbers: type["boxNumbers"] = loop.startPositions.map(
    (loopStartPosition, index) => {
      if (!isInit && !seq.loopIsSwitches[index]) return pre.boxNumbers[index];
      const diff = loopStartPosition.x - loop.endPositions[index].x;
      return Math.ceil(Math.abs(diff / boxSize.x));
    }
  );
  return {
    boxSize,
    boxNumbers,
  };
};
