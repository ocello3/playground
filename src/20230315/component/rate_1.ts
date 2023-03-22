export type statusType =
  | "init"
  | "waiting"
  | "attack_1"
  | "sustain_1"
  | "attack_2"
  | "sustain_2"
  | "release";

export type type = {
  status: statusType;
  duration: {
    waiting: number;
    sustain_1: number;
    sustain_2: number;
  };
  targetRate: {
    min: number;
    max: number;
    base: number;
  };
  coefficient: {
    attack_1: number;
    attack_2: number;
    release: number;
  };
  elapsedTime: number;
  rate: number;
};

export const get = (pre?: type): type => {
  const isInit = pre === undefined;
  const status: statusType = (() => {
    if (isInit) return "init";
    if (pre.status === "init") return "waiting";
    if (pre.status === "waiting") {
      if (pre.elapsedTime > pre.duration.waiting) return "attack_1";
      return "waiting";
    }
    if (pre.status === "attack_1") {
      if (pre.rate > pre.targetRate.max) return "sustain_1";
      return "attack_1";
    }
    if (pre.status === "sustain_1") {
      if (pre.elapsedTime > pre.duration.sustain_1) return "attack_2";
      return "sustain_1";
    }
    if (pre.status === "attack_2") {
      if (pre.rate < pre.targetRate.min) return "sustain_2";
      return "attack_2";
    }
    if (pre.status === "sustain_2") {
      if (pre.elapsedTime > pre.duration.sustain_2) return "release";
      return "sustain_2";
    }
    if (pre.status === "release") {
      if (pre.rate > pre.targetRate.base) return "init";
      return "release";
    }
    throw `preRate: ${pre.rate}, preElapsedTime: ${pre.elapsedTime}`;
  })();
  const duration =
    isInit || status === "init"
      ? {
          waiting: 20,
          sustain_1: 2,
          sustain_2: 30,
        }
      : pre.duration;
  const targetRate =
    isInit || status === "init"
      ? {
          min: 0.1,
          max: 1,
          base: 0.333,
        }
      : pre.targetRate;
  const coefficient =
    isInit || status === "init"
      ? {
          attack_1: 0.1,
          attack_2: 0.2,
          release: 0.03,
        }
      : pre.coefficient;
  const elapsedTime = (() => {
    if (isInit || status !== pre.status) return 0;
    return pre.elapsedTime + 1;
  })();
  const rate = (() => {
    if (isInit || status === "init") return targetRate.base;
    if (status === "waiting") return pre.rate;
    if (status === "attack_1") return pre.rate + pre.coefficient.attack_1;
    if (status === "sustain_1") return pre.rate;
    if (status === "attack_2") return pre.rate - pre.coefficient.attack_2;
    if (status === "sustain_2") return pre.rate;
    if (status === "release") return pre.rate + pre.coefficient.release;
    throw `status: ${status}`;
  })();
  return {
    status,
    duration,
    targetRate,
    coefficient,
    elapsedTime,
    rate,
  };
};
