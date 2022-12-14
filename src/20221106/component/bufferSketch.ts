import p5 from "p5";
import * as Params from "../params";
import * as Seq from "../sound/sequence";
import * as SynthData from "../sound/synthData";
import * as WholeBuffer from "./wholeBuffer";
import { tools } from "../../util/tools";

export type type = {
  loopStartPositions: p5.Vector[];
  loopStartCurrentPositions: p5.Vector[];
  loopEndPositions: p5.Vector[];
  loopEndCurrentPositions: p5.Vector[];
  currentPositions: p5.Vector[];
  boxNumbers: number[];
  waveXPositionArrays: number[][];
  waveAngleSpeeds: number[];
  waveAngleArrays: number[][];
  waveAmps: number[];
  waveYPositionArrays: number[][];
  boxLAPositionArrays: p5.Vector[][];
  currentBoxIndexes: number[];
  currentBoxHeightOffsets: number[];
  boxHeightOffsetArrays: number[][];
  amplitudes: number[];
  boxHues: number[];
  boxSaturations: number[];
  boxBrightnessArrays: number[][];
  panValues: number[];
};

export const get = (
  seq: Seq.type,
  params: Params.type,
  size: number,
  synthData: SynthData.type,
  wholeBuffer: WholeBuffer.type,
  pre?: type
) => {
  const isInit = pre === undefined;
  const loopStartPositions: type["loopStartPositions"] = (() => {
    if (isInit) return wholeBuffer.startPositions;
    return pre.loopStartPositions.map((preLoopStartPosition, index) => {
      if (!seq.loopIsSwitches[index]) return preLoopStartPosition;
      const newLoopStartPosition = preLoopStartPosition.copy();
      const positionRate =
        seq.loopStartTimes[index] / synthData.durations[index];
      const loopStartPosition = wholeBuffer.fullLengths[index] * positionRate;
      const x = loopStartPosition + wholeBuffer.margins[index];
      newLoopStartPosition.x = x;
      return newLoopStartPosition;
    });
  })();
  const loopStartCurrentPositions: type["loopStartCurrentPositions"] = (() => {
    if (isInit) return loopStartPositions;
    return pre.loopStartCurrentPositions.map(
      (preLoopStartCurrentPosition, index) => {
        const loopStartTargetPosition = loopStartPositions[index];
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
  const loopEndPositions: type["loopEndPositions"] = (() => {
    if (isInit) return wholeBuffer.endPositions;
    return pre.loopEndPositions.map((preLoopEndPosition, index) => {
      if (!seq.loopIsSwitches[index]) return preLoopEndPosition;
      const newLoopEndPosition = preLoopEndPosition.copy();
      const positionRate = seq.loopEndTimes[index] / synthData.durations[index];
      const loopEndPosition = wholeBuffer.fullLengths[index] * positionRate;
      const x = loopEndPosition + wholeBuffer.margins[index];
      newLoopEndPosition.x = x;
      return newLoopEndPosition;
    });
  })();
  const loopEndCurrentPositions: type["loopEndCurrentPositions"] = (() => {
    if (isInit) return loopEndPositions;
    return pre.loopEndCurrentPositions.map(
      (preLoopEndCurrentPosition, index) => {
        const loopEndTargetPosition = loopEndPositions[index];
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
      }
    );
  })();
  const boxNumbers: type["boxNumbers"] = loopStartPositions.map(
    (loopStartPosition, index) => {
      if (!isInit && !seq.loopIsSwitches[index]) return pre.boxNumbers[index];
      const diff = loopStartPosition.x - loopEndPositions[index].x;
      return Math.ceil(Math.abs(diff / params.boxSize.x));
    }
  );
  const waveXPositionArrays: type["waveXPositionArrays"] =
    loopStartPositions.map((loopStartPosition, trackIndex) => {
      if (!isInit && !seq.loopIsSwitches[trackIndex])
        return pre.waveXPositionArrays[trackIndex];
      const boxNumber = boxNumbers[trackIndex];
      const direction = seq.loopIsReverses[trackIndex] ? -1 : 1;
      return Array.from(
        Array(boxNumber),
        (_, boxIndex) =>
          loopStartPosition.x + params.boxSize.x * boxIndex * direction
      );
    });
  const waveAngleSpeeds: type["waveAngleSpeeds"] = waveXPositionArrays.map(
    (_, trackIndex) => {
      if (!isInit && !seq.loopIsSwitches[trackIndex])
        return pre.waveAngleSpeeds[trackIndex];
      return tools.map(
        Math.random(),
        0,
        1,
        params.waveSpeedRateMin * size,
        params.waveSpeedRateMax * size
      );
    }
  );
  const waveAngleArrays: type["waveAngleArrays"] = waveXPositionArrays.map(
    (waveXPositionArray, trackIndex) => {
      if (!isInit && !seq.loopIsSwitches[trackIndex])
        return pre.waveAngleArrays[trackIndex].map(
          (preWaveAngle) => preWaveAngle + waveAngleSpeeds[trackIndex]
        );
      const waveLength =
        Math.abs(
          loopEndPositions[trackIndex].x - loopStartPositions[trackIndex].x
        ) *
        tools.map(
          Math.random(),
          0,
          1,
          params.waveLengthRateMin,
          params.waveLengthRateMax
        );
      return waveXPositionArray.map((xPosition) => {
        const widthPerAngle = waveLength / boxNumbers[trackIndex];
        return (xPosition / widthPerAngle) * Math.PI * 2;
      });
    }
  );
  const waveAmps: type["waveAmps"] = waveXPositionArrays.map(
    (_, trackIndex) => {
      if (!isInit && !seq.loopIsSwitches[trackIndex])
        return pre.waveAmps[trackIndex];
      return tools.map(
        Math.random(),
        0,
        1,
        params.ampRateMin * params.boxSize.y,
        params.ampRateMax * params.boxSize.y
      );
    }
  );
  const waveYPositionArrays: type["waveYPositionArrays"] = waveAngleArrays.map(
    (preWaveAngleArray, trackIndex) => {
      const amp = waveAmps[trackIndex];
      const baseYPosition = wholeBuffer.startPositions[trackIndex].y;
      return preWaveAngleArray.map(
        (angle) => tools.map(Math.sin(angle), -1, 1, 0, 1) * amp + baseYPosition
      );
    }
  );
  const currentPositions: type["currentPositions"] = (() => {
    if (isInit)
      return synthData.durations.map((_, index) => {
        // for 4th buffer, fit to right end
        const x = wholeBuffer.margins[index];
        const y = (size / (synthData.durations.length + 1)) * (index + 1);
        return new p5.Vector(x, y);
      });
    return pre.currentPositions.map((preCurrentPosition, index) => {
      const loopLength: number = Math.abs(
        loopEndPositions[index].x - loopStartPositions[index].x
      );
      const progressLength: number = loopLength * seq.loopProgressRates[index];
      if (seq.loopIsReverses[index]) {
        preCurrentPosition.x = loopStartPositions[index].x - progressLength;
        return preCurrentPosition;
      } else {
        preCurrentPosition.x = loopStartPositions[index].x + progressLength;
        return preCurrentPosition;
      }
    });
  })();
  const boxLAPositionArrays: type["boxLAPositionArrays"] = currentPositions.map(
    (currentPosition, trackIndex) => {
      // reset for new loop
      if (
        pre === undefined ||
        seq.loopIsSwitches[trackIndex] ||
        seq.loopIsOvers[trackIndex]
      ) {
        const offset = new p5.Vector().set(0, params.boxSize.y * -0.5);
        return [p5.Vector.add(loopStartPositions[trackIndex], offset)];
      }
      // add new position at last of array
      const preBoxLAPositionArray = pre.boxLAPositionArrays[trackIndex];
      const direction = seq.loopIsReverses[trackIndex] ? -1 : 1;
      const lastPosition =
        preBoxLAPositionArray[preBoxLAPositionArray.length - 1];
      const diff = Math.abs(currentPosition.x - lastPosition.x);
      const addedBoxNumber = Math.round(diff / params.boxSize.x);
      if (addedBoxNumber === 0) return preBoxLAPositionArray;
      const addedBoxPositions = Array.from(
        Array(addedBoxNumber),
        (_, index) => {
          const progress = new p5.Vector(
            params.boxSize.x * (index + 1) * direction,
            0
          );
          return p5.Vector.add(lastPosition, progress);
        }
      );
      return preBoxLAPositionArray.concat(addedBoxPositions);
    }
  );
  const currentBoxIndexes: type["currentBoxIndexes"] = boxLAPositionArrays.map(
    (boxLAPositionArray) => boxLAPositionArray.length - 1
  );
  const currentBoxHeightOffsets: type["currentBoxHeightOffsets"] =
    waveYPositionArrays.map((_, trackIndex) => {
      const currentBoxIndex = currentBoxIndexes[trackIndex];
      const currentWaveYPos = waveYPositionArrays[trackIndex][currentBoxIndex];
      const baseYPosition = wholeBuffer.startPositions[trackIndex].y;
      return currentWaveYPos - baseYPosition;
    });
  const boxHeightOffsetArrays: type["boxHeightOffsetArrays"] =
    currentBoxHeightOffsets.map((currentBoxHeightOffset, trackIndex) => {
      const currentArrayLength = boxLAPositionArrays[trackIndex].length;
      if (pre === undefined) {
        return Array.from(
          Array(currentArrayLength),
          () => currentBoxHeightOffset
        );
      }
      const preArrayLength = pre.boxLAPositionArrays[trackIndex].length;
      const addedBoxNumber = currentArrayLength - preArrayLength;
      if (addedBoxNumber < 0) {
        return Array.from(
          Array(currentArrayLength),
          () => currentBoxHeightOffset
        );
      }
      const preBoxHeightOffsetArray = pre.boxHeightOffsetArrays[trackIndex];
      if (addedBoxNumber === 0) {
        preBoxHeightOffsetArray[preBoxHeightOffsetArray.length - 1] =
          currentBoxHeightOffsets[trackIndex];
        return preBoxHeightOffsetArray;
      }
      // addedBoxNumber > 0
      const newBoxHeightOffsetArray = Array.from(
        Array(addedBoxNumber),
        () => currentBoxHeightOffsets[trackIndex]
      );
      return preBoxHeightOffsetArray.concat(newBoxHeightOffsetArray);
    });
  const amplitudes: type["amplitudes"] = currentBoxHeightOffsets.map(
    (currentBoxHeightOffset) => {
      const mappedAmp = tools.map(
        currentBoxHeightOffset,
        0,
        params.boxSize.y,
        params.granularVolumeMin,
        params.granularVolumeMax
      );
      const amp = tools.constrain(
        mappedAmp,
        params.granularVolumeMin,
        params.granularVolumeMax
      );
      return isNaN(amp) ? 0 : amp;
    }
  );
  const boxHues: type["boxHues"] = seq.loopIsReverses.map((loopIsReverse) => {
    const flag = loopIsReverse ? 0 : 1;
    return params.hues[flag];
  });
  const boxSaturations: type["boxSaturations"] = seq.loopIsReverses.map(
    (loopIsReverse, index) => {
      const flag = loopIsReverse ? 1 : 0;
      const baseSaturation = params.saturations[flag];
      return tools.map(
        seq.playbackRates[index],
        params.playbackRateMin,
        params.playbackRateMax,
        baseSaturation - params.saturationRange,
        baseSaturation + params.saturationRange
      );
    }
  );
  const boxBrightnessArrays: type["boxBrightnessArrays"] =
    boxLAPositionArrays.map((boxLAPositionArray, trackIndex) => {
      const volume = synthData.volumes[trackIndex].getValue();
      const finiteVolume = isFinite(volume as number) ? volume : 0;
      const flag = seq.loopIsReverses[trackIndex] ? 1 : 0;
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
      if (
        pre === undefined ||
        seq.loopIsOvers[trackIndex] ||
        seq.loopIsSwitches[trackIndex]
      )
        return boxLAPositionArray.map(() => constrainedBrightness);

      // update last element using volume
      const preBoxBrightnessArray = pre.boxBrightnessArrays[trackIndex];
      const differenceInElementNumber =
        boxLAPositionArray.length - preBoxBrightnessArray.length;
      if (differenceInElementNumber === 0) {
        preBoxBrightnessArray[preBoxBrightnessArray.length - 1] =
          constrainedBrightness;
        return preBoxBrightnessArray;
      }
      // differenceInElementNumber >= 1)
      const newBrightnesses = Array.from(
        Array(differenceInElementNumber),
        () => constrainedBrightness
      );
      const newBrightnessArray = preBoxBrightnessArray.concat(newBrightnesses);
      return newBrightnessArray;
    });
  const panValues: type["panValues"] = currentPositions.map((currentPosition) =>
    tools.map(currentPosition.x, 0, size, -1, 1)
  );
  return {
    loopStartPositions,
    loopStartCurrentPositions,
    loopEndPositions,
    loopEndCurrentPositions,
    currentPositions,
    boxNumbers,
    waveXPositionArrays,
    waveAngleSpeeds,
    waveAngleArrays,
    waveAmps,
    waveYPositionArrays,
    boxLAPositionArrays,
    currentBoxIndexes,
    currentBoxHeightOffsets,
    boxHeightOffsetArrays,
    amplitudes,
    boxHues,
    boxSaturations,
    boxBrightnessArrays,
    panValues,
  };
};

export const draw = (
  bufferSketch: type,
  seq: Seq.type,
  params: Params.type,
  s: p5
) => {
  const {
    loopStartCurrentPositions,
    loopEndCurrentPositions,
    boxLAPositionArrays,
    boxHues,
    boxSaturations,
    boxBrightnessArrays,
    waveXPositionArrays,
    waveYPositionArrays,
    boxHeightOffsetArrays,
    currentBoxIndexes,
  } = bufferSketch;
  // boxes
  s.push();
  s.noStroke();
  boxLAPositionArrays.forEach((boxLAPositionArray, trackIndex) => {
    const hue = boxHues[trackIndex];
    const saturations = boxBrightnessArrays[trackIndex];
    const brightness = boxSaturations[trackIndex];
    const boxHeightOffsetArray = boxHeightOffsetArrays[trackIndex];
    boxLAPositionArray.forEach((boxLAPosition, boxIndex) => {
      const boxHeightOffset = boxHeightOffsetArray[boxIndex];
      const saturation = saturations[boxIndex];
      s.fill(hue, saturation, brightness);
      s.rect(
        boxLAPosition.x,
        boxLAPosition.y + params.boxSize.y - boxHeightOffset,
        params.boxSize.x,
        boxHeightOffset
      );
    });
  });
  s.pop();
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
      loopStartPosition.y + params.boxSize.y * params.loopRangeLineYPosRate,
      loopEndCurrentPositions[index].x,
      loopEndCurrentPositions[index].y +
        params.boxSize.y * params.loopRangeLineYPosRate
    );
    s.pop();
  });
  s.pop();
  // wave
  s.push();
  waveXPositionArrays.forEach((waveXPositionArray, trackIndex) => {
    const currentBoxIndex = currentBoxIndexes[trackIndex];
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
          waveXPosition + params.boxSize.x,
          waveYPosition
        );
      }
    });
  });
  s.pop();
};
