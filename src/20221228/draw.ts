import p5 from "p5";
import { drawFrame } from "../util/drawFrame";
import * as Light from "./component/light";

export const draw = (light: Light.type, size: number, s: p5) => {
  //--- light for test ---//
  s.push();
  s.line(light.center.x, light.center.y, light.pos.x, light.pos.y);
  s.pop();
  // -- frame ---//
  drawFrame(s, size);
};
