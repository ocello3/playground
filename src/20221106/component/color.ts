import * as Params from "../params";
import * as Seq from "../sound/sequence";
import * as SynthData from "../sound/synthData";
import * as Segment from "./segment";
import { tools } from "../../util/tools";

export type type = {
  hues: number[];
  saturations: number[];
  brightnessArrays: number[][];
};

export const get = (
  seq: Seq.type,
  params: Params.type,
  synthData: SynthData.type,
  segment: Segment.type,
  pre?: type
) => {
  const hues: type["hues"] = seq.loopIsReverses.map((loopIsReverse) => {
    const flag = loopIsReverse ? 0 : 1;
    return params.hues[flag];
  });
  const saturations: type["saturations"] = seq.loopIsReverses.map(
    (loopIsReverse, index) => {
      const flag = loopIsReverse ? 1 : 0;
      const baseSaturation = params.saturations[flag];
      return tools.map(
        seq.playbackRates[index],
        params.playbackRateMin,
        params.playbackRateMax,
        baseSaturation - params.saturationRange,
        baseSaturation + params.saturationRange
      );
    }
  );
  const brightnessArrays: type["brightnessArrays"] = segment.positionArrays.map(
    (boxLAPositionArray, trackIndex) => {
      const volume = synthData.volumes[trackIndex].getValue();
      const finiteVolume = isFinite(volume as number) ? volume : 0;
      const flag = seq.loopIsReverses[trackIndex] ? 1 : 0;
      const baseBrightness = params.brightnesses[flag];
      const brightness = tools.map(
        finiteVolume as number,
        -50,
        -20,
        baseBrightness - params.brightnessRange,
        baseBrightness + params.brightnessRange
      );
      const constrainedBrightness = tools.constrain(
        brightness,
        baseBrightness - params.brightnessRange,
        baseBrightness + params.brightnessRange
      );
      if (
        pre === undefined ||
        seq.loopIsOvers[trackIndex] ||
        seq.loopIsSwitches[trackIndex]
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
    hues: hues,
    saturations: saturations,
    brightnessArrays: brightnessArrays,
  };
};
