import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Params from "../params";

export type type = {
  start: p5.Vector; // center
  length: number;
  angle: number;
  vec: p5.Vector;
  end: p5.Vector;
};

export const get = (params: Params.type, size: number, pre?: type): type => {
  const isInit = pre === undefined;
  const start = isInit ? new p5.Vector(size * 0.5, size * 0.5) : pre.start;
  const length = (() => {
    if (isInit) {
      const distal = new p5.Vector(0, 0);
      return p5.Vector.dist(start, distal);
    }
    return pre.length;
  })();
  const angle = (() => {
    if (isInit) return 0;
    return pre.angle + params.light.speed;
  })();
  const vec = p5.Vector.fromAngle(angle, length);
  const end = p5.Vector.add(start, p5.Vector.mult(vec, length));
  return {
    start,
    length,
    angle,
    vec,
    end,
  };
};
