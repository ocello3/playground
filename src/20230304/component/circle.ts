import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Params from "../params";

export type type = {
  radius: number;
  center: p5.Vector;
  rotationSpeed: number;
  angle: number;
  distal: p5.Vector;
};

export const get = (params: Params.type, size: number, pre?: type): type => {
  const isInit = pre === undefined;
  const radius = size * params.circle.baseRadiusRate;
  const center = isInit
    ? (() => {
        const x = size * params.circle.centerXRate;
        const y = size * 0.5;
        return new p5.Vector(x, y);
      })()
    : pre.center;
  const rotationSpeed = (Math.PI * params.circle.rotationSpeedBpm) / 1800;
  const angle =
    isInit || pre.angle > Math.PI * 2
      ? 0
      : (() => {
          return pre.angle + pre.rotationSpeed;
        })();
  const distal = (() => {
    const incrementUnit = new p5.Vector(Math.cos(angle), Math.sin(angle));
    const increment = p5.Vector.mult(incrementUnit, radius);
    return p5.Vector.add(center, increment);
  })();
  return {
    radius,
    center,
    rotationSpeed,
    angle,
    distal,
  };
};
