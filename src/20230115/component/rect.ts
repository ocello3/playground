import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Euclid from "./euclid";
// import * as Params from "../params";

export type type = {
  sizes: p5.Vector[];
  positions: p5.Vector[];
  rates: {
    area: number;
    pairIndex: number;
    rectIndex: number;
  }[];
};

export const get = (
  euclid: Euclid.type,
  // params: Params.type,
  size: number
): type => {
  const fullSize = (() => {
    const size_0 = euclid[0].divisor;
    const size_1 = euclid[1].divisor;
    const count_0 = Math.floor(euclid[0].dividend / euclid[0].divisor);
    const width = euclid[1] === undefined ? size_0 : size_0 * count_0 + size_1;
    return { x: width, y: size_0 };
  })();
  const scale = new p5.Vector(size / fullSize.x, size / fullSize.y);
  const directions = euclid.map((_, index) => (index % 2 === 0 ? "x" : "y"));
  const nestedSizes: p5.Vector[][] = euclid.map((unit) => {
    if (unit.divisor === 0) return [new p5.Vector(0, 0)];
    const count = Math.floor(unit.dividend / unit.divisor);
    return Array.from(Array(count), () => p5.Vector.mult(scale, unit.divisor));
  });
  const progresses = nestedSizes
    .map((size, index) =>
      size.map((size) =>
        directions[index] === "x"
          ? new p5.Vector(size.x, 0)
          : new p5.Vector(0, size.y)
      )
    )
    .flat();
  const positions = progresses.map((_, index, progresses) => {
    if (index === 0) return new p5.Vector(0, 0);
    return progresses
      .slice(0, index)
      .reduce((acu, cur) => p5.Vector.add(acu, cur));
  });
  const rates = nestedSizes
    .map((sizes, pairIndex) => {
      const pairIndexRate = pairIndex / nestedSizes.length;
      return sizes.map((size, rectIndex) => {
        const areaRate =
          nestedSizes[0][0] === undefined
            ? 1
            : (size.x * size.y) / (nestedSizes[0][0].x * nestedSizes[0][0].y);
        const rectIndexRate = rectIndex / sizes.length;
        return {
          area: areaRate,
          pairIndex: pairIndexRate,
          rectIndex: rectIndexRate,
        };
      });
    })
    .flat();
  return {
    sizes: nestedSizes.flat(),
    positions,
    rates,
  };
};
