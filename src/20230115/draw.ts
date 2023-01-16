import p5 from "p5";
import { drawFrame } from "../util/drawFrame";
import * as Euclid from "./component/euclid";

export const draw = (euclid: Euclid.type, size: number, s: p5) => {
  s.push();
  s.textAlign(s.CENTER, s.CENTER);
  s.textSize(size * 0.05);
  s.text(euclid[euclid.length - 1].dividend, size * 0.5, size * 0.5);
  s.pop();
  drawFrame(s, size);
};
