import p5 from "p5";
import * as Params from "./params";
import * as Buffer from "./component/buffer";
import * as Loop from "./component/loop";
import * as Wave from "./component/wave";
import * as Box from "./component/box";
import * as Color from "./component/color";
import * as Segment from "./component/segment";

export const draw = (
  buffer: Buffer.type,
  loop: Loop.type,
  wave: Wave.type,
  box: Box.type,
  color: Color.type,
  segment: Segment.type,
  params: Params.type,
  s: p5
) => {
  // -- buffer -- //
  s.push();
  s.noFill();
  s.strokeWeight(1);
  s.strokeCap(s.SQUARE);
  buffer.startPositions.forEach((startPosition, trackIndex) => {
    s.stroke(
      color.hues[trackIndex],
      color.saturations[trackIndex],
      color.brightnesses[trackIndex]
    );
    s.line(
      startPosition.x,
      startPosition.y + segment.size.y * params.loopRangeLineYPosRate,
      buffer.endPositions[trackIndex].x,
      buffer.endPositions[trackIndex].y +
        segment.size.y * params.loopRangeLineYPosRate
    );
  });
  // -- loop -- //
  s.strokeWeight(3);
  s.strokeCap(s.PROJECT);
  loop.startCurrentPositions.forEach((loopStartPosition, trackIndex) => {
    s.push();
    s.stroke(
      color.hues[trackIndex],
      color.saturations[trackIndex],
      color.brightnesses[trackIndex]
    );
    s.line(
      loopStartPosition.x,
      loopStartPosition.y + segment.size.y * params.loopRangeLineYPosRate,
      loop.endCurrentPositions[trackIndex].x,
      loop.endCurrentPositions[trackIndex].y +
        segment.size.y * params.loopRangeLineYPosRate
    );
    s.pop();
  });
  s.pop();
  /* -- segment -- // remove later
  s.push();
  s.noFill();
  s.strokeWeight(0.1);
  segment.positionArrays.forEach((positionArray) =>
    positionArray.forEach((position) => {
      s.rect(position.x, position.y, segment.size.x, segment.size.y);
    })
  );
  s.pop();
	*/
  // -- wave -- //
  s.push();
  wave.positionArrays.forEach((positionArray, trackIndex) => {
    const currentBoxIndex = segment.currentIndexes[trackIndex];
    s.stroke(
      color.hues[trackIndex],
      color.saturations[trackIndex],
      color.brightnesses[trackIndex]
    );
    positionArray.forEach((position, boxIndex) => {
      if (boxIndex > currentBoxIndex) {
        s.line(position.x, position.y, position.x + segment.size.x, position.y);
      }
    });
  });
  s.pop();
  // -- box -- //
  s.push();
  s.noStroke();
  box.positionArrays.forEach((positionArray, trackIndex) => {
    const hue = color.hues[trackIndex];
    const saturations = color.brightnessArrays[trackIndex];
    const brightness = color.saturations[trackIndex];
    const boxHeightArray = box.heightArrays[trackIndex];
    positionArray.forEach((position, boxIndex) => {
      const boxHeight = boxHeightArray[boxIndex];
      const saturation = saturations[boxIndex];
      s.fill(hue, saturation, brightness);
      s.rect(position.x, position.y, segment.size.x, boxHeight);
    });
  });
  s.pop();
};
