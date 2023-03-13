import p5 from "p5";
import { drawFrame } from "../util/drawFrame";
import * as Circle from "./component/circle";
import * as Cum from "./component/cum";
import * as Params from "./params";

export const draw = (
  circles: Circle.type,
  cums: Cum.type,
  params: Params.type,
  size: number,
  s: p5
) => {
  // --- circle
  // center
  s.push();
  s.fill(0);
  s.stroke(0);
  s.circle(
    circles[0].center.x,
    circles[0].center.y,
    size * params.circle.sizeRate
  );
  // outline
  s.noFill();
  s.circle(
    circles[0].center.x,
    circles[0].center.y,
    size * params.circle.baseRadiusRate * 2
  );
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
  circles.forEach((circle) => {
    // distal circle
    s.push();
    s.fill(circle.color);
    s.stroke(circle.color);
    s.circle(circle.distal.x, circle.distal.y, size * params.circle.sizeRate);
    // distals - track
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
  });
  // --- cum
  cums.forEach((cum, index) => {
    s.push();
    s.fill(circles[index].color);
    s.stroke(circles[index].color);
    s.circle(cum.pos.x, cum.pos.y, size * params.circle.sizeRate);
    // poses
    s.noFill();
    s.beginShape();
    cum.poses.forEach((pos) => {
      s.curveVertex(pos.x, pos.y);
    });
    s.endShape();
    // --- connection line
    s.line(
      circles[index].distal.x,
      circles[index].distal.y,
      cum.pos.x,
      cum.pos.y
    );
    s.pop();
  });
  // --- frame
  drawFrame(s, size);
};
