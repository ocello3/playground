import p5 from "p5";
// import { tools } from "../../util/tools";
// import * as Params from "../params";

export type type = {
  pos: {
    x: number;
    y: number;
  };
};

export const get = (size: number, s: p5, pre?: type): type => {
  const isInit = pre === undefined;
  const pos = (() => {
    if (isInit) return { x: size * 0.5, y: size * 0.5 };
    if (s.keyIsPressed === true && s.key === "1")
      return {
        x: pre.pos.x + s.movedX,
        y: pre.pos.y + s.movedY,
      };
    return pre.pos;
  })();
  return {
    pos,
  };
};
