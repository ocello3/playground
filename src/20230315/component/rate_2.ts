import * as Rate_1 from "./rate_1";

type statusType = "init" | "waiting" | "attack" | "release";

export type type = {
  status: statusType;
  targetRate: {
    max: number;
    base: number;
  };
  coefficient: {
    attack: number;
    release: number;
  };
  rate: number;
};

export const get = (status_1: Rate_1.statusType, pre?: type): type => {
  const isInit = pre === undefined;
  const status: statusType = (() => {
    if (isInit) return "init";
    if (pre.status === "init") return "waiting";
    if (pre.status === "waiting") {
      if (
        status_1 === "waiting" ||
        status_1 === "attack_1" ||
        status_1 === "sustain_1" ||
        status_1 === "sustain_2"
      ) {
        return "waiting";
      } else {
        return "attack";
      }
    }
    if (pre.status === "attack") {
      if (pre.rate < pre.targetRate.max) return "attack";
      return "release";
    }
    if (pre.status === "release") {
      if (status_1 === "init") return "init";
      return "release";
    }
    throw `status_1: ${status_1}`;
  })();
  const targetRate =
    isInit || status === "init"
      ? {
          max: 1,
          base: 0.5,
        }
      : pre.targetRate;
  const coefficient =
    isInit || status === "init"
      ? {
          attack: 0.04,
          release: 0.04,
        }
      : pre.coefficient;
  const rate = (() => {
    if (isInit || status === "init") return targetRate.base;
    if (status === "waiting") return pre.rate;
    if (status === "attack") return pre.rate + coefficient.attack;
    if (status === "release") {
      if (pre.rate < pre.targetRate.base) return pre.rate;
      return pre.rate - coefficient.release;
    }
    throw `status: ${status}`;
  })();
  return {
    status,
    targetRate,
    coefficient,
    rate,
  };
};
