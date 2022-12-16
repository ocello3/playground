import * as Params from "../params";
import * as Seq from "../sound/sequence";
import * as Loop from "./loop";

export type type = {
  boxNumbers: number[];
};

export const get = (
  params: Params.type,
  seq: Seq.type,
  loop: Loop.type,
  pre?: type
) => {
  const isInit = pre === undefined;
  const boxNumbers: type["boxNumbers"] = loop.startPositions.map(
    (loopStartPosition, index) => {
      if (!isInit && !seq.loopIsSwitches[index]) return pre.boxNumbers[index];
      const diff = loopStartPosition.x - loop.endPositions[index].x;
      return Math.ceil(Math.abs(diff / params.boxSize.x));
    }
  );
  return {
    boxNumbers,
  };
};
