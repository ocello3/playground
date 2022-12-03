import * as Synth from "./synth";
import * as Tone from "tone";
import * as Params from "./params";
import { tools } from "../util/tools";

export const set = (synth: Synth.type, millis: number) => {
  const durations = synth.data.durations;
  const longestDuration = durations.reduce((preDuration, curDuration) => {
    if (curDuration > preDuration) return curDuration;
    return preDuration;
  }, 0);
  // same as whole buffer for initial loop
  const loopStartTimes = durations.map(() => 0);
  const loopEndTimes = durations.map((duration) => duration);
  const loopIsReverses = durations.map(() => false);
  const loopIsSwitches = durations.map(() => false);
  const loopIsOvers = durations.map(() => false);
  const loopStampTimes = durations.map(() => 0);
  const loopElapsedTimes = durations.map(() => millis * 0.001);
  const loopProgressRates = durations.map(() => 0);
  // play immediately after play
  const loopRetentionFrames = durations.map(() => 1);
  const playbackRates = durations.map(() => 1);
  const volumes = durations.map(() => new Tone.Meter());
  synth.players.forEach((player, index) => player.connect(volumes[index]));
  return {
    durations,
    longestDuration,
    loopStartTimes,
    loopEndTimes,
    loopIsReverses,
    loopIsSwitches,
    loopGrainSizes: loopEndTimes,
    loopIsOvers,
    loopStampTimes,
    loopElapsedTimes,
    loopProgressRates,
    loopRetentionFrames, // TODO: remove later
    playbackRates,
    volumes,
  };
};
export const obj = set(Synth.obj, 0);
export type type = typeof obj;

export const update = (
  preBuffer: type,
  params: Params.type,
  millis: number
) => {
  const newBuffer = { ...preBuffer };
  newBuffer.loopRetentionFrames = preBuffer.loopRetentionFrames.map(
    (preLoopRetentionFrame, index) => {
      if (preLoopRetentionFrame > 0) return preLoopRetentionFrame - 1;
      const rate = tools.map(
        Math.random(),
        0,
        1,
        params.loopRetentionFrameRateMin,
        params.loopRetentionFrameRateMax
      );
      return preBuffer.durations[index] * 60 * Math.floor(rate);
    }
  );
  newBuffer.loopIsSwitches = newBuffer.loopRetentionFrames.map(
    (loopRetentionFrame) => loopRetentionFrame === 0
  );
  newBuffer.loopStartTimes = preBuffer.loopStartTimes.map(
    (loopStartTime, index) => {
      if (!newBuffer.loopIsSwitches[index]) return loopStartTime;
      return Math.random() * preBuffer.durations[index];
    }
  );
  newBuffer.loopEndTimes = preBuffer.loopEndTimes.map((loopEndTime, index) => {
    if (!newBuffer.loopIsSwitches[index]) return loopEndTime;
    return Math.random() * preBuffer.durations[index];
  });
  newBuffer.loopIsReverses = preBuffer.loopIsReverses.map(
    (loopIsReverse, index) => {
      if (!newBuffer.loopIsSwitches[index]) return loopIsReverse;
      return newBuffer.loopStartTimes[index] > newBuffer.loopEndTimes[index];
    }
  );
  newBuffer.loopIsOvers = preBuffer.loopElapsedTimes.map(
    (loopElapsedTime, index) =>
      loopElapsedTime >
      newBuffer.durations[index] / newBuffer.playbackRates[index]
  );
  newBuffer.loopStampTimes = preBuffer.loopStampTimes.map(
    (preStampTime, index) =>
      newBuffer.loopIsOvers[index] ? millis * 0.001 : preStampTime
  );
  newBuffer.loopElapsedTimes = preBuffer.loopElapsedTimes.map(
    (_, index) => millis * 0.001 - newBuffer.loopStampTimes[index]
  );
  newBuffer.loopProgressRates = newBuffer.loopElapsedTimes.map(
    (loopElapsedTime, index) =>
      (loopElapsedTime / preBuffer.durations[index]) *
      newBuffer.playbackRates[index]
  );
  newBuffer.loopGrainSizes = newBuffer.loopEndTimes.map((loopEndTime, index) =>
    Math.abs(loopEndTime - newBuffer.loopStartTimes[index])
  );
  newBuffer.playbackRates = preBuffer.playbackRates.map(
    (prePlaybackRate, index) =>
      newBuffer.loopIsSwitches[index]
        ? tools.map(
            Math.random(),
            0,
            1,
            params.playbackRateMin,
            params.playbackRateMax
          )
        : prePlaybackRate
  );
  return newBuffer;
};
