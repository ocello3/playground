import p5 from "p5";
import * as InnerFrame from "./component/innerFrame";
import * as Env from "./component/env";
import { drawFrame } from "../util/drawFrame";

export const draw = (
  innerFrame: InnerFrame.type,
  env: Env.type,
  size: number,
  s: p5
) => {
  innerFrame.coordinates.forEach((coordinate, index) => {
    s.push();
    s.translate(coordinate.x, coordinate.y);
    s.stroke(1);
    // inside frames
    s.push();
    s.noFill();
    const size = innerFrame.sizes[index];
    s.rect(0, 0, size.x, size.y);
    s.pop();
    // ADSR
    s.push();
    s.noFill();
    s.beginShape();
    env.points.forEach((point) => s.vertex(point.x, point.y));
    s.endShape();
    s.pop();
    s.pop();
  });
  drawFrame(s, size);
};
