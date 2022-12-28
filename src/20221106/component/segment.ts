import p5 from "p5";
import * as Params from "../params";
import * as Ctrl from "../sound/controller";
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
  ctrl: Ctrl.type,
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
      if (isInit || ctrl.loopIsSwitches[index]) {
        const diff = loopStartPosition.x - loop.endPositions[index].x;
        const count = Math.ceil(Math.abs(diff / size.x));
        return count < 1 ? 1 : count;
      }
      return pre.counts[index];
    }
  );
  const positionArrays: type["positionArrays"] = loop.startPositions.map(
    (startPosition, trackIndex) => {
      if (isInit || ctrl.loopIsSwitches[trackIndex])
        return Array.from(Array(counts[trackIndex]), (_, segmentIndex) => {
          const direction = ctrl.loopIsReverses[trackIndex] ? -1 : 1;
          const offset = new p5.Vector(size.x * direction * segmentIndex, 0);
          return p5.Vector.add(startPosition, offset);
        });
      return pre.positionArrays[trackIndex];
    }
  );
  const currentIndexes: type["currentIndexes"] = loop.progresses.map(
    (progress, trackIndex) => {
      if (
        isInit ||
        ctrl.loopIsSwitches[trackIndex] ||
        ctrl.loopIsOvers[trackIndex]
      )
        return 0;
      const preProgress = size.x * pre.currentIndexes[trackIndex];
      const diff = Math.abs(progress - preProgress);
      const addedIndexes = Math.floor(diff / size.x);
      const currentIndex = pre.currentIndexes[trackIndex] + addedIndexes;
      const maxIndex = positionArrays[trackIndex].length - 1;
      return currentIndex > maxIndex ? maxIndex : currentIndex;
    }
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
    positionArrays,
    currentIndexes,
    addedSegments,
  };
};
