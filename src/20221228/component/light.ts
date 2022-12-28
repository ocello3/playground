import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Params from "../params";

export type type = {
  center: p5.Vector;
  radius: number;
  angle: number;
  pos: p5.Vector;
};

export const get = (params: Params.type, size: number, pre?: type): type => {
  const isInit = pre === undefined;
  const center = isInit ? new p5.Vector(size * 0.5, size * 0.5) : pre.center;
  const radius = (() => {
    if (isInit) {
      const distal = new p5.Vector(0, 0);
      return p5.Vector.dist(center, distal);
    }
    return pre.radius;
  })();
  const angle = (() => {
    if (isInit) return 0;
    return pre.angle + params.light.speed;
  })();
  const pos = (() => {
    const vec = p5.Vector.fromAngle(angle, radius);
    return p5.Vector.add(center, vec);
  })();
  return {
    center,
    radius,
    angle,
    pos,
  };
};
