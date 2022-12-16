import p5 from "p5";
import * as Params from "../params";
import * as Seq from "../sound/sequence";
import * as SynthData from "../sound/synthData";
import * as Buffer from "./buffer";
import * as Loop from "./loop";
import * as Segment from "./segment";
import { tools } from "../../util/tools";

export type type = {
  currentPositions: p5.Vector[];
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
  buffer: Buffer.type,
  loop: Loop.type,
  segment: Segment.type,
  pre?: type
) => {
  const isInit = pre === undefined;
  const waveXPositionArrays: type["waveXPositionArrays"] =
    loop.startPositions.map((loopStartPosition, trackIndex) => {
      if (!isInit && !seq.loopIsSwitches[trackIndex])
        return pre.waveXPositionArrays[trackIndex];
      const boxNumber = segment.boxNumbers[trackIndex];
      const direction = seq.loopIsReverses[trackIndex] ? -1 : 1;
      return Array.from(
        Array(boxNumber),
        (_, boxIndex) =>
          loopStartPosition.x + segment.boxSize.x * boxIndex * direction
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
        const widthPerAngle = waveLength / segment.boxNumbers[trackIndex];
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
        params.ampRateMin * segment.boxSize.y,
        params.ampRateMax * segment.boxSize.y
      );
    }
  );
  const waveYPositionArrays: type["waveYPositionArrays"] = waveAngleArrays.map(
    (preWaveAngleArray, trackIndex) => {
      const amp = waveAmps[trackIndex];
      const baseYPosition = buffer.startPositions[trackIndex].y;
      return preWaveAngleArray.map(
        (angle) => tools.map(Math.sin(angle), -1, 1, 0, 1) * amp + baseYPosition
      );
    }
  );
  const currentPositions: type["currentPositions"] = (() => {
    if (isInit)
      return synthData.durations.map((_, index) => {
        // for 4th buffer, fit to right end
        const x = buffer.margins[index];
        const y = (size / (synthData.durations.length + 1)) * (index + 1);
        return new p5.Vector(x, y);
      });
    return pre.currentPositions.map((preCurrentPosition, index) => {
      const loopLength: number = Math.abs(
        loop.endPositions[index].x - loop.startPositions[index].x
      );
      const progressLength: number = loopLength * seq.loopProgressRates[index];
      if (seq.loopIsReverses[index]) {
        preCurrentPosition.x = loop.startPositions[index].x - progressLength;
        return preCurrentPosition;
      } else {
        preCurrentPosition.x = loop.startPositions[index].x + progressLength;
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
        const offset = new p5.Vector().set(0, segment.boxSize.y * -0.5);
        return [p5.Vector.add(loop.startPositions[trackIndex], offset)];
      }
      // add new position at last of array
      const preBoxLAPositionArray = pre.boxLAPositionArrays[trackIndex];
      const direction = seq.loopIsReverses[trackIndex] ? -1 : 1;
      const lastPosition =
        preBoxLAPositionArray[preBoxLAPositionArray.length - 1];
      const diff = Math.abs(currentPosition.x - lastPosition.x);
      const addedBoxNumber = Math.round(diff / segment.boxSize.x);
      if (addedBoxNumber === 0) return preBoxLAPositionArray;
      const addedBoxPositions = Array.from(
        Array(addedBoxNumber),
        (_, index) => {
          const progress = new p5.Vector(
            segment.boxSize.x * (index + 1) * direction,
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
      const baseYPosition = buffer.startPositions[trackIndex].y;
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
        segment.boxSize.y,
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
    currentPositions,
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
  segment: Segment.type,
  seq: Seq.type,
  params: Params.type,
  s: p5
) => {
  const {
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
        boxLAPosition.y + segment.boxSize.y - boxHeightOffset,
        segment.boxSize.x,
        boxHeightOffset
      );
    });
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
          waveXPosition + segment.boxSize.x,
          waveYPosition
        );
      }
    });
  });
  s.pop();
};
