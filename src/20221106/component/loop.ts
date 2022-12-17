import p5 from "p5";
import * as Params from "../params";
import * as Ctrl from "../sound/controller";
import * as SynthData from "../sound/synthData";
import * as Buffer from "./buffer";
import { tools } from "../../util/tools";

export type type = {
  startPositions: p5.Vector[];
  startCurrentPositions: p5.Vector[];
  endPositions: p5.Vector[];
  endCurrentPositions: p5.Vector[];
  progresses: number[];
  currentPositions: p5.Vector[];
};

export const get = (
  params: Params.type,
  canvasSize: number,
  ctrl: Ctrl.type,
  synthData: SynthData.type,
  buffer: Buffer.type,
  pre?: type
) => {
  const isInit = pre === undefined;
  const startPositions: type["startPositions"] = (() => {
    if (isInit) return buffer.startPositions;
    return pre.startPositions.map((preLoopStartPosition, index) => {
      if (!ctrl.loopIsSwitches[index]) return preLoopStartPosition;
      const newLoopStartPosition = preLoopStartPosition.copy();
      const positionRate =
        ctrl.loopStartTimes[index] / synthData.durations[index];
      const loopStartPosition = buffer.fullLengths[index] * positionRate;
      const x = loopStartPosition + buffer.margins[index].x;
      newLoopStartPosition.x = x;
      return newLoopStartPosition;
    });
  })();
  const startCurrentPositions: type["startCurrentPositions"] = (() => {
    if (isInit) return startPositions;
    return pre.startCurrentPositions.map(
      (preLoopStartCurrentPosition, index) => {
        const loopStartTargetPosition = startPositions[index];
        const diff = loopStartTargetPosition.x - preLoopStartCurrentPosition.x;
        if (Math.abs(diff) < 1) return loopStartTargetPosition;
        const easingF = tools.map(
          ctrl.playbackRates[index],
          params.playbackRateMin,
          params.playbackRateMax,
          params.easingFMin,
          params.easingFMax
        );
        const progress = new p5.Vector(diff * easingF, 0);
        return p5.Vector.add(preLoopStartCurrentPosition, progress);
      }
    );
  })();
  const endPositions: type["endPositions"] = (() => {
    if (isInit) return buffer.endPositions;
    return pre.endPositions.map((preLoopEndPosition, index) => {
      if (!ctrl.loopIsSwitches[index]) return preLoopEndPosition;
      const newLoopEndPosition = preLoopEndPosition.copy();
      const positionRate =
        ctrl.loopEndTimes[index] / synthData.durations[index];
      const loopEndPosition = buffer.fullLengths[index] * positionRate;
      const x = loopEndPosition + buffer.margins[index].x;
      newLoopEndPosition.x = x;
      return newLoopEndPosition;
    });
  })();
  const endCurrentPositions: type["endCurrentPositions"] = (() => {
    if (isInit) return endPositions;
    return pre.endCurrentPositions.map((preLoopEndCurrentPosition, index) => {
      const loopEndTargetPosition = endPositions[index];
      const diff = loopEndTargetPosition.x - preLoopEndCurrentPosition.x;
      if (Math.abs(diff) < 1) return loopEndTargetPosition;
      const easingF = tools.map(
        ctrl.playbackRates[index],
        params.playbackRateMin,
        params.playbackRateMax,
        params.easingFMin,
        params.easingFMax
      );
      const progress = new p5.Vector(diff * easingF, 0);
      return p5.Vector.add(preLoopEndCurrentPosition, progress);
    });
  })();
  const progresses: type["progresses"] = startPositions.map(
    (startPosition, trackIndex) => {
      if (isInit) return 0;
      const loopLength: number = Math.abs(
        endPositions[trackIndex].x - startPosition.x
      );
      return loopLength * ctrl.loopProgressRates[trackIndex];
    }
  );
  const currentPositions: type["currentPositions"] = (() => {
    if (isInit)
      return synthData.durations.map((_, index) => {
        // for 4th buffer, fit to right end
        const x = buffer.margins[index].x;
        const y = (canvasSize / (synthData.durations.length + 1)) * (index + 1);
        return new p5.Vector(x, y);
      });
    return pre.currentPositions.map((preCurrentPosition, index) => {
      if (ctrl.loopIsReverses[index]) {
        preCurrentPosition.x = startPositions[index].x - progresses[index];
        return preCurrentPosition;
      } else {
        preCurrentPosition.x = startPositions[index].x + progresses[index];
        return preCurrentPosition;
      }
    });
  })();
  return {
    startPositions,
    startCurrentPositions,
    endPositions,
    endCurrentPositions,
    progresses,
    currentPositions,
  };
};
