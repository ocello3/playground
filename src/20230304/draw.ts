import p5 from "p5";
import { drawFrame } from "../util/drawFrame";
import * as Circle from "./component/circle";
import * as Cum from "./component/cum";
import * as Params from "./params";

export const draw = (
  circle: Circle.type,
  cum: Cum.type,
  params: Params.type,
  size: number,
  s: p5
) => {
  // --- circle
  // distal
  s.push();
  s.fill(0);
  s.circle(circle.distal.x, circle.distal.y, size * params.circle.sizeRate);
  // center
  s.circle(circle.center.x, circle.center.y, size * params.circle.sizeRate);
  s.pop();
  // outline
  s.push();
  s.noFill();
  s.circle(
    circle.center.x,
    circle.center.y,
    size * params.circle.baseRadiusRate * 2
  );
  // distals
  s.push();
  s.noFill();
  s.beginShape();
  circle.distals.forEach((distal) => {
    s.curveVertex(distal.x, distal.y);
  });
  s.endShape();
  s.pop();
  // connection line
  s.line(circle.center.x, circle.center.y, circle.distal.x, circle.distal.y);
  s.pop();
  // --- cum
  s.push();
  s.fill(0);
  s.circle(cum.pos.x, cum.pos.y, size * params.circle.sizeRate);
  s.pop();
  // --- connection line
  s.push();
  s.line(circle.distal.x, circle.distal.y, cum.pos.x, cum.pos.y);
  s.pop();
  // --- cum guide
  s.push();
  s.line(0, size * 0.5, size, size * 0.5);
  s.pop();
  // --- frame
  drawFrame(s, size);
};
