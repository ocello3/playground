import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Params from "../params";
import * as Rate_1 from "./rate_1";
import * as Rate_2 from "./rate_2";

export type fontType = {
  compartmentOrigin: p5.Vector;
  compartmentScale: number;
  textWidths: number[];
  baseScales: p5.Vector[];
  scale_1vs2and3: Rate_1.type;
  scale_2vs3: Rate_2.type;
  scales: p5.Vector[];
  poses: p5.Vector | p5.Vector[];
};

export type type = fontType[];

const getFont = (
  compartmentIndex: number,
  params: Params.type,
  size: number,
  s: p5,
  pre?: fontType
): fontType => {
  const isInit = pre === undefined;
  const compartmentOrigin = isInit
    ? new p5.Vector(
        (compartmentIndex % 2) * size * 0.5,
        Math.floor(compartmentIndex / 2) * size * 0.5
      )
    : pre.compartmentOrigin;
  const compartmentScale = 0.5;
  const baseScales = isInit
    ? [...params.font.str].map(
        (_, index) =>
          new p5.Vector(
            size * params.font.baseScaleRates[index],
            size * params.font.baseScaleRates[index]
          )
      )
    : pre.baseScales;
  const scale_1vs2and3 = isInit ? Rate_1.get() : Rate_1.get(pre.scale_1vs2and3);
  const scale_2vs3 = isInit
    ? Rate_2.get(scale_1vs2and3.status)
    : Rate_2.get(scale_1vs2and3.status, pre.scale_2vs3);
  const scales = (() => {
    const restRate = 1 - scale_1vs2and3.rate;
    const scaleRates = [
      scale_1vs2and3.rate,
      restRate * scale_2vs3.rate,
      restRate * (1 - scale_2vs3.rate),
    ];
    return baseScales.map((baseScale, index) =>
      p5.Vector.mult(baseScale, [scaleRates[index], 1])
    );
  })();
  const textWidths: number[] = [...params.font.str].map(
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
    compartmentOrigin,
    compartmentScale,
    textWidths,
    baseScales,
    scale_1vs2and3,
    scale_2vs3,
    scales,
    poses,
  };
};

export const get = (
  params: Params.type,
  size: number,
  s: p5,
  pre?: type
): type => {
  const isInit = pre === undefined;
  return isInit
    ? Array.from(Array(params.font.count), (_, index) =>
        getFont(index, params, size, s)
      )
    : pre.map((preFont, index) => getFont(index, params, size, s, preFont));
};
