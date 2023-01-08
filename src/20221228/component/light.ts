import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Params from "../params";

export type type = {
  start: p5.Vector; // center
  length: number;
  angle: number;
  vec: p5.Vector;
  end: p5.Vector;
  isShadow: boolean; // true in shadow
  isSwitch: boolean; // true when isShadow is changed
};

export const get = (params: Params.type, size: number, pre?: type): type => {
  const isInit = pre === undefined;
  const angle = (() => {
    if (isInit) return Math.PI + params.boader.angle;
    const newAngle = pre.angle + params.light.speed;
    // return newAngle > Math.PI * 2 ? Math.PI + params.boader.angle : newAngle;
    return newAngle > Math.PI * 2 ? newAngle - Math.PI * 2 : newAngle;
  })();
  const isShadow = (() => {
    const lower = angle <= params.boader.angle;
    const upper = angle >= Math.PI + params.boader.angle;
    return lower || upper;
  })();
  const isSwitch = isInit ? true : isShadow != pre.isShadow;
  const start = isInit ? new p5.Vector(size * 0.5, size * 0.5) : pre.start;
  const length = (() => {
    const calc = (rate: number) => {
      const distal = new p5.Vector(0, 0);
      return p5.Vector.dist(start, distal) * rate;
    };
    if (isSwitch || isInit) {
      if (isShadow) return calc(params.light.shadowDistRate);
      return calc(params.light.lightDistRate);
    }
    return pre.length;
  })();
  const vec = p5.Vector.fromAngle(-1 * angle);
  const end = p5.Vector.add(start, p5.Vector.mult(vec, length));
  return {
    start,
    length,
    angle,
    vec,
    end,
    isShadow,
    isSwitch,
  };
};
