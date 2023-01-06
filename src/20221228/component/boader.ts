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
  const isStill = (() => {
    if (isInit) return false;
    if (params.boader.angle === pre.angle) return true;
    return false;
  })();
  if (!isInit && isStill) return pre;
  const vec = p5.Vector.fromAngle(-1 * params.boader.angle);
  const length = size / Math.cos(params.boader.angle);
  const height = size * Math.tan(params.boader.angle);
  const margin = (size - height) * 0.5;
  const start = new p5.Vector(0, margin + height);
  const end = new p5.Vector(size, margin);
  return {
    vec,
    length,
    start,
    end,
    angle: params.boader.angle,
  };
};
