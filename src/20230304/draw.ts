import p5 from "p5";
import { drawFrame } from "../util/drawFrame";
import * as Circle from "./component/circle";

export const draw = (circle: Circle.type, size: number, s: p5) => {
  // --- circle
  s.push();
  s.circle(circle.distal.x, circle.distal.y, 10);
  s.pop();
  drawFrame(s, size);
};
