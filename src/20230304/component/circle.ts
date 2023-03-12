import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Params from "../params";

export type type = {
  status: string;
  radius: number;
  center: p5.Vector;
  rattlingRate: number;
  rotationSpeed: number;
  angle: number;
  distal: p5.Vector;
  distals: p5.Vector[];
};

export const get = (
  params: Params.type,
  size: number,
  frameCount: number,
  pre?: type
): type => {
  const isInit = pre === undefined;
  const status = (() => {
    const max = size * params.circle.baseRadiusRate;
    if (isInit) {
      return "max";
    } else if (pre.status === "max") {
      return "rotate";
    } else if (pre.status === "rotate") {
      if (pre.radius < 0) return "min";
      return pre.status;
    } else if (pre.status === "min") {
      return "back";
    } else if (pre.status === "back") {
      if (pre.radius > max) return "max";
      return pre.status;
    }
    throw `preStatus: ${pre.status}`;
  })();
  const radius = (() => {
    const max = size * params.circle.baseRadiusRate;
    if (isInit || status === "max") return max;
    if (status === "rotate")
      return pre.radius - size * params.circle.radiusReducRate;
    if (status === "min") return 0;
    if (status === "back")
      return pre.radius + size * params.circle.radiusIncreRate;
    throw `status: ${status}`;
  })();
  const center = isInit
    ? (() => {
        const x = size * params.circle.centerXRate;
        const y = size * params.circle.centerYRate;
        return new p5.Vector(x, y);
      })()
    : pre.center;
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
    if (!isInit && status === "rotate" && pre.angle < Math.PI * 2)
      return pre.angle + pre.rotationSpeed;
    return 0;
  })();
  const distal = (() => {
    const incrementUnit = new p5.Vector(Math.cos(angle), Math.sin(angle));
    const increment = p5.Vector.mult(incrementUnit, radius);
    return p5.Vector.add(center, increment);
  })();
  const distals = (() => {
    if (isInit || status === "max") return [distal];
    if (status === "back") return pre.distals;
    const cycleFrameCounts =
      params.circle.baseRadiusRate / params.circle.radiusReducRate;
    const intervalFrameCounts = Math.floor(
      cycleFrameCounts / params.circle.trackArrayResolution
    );
    if (frameCount % intervalFrameCounts === 0)
      return pre.distals.concat(distal);
    return pre.distals;
  })();
  return {
    status,
    radius,
    center,
    rattlingRate,
    rotationSpeed,
    angle,
    distal,
    distals,
  };
};
