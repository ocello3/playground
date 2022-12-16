import p5 from "p5";
import * as Ctrl from "../sound/controller";
import * as SynthData from "../sound/synthData";
import * as Params from "../params";

export type type = {
  bufferConvertRateToLength: number;
  fullLengths: number[];
  margins: number[];
  startPositions: p5.Vector[];
  endPositions: p5.Vector[];
};

export const get = (
  ctrl: Ctrl.type,
  params: Params.type,
  canvasSize: number,
  synthData: SynthData.type,
  pre?: type
) => {
  const isInit = pre === undefined;
  const bufferConvertRateToLength: type["bufferConvertRateToLength"] = (() => {
    if (isInit) {
      const lengthForLongestBuffer = canvasSize * (1 - params.marginRate);
      return lengthForLongestBuffer / ctrl.longestDuration;
    } else {
      return pre.bufferConvertRateToLength;
    }
  })();
  const fullLengths: type["fullLengths"] = (() => {
    if (isInit) {
      return synthData.durations.map(
        (duration) => duration * bufferConvertRateToLength
      );
    } else {
      return pre.fullLengths;
    }
  })();
  const margins: type["margins"] = (() => {
    if (isInit) {
      return params.alignments.map((alignment, index) => {
        const sideMargin = canvasSize * params.marginRate * 0.5;
        return alignment === "right"
          ? sideMargin
          : canvasSize - fullLengths[index] - sideMargin;
      });
    } else {
      return pre.margins;
    }
  })();
  const startPositions: type["startPositions"] = (() => {
    if (isInit) {
      return synthData.durations.map((_, index) => {
        // for 4th buffer, fit to right end
        const x = margins[index];
        const y = (canvasSize / (synthData.durations.length + 1)) * (index + 1);
        return new p5.Vector(x, y);
      });
    } else {
      return pre.startPositions;
    }
  })();
  const endPositions: type["endPositions"] = (() => {
    if (isInit) {
      return startPositions.map((startPosition, index) =>
        p5.Vector.add(startPosition, new p5.Vector().set(fullLengths[index], 0))
      );
    } else {
      return pre.endPositions;
    }
  })();
  return {
    bufferConvertRateToLength,
    fullLengths,
    margins,
    startPositions,
    endPositions,
  };
};
