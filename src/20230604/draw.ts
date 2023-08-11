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
    const width = innerFrame.sizes[arrayIndex].x;
    const height = innerFrame.sizes[arrayIndex].y;
    s.push();
    s.translate(coordinate.x, coordinate.y);
    s.stroke(1);
    // inside frames
    /*
    s.push();
    s.noFill();
    const size = innerFrame.sizes[arrayIndex];
    s.rect(0, 0, size.x, size.y);
    s.pop();
		*/
    // ADSR
    s.push();
    s.noStroke();
    s.fill(150, 120);
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
    const heightArray = progressLine.heightArrays[arrayIndex];
    pointArray.forEach((point, pointIndex) => {
      s.push();
      s.fill(50, 150);
      const heightDiff = height - heightArray[pointIndex];
      s.rect(
        point.x,
        point.y + heightDiff,
        progressLine.rectSizes[arrayIndex].x,
        progressLine.rectSizes[arrayIndex].y - heightDiff
      );
      s.pop();
    });
    s.pop();
    // bottom line
    s.push();
    s.stroke(70, 150);
    s.strokeWeight(size * 0.005);
    s.strokeCap(s.ROUND);
    s.line(0, height, width, height);
    s.pop();
    s.pop();
  });
  drawFrame(s, size);
};
