import p5 from "p5";
import { tools } from "../../util/tools";
// import { tools } from "../../util/tools";
import * as Boader from "./boader";
import * as Params from "../params";

export type type = {
  start: p5.Vector; // center
  length: number;
  angle: number;
  angleRate: number;
  vec: p5.Vector;
  end: p5.Vector;
  isShadow: boolean; // true in shadow
  isSwitch: boolean; // true when isShadow is changed
};

export const get = (
  boader: Boader.type,
  params: Params.type,
  size: number,
  pre?: type
): type => {
  const isInit = pre === undefined;
  const angle = (() => {
    if (isInit) return Math.PI + boader.angle;
    const newAngle = pre.angle + params.light.speed;
    // return newAngle > Math.PI * 2 ? Math.PI + params.boader.angle : newAngle;
    return newAngle > Math.PI * 2 ? newAngle - Math.PI * 2 : newAngle;
  })();
  const isShadow = (() => {
    const lower = angle <= boader.angle;
    const upper = angle >= Math.PI + boader.angle;
    return lower || upper;
  })();
  const isSwitch = isInit ? true : isShadow != pre.isShadow;
  const angleRate = (() => {
    const rawRate = angle / (Math.PI * 2) - boader.angle / (Math.PI * 2);
    const rate = rawRate < 0 ? 1 + rawRate : rawRate;
    if (isShadow) {
      const constrainedRate = rate - 0.5; // 0 - 0.5
      return tools.map(Math.abs(constrainedRate - 0.25), 0, 0.25, 1, 0);
    }
    // rate: 0 - 0.5
    return tools.map(Math.abs(rate - 0.25), 0, 0.25, 1, 0);
  })();
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
    angleRate,
    vec,
    end,
    isShadow,
    isSwitch,
  };
};
