// import p5 from "p5";
// import { tools } from "../../util/tools";
// import * as Params from "../params";

export type type = {
  a: number;
  b: number;
}[];

export const get = (units: type): type => {
  // const isInit = pre === undefined;
  const unit = units.slice(-1)[0];
  if (unit.b === 0) return units;
  const newUnit = {
    a: unit.b,
    b: unit.a % unit.b,
  };
  units.push(newUnit);
  return get(units);
};
