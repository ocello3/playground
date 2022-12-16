import p5 from "p5";
import * as Segment from "./segment";
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

export const draw = (
  buffer: type,
  segment: Segment.type,
  seq: Ctrl.type,
  params: Params.type,
  s: p5
) => {
  const { startPositions, endPositions } = buffer;
  // frame of whole buffer
  s.push();
  s.noFill();
  s.strokeWeight(1);
  s.strokeCap(s.SQUARE);
  startPositions.forEach((startPosition, index) => {
    const flag = seq.loopIsReverses[index] ? 0 : 1;
    const hue = params.hues[flag];
    const saturation = params.saturations[flag] - params.saturationRange;
    const brightness = params.saturations[flag] - params.brightnessRange * 0.5;
    s.stroke(hue, saturation, brightness);
    s.line(
      startPosition.x,
      startPosition.y + segment.size.y * params.loopRangeLineYPosRate,
      endPositions[index].x,
      endPositions[index].y + segment.size.y * params.loopRangeLineYPosRate
    );
  });
};
