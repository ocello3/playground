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
  const pointArrays = isInit
    ? isDraws.map((_, index) => {
        const hRect = innerFrame.sizes[index].x * params.hRect;
        const rectCount = Math.floor(1 / params.hRect);
        const pointArray = Array.from(Array(rectCount), (_, rectIndex) => {
          const x = hRect * rectIndex;
          const y = 0;
          return new p5.Vector(x, y);
        });
        return pointArray;
      })
    : pre.pointArrays;
  const currentRectId = (() => {
    const arrayIndex = isDraws.findIndex((element) => element === true);
    const currentPos = innerFrame.sizes[arrayIndex].x * progress.progress;
    const hRect = innerFrame.sizes[arrayIndex].x * params.hRect;
    const rectIndex = pointArrays[arrayIndex].findIndex(
      (point) => point.x < currentPos && currentPos < point.x + hRect
    );
    return {
      arrayIndex,
      rectIndex,
    };
  })();
  const alphaArrays = (() => {
    if (isInit) return pointArrays.map((pointArray) => pointArray.map(() => 0));
    const isReset =
      params.currentSeqId === 0 && pre.preSeqId === params.count - 1;
    if (isReset)
      return pointArrays.map((pointArray) => pointArray.map(() => 0));
    if (isReset) throw "isReset";
    return pointArrays.map((pointArray, arrayIndex) => {
      if (isDraws[arrayIndex])
        return pointArray.map((_, rectIndex) => {
          if (
            pre.currentRectId.rectIndex < rectIndex &&
            rectIndex <= currentRectId.rectIndex
          )
            return 155; // update alpha
          return pre.alphaArrays[arrayIndex][rectIndex];
        });
      return pre.alphaArrays[arrayIndex];
    });
  })();
  const rectSizes = isInit
    ? innerFrame.sizes.map((size, arrayIndex) => {
        const x = innerFrame.sizes[arrayIndex].x * params.hRect;
        return new p5.Vector(x, size.y);
      })
    : pre.rectSizes;
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
