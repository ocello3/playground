import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Euclid from "./euclid";
// import * as Params from "../params";

export type type = {
  sizes: p5.Vector[];
  positions: p5.Vector[];
};

export const get = (euclid: Euclid.type, size: number): type => {
  // const isInit = pre === undefined;
  const scale = (size / euclid[0].divisor) * 0.5;
  const sizes = euclid.map((unit) => {
    const size = unit.divisor * scale;
    return new p5.Vector(size, size);
  });
  const progresses = sizes.map((size, index) => {
    if (index % 2 === 0) return new p5.Vector(size.x, 0);
    return new p5.Vector(0, size.y);
  });
  const positions = progresses.map((_, index, progresses) => {
    if (index === 0) return new p5.Vector(0, 0);
    return progresses
      .slice(0, index)
      .reduce((acu, cur) => p5.Vector.add(acu, cur));
  });
  return {
    sizes,
    positions,
  };
};
