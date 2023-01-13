import p5 from "p5";
import * as Params from "../params";

export type type = {
  vec: p5.Vector;
  length: number;
  start: p5.Vector; // left
  end: p5.Vector; // right
  angle: number;
};

export const get = (params: Params.type, size: number, pre?: type): type => {
  const isInit = pre === undefined;
  const angle = (() => {
    if (isInit) return Math.PI;
    const newAngle = pre.angle - params.boader.speed;
    return newAngle < 0 ? Math.PI : newAngle;
  })();
  const vec = p5.Vector.fromAngle(angle);
  const length = size * Math.sqrt(2);
  const center = new p5.Vector(size * 0.5, size * 0.5);
  const range = new p5.Vector(
    length * 0.5 * Math.cos(angle),
    length * 0.5 * Math.sin(angle)
  );
  const start = p5.Vector.sub(center, range);
  const end = p5.Vector.add(center, range);
  return {
    vec,
    length,
    start,
    end,
    angle,
  };
};
