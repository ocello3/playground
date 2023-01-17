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
  const isUpdate = pre != undefined && unit === pre[0];
  // no update
  if (isUpdate) return pre;
  // update
  if (params != undefined) units.push(unit);
  const isThreshold = params != undefined && units.length > params?.euclid.thr;
  const remainder = unit.dividend % unit.divisor;
  if (unit.divisor === 0 || isThreshold) return units;
  const newUnit = {
    dividend: unit.divisor,
    divisor: remainder,
  };
  units.push(newUnit);
  return get(units);
};
