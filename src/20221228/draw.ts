import p5 from "p5";
import { drawFrame } from "../util/drawFrame";
import * as Light from "./component/light";
import * as Boader from "./component/boader";
import * as Object from "./component/object";
import * as Shadow from "./component/shadow";

export const draw = (
  light: Light.type,
  boader: Boader.type,
  object: Object.type,
  shadow: Shadow.type,
  size: number,
  s: p5
) => {
  //--- light for test ---//
  /*
  s.push();
  s.line(light.start.x, light.start.y, light.end.x, light.end.y);
  s.pop();
	*/
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
    s.fill(0, 50 * light.angleRate);
    s.triangle(
      start.x,
      start.y,
      end.x,
      end.y,
      object.ends[index].x,
      object.ends[index].y
    );
    const color = light.isShadow ? 255 : 0;
    s.fill(color, 150 * light.angleRate);
    s.triangle(start.x, start.y, end.x, end.y, intersection.x, intersection.y);
  });
  s.pop();
  // -- frame ---//
  drawFrame(s, size);
};
