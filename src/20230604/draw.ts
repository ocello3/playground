import p5 from "p5";
import { drawFrame } from "../util/drawFrame";
import * as Lib from "./component/lib";

export const draw = (data: Lib.type, size: number, s: p5) => {
  const { radius } = data;
  s.push();
  s.translate(size * 0.5, size * 0.5);
  s.circle(0, 0, radius);
  s.pop();
  drawFrame(s, size);
};
