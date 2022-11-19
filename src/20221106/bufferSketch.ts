import p5 from "p5";
import * as Params from "./params";
import * as Buffer from "./buffer";
import * as Synth from "./synth";

export const set = (
  buffer: Buffer.type,
  size: number,
  params: Params.type,
  synth: Synth.type
) => {
  const { marginRate } = params;
  const lengthForLongestBuffer = size * (1 - marginRate);
  const bufferConvertRateToLength =
    lengthForLongestBuffer / buffer.longestDuration;
  const fullLengths = synth.data.durations.map(
    (duration) => duration * bufferConvertRateToLength
  );
  const margin = size * marginRate * 0.5;
  const startPositions = synth.data.durations.map((_, index) => {
    const x = margin;
    const y = (size / (synth.data.durations.length + 1)) * (index + 1);
    return new p5.Vector().set(x, y);
  });
  const endPositions = startPositions.map((startPosition, index) =>
    p5.Vector.add(startPosition, new p5.Vector().set(fullLengths[index], 0))
  );
  // whole initial data
  return {
    bufferConvertRateToLength,
    fullLengths,
    margin,
    startPositions,
    endPositions,
    currentPositions: startPositions,
    loopStartPositions: startPositions,
    loopEndPositions: endPositions,
  };
};
export const obj = set(Buffer.obj, 100, Params.obj, Synth.obj);
export type type = typeof obj;

export const update = (preBufferSketch: type, buffer: Buffer.type) => {
  const newBufferSketch = { ...preBufferSketch };
  newBufferSketch.loopStartPositions = preBufferSketch.loopStartPositions.map(
    (preLoopStartPosition, index) => {
      const newLoopStartPosition = preLoopStartPosition.copy();
      const positionRate =
        buffer.loopStartTimes[index] / buffer.durations[index];
      const x =
        preBufferSketch.fullLengths[index] * positionRate +
        preBufferSketch.margin;
      newLoopStartPosition.x = x;
      return newLoopStartPosition;
    }
  );
  newBufferSketch.loopEndPositions = preBufferSketch.loopEndPositions.map(
    (preLoopEndPosition, index) => {
      const newLoopEndPosition = preLoopEndPosition.copy();
      const positionRate = buffer.loopEndTimes[index] / buffer.durations[index];
      const x =
        preBufferSketch.fullLengths[index] * positionRate +
        preBufferSketch.margin;
      newLoopEndPosition.x = x;
      return newLoopEndPosition;
    }
  );
  return newBufferSketch;
};

export const draw = (bufferSketch: type, s: p5) => {
  const { startPositions, endPositions, loopStartPositions, loopEndPositions } =
    bufferSketch;
  // whole buffer
  s.push();
  startPositions.forEach((startPosition, index) => {
    const endPosition = endPositions[index];
    s.line(startPosition.x, startPosition.y, endPosition.x, endPosition.y);
  });
  s.pop();
  // loopStart point
  s.push();
  s.fill("blue");
  loopStartPositions.forEach((loopStartPosition) => {
    s.circle(loopStartPosition.x, loopStartPosition.y, 10);
  });
  s.pop();
  // loopEnd point
  s.push();
  s.fill("red");
  loopEndPositions.forEach((loopEndPosition) => {
    s.circle(loopEndPosition.x, loopEndPosition.y, 10);
  });
  s.pop();
};
