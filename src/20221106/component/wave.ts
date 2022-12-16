import p5 from "p5";
import * as Params from "../params";
import * as Seq from "../sound/sequence";
import * as Buffer from "./buffer";
import * as Loop from "./loop";
import * as Segment from "./segment";
import { tools } from "../../util/tools";

export type type = {
  xPositionArrays: number[][];
  angleSpeeds: number[];
  angleArrays: number[][];
  amps: number[];
  yPositionArrays: number[][];
};

export const get = (
  seq: Seq.type,
  params: Params.type,
  canvasSize: number,
  buffer: Buffer.type,
  loop: Loop.type,
  segment: Segment.type,
  pre?: type
) => {
  const isInit = pre === undefined;
  const xPositionArrays: type["xPositionArrays"] = loop.startPositions.map(
    (loopStartPosition, trackIndex) => {
      if (!isInit && !seq.loopIsSwitches[trackIndex])
        return pre.xPositionArrays[trackIndex];
      const boxNumber = segment.counts[trackIndex];
      const direction = seq.loopIsReverses[trackIndex] ? -1 : 1;
      return Array.from(
        Array(boxNumber),
        (_, boxIndex) =>
          loopStartPosition.x + segment.size.x * boxIndex * direction
      );
    }
  );
  const angleSpeeds: type["angleSpeeds"] = xPositionArrays.map(
    (_, trackIndex) => {
      if (!isInit && !seq.loopIsSwitches[trackIndex])
        return pre.angleSpeeds[trackIndex];
      return tools.map(
        Math.random(),
        0,
        1,
        params.waveSpeedRateMin * canvasSize,
        params.waveSpeedRateMax * canvasSize
      );
    }
  );
  const angleArrays: type["angleArrays"] = xPositionArrays.map(
    (waveXPositionArray, trackIndex) => {
      if (!isInit && !seq.loopIsSwitches[trackIndex])
        return pre.angleArrays[trackIndex].map(
          (preWaveAngle) => preWaveAngle + angleSpeeds[trackIndex]
        );
      const waveLength =
        Math.abs(
          loop.endPositions[trackIndex].x - loop.startPositions[trackIndex].x
        ) *
        tools.map(
          Math.random(),
          0,
          1,
          params.waveLengthRateMin,
          params.waveLengthRateMax
        );
      return waveXPositionArray.map((xPosition) => {
        const widthPerAngle = waveLength / segment.counts[trackIndex];
        return (xPosition / widthPerAngle) * Math.PI * 2;
      });
    }
  );
  const amps: type["amps"] = xPositionArrays.map((_, trackIndex) => {
    if (!isInit && !seq.loopIsSwitches[trackIndex]) return pre.amps[trackIndex];
    return tools.map(
      Math.random(),
      0,
      1,
      params.ampRateMin * segment.size.y,
      params.ampRateMax * segment.size.y
    );
  });
  const yPositionArrays: type["yPositionArrays"] = angleArrays.map(
    (preWaveAngleArray, trackIndex) => {
      const amp = amps[trackIndex];
      const baseYPosition = buffer.startPositions[trackIndex].y;
      return preWaveAngleArray.map(
        (angle) => tools.map(Math.sin(angle), -1, 1, 0, 1) * amp + baseYPosition
      );
    }
  );
  return {
    xPositionArrays: xPositionArrays,
    angleSpeeds: angleSpeeds,
    angleArrays: angleArrays,
    amps: amps,
    yPositionArrays: yPositionArrays,
  };
};

export const draw = (
  wave: type,
  segment: Segment.type,
  seq: Seq.type,
  params: Params.type,
  s: p5
) => {
  const {
    xPositionArrays: waveXPositionArrays,
    yPositionArrays: waveYPositionArrays,
  } = wave;
  s.push();
  waveXPositionArrays.forEach((waveXPositionArray, trackIndex) => {
    const currentBoxIndex = segment.currentIndexes[trackIndex];
    const flag = seq.loopIsReverses[trackIndex] ? 0 : 1;
    const hue = params.hues[flag];
    const saturation = params.saturations[flag] - params.saturationRange;
    const brightness = params.saturations[flag] - params.brightnessRange * 0.5;
    s.stroke(hue, saturation, brightness);
    const waveYPositionArray = waveYPositionArrays[trackIndex];
    waveXPositionArray.forEach((waveXPosition, boxIndex) => {
      if (boxIndex > currentBoxIndex) {
        const waveYPosition = waveYPositionArray[boxIndex];
        s.line(
          waveXPosition,
          waveYPosition,
          waveXPosition + segment.size.x,
          waveYPosition
        );
      }
    });
  });
  s.pop();
};
