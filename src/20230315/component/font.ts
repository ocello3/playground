import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Params from "../params";

export type type = {
  str: string;
  textWidths: number[];
  scales: p5.Vector[];
  poses: p5.Vector | p5.Vector[];
};

export const get = (
  params: Params.type,
  size: number,
  s: p5,
  pre?: type
): type => {
  const isInit = pre === undefined;
  const str = isInit ? "バタン" : pre.str;
  const scales = (() => {
    if (!isInit) return pre.scales;
    const scaleRates = [
      new p5.Vector(0.4, 0.8),
      new p5.Vector(2, 1.5),
      new p5.Vector(0.1, 0.3),
    ];
    return scaleRates.map((scaleRates) =>
      scaleRates.mult(size * params.font.baseScaleRate)
    );
  })();
  const textWidths: number[] = isInit
    ? [...str].map((font, index) => s.textWidth(font) * scales[index].x)
    : pre.textWidths;
  const poses = isInit
    ? textWidths.map((_, index, self) =>
        self
          .slice(0, index)
          .reduce(
            (accumulator, currentValue) =>
              p5.Vector.add(accumulator, new p5.Vector(currentValue, 0)),
            new p5.Vector(0, size * 0.5)
          )
      )
    : pre.poses;
  return {
    str,
    textWidths,
    scales,
    poses,
  };
};
