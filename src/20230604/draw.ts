import p5 from "p5";
import * as InnerFrame from "./component/innerFrame";
import * as Env from "./component/env";
import * as ProgressLine from "./component/progressLine";
import * as Text from "./component/text";
import { drawFrame } from "../util/drawFrame";

export const draw = (
  innerFrame: InnerFrame.type,
  env: Env.type,
  progressLine: ProgressLine.type,
  text: Text.type,
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
    // texts for adsrs
    s.push();
    s.noStroke();
    const adsrText = text.adsrs[arrayIndex];
    s.textAlign(s.LEFT, s.TOP);
    s.text(adsrText.attack.text, adsrText.attack.pos.x, adsrText.attack.pos.y);
    s.textAlign(s.LEFT, s.BOTTOM);
    s.text(adsrText.decay.text, adsrText.decay.pos.x, adsrText.decay.pos.y);
    s.text(
      adsrText.sustain.text,
      adsrText.sustain.pos.x,
      adsrText.sustain.pos.y
    );
    s.textAlign(s.RIGHT, s.TOP);
    s.text(
      adsrText.release.text,
      adsrText.release.pos.x,
      adsrText.release.pos.y
    );
    // texts for harmonicity
    const harmonicityText = text.amParams[arrayIndex].harmonicity;
    s.textAlign(s.LEFT, s.BOTTOM);
    s.translate(harmonicityText.pos.x, harmonicityText.pos.y);
    s.rotate(Math.PI * -0.5);
    s.text(harmonicityText.text, 0, 0);
    s.pop();
    s.pop();
  });
  s.push();
  s.textAlign(s.RIGHT, s.TOP);
  s.text(
    text.general.totalLength.text,
    text.general.totalLength.pos.x,
    text.general.totalLength.pos.y
  );
  s.pop();
  drawFrame(s, size);
};
