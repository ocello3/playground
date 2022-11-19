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
  const startPositions = synth.data.durations.map((_, index) => {
    const x = size * marginRate * 0.5;
    const y = (size / (synth.data.durations.length + 1)) * (index + 1);
    return new p5.Vector().set(x, y);
  });
  const endPositions = startPositions.map((startPosition, index) =>
    p5.Vector.add(startPosition, new p5.Vector().set(fullLengths[index], 0))
  );
  // whole initial data
  return {
    fullLengths,
    startPositions,
    endPositions,
    currentPositions: startPositions,
    loopStartPositions: startPositions,
    loopEndPositions: endPositions,
  };
};
export const obj = set(Buffer.obj, 100, Params.obj, Synth.obj);
export type type = typeof obj;

export const draw = (bufferSketch: type, s: p5) => {
  const { startPositions, endPositions } = bufferSketch;
  s.push();
  startPositions.forEach((startPosition, index) => {
    const endPosition = endPositions[index];
    s.line(startPosition.x, startPosition.y, endPosition.x, endPosition.y);
  });
  s.pop();
};
