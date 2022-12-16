import p5 from "p5";
import * as Params from "../params";
import * as Buffer from "./buffer";
import * as Loop from "./loop";
import * as Segment from "./segment";
import * as Wave from "./wave";
import * as Color from "./color";
import { tools } from "../../util/tools";

export type type = {
  currentBoxHeightOffsets: number[];
  boxHeightOffsetArrays: number[][];
  amplitudes: number[];
  panValues: number[];
};

export const get = (
  params: Params.type,
  canvasSize: number,
  buffer: Buffer.type,
  loop: Loop.type,
  segment: Segment.type,
  wave: Wave.type,
  pre?: type
) => {
  const currentBoxHeightOffsets: type["currentBoxHeightOffsets"] =
    wave.yPositionArrays.map((_, trackIndex) => {
      const currentBoxIndex = segment.currentIndexes[trackIndex];
      const currentWaveYPos = wave.yPositionArrays[trackIndex][currentBoxIndex];
      const baseYPosition = buffer.startPositions[trackIndex].y;
      return currentWaveYPos - baseYPosition;
    });
  const boxHeightOffsetArrays: type["boxHeightOffsetArrays"] =
    currentBoxHeightOffsets.map((currentBoxHeightOffset, trackIndex) => {
      const currentArrayLength = segment.positionArrays[trackIndex].length;
      if (pre === undefined) {
        return Array.from(
          Array(currentArrayLength),
          () => currentBoxHeightOffset
        );
      }
      const addedBoxNumber = segment.addedSegments[trackIndex];
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
        segment.size.y,
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
  const panValues: type["panValues"] = loop.currentPositions.map(
    (currentPosition) => tools.map(currentPosition.x, 0, canvasSize, -1, 1)
  );
  return {
    currentBoxHeightOffsets,
    boxHeightOffsetArrays,
    amplitudes,
    panValues,
  };
};

export const draw = (
  box: type,
  segment: Segment.type,
  color: Color.type,
  s: p5
) => {
  const { boxHeightOffsetArrays } = box;
  // boxes
  s.push();
  s.noStroke();
  segment.positionArrays.forEach((boxLAPositionArray, trackIndex) => {
    const hue = color.hues[trackIndex];
    const saturations = color.brightnessArrays[trackIndex];
    const brightness = color.saturations[trackIndex];
    const boxHeightOffsetArray = boxHeightOffsetArrays[trackIndex];
    boxLAPositionArray.forEach((boxLAPosition, boxIndex) => {
      const boxHeightOffset = boxHeightOffsetArray[boxIndex];
      const saturation = saturations[boxIndex];
      s.fill(hue, saturation, brightness);
      s.rect(
        boxLAPosition.x,
        boxLAPosition.y + segment.size.y - boxHeightOffset,
        segment.size.x,
        boxHeightOffset
      );
    });
  });
  s.pop();
  // wave
};
