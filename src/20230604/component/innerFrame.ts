import p5 from "p5";
import * as Params from "../params";

export type type = {
  coordinates: p5.Vector[];
  sizes: p5.Vector[];
};

export const get = (params: Params.type, size: number, pre?: type): type => {
  const isInit = pre === undefined;
  if (!isInit) return pre;
  const hMargin = size * params.hMargin;
  const vMargin = size * params.vMargin;
  const hTotalMargin = hMargin * 2;
  const vTotalMargin = vMargin * (params.count + 1);
  const hSize = size - hTotalMargin;
  const vSize = (size - vTotalMargin) / params.count;
  const coordinates = Array.from(Array(params.count), (_, index) => {
    const x = hMargin;
    const y = vMargin * (index + 1) + vSize * index;
    return new p5.Vector(x, y);
  });
  const sizes = coordinates.map(() => new p5.Vector(hSize, vSize));
  return {
    coordinates,
    sizes,
  };
};
