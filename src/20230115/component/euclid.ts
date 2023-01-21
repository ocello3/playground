import * as Params from "../params";

export type type = {
  dividend: number;
  divisor: number;
}[];

export const get = (units: type, params: Params.type, pre?: type): type => {
  if (pre != undefined && params.isUpdate == false) return pre;
  // get first unit
  const unit =
    units.length === 0
      ? { dividend: params.euclid.dividend, divisor: params.euclid.divisor }
      : units.slice(-1)[0];
  // add first unit
  if (units.length === 0) units.push(unit);
  // quit recursion
  const isThreshold = units.length > params.euclid.thr;
  if (unit.divisor === 0 || isThreshold) return units;
  // get new unit
  const remainder = unit.dividend % unit.divisor;
  const newUnit = {
    dividend: unit.divisor,
    divisor: remainder,
  };
  units.push(newUnit);
  return get(units, params);
};
