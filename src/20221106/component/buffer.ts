import p5 from "p5";
import * as Ctrl from "../sound/controller";
import * as SynthData from "../sound/synthData";
import * as Params from "../params";

export type type = {
  bufferConvertRateToLength: number;
  fullLengths: number[];
  margins: p5.Vector[];
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
        const widthMarginLength = canvasSize * params.marginRate * 0.5;
        const widthMargin =
          alignment === "right"
            ? widthMarginLength
            : canvasSize - fullLengths[index] - widthMarginLength;
        const boxHeight = canvasSize * params.boxHeightRate;
        const boxTotalHeight = boxHeight * params.alignments.length;
        const totalHeightMargin = canvasSize - boxTotalHeight;
        const marginCount = params.alignments.length + 1;
        const heightMargin = totalHeightMargin / marginCount;
        return new p5.Vector(widthMargin, heightMargin);
      });
    } else {
      return pre.margins;
    }
  })();
  const startPositions: type["startPositions"] = (() => {
    if (isInit) {
      return synthData.durations.map((_, index) => {
        // for 4th buffer, fit to right end
        const x = margins[index].x;
        const boxHeight = canvasSize * params.boxHeightRate;
        const y = margins[index].y * (index + 1) + boxHeight * index;
        return new p5.Vector(x, y);
      });
    } else {
      return pre.startPositions;
    }
  })();
  const endPositions: type["endPositions"] = (() => {
    if (isInit) {
      return startPositions.map((startPosition, index) =>
        p5.Vector.add(startPosition, new p5.Vector(fullLengths[index], 0))
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
