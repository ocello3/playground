import p5 from "p5";
import { drawFrame } from "../util/drawFrame";
import * as Circle from "./component/circle";
import * as Cum from "./component/cum";

export const draw = (
  circle: Circle.type,
  cum: Cum.type,
  size: number,
  s: p5
) => {
  // --- circle
  s.push();
  s.circle(circle.distal.x, circle.distal.y, 10);
  s.pop();
  // --- cum
  s.push();
  s.circle(cum.pos.x, cum.pos.y, 10);
  s.pop();
  // --- frame
  drawFrame(s, size);
};
