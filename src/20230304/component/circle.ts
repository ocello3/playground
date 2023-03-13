import p5 from "p5";
import { tools } from "../../util/tools";
import * as Params from "../params";

export type circleType = {
  status: string;
  radius: number;
  center: p5.Vector;
  rattlingRate: number;
  rotationSpeed: number;
  angle: number;
  distal: p5.Vector;
  distals: p5.Vector[];
  color: number;
};

export type type = circleType[];

const getCircle = (
  index: number,
  params: Params.type,
  size: number,
  frameCount: number,
  preCircle?: circleType
): circleType => {
  const isInit = preCircle === undefined;
  const status = (() => {
    const max = size * params.circle.baseRadiusRate;
    if (isInit) {
      return "max";
    } else if (preCircle.status === "max") {
      return "rotate";
    } else if (preCircle.status === "rotate") {
      if (preCircle.radius < 0) return "min";
      return preCircle.status;
    } else if (preCircle.status === "min") {
      return "back";
    } else if (preCircle.status === "back") {
      if (preCircle.radius > max) return "max";
      return preCircle.status;
    }
    throw `preStatus: ${preCircle.status}`;
  })();
  const radius = (() => {
    const max = size * params.circle.baseRadiusRate;
    if (isInit || status === "max") return max;
    if (status === "rotate")
      return preCircle.radius - size * params.circle.radiusReducRate;
    if (status === "min") return 0;
    if (status === "back")
      return preCircle.radius + size * params.circle.radiusIncreRate;
    throw `status: ${status}`;
  })();
  const center = isInit
    ? (() => {
        const x = size * params.circle.centerXRate;
        const y = size * params.circle.centerYRate;
        return new p5.Vector(x, y);
      })()
    : preCircle.center;
  const rattlingRate = (() => {
    const seed = Math.random();
    const rattlings = params.circle.rattlings;
    if (seed < rattlings[0].prob) return rattlings[0].rattlingRate;
    if (seed < rattlings[1].prob) return rattlings[1].rattlingRate;
    if (seed < rattlings[2].prob) return rattlings[2].rattlingRate;
    return 1;
  })();
  const rotationSpeed = (() => {
    if (status === "rotate") {
      return (rattlingRate * (Math.PI * params.circle.bpm)) / 1800;
    }
    return 0;
  })();
  const angle = (() => {
    if (!isInit && status === "rotate" && preCircle.angle < Math.PI * 2)
      return preCircle.angle + preCircle.rotationSpeed;
    return 0;
  })();
  const distal = (() => {
    const incrementUnit = new p5.Vector(Math.cos(angle), Math.sin(angle));
    const increment = p5.Vector.mult(incrementUnit, radius);
    return p5.Vector.add(center, increment);
  })();
  const distals = (() => {
    if (isInit || status === "max") return [distal];
    if (status === "back") return preCircle.distals;
    const cycleFrameCounts =
      params.circle.baseRadiusRate / params.circle.radiusReducRate;
    const intervalFrameCounts = Math.floor(
      cycleFrameCounts / params.circle.trackArrayResolution
    );
    if (frameCount % intervalFrameCounts === 0)
      return preCircle.distals.concat(distal);
    return preCircle.distals;
  })();
  const color = isInit
    ? Math.floor(
        tools.map(
          index,
          0,
          params.circle.count - 1,
          params.circle.color.max,
          params.circle.color.min
        )
      )
    : preCircle.color;
  return {
    status,
    radius,
    center,
    rattlingRate,
    rotationSpeed,
    angle,
    distal,
    distals,
    color,
  };
};

export const get = (
  params: Params.type,
  size: number,
  frameCount: number,
  pre?: type
): type => {
  if (pre === undefined)
    return Array.from(Array(params.circle.count), (_, index) =>
      getCircle(index, params, size, frameCount)
    );
  return pre.map((preCircle, index) =>
    getCircle(index, params, size, frameCount, preCircle)
  );
};
