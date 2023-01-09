import p5 from "p5";
import { tools } from "../../util/tools";
import * as Light from "./light";
import * as Boader from "./boader";
import * as Object from "./object";

export type type = {
  starts: p5.Vector[]; // root of object
  ends: p5.Vector[];
  intersections: p5.Vector[];
  vecs: p5.Vector[];
  lengths: number[];
};

export const get = (
  light: Light.type,
  boader: Boader.type,
  object: Object.type
): type => {
  const starts = object.starts;
  const ends = starts.map((start, index) =>
    tools.getIntersection(start, light.end, light.end, object.ends[index])
  );
  const intersections = object.ends.map((objectEnd, index) =>
    tools.getIntersection(objectEnd, ends[index], boader.start, boader.end)
  );
  const diffs = starts.map((start, index) => p5.Vector.sub(ends[index], start));
  const vecs = diffs.map((diff) => p5.Vector.normalize(diff));
  const lengths = diffs.map((diff) => p5.Vector.mag(diff));
  return {
    starts,
    ends,
    intersections,
    vecs,
    lengths,
  };
};
