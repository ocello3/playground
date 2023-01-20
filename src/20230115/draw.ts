import p5 from "p5";
import { tools } from "../util/tools";
import { drawFrame } from "../util/drawFrame";
// import * as Euclid from "./component/euclid";
import * as Rect from "./component/rect";
import * as Params from "./params";

export const draw = (
  rect: Rect.type,
  params: Params.type,
  size: number,
  s: p5
) => {
  s.push();
  s.noStroke();
  rect.sizes.forEach((size, index) => {
    const position = rect.positions[index];
    const rate = rect.rates[index];
    const hue = tools.map(
      rate.area,
      0,
      1,
      params.rect.h_min,
      params.rect.h_max
    );
    const saturation = tools.map(
      rate.pairIndex,
      0,
      1,
      params.rect.s_max,
      params.rect.s_min
    );
    const brightness = tools.map(
      rate.rectIndex,
      0,
      1,
      params.rect.b_min,
      params.rect.b_max
    );
    s.fill(hue, saturation, brightness);
    s.rect(position.x, position.y, size.x, size.y);
  });
  s.pop();
  drawFrame(s, size);
};
