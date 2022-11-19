import * as Synth from "./synth";

export const set = (synth: Synth.type) => {
  const longestDuration = synth.data.durations.reduce(
    (preDuration, curDuration) => {
      if (curDuration > preDuration) return curDuration;
      return preDuration;
    },
    0
  );
  // same as whole buffer for initial loop
  const loopStartTimes = synth.data.durations.map(() => 0);
  const loopEndTimes = synth.data.durations.map((duration) => duration);
  return {
    longestDuration,
    loopStartTimes,
    loopEndTimes,
  };
};
export const obj = set(Synth.obj);
export type type = typeof obj;
