import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Params from "../params";

export type type = {
  start: p5.Vector; // center
  length: number;
  angle: number;
  vec: p5.Vector;
  end: p5.Vector;
  isShadow: boolean;
};

export const get = (params: Params.type, size: number, pre?: type): type => {
  const isInit = pre === undefined;
  const start = isInit ? new p5.Vector(size * 0.5, size * 0.5) : pre.start;
  const length = (() => {
    if (isInit) {
      const distal = new p5.Vector(0, 0);
      return p5.Vector.dist(start, distal) * params.light.distRate;
    }
    return pre.length;
  })();
  const angle = (() => {
    if (isInit) return Math.PI + params.boader.angle;
    const newAngle = pre.angle + params.light.speed;
    // return newAngle > Math.PI * 2 ? Math.PI + params.boader.angle : newAngle;
    return newAngle;
  })();
  const vec = p5.Vector.fromAngle(-1 * angle);
  const end = p5.Vector.add(start, p5.Vector.mult(vec, length));
  const isShadow = (() => {
    const relativeAngle = angle % (Math.PI * 2);
    const condition_1 = relativeAngle <= params.boader.angle;
    const condition_2 = relativeAngle >= Math.PI + params.boader.angle;
    return condition_1 || condition_2;
  })();
  return {
    start,
    length,
    angle,
    vec,
    end,
    isShadow,
  };
};
