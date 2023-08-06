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
  innerFrame.coordinates.forEach((coordinate, arrayIndex) => {
    s.push();
    s.translate(coordinate.x, coordinate.y);
    s.stroke(1);
    // inside frames
    s.push();
    s.noFill();
    const size = innerFrame.sizes[arrayIndex];
    s.rect(0, 0, size.x, size.y);
    s.pop();
    // ADSR
    s.push();
    s.noFill();
    s.beginShape();
    const envPos = env.envs[arrayIndex];
    s.vertex(envPos.startPos.x, envPos.startPos.y);
    s.vertex(envPos.attackedPos.x, envPos.attackedPos.y);
    s.vertex(envPos.decayedPos.x, envPos.decayedPos.y);
    s.vertex(envPos.sustainedPos.x, envPos.sustainedPos.y);
    s.vertex(envPos.endPos.x, envPos.endPos.y);
    s.endShape();
    s.pop();
    // progressLine
    s.push();
    s.noStroke();
    const pointArray = progressLine.pointArrays[arrayIndex];
    const alphaArray = progressLine.alphaArrays[arrayIndex];
    pointArray.forEach((point, pointIndex) => {
      s.push();
      s.fill(0, alphaArray[pointIndex]);
      s.rect(
        point.x,
        point.y,
        progressLine.rectSizes[arrayIndex].x,
        progressLine.rectSizes[arrayIndex].y
      );
      s.pop();
    });
    s.pop();
    s.pop();
  });
  drawFrame(s, size);
};
