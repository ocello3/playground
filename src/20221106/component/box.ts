import p5 from "p5";
import * as Buffer from "./buffer";
import * as Segment from "./segment";
import * as Wave from "./wave";
import * as Color from "./color";

export type type = {
  currentBoxHeightOffsets: number[];
  boxHeightOffsetArrays: number[][];
};

export const get = (
  buffer: Buffer.type,
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
      if (segment.addedSegments[trackIndex] < 0) {
        return Array.from(
          Array(currentArrayLength),
          () => currentBoxHeightOffset
        );
      }
      const preBoxHeightOffsetArray = pre.boxHeightOffsetArrays[trackIndex];
      if (segment.addedSegments[trackIndex] === 0) {
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
  return {
    currentBoxHeightOffsets,
    boxHeightOffsetArrays,
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
