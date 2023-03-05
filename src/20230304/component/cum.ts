import p5 from "p5";
import * as Params from "../params";
import * as Circle from "./circle";

export type type = {
  dist: number;
  pos: p5.Vector;
};

export const get = (
  circle: Circle.type,
  params: Params.type,
  size: number,
  pre?: type
): type => {
  const isInit = pre === undefined;
  const dist = isInit ? size * params.cum.distRate : pre.dist;
  const pos = (() => {
    const y = circle.center.y;
    const x =
      circle.distal.x -
      Math.pow(Math.pow(dist, 2) - Math.pow(circle.distal.y - y, 2), 0.5);
    return new p5.Vector(x, y);
  })();
  return {
    dist: dist,
    pos: pos,
  };
};
