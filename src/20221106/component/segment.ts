import p5 from "p5";
import * as Params from "../params";
import * as Seq from "../sound/sequence";
import * as Loop from "./loop";

export type type = {
  size: p5.Vector;
  counts: number[];
  positionArrays: p5.Vector[][];
  currentIndexes: number[];
  addedSegments: number[];
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
  const positionArrays: type["positionArrays"] = loop.currentPositions.map(
    (currentPosition, trackIndex) => {
      // reset for new loop
      if (
        pre === undefined ||
        seq.loopIsSwitches[trackIndex] ||
        seq.loopIsOvers[trackIndex]
      ) {
        const offset = new p5.Vector().set(0, size.y * -0.5);
        return [p5.Vector.add(loop.startPositions[trackIndex], offset)];
      }
      // add new position at last of array
      const preBoxLAPositionArray = pre.positionArrays[trackIndex];
      const direction = seq.loopIsReverses[trackIndex] ? -1 : 1;
      const lastPosition =
        preBoxLAPositionArray[preBoxLAPositionArray.length - 1];
      const diff = Math.abs(currentPosition.x - lastPosition.x);
      const addedBoxNumber = Math.round(diff / size.x);
      if (addedBoxNumber === 0) return preBoxLAPositionArray;
      const addedBoxPositions = Array.from(
        Array(addedBoxNumber),
        (_, index) => {
          const progress = new p5.Vector(size.x * (index + 1) * direction, 0);
          return p5.Vector.add(lastPosition, progress);
        }
      );
      return preBoxLAPositionArray.concat(addedBoxPositions);
    }
  );
  const currentIndexes: type["currentIndexes"] = positionArrays.map(
    (boxLAPositionArray) => boxLAPositionArray.length - 1
  );
  const addedSegments: type["addedSegments"] = currentIndexes.map(
    (currentBoxIndex, trackIndex) => {
      if (isInit) return 0;
      return currentBoxIndex - pre.currentIndexes[trackIndex];
    }
  );
  return {
    size,
    counts,
    positionArrays: positionArrays,
    currentIndexes,
    addedSegments,
  };
};
