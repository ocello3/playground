import p5 from "p5";
import * as Params from "./params";
import * as Buffer from "./buffer";
import * as Synth from "./synth";
import { tools } from "../util/tools";

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
  const margins = params.alignments.map((alignment, index) => {
    const sideMargin = size * marginRate * 0.5;
    return alignment === "right"
      ? sideMargin
      : size - fullLengths[index] - sideMargin;
  });
  const startPositions = synth.data.durations.map((_, index) => {
    // for 4th buffer, fit to right end
    const x = margins[index];
    const y = (size / (synth.data.durations.length + 1)) * (index + 1);
    return new p5.Vector().set(x, y);
  });
  const endPositions = startPositions.map((startPosition, index) =>
    p5.Vector.add(startPosition, new p5.Vector().set(fullLengths[index], 0))
  );
  const boxSize = new p5.Vector().set(
    size * params.boxIntervalRate,
    size * params.boxHeightRate
  );
  const boxNumbers = startPositions.map((startPosition, index) => {
    const diff = startPosition.x - endPositions[index].x;
    return Math.ceil(Math.abs(diff / boxSize.x));
  });
  const boxLAPositionArrays = boxNumbers.map((_, trackIndex) => {
    const offset = new p5.Vector().set(0, boxSize.y * -0.5);
    return [p5.Vector.add(startPositions[trackIndex], offset)];
  });
  const boxColorArrays = boxNumbers.map(() => [0]);
  const isOvers = startPositions.map(() => false);
  const volumePositionArrays = startPositions.map((startPosition) => [
    startPosition,
  ]);
  const panValues = startPositions.map((startPosition) =>
    tools.map(startPosition.x, 0, size, -1, 1)
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
    margins,
    startPositions,
    endPositions,
    loopStartPositions: startPositions,
    loopEndPositions: endPositions,
    currentPositions: startPositions,
    boxSize,
    boxNumbers,
    boxLAPositionArrays,
    boxColorArrays,
    isOvers,
    arrowPositions,
    panValues,
    volumePositionArrays,
  };
};
export const obj = set(Buffer.obj, 100, Params.obj, Synth.obj);
export type type = typeof obj;

export const update = (
  preBufferSketch: type,
  buffer: Buffer.type,
  params: Params.type,
  size: number,
  frameRate: number
) => {
  const newBufferSketch = { ...preBufferSketch };
  newBufferSketch.loopStartPositions = preBufferSketch.loopStartPositions.map(
    (preLoopStartPosition, index) => {
      if (!buffer.loopIsSwitches[index]) return preLoopStartPosition;
      const newLoopStartPosition = preLoopStartPosition.copy();
      const positionRate =
        buffer.loopStartTimes[index] / buffer.durations[index];
      const loopStartPosition =
        preBufferSketch.fullLengths[index] * positionRate;
      const x = loopStartPosition + preBufferSketch.margins[index];
      newLoopStartPosition.x = x;
      return newLoopStartPosition;
    }
  );
  newBufferSketch.loopEndPositions = preBufferSketch.loopEndPositions.map(
    (preLoopEndPosition, index) => {
      if (!buffer.loopIsSwitches[index]) return preLoopEndPosition;
      const newLoopEndPosition = preLoopEndPosition.copy();
      const positionRate = buffer.loopEndTimes[index] / buffer.durations[index];
      const loopEndPosition = preBufferSketch.fullLengths[index] * positionRate;
      const x = loopEndPosition + preBufferSketch.margins[index];
      newLoopEndPosition.x = x;
      return newLoopEndPosition;
    }
  );
  newBufferSketch.boxNumbers = preBufferSketch.boxNumbers.map(
    (preBoxNumber, index) => {
      if (!buffer.loopIsSwitches[index]) return preBoxNumber;
      const diff =
        newBufferSketch.loopStartPositions[index].x -
        newBufferSketch.loopEndPositions[index].x;
      return Math.ceil(Math.abs(diff / preBufferSketch.boxSize.x));
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
  newBufferSketch.boxLAPositionArrays = preBufferSketch.boxLAPositionArrays.map(
    (preBoxLAPositionArray, trackIndex) => {
      // reset for new loop
      if (
        buffer.loopIsSwitches[trackIndex] ||
        newBufferSketch.isOvers[trackIndex]
      ) {
        const offset = new p5.Vector().set(0, preBufferSketch.boxSize.y * -0.5);
        return [
          p5.Vector.add(newBufferSketch.loopStartPositions[trackIndex], offset),
        ];
      }
      // add new position at last of array
      const direction = buffer.loopIsReverses[trackIndex] ? -1 : 1;
      const lastPosition =
        preBoxLAPositionArray[preBoxLAPositionArray.length - 1];
      const diff = Math.abs(
        newBufferSketch.currentPositions[trackIndex].x - lastPosition.x
      );
      const addedBoxNumber = Math.round(diff / preBufferSketch.boxSize.x);
      if (addedBoxNumber === 0) return preBoxLAPositionArray;
      const addedBoxPositions = Array.from(
        Array(addedBoxNumber),
        (_, index) => {
          const progress = new p5.Vector(
            preBufferSketch.boxSize.x * (index + 1) * direction,
            0
          );
          return p5.Vector.add(lastPosition, progress);
        }
      );
      return preBoxLAPositionArray.concat(addedBoxPositions);
    }
  );
  newBufferSketch.boxColorArrays = newBufferSketch.boxLAPositionArrays.map(
    (newBoxLAPositionArray, trackIndex) => {
      // update last element using volume
      const preBoxColorArray = preBufferSketch.boxColorArrays[trackIndex];
      const differenceInElementNumber =
        newBoxLAPositionArray.length - preBoxColorArray.length;
      const volume = buffer.volumes[trackIndex].getValue();
      const finiteVolume = isFinite(volume as number) ? volume : 0;
      const alpha = tools.map(
        finiteVolume as number,
        -50,
        -20,
        params.alphaMin,
        255
      );
      const constrainedAlpha = tools.constrain(alpha, params.alphaMin, 255);
      if (differenceInElementNumber === 0) {
        preBoxColorArray[preBoxColorArray.length - 1] = constrainedAlpha;
        return preBoxColorArray;
      } else if (differenceInElementNumber > 1) {
        const newAlphas = Array.from(
          Array(differenceInElementNumber),
          () => constrainedAlpha
        );
        const newAlphaArray = preBoxColorArray.concat(newAlphas);
        return newAlphaArray;
      } else {
        // if boxLAPositionsArrays are initialized by isOver || isSwitch
        return newBoxLAPositionArray.map(() => constrainedAlpha);
      }
    }
  );
  newBufferSketch.isOvers = newBufferSketch.currentPositions.map(
    (currentPosition, index) =>
      currentPosition.x === newBufferSketch.loopStartPositions[index].x
  );
  newBufferSketch.volumePositionArrays =
    preBufferSketch.volumePositionArrays.map(
      (preVolumePositionArray, index) => {
        // delete array and reset by startPosition
        if (newBufferSketch.isOvers[index] || buffer.loopIsSwitches[index]) {
          return [newBufferSketch.loopStartPositions[index]];
        }
        // for interval, skip addition to array
        const lastPosition = preVolumePositionArray.slice(-1)[0];
        const diffWidth = Math.abs(
          lastPosition.x - newBufferSketch.currentPositions[index].x
        );
        if (diffWidth < 1) {
          return preVolumePositionArray;
        }
        // add new position to array
        const newPosition = newBufferSketch.currentPositions[index].copy();
        const volume = buffer.volumes[index].getValue();
        const finiteVolume = isFinite(volume as number) ? volume : 0;
        const height = tools.map(finiteVolume as number, -50, -20, 0, 20);
        const constrainedHeight = height < 0 ? 0 : height;
        newPosition.add(new p5.Vector().set(0, -constrainedHeight));
        preVolumePositionArray.push(newPosition);
        return preVolumePositionArray;
      }
    );
  newBufferSketch.panValues = newBufferSketch.currentPositions.map(
    (currentPosition) => tools.map(currentPosition.x, 0, size, -1, 1)
  );
  return newBufferSketch;
};

export const draw = (bufferSketch: type, s: p5) => {
  const {
    startPositions,
    endPositions,
    // loopStartPositions,
    // loopEndPositions,
    // arrowPositions,
    // currentPositions,
    boxLAPositionArrays,
    boxColorArrays,
    boxSize,
    // volumePositionArrays,
  } = bufferSketch;
  // whole buffer
  s.push();
  s.stroke(0);
  startPositions.forEach((startPosition, index) => {
    const endPosition = endPositions[index];
    s.line(startPosition.x, startPosition.y, endPosition.x, endPosition.y);
  });
  s.pop();
  // boxes
  s.push();
  s.noStroke();
  boxLAPositionArrays.forEach((boxLAPositionArray, trackIndex) => {
    const boxColorArray = boxColorArrays[trackIndex];
    boxLAPositionArray.forEach((boxLAPosition, boxIndex) => {
      const alpha = boxColorArray[boxIndex];
      s.fill(0, alpha);
      s.rect(boxLAPosition.x, boxLAPosition.y, boxSize.x, boxSize.y);
    });
  });
  /*
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
  s.push();
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
  s.pop();
  // draw reverse arrow
  s.push();
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
  s.pop();
  // draw currentPosition
  /*
  s.push();
  currentPositions.forEach((currentPosition) =>
    s.line(
      currentPosition.x,
      currentPosition.y - 10,
      currentPosition.x,
      currentPosition.y + 10
    )
  );
  s.pop();
	*/
  // draw volume at currentPositon
  /*
  s.push();
  s.noFill();
  s.strokeWeight(1);
  volumePositionArrays.forEach((volumePositionArray, index) => {
    const startPosition = startPositions[index];
    volumePositionArray.forEach((position) => {
      s.line(position.x, startPosition.y, position.x, position.y);
    });
  });
  s.pop();
	*/
};
