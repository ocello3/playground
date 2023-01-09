import p5 from "p5";
import { tools } from "../../util/tools";
import * as Boader from "./boader";
import * as Params from "../params";

export type type = {
  rates: number[]; // 0 - 1, updated when over, used for speed and length for pers
  speeds: number[];
  intervals: number[]; // distance from start of boader to start of object (root)
  starts: p5.Vector[]; // root
  vecs: p5.Vector[];
  lengths: number[];
  ends: p5.Vector[]; // tip
  isOvers: boolean[];
};

export const get = (
  boader: Boader.type,
  params: Params.type,
  size: number,
  pre?: type
): type => {
  const isInit = pre === undefined;
  const rates = (() => {
    if (isInit)
      return Array.from(Array(params.object.count), () => Math.random());
    return pre.rates.map((preRate, index) =>
      pre.isOvers[index] ? Math.random() : preRate
    );
  })();
  const speeds = rates.map((rate) =>
    tools.map(rate, 0, 1, params.object.speed_min, params.object.speed_max)
  );
  const intervals = (() => {
    if (isInit)
      return Array.from(
        Array(params.object.count),
        () => Math.random() * boader.length
      );
    return pre.intervals.map((preInterval, index) =>
      pre.isOvers[index] ? 0 : preInterval + speeds[index]
    );
  })();
  const starts = intervals.map((interval) =>
    p5.Vector.add(boader.start, p5.Vector.mult(boader.vec, interval))
  );
  const vecs = intervals.map(() =>
    p5.Vector.fromAngle(boader.angle + Math.PI * 0.5)
  );
  const lengths = (() => {
    if (isInit) return intervals.map(() => Math.random() * size * 0.5);
    const lengthRates = rates.map((rate) =>
      tools.map(
        rate,
        0,
        1,
        params.object.lengthRate_max,
        params.object.lengthRate_min
      )
    );
    return lengthRates.map((lengthRate) => size * lengthRate);
  })();
  const ends = starts.map((start, index) =>
    p5.Vector.add(start, p5.Vector.mult(vecs[index], lengths[index]))
  );
  const isOvers = intervals.map((interval) => interval > boader.length);
  return {
    rates,
    speeds,
    intervals,
    starts,
    vecs,
    lengths,
    ends,
    isOvers,
  };
};
