import * as Params from "../params";
import * as Loop from "../component/loop";
import * as Segment from "../component/segment";
import * as Box from "../component/box";
import { tools } from "../../util/tools";

export type type = {
  amplitudes: number[];
  panValues: number[];
};

export const get = (
  params: Params.type,
  canvasSize: number,
  loop: Loop.type,
  segment: Segment.type,
  box: Box.type
) => {
  const amplitudes: type["amplitudes"] = box.currentHeights.map(
    (currentBoxHeightOffset) => {
      const mappedAmp = tools.map(
        currentBoxHeightOffset,
        0,
        segment.size.y,
        params.granularVolumeMin,
        params.granularVolumeMax
      );
      const amp = tools.constrain(
        mappedAmp,
        params.granularVolumeMin,
        params.granularVolumeMax
      );
      return isNaN(amp) ? 0 : amp;
    }
  );
  const panValues: type["panValues"] = loop.currentPositions.map(
    (currentPosition) => tools.map(currentPosition.x, 0, canvasSize, -1, 1)
  );
  return {
    amplitudes,
    panValues,
  };
};
