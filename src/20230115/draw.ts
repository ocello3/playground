import p5 from "p5";
import { drawFrame } from "../util/drawFrame";
// import * as Euclid from "./component/euclid";
import * as Rect from "./component/rect";

export const draw = (rect: Rect.type, size: number, s: p5) => {
  s.push();
  s.stroke(0);
  rect.sizes.forEach((size, index) => {
    const position = rect.positions[index];
    s.rect(position.x, position.y, size.x, size.y);
  });
  s.pop();
  drawFrame(s, size);
};
