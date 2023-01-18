import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Euclid from "./euclid";
import * as Params from "../params";

export type type = {
  sizes: number[];
  positions: p5.Vector[];
};

export const get = (
  euclid: Euclid.type,
  params: Params.type,
  size: number
): type => {
  // const isInit = pre === undefined;
  const scale = (size / euclid[0].divisor) * params.rect.scale;
  const sizes = euclid.map((unit, index) => {
    if (unit.divisor === 0) return [0];
    const count = index === 0 ? 1 : Math.floor(unit.dividend / unit.divisor);
    return Array.from(Array(count), () => unit.divisor * scale);
  });
  const directions = sizes.map((_, index) => (index % 2 === 0 ? "x" : "y"));
  const progresses = sizes
    .map((size, index) =>
      size.map((size) =>
        directions[index] === "x"
          ? new p5.Vector(size, 0)
          : new p5.Vector(0, size)
      )
    )
    .flat();
  const positions = progresses.map((_, index, progresses) => {
    if (index === 0) return new p5.Vector(0, 0);
    return progresses
      .slice(0, index)
      .reduce((acu, cur) => p5.Vector.add(acu, cur));
  });
  return {
    sizes: sizes.flat(),
    positions,
  };
};
