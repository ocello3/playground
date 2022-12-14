import * as SynthData from "./synthData";
import * as Params from "../params";
import { tools } from "../../util/tools";

export type type = {
  longestDuration: number;
  loopRetentionFrames: number[];
  loopIsSwitches: boolean[];
  playbackRates: number[];
  loopStartTimes: number[];
  loopEndTimes: number[];
  loopIsReverses: boolean[];
  loopElapsedTimes: number[];
  loopIsOvers: boolean[];
  loopStampTimes: number[];
  loopProgressRates: number[];
  loopGrainSizes: number[];
};

export const get = (
  synthData: SynthData.type,
  params: Params.type,
  millis: number,
  pre?: type
) => {
  const isInit = pre === undefined;
  const longestDuration: type["longestDuration"] = synthData.durations.reduce(
    (preDuration, curDuration) => {
      if (curDuration > preDuration) return curDuration;
      return preDuration;
    },
    0
  );
  const loopRetentionFrames: type["loopRetentionFrames"] =
    synthData.durations.map((duration, trackIndex) => {
      if (isInit || pre.loopRetentionFrames[trackIndex] === 0) {
        const rate = tools.map(
          Math.random(),
          0,
          1,
          params.loopRetentionFrameRateMin,
          params.loopRetentionFrameRateMax
        );
        return duration * 60 * Math.floor(rate);
      }
      return pre.loopRetentionFrames[trackIndex] - 1;
    });
  const loopIsSwitches: type["loopIsSwitches"] = loopRetentionFrames.map(
    (loopRetentionFrame) => loopRetentionFrame === 0
  );
  const playbackRates: type["playbackRates"] = loopIsSwitches.map(
    (loopIsSwitch, trackIndex) => {
      if (isInit || loopIsSwitch)
        return tools.map(
          Math.random(),
          0,
          1,
          params.playbackRateMin,
          params.playbackRateMax
        );
      return pre.playbackRates[trackIndex];
    }
  );
  const loopStartTimes: type["loopStartTimes"] = synthData.durations.map(
    (duration, trackIndex) => {
      if (isInit || loopIsSwitches[trackIndex]) return Math.random() * duration;
      return pre.loopStartTimes[trackIndex];
    }
  );
  const loopEndTimes: type["loopEndTimes"] = synthData.durations.map(
    (duration, trackIndex) => {
      if (isInit || loopIsSwitches[trackIndex]) return Math.random() * duration;
      return pre.loopEndTimes[trackIndex];
    }
  );
  const loopIsReverses: type["loopIsReverses"] = loopIsSwitches.map(
    (loopIsSwitch, trackIndex) => {
      if (isInit || loopIsSwitch)
        return loopStartTimes[trackIndex] > loopEndTimes[trackIndex];
      return pre.loopIsReverses[trackIndex];
    }
  );
  const loopElapsedTimes: type["loopElapsedTimes"] = loopIsSwitches.map(
    (loopIsSwitch, trackIndex) => {
      if (loopIsSwitch) return 0;
      const preLoopStampTime = isInit ? 0 : pre.loopStampTimes[trackIndex];
      return millis * 0.001 - preLoopStampTime;
    }
  );
  const loopIsOvers: type["loopIsOvers"] = loopElapsedTimes.map(
    (loopElapsedTime, trackIndex) =>
      loopElapsedTime >
      synthData.durations[trackIndex] / playbackRates[trackIndex]
  );
  const loopStampTimes: type["loopStampTimes"] = loopIsOvers.map(
    (loopIsOver, trackIndex) => {
      if (isInit || loopIsOver || loopIsSwitches[trackIndex])
        return millis * 0.001;
      return pre.loopStampTimes[trackIndex];
    }
  );
  const loopProgressRates: type["loopProgressRates"] = loopElapsedTimes.map(
    (loopElapsedTime, trackIndex) =>
      (loopElapsedTime / synthData.durations[trackIndex]) *
      playbackRates[trackIndex]
  );
  const loopGrainSizes = loopEndTimes.map((loopEndTime, trackIndex) =>
    Math.abs(loopEndTime - loopStartTimes[trackIndex])
  );
  return {
    longestDuration,
    loopRetentionFrames,
    loopIsSwitches,
    playbackRates,
    loopStartTimes,
    loopEndTimes,
    loopIsReverses,
    loopElapsedTimes,
    loopIsOvers,
    loopStampTimes,
    loopProgressRates,
    loopGrainSizes,
  };
};
