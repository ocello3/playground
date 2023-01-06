import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Boader from "./boader";
import * as Params from "../params";

export type type = {
  intervals: number[]; // distance from start of boader to start of object (root)
  starts: p5.Vector[]; // root
  vecs: p5.Vector[];
  lengths: number[];
  ends: p5.Vector[]; // tip
};

export const get = (
  boader: Boader.type,
  params: Params.type,
  size: number,
  pre?: type
): type => {
  const isInit = pre === undefined;
  const intervals = (() => {
    if (isInit)
      return Array.from(
        Array(params.object.count),
        () => Math.random() * boader.length
      );
    return pre.intervals;
  })();
  const starts = intervals.map((interval) =>
    p5.Vector.add(boader.start, p5.Vector.mult(boader.vec, interval))
  );
  const vecs = intervals.map(() =>
    p5.Vector.fromAngle(-1 * params.boader.angle - Math.PI * 0.5)
  );
  const lengths = (() => {
    if (isInit) return intervals.map(() => Math.random() * size * 0.5);
    return pre.lengths;
  })();
  const ends = starts.map((start, index) =>
    p5.Vector.add(start, p5.Vector.mult(vecs[index], lengths[index]))
  );
  return {
    intervals,
    starts,
    vecs,
    lengths,
    ends,
  };
};
