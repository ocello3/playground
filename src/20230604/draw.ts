import p5 from "p5";
import * as InnerFrame from "./component/innerFrame";
import * as Env from "./component/env";
import * as ProgressLine from "./component/progressLine";
import { drawFrame } from "../util/drawFrame";

export const draw = (
  innerFrame: InnerFrame.type,
  env: Env.type,
  progressLine: ProgressLine.type,
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
    env.envs[index].points.forEach((point) => s.vertex(point.x, point.y));
    s.endShape();
    s.pop();
    // progressLine
    if (progressLine.isDraws[index]) {
      const point = progressLine.points[index];
      const length = progressLine.lengths[index];
      s.line(point.x, point.y, point.x, point.y + length);
    }
    s.pop();
  });
  drawFrame(s, size);
};
