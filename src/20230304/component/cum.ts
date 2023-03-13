import p5 from "p5";
import * as Params from "../params";
import * as Circle from "./circle";

type cumType = {
  dist: number;
  pos: p5.Vector;
  poses: p5.Vector[];
};

export type type = cumType[];

const getCum = (
  circle: Circle.circleType,
  params: Params.type,
  size: number,
  pre?: cumType
): cumType => {
  const isInit = pre === undefined;
  const dist = isInit ? size * params.cum.distRate : pre.dist;
  const pos = (() => {
    const y =
      circle.center.y + (0.5 - circle.rattlingRate) * params.cum.rattlingSize;
    const x =
      circle.distal.x -
      Math.pow(Math.pow(dist, 2) - Math.pow(circle.distal.y - y, 2), 0.5);
    return new p5.Vector(x, y);
  })();
  const poses = (() => {
    if (isInit) return [pos];
    const progress = new p5.Vector(0, circle.rotationSpeed * size * 0.3);
    const movedPoses = pre.poses.map((prePos) =>
      p5.Vector.add(prePos, progress)
    );
    const addedPoses = movedPoses.concat(pos);
    if (addedPoses.length < params.cum.posesLength) return addedPoses;
    return addedPoses.slice(1, addedPoses.length);
  })();
  return {
    dist,
    pos,
    poses,
  };
};

export const get = (
  circles: Circle.type,
  params: Params.type,
  size: number,
  pre?: type
): type => {
  if (pre === undefined)
    return circles.map((circle) => getCum(circle, params, size));
  return circles.map((circle, index) =>
    getCum(circle, params, size, pre[index])
  );
};
