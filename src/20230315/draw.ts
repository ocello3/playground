import p5 from "p5";
import { isArray } from "tone";
import { drawFrame } from "../util/drawFrame";
import * as Params from "./params";
import * as Font from "./component/font";

export const draw = (
  fonts: Font.type,
  params: Params.type,
  size: number,
  s: p5
) => {
  s.push();
  s.fill(0);
  fonts.forEach((font) => {
    s.push();
    s.translate(font.compartmentOrigin.x, font.compartmentOrigin.y);
    s.scale(font.compartmentScale); // 0.5
    if (isArray(font.poses))
      font.poses.forEach((pos, index) => {
        s.push();
        s.translate(pos.x, pos.y);
        s.scale(font.scales[index].x, font.scales[index].y);
        s.text(params.font.str.charAt(index), 0, 0);
        s.pop();
      });
    s.pop();
  });
  s.pop();
  drawFrame(s, size);
};
