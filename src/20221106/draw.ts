import p5 from "p5";
import * as Params from "./params";
import * as Buffer from "./component/buffer";
import * as Loop from "./component/loop";
import * as Wave from "./component/wave";
import * as Box from "./component/box";
import * as Color from "./component/color";
import * as Segment from "./component/segment";
import * as Ctrl from "./sound/controller";

export const draw = (
  buffer: Buffer.type,
  loop: Loop.type,
  wave: Wave.type,
  box: Box.type,
  color: Color.type,
  segment: Segment.type,
  ctrl: Ctrl.type,
  params: Params.type,
  s: p5
) => {
  // -- buffer -- //
  const { startPositions, endPositions } = buffer;
  s.push();
  s.noFill();
  s.strokeWeight(1);
  s.strokeCap(s.SQUARE);
  startPositions.forEach((startPosition, index) => {
    const flag = ctrl.loopIsReverses[index] ? 0 : 1;
    const hue = params.hues[flag];
    const saturation = params.saturations[flag] - params.saturationRange;
    const brightness = params.saturations[flag] - params.brightnessRange * 0.5;
    s.stroke(hue, saturation, brightness);
    s.line(
      startPosition.x,
      startPosition.y + segment.size.y * params.loopRangeLineYPosRate,
      endPositions[index].x,
      endPositions[index].y + segment.size.y * params.loopRangeLineYPosRate
    );
  });
  // -- loop -- //
  const {
    startCurrentPositions: loopStartCurrentPositions,
    endCurrentPositions: loopEndCurrentPositions,
  } = loop;
  s.strokeWeight(3);
  s.strokeCap(s.PROJECT);
  loopStartCurrentPositions.forEach((loopStartPosition, index) => {
    s.push();
    const flag = ctrl.loopIsReverses[index] ? 0 : 1;
    const hue = params.hues[flag];
    const saturation = params.saturations[flag] - params.saturationRange;
    const brightness = params.saturations[flag] - params.brightnessRange * 0.5;
    s.stroke(hue, saturation, brightness);
    s.line(
      loopStartPosition.x,
      loopStartPosition.y + segment.size.y * params.loopRangeLineYPosRate,
      loopEndCurrentPositions[index].x,
      loopEndCurrentPositions[index].y +
        segment.size.y * params.loopRangeLineYPosRate
    );
    s.pop();
  });
  s.pop();
  // -- wave -- //
  const {
    xPositionArrays: waveXPositionArrays,
    yPositionArrays: waveYPositionArrays,
  } = wave;
  s.push();
  waveXPositionArrays.forEach((waveXPositionArray, trackIndex) => {
    const currentBoxIndex = segment.currentIndexes[trackIndex];
    const flag = ctrl.loopIsReverses[trackIndex] ? 0 : 1;
    const hue = params.hues[flag];
    const saturation = params.saturations[flag] - params.saturationRange;
    const brightness = params.saturations[flag] - params.brightnessRange * 0.5;
    s.stroke(hue, saturation, brightness);
    const waveYPositionArray = waveYPositionArrays[trackIndex];
    waveXPositionArray.forEach((waveXPosition, boxIndex) => {
      if (boxIndex > currentBoxIndex) {
        const waveYPosition = waveYPositionArray[boxIndex];
        s.line(
          waveXPosition,
          waveYPosition,
          waveXPosition + segment.size.x,
          waveYPosition
        );
      }
    });
  });
  s.pop();
  // -- box -- //
  const { boxHeightOffsetArrays } = box;
  // boxes
  s.push();
  s.noStroke();
  segment.positionArrays.forEach((boxLAPositionArray, trackIndex) => {
    const hue = color.hues[trackIndex];
    const saturations = color.brightnessArrays[trackIndex];
    const brightness = color.saturations[trackIndex];
    const boxHeightOffsetArray = boxHeightOffsetArrays[trackIndex];
    boxLAPositionArray.forEach((boxLAPosition, boxIndex) => {
      const boxHeightOffset = boxHeightOffsetArray[boxIndex];
      const saturation = saturations[boxIndex];
      s.fill(hue, saturation, brightness);
      s.rect(
        boxLAPosition.x,
        boxLAPosition.y + segment.size.y - boxHeightOffset,
        segment.size.x,
        boxHeightOffset
      );
    });
  });
  s.pop();
};
