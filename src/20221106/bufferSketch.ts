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
    return new p5.Vector(x, y);
  });
  const currentPositions = synth.data.durations.map((_, index) => {
    // for 4th buffer, fit to right end
    const x = margins[index];
    const y = (size / (synth.data.durations.length + 1)) * (index + 1);
    return new p5.Vector(x, y);
  });
  const endPositions = startPositions.map((startPosition, index) =>
    p5.Vector.add(startPosition, new p5.Vector().set(fullLengths[index], 0))
  );
  const boxSize = new p5.Vector(
    size * params.boxIntervalRate,
    size * params.boxHeightRate
  );
  const boxNumbers = startPositions.map((startPosition, index) => {
    const diff = startPosition.x - endPositions[index].x;
    return Math.ceil(Math.abs(diff / boxSize.x));
  });
  const waveXPositionArrays = startPositions.map((startPosition) =>
    Array.from(Array(boxNumbers), () => startPosition.x)
  );
  const waveAngleSpeeds = boxNumbers.map(() => 0);
  const waveAngleArrays = waveXPositionArrays.map((waveXPositionArray) =>
    waveXPositionArray.map(() => 0)
  );
  const waveAmps = boxNumbers.map(() => 0);
  const waveYPositionArrays = waveAngleArrays.map(
    (waveAngleArray, trackIndex) =>
      waveAngleArray.map(() => {
        const startPosition = startPositions[trackIndex];
        return startPosition.y;
      })
  );
  const boxLAPositionArrays = boxNumbers.map((_, trackIndex) => {
    const offset = new p5.Vector(0, boxSize.y * -0.5);
    return [p5.Vector.add(startPositions[trackIndex], offset)];
  });
  const boxHues = buffer.loopIsReverses.map(() => 0);
  const boxSaturations = buffer.loopIsReverses.map(() => 0);
  const boxBrightnessArrays = buffer.loopIsReverses.map(() => [0]);
  const panValues = startPositions.map((startPosition) =>
    tools.map(startPosition.x, 0, size, -1, 1)
  );
  // whole initial data
  return {
    bufferConvertRateToLength,
    fullLengths,
    margins,
    startPositions,
    endPositions,
    loopStartPositions: startPositions,
    loopStartCurrentPositions: startPositions,
    loopEndPositions: endPositions,
    loopEndCurrentPositions: endPositions,
    currentPositions,
    boxSize,
    boxNumbers,
    waveXPositionArrays,
    waveAngleSpeeds,
    waveAngleArrays,
    waveAmps,
    waveYPositionArrays,
    boxLAPositionArrays,
    boxHues,
    boxSaturations,
    boxBrightnessArrays,
    panValues,
  };
};
export const obj = set(Buffer.obj, 100, Params.obj, Synth.obj);
export type type = typeof obj;

export const update = (
  preBufferSketch: type,
  buffer: Buffer.type,
  params: Params.type,
  size: number
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
  newBufferSketch.loopStartCurrentPositions =
    preBufferSketch.loopStartCurrentPositions.map(
      (preLoopStartCurrentPosition, index) => {
        const loopStartTargetPosition =
          newBufferSketch.loopStartPositions[index];
        const diff = loopStartTargetPosition.x - preLoopStartCurrentPosition.x;
        if (Math.abs(diff) < 1) return loopStartTargetPosition;
        const easingF = tools.map(
          buffer.playbackRates[index],
          params.playbackRateMin,
          params.playbackRateMax,
          params.easingFMin,
          params.easingFMax
        );
        const progress = new p5.Vector(diff * easingF, 0);
        return p5.Vector.add(preLoopStartCurrentPosition, progress);
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
  newBufferSketch.loopEndCurrentPositions =
    preBufferSketch.loopEndCurrentPositions.map(
      (preLoopEndCurrentPosition, index) => {
        const loopEndTargetPosition = newBufferSketch.loopEndPositions[index];
        const diff = loopEndTargetPosition.x - preLoopEndCurrentPosition.x;
        if (Math.abs(diff) < 1) return loopEndTargetPosition;
        const easingF = tools.map(
          buffer.playbackRates[index],
          params.playbackRateMin,
          params.playbackRateMax,
          params.easingFMin,
          params.easingFMax
        );
        const progress = new p5.Vector(diff * easingF, 0);
        return p5.Vector.add(preLoopEndCurrentPosition, progress);
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
  newBufferSketch.waveXPositionArrays = preBufferSketch.waveXPositionArrays.map(
    (preWavePositionArray, trackIndex) => {
      if (!buffer.loopIsSwitches[trackIndex]) return preWavePositionArray;
      const boxNumber = newBufferSketch.boxNumbers[trackIndex];
      const direction = buffer.loopIsReverses[trackIndex] ? -1 : 1;
      const loopStartPosition = newBufferSketch.loopStartPositions[trackIndex];
      return Array.from(
        Array(boxNumber),
        (_, boxIndex) =>
          loopStartPosition.x + preBufferSketch.boxSize.x * boxIndex * direction
      );
    }
  );
  newBufferSketch.waveAngleSpeeds = preBufferSketch.waveAngleSpeeds.map(
    (preWaveAngleSpeed, trackIndex) => {
      if (!buffer.loopIsSwitches[trackIndex]) return preWaveAngleSpeed;
      return tools.map(
        Math.random(),
        0,
        1,
        params.waveSpeedRateMin * size,
        params.waveSpeedRateMax * size
      );
    }
  );
  newBufferSketch.waveAngleArrays = preBufferSketch.waveAngleArrays.map(
    (preWaveAngleArray, trackIndex) => {
      if (!buffer.loopIsSwitches[trackIndex])
        return preWaveAngleArray.map(
          (preWaveAngle) =>
            preWaveAngle + newBufferSketch.waveAngleSpeeds[trackIndex]
        );
      const xPositionArray = newBufferSketch.waveXPositionArrays[trackIndex];
      const waveLength =
        Math.abs(
          newBufferSketch.loopEndPositions[trackIndex].x -
            newBufferSketch.loopStartPositions[trackIndex].x
        ) *
        tools.map(
          Math.random(),
          0,
          1,
          params.waveLengthRateMin,
          params.waveLengthRateMax
        );
      return xPositionArray.map((xPosition) => {
        const widthPerAngle =
          waveLength / newBufferSketch.boxNumbers[trackIndex];
        return (xPosition / widthPerAngle) * Math.PI * 2;
      });
    }
  );
  newBufferSketch.waveAmps = preBufferSketch.waveAmps.map(
    (preAmp, trackIndex) => {
      if (!buffer.loopIsSwitches[trackIndex]) return preAmp;
      return tools.map(
        Math.random(),
        0,
        1,
        params.ampRateMin * preBufferSketch.boxSize.y,
        params.ampRateMax * preBufferSketch.boxSize.y
      );
    }
  );
  newBufferSketch.waveYPositionArrays = newBufferSketch.waveAngleArrays.map(
    (preWaveAngleArray, trackIndex) => {
      const amp = newBufferSketch.waveAmps[trackIndex];
      const baseYPosition = preBufferSketch.startPositions[trackIndex].y;
      return preWaveAngleArray.map(
        (angle) => Math.sin(angle) * amp + baseYPosition
      );
    }
  );
  newBufferSketch.currentPositions = preBufferSketch.currentPositions.map(
    (preCurrentPosition, index) => {
      const loopLength: number = Math.abs(
        newBufferSketch.loopEndPositions[index].x -
          newBufferSketch.loopStartPositions[index].x
      );
      const progressLength: number =
        loopLength * buffer.loopProgressRates[index];
      if (buffer.loopIsReverses[index]) {
        preCurrentPosition.x =
          newBufferSketch.loopStartPositions[index].x - progressLength;
        return preCurrentPosition;
      } else {
        preCurrentPosition.x =
          newBufferSketch.loopStartPositions[index].x + progressLength;
        return preCurrentPosition;
      }
    }
  );
  newBufferSketch.boxLAPositionArrays = preBufferSketch.boxLAPositionArrays.map(
    (preBoxLAPositionArray, trackIndex) => {
      // reset for new loop
      if (buffer.loopIsSwitches[trackIndex] || buffer.loopIsOvers[trackIndex]) {
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
  newBufferSketch.boxHues = buffer.loopIsReverses.map((loopIsReverse) => {
    const flag = loopIsReverse ? 0 : 1;
    return params.hues[flag];
  });
  newBufferSketch.boxSaturations = buffer.loopIsReverses.map(
    (loopIsReverse, index) => {
      const flag = loopIsReverse ? 1 : 0;
      const baseSaturation = params.saturations[flag];
      return tools.map(
        buffer.playbackRates[index],
        params.playbackRateMin,
        params.playbackRateMax,
        baseSaturation - params.saturationRange,
        baseSaturation + params.saturationRange
      );
    }
  );
  newBufferSketch.boxBrightnessArrays = newBufferSketch.boxLAPositionArrays.map(
    (newBoxLAPositionArray, trackIndex) => {
      // update last element using volume
      const preBoxBrightnessArray =
        preBufferSketch.boxBrightnessArrays[trackIndex];
      const differenceInElementNumber =
        newBoxLAPositionArray.length - preBoxBrightnessArray.length;
      const volume = buffer.volumes[trackIndex].getValue();
      const finiteVolume = isFinite(volume as number) ? volume : 0;
      const flag = buffer.loopIsReverses[trackIndex] ? 1 : 0;
      const baseBrightness = params.brightnesses[flag];
      const brightness = tools.map(
        finiteVolume as number,
        -50,
        -20,
        baseBrightness - params.brightnessRange,
        baseBrightness + params.brightnessRange
      );
      const constrainedBrightness = tools.constrain(
        brightness,
        baseBrightness - params.brightnessRange,
        baseBrightness + params.brightnessRange
      );
      if (differenceInElementNumber === 0) {
        preBoxBrightnessArray[preBoxBrightnessArray.length - 1] =
          constrainedBrightness;
        return preBoxBrightnessArray;
      } else if (differenceInElementNumber >= 1) {
        const newBrightnesses = Array.from(
          Array(differenceInElementNumber),
          () => constrainedBrightness
        );
        const newBrightnessArray =
          preBoxBrightnessArray.concat(newBrightnesses);
        return newBrightnessArray;
      } else {
        // if boxLAPositionsArrays are initialized by isOver || isSwitch
        return newBoxLAPositionArray.map(() => constrainedBrightness);
      }
    }
  );
  newBufferSketch.panValues = newBufferSketch.currentPositions.map(
    (currentPosition) => tools.map(currentPosition.x, 0, size, -1, 1)
  );
  return newBufferSketch;
};

export const draw = (
  bufferSketch: type,
  buffer: Buffer.type,
  params: Params.type,
  s: p5
) => {
  const {
    startPositions,
    endPositions,
    loopStartCurrentPositions,
    loopEndCurrentPositions,
    boxLAPositionArrays,
    boxHues,
    boxSaturations,
    boxBrightnessArrays,
    boxSize,
    waveXPositionArrays,
    waveYPositionArrays,
  } = bufferSketch;
  // boxes
  s.push();
  s.noStroke();
  boxLAPositionArrays.forEach((boxLAPositionArray, trackIndex) => {
    const hue = boxHues[trackIndex];
    const saturations = boxBrightnessArrays[trackIndex];
    const brightness = boxSaturations[trackIndex];
    boxLAPositionArray.forEach((boxLAPosition, boxIndex) => {
      const saturation = saturations[boxIndex];
      s.fill(hue, saturation, brightness);
      s.rect(boxLAPosition.x, boxLAPosition.y, boxSize.x, boxSize.y);
    });
  });
  s.pop();
  // frame of whole buffer
  s.push();
  s.noFill();
  s.strokeWeight(1);
  s.strokeCap(s.SQUARE);
  startPositions.forEach((startPosition, index) => {
    const flag = buffer.loopIsReverses[index] ? 0 : 1;
    const hue = params.hues[flag];
    const saturation = params.saturations[flag] - params.saturationRange;
    const brightness = params.saturations[flag] - params.brightnessRange * 0.5;
    s.stroke(hue, saturation, brightness);
    s.line(
      startPosition.x,
      startPosition.y + boxSize.y * params.loopRangeLineYPosRate,
      endPositions[index].x,
      endPositions[index].y + boxSize.y * params.loopRangeLineYPosRate
    );
  });
  // loop range line
  s.strokeWeight(3);
  s.strokeCap(s.PROJECT);
  loopStartCurrentPositions.forEach((loopStartPosition, index) => {
    s.push();
    const flag = buffer.loopIsReverses[index] ? 0 : 1;
    const hue = params.hues[flag];
    const saturation = params.saturations[flag] - params.saturationRange;
    const brightness = params.saturations[flag] - params.brightnessRange * 0.5;
    s.stroke(hue, saturation, brightness);
    s.line(
      loopStartPosition.x,
      loopStartPosition.y + boxSize.y * params.loopRangeLineYPosRate,
      loopEndCurrentPositions[index].x,
      loopEndCurrentPositions[index].y +
        boxSize.y * params.loopRangeLineYPosRate
    );
    s.pop();
  });
  s.pop();
  // wave
  s.push();
  s.fill(0);
  waveXPositionArrays.forEach((waveXPositionArray, trackIndex) => {
    const waveYPositionArray = waveYPositionArrays[trackIndex];
    waveXPositionArray.forEach((waveXPosition, boxIndex) => {
      const waveYPosition = waveYPositionArray[boxIndex];
      s.circle(waveXPosition, waveYPosition, 2);
    });
  });
  s.pop();
};
