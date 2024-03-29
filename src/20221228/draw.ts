import p5 from "p5";
import { drawFrame } from "../util/drawFrame";
import * as Light from "./component/light";
import * as Boader from "./component/boader";
import * as Object from "./component/object";
import * as Shadow from "./component/shadow";
import * as Params from "./params";

export const draw = (
  light: Light.type,
  boader: Boader.type,
  object: Object.type,
  shadow: Shadow.type,
  params: Params.type,
  size: number,
  s: p5
) => {
  //--- background ---//
  if (light.isShadow)
    s.background(
      params.background.shadowColor,
      params.background.shadowAlpha * light.angleRate
    );
  if (!light.isShadow)
    s.background(
      params.background.lightColor,
      params.background.lightAlpha * light.angleRate
    );
  //--- boader ---//
  s.push();
  s.stroke("black");
  s.line(boader.start.x, boader.start.y, boader.end.x, boader.end.y);
  s.pop();
  //--- object ---//
  s.push();
  s.stroke("black");
  object.starts.forEach((start, index) => {
    const end = object.ends[index];
    s.line(start.x, start.y, end.x, end.y);
  });
  s.pop();
  //--- shadow ---//
  s.push();
  s.noStroke();
  shadow.starts.forEach((start, index) => {
    const end = shadow.ends[index];
    const intersection = shadow.intersections[index];
    s.fill(0, params.shadow.alpha * light.angleRate);
    s.triangle(
      start.x,
      start.y,
      end.x,
      end.y,
      object.ends[index].x,
      object.ends[index].y
    );
    const color = light.isShadow
      ? 0
      : params.background.shadowColor * params.shadow.colorRate;
    s.fill(color, params.background.shadowAlpha * light.angleRate);
    s.triangle(start.x, start.y, end.x, end.y, intersection.x, intersection.y);
  });
  s.pop();
  // -- frame ---//
  drawFrame(s, size);
};
