import p5 from "p5";
import * as InnerFrame from "./innerFrame";
import * as Progress from "./progress";
import * as Params from "../params";

export type type = {
  isDraws: boolean[];
  currentRectId: {
    arrayIndex: number;
    rectIndex: number;
  };
  pointArrays: p5.Vector[][];
  alphaArrays: number[][];
  rectSizes: p5.Vector[];
  preSeqId: number;
};

export const get = (
  innerFrame: InnerFrame.type,
  progress: Progress.type,
  params: Params.type,
  pre?: type
): type => {
  const isInit = pre === undefined;
  const isDraws = Array.from(
    Array(params.count),
    (_, index) => index === params.currentSeqId
  );
  const rectSizes = isInit
    ? innerFrame.sizes.map((size, arrayIndex) => {
        const x = innerFrame.sizes[arrayIndex].x * params.rectWidth;
        return new p5.Vector(x, size.y);
      })
    : pre.rectSizes;
  const pointArrays = isInit
    ? isDraws.map((_, index) => {
        const rectCount = Math.ceil(1 / params.rectWidth);
        const pointArray = Array.from(Array(rectCount), (_, rectIndex) => {
          const x = rectSizes[index].x * rectIndex;
          const y = 0;
          return new p5.Vector(x, y);
        });
        return pointArray;
      })
    : pre.pointArrays;
  const currentRectId = (() => {
    const arrayIndex = isDraws.findIndex((element) => element === true);
    const currentPos = innerFrame.sizes[arrayIndex].x * progress.progress;
    const rectIndex = pointArrays[arrayIndex].findIndex(
      (point) =>
        point.x < currentPos && currentPos < point.x + rectSizes[arrayIndex].x
    );
    return {
      arrayIndex,
      rectIndex,
    };
  })();
  const isReset = isInit
    ? false
    : params.currentSeqId === 0 && pre.preSeqId === params.count - 1;
  const alphaArrays =
    isInit || isReset
      ? pointArrays.map((pointArray) => pointArray.map(() => 0))
      : pre.alphaArrays.map((preAlphaArray, arrayIndex) => {
          if (isDraws[arrayIndex])
            return preAlphaArray.map((preAlpha, rectIndex) => {
              if (
                pre.currentRectId.rectIndex < rectIndex &&
                rectIndex <= currentRectId.rectIndex
              )
                return 155; // update alpha
              return preAlpha;
            });
          return preAlphaArray;
        });
  const preSeqId = params.currentSeqId;
  return {
    isDraws,
    pointArrays,
    currentRectId,
    alphaArrays,
    rectSizes,
    preSeqId,
  };
};
