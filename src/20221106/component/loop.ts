import p5 from "p5";
import * as Params from "../params";
import * as Seq from "../sound/sequence";
import * as SynthData from "../sound/synthData";
import * as buffer from "./buffer";
import * as Segment from "./segment";
import { tools } from "../../util/tools";

export type type = {
  startPositions: p5.Vector[];
  startCurrentPositions: p5.Vector[];
  endPositions: p5.Vector[];
  endCurrentPositions: p5.Vector[];
};

export const get = (
  params: Params.type,
  seq: Seq.type,
  synthData: SynthData.type,
  buffer: buffer.type,
  pre?: type
) => {
  const isInit = pre === undefined;
  const startPositions: type["startPositions"] = (() => {
    if (isInit) return buffer.startPositions;
    return pre.startPositions.map((preLoopStartPosition, index) => {
      if (!seq.loopIsSwitches[index]) return preLoopStartPosition;
      const newLoopStartPosition = preLoopStartPosition.copy();
      const positionRate =
        seq.loopStartTimes[index] / synthData.durations[index];
      const loopStartPosition = buffer.fullLengths[index] * positionRate;
      const x = loopStartPosition + buffer.margins[index];
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
          seq.playbackRates[index],
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
      if (!seq.loopIsSwitches[index]) return preLoopEndPosition;
      const newLoopEndPosition = preLoopEndPosition.copy();
      const positionRate = seq.loopEndTimes[index] / synthData.durations[index];
      const loopEndPosition = buffer.fullLengths[index] * positionRate;
      const x = loopEndPosition + buffer.margins[index];
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
        seq.playbackRates[index],
        params.playbackRateMin,
        params.playbackRateMax,
        params.easingFMin,
        params.easingFMax
      );
      const progress = new p5.Vector(diff * easingF, 0);
      return p5.Vector.add(preLoopEndCurrentPosition, progress);
    });
  })();
  return {
    startPositions,
    startCurrentPositions,
    endPositions,
    endCurrentPositions,
  };
};

export const draw = (
  loop: type,
  segment: Segment.type,
  seq: Seq.type,
  params: Params.type,
  s: p5
) => {
  const {
    startCurrentPositions: loopStartCurrentPositions,
    endCurrentPositions: loopEndCurrentPositions,
  } = loop;
  // loop range line
  s.strokeWeight(3);
  s.strokeCap(s.PROJECT);
  loopStartCurrentPositions.forEach((loopStartPosition, index) => {
    s.push();
    const flag = seq.loopIsReverses[index] ? 0 : 1;
    const hue = params.hues[flag];
    const saturation = params.saturations[flag] - params.saturationRange;
    const brightness = params.saturations[flag] - params.brightnessRange * 0.5;
    s.stroke(hue, saturation, brightness);
    s.line(
      loopStartPosition.x,
      loopStartPosition.y + segment.boxSize.y * params.loopRangeLineYPosRate,
      loopEndCurrentPositions[index].x,
      loopEndCurrentPositions[index].y +
        segment.boxSize.y * params.loopRangeLineYPosRate
    );
    s.pop();
  });
  s.pop();
};
