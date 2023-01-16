import * as Params from "../params";

export type type = {
  dividend: number;
  divisor: number;
}[];

export const get = (units: type, params?: Params.type, pre?: type): type => {
  const unit =
    params === undefined
      ? units.slice(-1)[0]
      : { dividend: params.euclid.dividend, divisor: params.euclid.divisor };
  // no update
  if (pre != undefined && unit === pre[0]) return pre;
  // update
  const remainder = unit.dividend % unit.divisor;
  if (unit.divisor === 0) return units;
  const newUnit = {
    dividend: unit.divisor,
    divisor: remainder,
  };
  units.push(newUnit);
  return get(units);
};
