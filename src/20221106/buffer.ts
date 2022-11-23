import * as Synth from "./synth";

export const set = (synth: Synth.type) => {
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
  // play immediately after play
  const loopRetentionFrames = durations.map(() => 1);
  return {
    durations,
    longestDuration,
    loopStartTimes,
    loopEndTimes,
    loopIsReverses,
    loopIsSwitches,
    loopGrainSizes: loopEndTimes,
    loopRetentionFrames,
  };
};
export const obj = set(Synth.obj);
export type type = typeof obj;

export const update = (preBuffer: type) => {
  const newBuffer = { ...preBuffer };
  newBuffer.loopRetentionFrames = preBuffer.loopRetentionFrames.map(
    (preLoopRetentionFrame, index) => {
      if (preLoopRetentionFrame > 0) return preLoopRetentionFrame - 1;
      return preBuffer.durations[index] * 60;
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
  newBuffer.loopGrainSizes = newBuffer.loopEndTimes.map((loopEndTime, index) =>
    Math.abs(loopEndTime - newBuffer.loopStartTimes[index])
  );
  return newBuffer;
};
