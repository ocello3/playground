import p5 from "p5";
import { drawFrame } from "../util/drawFrame";
import * as Point from "./component/point";

export const draw = (point: Point.type, size: number, s: p5) => {
  s.push();
  s.circle(point.pos.x, point.pos.y, size * 0.01);
  s.pop();
  drawFrame(s, size);
};
