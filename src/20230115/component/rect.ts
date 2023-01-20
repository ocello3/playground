import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Euclid from "./euclid";
// import * as Params from "../params";

export type type = {
  sizes: p5.Vector[];
  positions: p5.Vector[];
};

export const get = (
  euclid: Euclid.type,
  // params: Params.type,
  size: number
): type => {
  // const isInit = pre === undefined;
  const wholeSize = (() => {
    const height = euclid[0].divisor;
    const width =
      euclid[1] === undefined
        ? height
        : height * Math.floor(euclid[0].dividend / euclid[0].divisor) +
          euclid[1].divisor;
    return { x: width, y: height };
  })();
  const scale = new p5.Vector(size / wholeSize.x, size / wholeSize.y);
  const directions = euclid.map((_, index) => (index % 2 === 0 ? "x" : "y"));
  // const sizes: p5.Vector[][] = euclid.map((unit, index) => {
  const sizes: p5.Vector[][] = euclid.map((unit) => {
    if (unit.divisor === 0) return [new p5.Vector(0, 0)];
    // create multiple rects based on quotient
    // const count = index === 0 ? 1 : Math.floor(unit.dividend / unit.divisor);
    const count = Math.floor(unit.dividend / unit.divisor);
    // return Array.from(Array(count), () => p5.Vector.mult(scale, unit.divisor));
    // if (index === 0) return [new p5.Vector(0, 0)];
    return Array.from(Array(count), () => p5.Vector.mult(scale, unit.divisor));
  });
  const progresses = sizes
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
  return {
    sizes: sizes.flat(),
    positions,
  };
};
