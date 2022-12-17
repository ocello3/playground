import p5 from "p5";
import * as Params from "../params";
import * as Ctrl from "../sound/controller";
import * as Loop from "./loop";
import * as Segment from "./segment";
import { tools } from "../../util/tools";

export type type = {
  angleSpeeds: number[];
  angleArrays: number[][];
  amps: number[];
  positionArrays: p5.Vector[][];
};

export const get = (
  ctrl: Ctrl.type,
  params: Params.type,
  canvasSize: number,
  loop: Loop.type,
  segment: Segment.type,
  pre?: type
) => {
  const isInit = pre === undefined;
  const angleSpeeds: type["angleSpeeds"] = ctrl.loopIsSwitches.map(
    (loopIsSwitch, trackIndex) => {
      if (isInit || loopIsSwitch)
        return tools.map(
          Math.random(),
          0,
          1,
          params.waveSpeedRateMin * canvasSize,
          params.waveSpeedRateMax * canvasSize
        );
      return pre.angleSpeeds[trackIndex];
    }
  );
  const angleArrays: type["angleArrays"] = segment.positionArrays.map(
    (positionArray, trackIndex) => {
      if (isInit || ctrl.loopIsSwitches[trackIndex]) {
        const loopLength = Math.abs(
          loop.endPositions[trackIndex].x - loop.startPositions[trackIndex].x
        );
        const waveLengthRate = tools.map(
          Math.random(),
          0,
          1,
          params.waveLengthRateMin,
          params.waveLengthRateMax
        );
        const waveLength = loopLength * waveLengthRate;
        const waveCountInLoop = loopLength / waveLength;
        const totalAngleInLoop = Math.PI * 2 * waveCountInLoop;
        const anglePerSegment = totalAngleInLoop / segment.counts[trackIndex];
        return positionArray.map((_, waveIndex) => anglePerSegment * waveIndex);
      }
      return pre.angleArrays[trackIndex].map(
        (preWaveAngle) => preWaveAngle + angleSpeeds[trackIndex]
      );
    }
  );
  const amps: type["amps"] = ctrl.loopIsSwitches.map(
    (loopIsSwitch, trackIndex) => {
      if (isInit || loopIsSwitch)
        return tools.map(
          Math.random(),
          0,
          1,
          params.ampRateMin * segment.size.y,
          params.ampRateMax * segment.size.y
        );
      return pre.amps[trackIndex];
    }
  );
  const positionArrays: type["positionArrays"] = segment.positionArrays.map(
    (segmentPositionArray, trackIndex) => {
      const amp = amps[trackIndex];
      return segmentPositionArray.map((segmentPosition, waveIndex) => {
        const angle = angleArrays[trackIndex][waveIndex];
        const centerYPos = segmentPosition.y + segment.size.y * 0.5;
        const displacement = tools.map(Math.sin(angle), -1, 1, -0.5, 0.5) * amp;
        return new p5.Vector(segmentPosition.x, centerYPos + displacement);
      });
    }
  );
  return {
    angleSpeeds,
    angleArrays,
    amps,
    positionArrays,
  };
};
