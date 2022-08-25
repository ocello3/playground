import p5 from "p5";
import { TabApi } from "tweakpane";
// import { tools } from "../util/tools";

const setParams = () => {
  return {
    rate: 0.5,
  };
};
const thisParams = setParams();
type paramsType = typeof thisParams;

const setGui = (params: paramsType, tab: TabApi) => {
  const _tab = tab.pages[1];
  _tab.addInput(params, "rate", { step: 0.1, min: 0.1, max: 1.0 });
};

const setData = (params: paramsType, size: number) => {
  const { rate } = params;
  return {
    radius: size * 0.5 * rate,
    center: new p5.Vector().set(size * 0.5, size * 0.5),
  };
};
const thisData = setData(thisParams, 100);
export type dataType = typeof thisData;

const updateData = (
  preData: dataType,
  params: paramsType,
  size: number
): dataType => {
  const { rate } = params;
  const newData = { ...preData };
  newData.radius = size * 0.5 * rate;
  return newData;
};

const draw = (data: dataType, params: paramsType, s: p5) => {
  const { radius, center } = data;
  s.push();
  s.circle(center.x, center.y, radius);
  s.pop();
};

export const lib = { setParams, setGui, setData, updateData, draw };
