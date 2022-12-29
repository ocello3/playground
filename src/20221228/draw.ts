import p5 from "p5";
import { drawFrame } from "../util/drawFrame";
import * as Light from "./component/light";
import * as Boader from "./component/boader";
import * as Object from "./component/object";

export const draw = (
  light: Light.type,
  boader: Boader.type,
  object: Object.type,
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
  s.pop();
  //--- object ---//
  s.push();
  object.starts.forEach((start, index) => {
    const end = object.ends[index];
    s.line(start.x, start.y, end.x, end.y);
  });
  s.pop();
  // -- frame ---//
  drawFrame(s, size);
};
