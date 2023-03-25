import * as Params from "../params";
import { tools } from "../../util/tools";

export type statusType =
  | "init"
  | "waiting"
  | "attack_1"
  | "sustain_1"
  | "attack_2"
  | "sustain_2"
  | "release";

export type type = {
  preStatus: statusType;
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

export const get = (params: Params.type, pre?: type): type => {
  const isInit = pre === undefined;
  const preStatus = isInit ? "init" : pre.status;
  const status: statusType = (() => {
    if (isInit) return "init";
    switch (pre.status) {
      case "init":
        return "waiting";
      case "waiting":
        if (pre.elapsedTime > pre.duration.waiting) return "attack_1";
        return "waiting";
      case "attack_1":
        if (pre.rate > pre.targetRate.max) return "sustain_1";
        return "attack_1";
      case "sustain_1":
        if (pre.elapsedTime > pre.duration.sustain_1) return "attack_2";
        return "sustain_1";
      case "attack_2":
        if (pre.rate < pre.targetRate.min) return "sustain_2";
        return "attack_2";
      case "sustain_2":
        if (pre.elapsedTime > pre.duration.sustain_2) return "release";
        return "sustain_2";
      case "release":
        if (pre.rate > pre.targetRate.base) return "init";
        return "release";
      default:
        throw `preRate: ${pre.rate}, preElapsedTime: ${pre.elapsedTime}`;
    }
  })();
  const duration =
    isInit || status === "init"
      ? {
          waiting: tools.map(
            Math.random(),
            0,
            1,
            params.font.rate_1.waiting.min,
            params.font.rate_1.waiting.max
          ),
          sustain_1: tools.map(
            Math.random(),
            0,
            1,
            params.font.rate_1.sustain_1.min,
            params.font.rate_1.sustain_1.max
          ),
          sustain_2: tools.map(
            Math.random(),
            0,
            1,
            params.font.rate_1.sustain_2.min,
            params.font.rate_1.sustain_2.max
          ),
        }
      : pre.duration;
  const targetRate =
    isInit || status === "init"
      ? {
          min: 0.1,
          max: 1,
          base: params.font.rate_1.base,
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
    preStatus,
    status,
    duration,
    targetRate,
    coefficient,
    elapsedTime,
    rate,
  };
};
