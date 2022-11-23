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
  const arrowLength = size * 0.03; // TODO: might add to params
  const arrowPositions = {
    forward: {
      upperPositions: endPositions.map((originPosition) =>
        p5.Vector.add(
          originPosition,
          p5.Vector.fromAngle((3 / 4) * Math.PI, arrowLength)
        )
      ),
      lowerPositions: endPositions.map((originPosition) =>
        p5.Vector.add(
          originPosition,
          p5.Vector.fromAngle((-3 / 4) * Math.PI, arrowLength)
        )
      ),
    },
    reverse: {
      upperPositions: startPositions.map((originPosition) =>
        p5.Vector.add(
          originPosition,
          p5.Vector.fromAngle((1 / 4) * Math.PI, arrowLength)
        )
      ),
      lowerPositions: startPositions.map((originPosition) =>
        p5.Vector.add(
          originPosition,
          p5.Vector.fromAngle((-1 / 4) * Math.PI, arrowLength)
        )
      ),
    },
  };
  // whole initial data
  return {
    bufferConvertRateToLength,
    fullLengths,
    margin,
    startPositions,
    endPositions,
    loopStartPositions: startPositions,
    loopEndPositions: endPositions,
    currentPositions: startPositions,
    arrowPositions,
  };
};
export const obj = set(Buffer.obj, 100, Params.obj, Synth.obj);
export type type = typeof obj;

export const update = (
  preBufferSketch: type,
  buffer: Buffer.type,
  frameRate: number
) => {
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
  newBufferSketch.currentPositions = preBufferSketch.currentPositions.map(
    (currentPosition, index) => {
      const loopPositionInterval = p5.Vector.dist(
        newBufferSketch.loopStartPositions[index],
        newBufferSketch.loopEndPositions[index]
      );
      const prePosition = buffer.loopIsSwitches[index]
        ? newBufferSketch.loopStartPositions[index]
        : currentPosition;
      const direction = buffer.loopIsReverses[index] ? -1 : 1;
      const progressSpeed =
        (loopPositionInterval / buffer.durations[index] / frameRate) *
        buffer.playbackRates[index] *
        direction;
      const progress = new p5.Vector().set(progressSpeed, 0);
      const newCurrentPosition = p5.Vector.add(prePosition, progress);
      const isOver = buffer.loopIsReverses[index]
        ? newCurrentPosition.x < preBufferSketch.loopEndPositions[index].x
        : newCurrentPosition.x > preBufferSketch.loopEndPositions[index].x;
      return isOver
        ? newBufferSketch.loopStartPositions[index]
        : newCurrentPosition;
    }
  );
  return newBufferSketch;
};

export const draw = (bufferSketch: type, buffer: Buffer.type, s: p5) => {
  const {
    startPositions,
    endPositions,
    loopStartPositions,
    loopEndPositions,
    arrowPositions,
    currentPositions,
  } = bufferSketch;
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
  // draw forward arrow
  s.pop();
  endPositions.forEach((originPosition, index) => {
    if (!buffer.loopIsReverses[index]) {
      s.line(
        originPosition.x,
        originPosition.y,
        arrowPositions.forward.upperPositions[index].x,
        arrowPositions.forward.upperPositions[index].y
      );
    }
  });
  endPositions.forEach((originPosition, index) => {
    if (!buffer.loopIsReverses[index]) {
      s.line(
        originPosition.x,
        originPosition.y,
        arrowPositions.forward.lowerPositions[index].x,
        arrowPositions.forward.lowerPositions[index].y
      );
    }
  });
  s.push();
  // draw reverse arrow
  s.pop();
  startPositions.forEach((originPosition, index) => {
    if (buffer.loopIsReverses[index]) {
      s.line(
        originPosition.x,
        originPosition.y,
        arrowPositions.reverse.upperPositions[index].x,
        arrowPositions.reverse.upperPositions[index].y
      );
    }
  });
  startPositions.forEach((originPosition, index) => {
    if (buffer.loopIsReverses[index]) {
      s.line(
        originPosition.x,
        originPosition.y,
        arrowPositions.reverse.lowerPositions[index].x,
        arrowPositions.reverse.lowerPositions[index].y
      );
    }
  });
  s.push();
  // draw currentPosition
  s.pop();
  currentPositions.forEach((currentPosition) =>
    s.line(
      currentPosition.x,
      currentPosition.y - 10,
      currentPosition.x,
      currentPosition.y + 10
    )
  );
  s.push();
};
