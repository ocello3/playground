import p5 from "p5";
import * as Segment from "./segment";
import * as Wave from "./wave";

export type type = {
  LLpositionArrays: p5.Vector[][];
  currentHeights: number[];
  heightArrays: number[][];
  positionArrays: p5.Vector[][];
};

export const get = (
  segment: Segment.type,
  wave: Wave.type,
  pre?: type
): type => {
  const isInit = pre === undefined;
  const LLpositionArrays = (() => {
    const offset = new p5.Vector(0, segment.size.y);
    return segment.positionArrays.map((segmentPositionArray, trackIndex) => {
      const LUpositions = segmentPositionArray.filter(
        (_, boxIndex) => boxIndex <= segment.currentIndexes[trackIndex]
      );
      return LUpositions.map((LUposition) => p5.Vector.add(LUposition, offset));
    });
  })();
  const currentHeights: type["currentHeights"] = wave.positionArrays.map(
    (wavePositionArray, trackIndex) => {
      const currentBoxIndex = segment.currentIndexes[trackIndex];
      const currentWavePos = wavePositionArray[currentBoxIndex];
      const LLposition = LLpositionArrays[trackIndex][currentBoxIndex];
      return LLposition.y - currentWavePos.y;
    }
  );
  const heightArrays: type["heightArrays"] = LLpositionArrays.map(
    (LLpositionArray, trackIndex) => {
      const currentHeight = currentHeights[trackIndex];
      const addedBoxCount = segment.addedSegments[trackIndex];
      const newBoxCount = LLpositionArray.length;
      if (isInit || addedBoxCount < 0)
        return Array.from(Array(newBoxCount), () => currentHeight);
      const preHeightArray = pre.heightArrays[trackIndex];
      if (addedBoxCount === 0)
        return preHeightArray.map((preHeight, boxIndex) =>
          boxIndex === preHeightArray.length - 1 ? currentHeight : preHeight
        );
      // addedBoxNumber > 0
      const newHeightArray = Array.from(
        Array(addedBoxCount),
        () => currentHeight
      );
      return preHeightArray.concat(newHeightArray);
    }
  );
  const positionArrays: type["positionArrays"] = LLpositionArrays.map(
    (LLpositionArray, trackIndex) =>
      LLpositionArray.map((LLposition, boxIndex) => {
        const offset = new p5.Vector(0, heightArrays[trackIndex][boxIndex]);
        return p5.Vector.sub(LLposition, offset);
      })
  );
  return {
    LLpositionArrays,
    currentHeights,
    heightArrays,
    positionArrays,
  };
};
