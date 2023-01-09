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
  // const isStill = (() => {
  //   if (isInit) return false;
  //   if (params.boader.angle === pre.angle) return true;
  //   return false;
  // })();
  // if (!isInit && isStill) return pre;
  const angle = (() => {
    if (isInit) return Math.PI;
    const newAngle = pre.angle + params.boader.speed;
    return newAngle < 0 ? Math.PI : newAngle;
  })();
  const vec = p5.Vector.fromAngle(angle);
  // const length = size / Math.cos(angle);
  const length = size * Math.sqrt(2);
  const width = length * 0.5 * Math.cos(angle);
  // const height = size * Math.tan(angle);
  const height = length * 0.5 * Math.sin(angle);
  // const margin = (size - height) * 0.5;
  // const start = new p5.Vector(0, margin + height);
  const start = new p5.Vector(size * 0.5 + width, size * 0.5 + height);
  // const end = new p5.Vector(size, margin);
  const end = new p5.Vector(size * 0.5 - width, size * 0.5 - height);
  return {
    vec,
    length,
    start,
    end,
    angle,
  };
};
