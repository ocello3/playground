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
    if (status_1 === "init") return "init";
    if (
      status_1 === "waiting" ||
      status_1 === "attack_1" ||
      status_1 === "sustain_1" ||
      status_1 === "sustain_2"
    )
      return "waiting";
    if (status_1 === "attack_2") return "attack";
    if (status_1 === "release") return "release";
    throw `status_1: ${status_1}`;
  })();
  const targetRate =
    isInit || status === "init"
      ? {
          max: 0.6,
          base: 0.3,
        }
      : pre.targetRate;
  const coefficient =
    isInit || status === "init"
      ? {
          attack: 0.01,
          release: 0.001,
        }
      : pre.coefficient;
  const rate = (() => {
    if (isInit || status === "init") return targetRate.base;
    if (status === "waiting") return pre.rate;
    if (status === "attack") return pre.rate + coefficient.attack;
    if (status === "release") return pre.rate - coefficient.release;
    throw `status: ${status}`;
  })();
  return {
    status,
    targetRate,
    coefficient,
    rate,
  };
};
