import p5 from "p5";
import { TabApi } from "tweakpane";
import {
  thisParams as moverParams,
  paramsType as moverParamsType,
  dataType as moverDataType,
} from "./mover";
import { tools } from "../util/tools";

const setParams = (moverParams: moverParamsType) => {
  return {
    num: moverParams.num,
    lengthMin: 10,
    lengthMax: 30,
    gravityRate: 2,
    windRate: 10,
    bufferAdjustRate: 5,
    bufferBaseRate: 0.1,
  };
};
const thisParams = setParams(moverParams);
type paramsType = typeof thisParams;

const setGui = (params: paramsType, tab: TabApi) => {
  const _tab = tab.pages[1];
  _tab.addBinding(params, "gravityRate", { step: 0.5, min: 1, max: 5 });
};

const setData = (params: paramsType, size: number) => {
  const { num, lengthMin, lengthMax } = params;
  return {
    winds: Array.from(Array(num), () => {
      const startPos = (() => {
        const x = Math.random() * size;
        const y = Math.random() * size;
        return new p5.Vector().set(x, y);
      })();
      const wind = {
        length: tools.map(Math.random(), 0, 1, lengthMin, lengthMax),
        vec: new p5.Vector().set(0, 0),
        startPos,
        endPos: startPos,
        isReset: false,
      };
      return wind;
    }),
  };
};
const thisData = setData(thisParams, 100);
export type dataType = typeof thisData;

const updateData = (
  preData: dataType,
  moverData: moverDataType,
  params: paramsType,
  moverParams: moverParamsType,
  size: number
): dataType => {
  const newData = { ...preData };
  newData.winds = preData.winds.map((preWind, index) => {
    const newWind = { ...preWind };
    const mover = moverData.movers[index];
    const {
      lengthMin,
      lengthMax,
      gravityRate,
      windRate,
      bufferAdjustRate,
      bufferBaseRate,
    } = params;
    const { bufferRate, bufferRateMin } = moverParams;
    newWind.vec = (() => {
      const buffer =
        (bufferRate - bufferRateMin + bufferBaseRate) * bufferAdjustRate;
      const originalVec = p5.Vector.mult(mover.acc, bufferRate * buffer);
      const adjustRate = new p5.Vector().set(windRate, gravityRate);
      return p5.Vector.mult(originalVec, adjustRate);
    })();
    newWind.length = (() => {
      if (preWind.isReset)
        return tools.map(Math.random(), 0, 1, lengthMin, lengthMax);
      return preWind.length - p5.Vector.mag(newWind.vec);
    })();
    newWind.isReset = (() => {
      if (preWind.isReset) return false;
      return newWind.length < 0;
    })();
    newWind.startPos = (() => {
      if (newWind.isReset) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        return new p5.Vector().set(x, y);
      }
      return preWind.startPos;
    })();
    newWind.endPos = (() => {
      if (newWind.isReset) return newWind.startPos;
      return p5.Vector.add(preWind.endPos, newWind.vec);
    })();
    return newWind;
  });
  return newData;
};

const draw = (data: dataType, s: p5) => {
  s.push();
  s.strokeWeight(3);
  s.stroke(0, 60);
  for (const wind of data.winds) {
    const { startPos, endPos } = wind;
    s.line(startPos.x, startPos.y, endPos.x, endPos.y);
  }
  s.pop();
};

export const wind = { setParams, setGui, setData, updateData, draw };
