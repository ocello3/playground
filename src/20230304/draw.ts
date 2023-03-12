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
  s.pop();
  // distals - track
  s.push();
  s.noFill();
  s.beginShape();
  s.curveVertex(circle.distals.slice(-1)[0].x, circle.distals.slice(-1)[0].y);
  circle.distals.forEach((distal) => {
    s.curveVertex(distal.x, distal.y);
  });
  s.curveVertex(circle.distals[0].x, circle.distals[0].y);
  if (circle.distals.length > 1)
    s.curveVertex(circle.distals[1].x, circle.distals[1].y);
  s.endShape();
  // connection line
  s.line(circle.center.x, circle.center.y, circle.distal.x, circle.distal.y);
  s.pop();
  // --- cum
  s.push();
  s.fill(0);
  s.circle(cum.pos.x, cum.pos.y, size * params.circle.sizeRate);
  s.pop();
  // poses
  s.push();
  s.noFill();
  s.beginShape();
  cum.poses.forEach((pos) => {
    s.curveVertex(pos.x, pos.y);
  });
  s.endShape();
  s.pop();
  // --- connection line
  s.push();
  s.line(circle.distal.x, circle.distal.y, cum.pos.x, cum.pos.y);
  s.pop();
  // --- cum guide
  s.push();
  s.line(
    0,
    size * params.circle.centerYRate,
    size,
    size * params.circle.centerYRate
  );
  s.pop();
  // --- frame
  drawFrame(s, size);
};
