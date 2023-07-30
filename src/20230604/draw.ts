import p5 from "p5";
import * as Env from "./component/env";
import { drawFrame } from "../util/drawFrame";

export const draw = (env: Env.type, size: number, s: p5) => {
  s.push();
  s.beginShape();
  env.points.forEach((point) => s.vertex(point.x, point.y));
  s.endShape();
  s.pop();
  drawFrame(s, size);
};
