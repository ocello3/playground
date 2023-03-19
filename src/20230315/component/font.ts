import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Params from "../params";

export type fontType = {
  compartmentOrigin: p5.Vector;
  compartmentScale: number;
  textWidths: number[];
  baseScales: p5.Vector[];
  scale_1vs2and3: number;
  scale_2vs3: number;
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
  const scale_1vs2and3 = (Math.sin(s.millis() * 0.001) + 1) * 0.3;
  const scale_2vs3 = (Math.cos(s.millis() * 0.003) + 1) * 0.3;
  const scales = (() => {
    const restRate = 1 - scale_1vs2and3;
    const scaleRates = [
      scale_1vs2and3,
      restRate * scale_2vs3,
      restRate * (1 - scale_2vs3),
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
