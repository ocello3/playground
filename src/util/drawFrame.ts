import { eP5 } from "../type/eP5";
import { params } from "./params";

export const drawFrame = (s: eP5, params: params) => {
  s.push();
  s.noFill();
  s.stroke(0);
  s.rect(0, 0, params.size, params.size);
  s.pop();
  return false;
};
