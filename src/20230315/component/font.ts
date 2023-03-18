import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Params from "../params";

export type type = {
  str: string;
  textWidths: number[];
  baseScaleRates: p5.Vector[];
  scaleRate_1: number;
  scaleRate_2: number;
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
  const baseScaleRates = isInit
    ? [...str].map(
        () =>
          new p5.Vector(
            size * params.font.baseScaleRate,
            size * params.font.baseScaleRate
          )
      )
    : pre.baseScaleRates;
  const scaleRate_1 = (Math.sin(s.millis() * 0.001) + 1) * 0.3;
  const scaleRate_2 = (Math.cos(s.millis() * 0.003) + 1) * 0.3;
  const scales = (() => {
    const restRate = 1 - scaleRate_1;
    const scaleRates = [
      scaleRate_1,
      restRate * scaleRate_2,
      restRate * (1 - scaleRate_2),
    ];
    return baseScaleRates.map((baseScale, index) =>
      p5.Vector.mult(baseScale, [scaleRates[index], 1])
    );
  })();
  const textWidths: number[] = [...str].map(
    (font, index) => s.textWidth(font) * scales[index].x
  );
  const poses = textWidths.map((_, index, self) =>
    self
      .slice(0, index)
      .reduce(
        (accumulator, currentValue) =>
          p5.Vector.add(accumulator, new p5.Vector(currentValue, 0)),
        new p5.Vector(0, size * 0.5)
      )
  );
  return {
    str,
    textWidths,
    baseScaleRates,
    scaleRate_1,
    scaleRate_2,
    scales,
    poses,
  };
};
