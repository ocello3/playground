// import p5 from "p5";
// import { tools } from "../../util/tools";
import * as Params from "../params";

export type type = {
  radius: number;
};

export const get = (params: Params.type, size: number, pre?: type): type => {
  const isInit = pre === undefined;
  const radius = isInit ? 0 : size * 0.5 * params.rate;
  return {
    radius,
  };
};
