import p5 from "p5";
import { drawFrame } from "../util/drawFrame";
import * as Light from "./component/light";
import * as Boader from "./component/boader";

export const draw = (
  light: Light.type,
  boader: Boader.type,
  size: number,
  s: p5
) => {
  //--- light for test ---//
  s.push();
  s.line(light.start.x, light.start.y, light.end.x, light.end.y);
  s.pop();
  //--- boader ---//
  s.push();
  s.line(boader.start.x, boader.start.y, boader.end.x, boader.end.y);
  // -- frame ---//
  drawFrame(s, size);
};
