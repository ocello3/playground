import * as Params from "../params";
import * as Ctrl from "../sound/controller";
import * as SynthData from "../sound/synthData";
import * as Segment from "./segment";
import { tools } from "../../util/tools";

export type type = {
  hues: number[];
  saturations: number[];
  brightnesses: number[];
  brightnessArrays: number[][];
};

export const get = (
  ctrl: Ctrl.type,
  params: Params.type,
  synthData: SynthData.type,
  segment: Segment.type,
  pre?: type
): type => {
  const hues: type["hues"] = ctrl.loopIsReverses.map((loopIsReverse) => {
    const flag = loopIsReverse ? 0 : 1;
    return params.hues[flag];
  });
  const saturations: type["saturations"] = ctrl.loopIsReverses.map(
    (loopIsReverse, index) => {
      const flag = loopIsReverse ? 1 : 0;
      const baseSaturation = params.saturations[flag];
      return tools.map(
        ctrl.playbackRates[index],
        params.playbackRateMin,
        params.playbackRateMax,
        baseSaturation - params.saturationRange,
        baseSaturation + params.saturationRange
      );
    }
  );
  const brightnesses: type["brightnesses"] = ctrl.loopIsReverses.map(
    (loopIsReverse) => {
      const flag = loopIsReverse ? 1 : 0;
      return params.brightnesses[flag];
    }
  );
  const brightnessArrays: type["brightnessArrays"] = segment.positionArrays.map(
    (boxLAPositionArray, trackIndex) => {
      const volume = synthData.volumes[trackIndex].getValue();
      const finiteVolume = isFinite(volume as number) ? volume : 0;
      const brightness = tools.map(
        finiteVolume as number,
        -50,
        -20,
        brightnesses[trackIndex] - params.brightnessRange,
        brightnesses[trackIndex] + params.brightnessRange
      );
      const constrainedBrightness = tools.constrain(
        brightness,
        brightnesses[trackIndex] - params.brightnessRange,
        brightnesses[trackIndex] + params.brightnessRange
      );
      if (
        pre === undefined ||
        ctrl.loopIsOvers[trackIndex] ||
        ctrl.loopIsSwitches[trackIndex]
      )
        return boxLAPositionArray.map(() => constrainedBrightness);

      // update last element using volume
      const preBoxBrightnessArray = pre.brightnessArrays[trackIndex];
      const differenceInElementNumber =
        boxLAPositionArray.length - preBoxBrightnessArray.length;
      if (differenceInElementNumber === 0) {
        preBoxBrightnessArray[preBoxBrightnessArray.length - 1] =
          constrainedBrightness;
        return preBoxBrightnessArray;
      }
      // differenceInElementNumber >= 1)
      const newBrightnesses = Array.from(
        Array(differenceInElementNumber),
        () => constrainedBrightness
      );
      const newBrightnessArray = preBoxBrightnessArray.concat(newBrightnesses);
      return newBrightnessArray;
    }
  );
  return {
    hues,
    saturations,
    brightnesses,
    brightnessArrays,
  };
};
