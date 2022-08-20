import p5 from "p5";
import { TabApi } from "tweakpane";
import { eP5 } from "../type/eP5";
import { tools } from "../util/tools";

const setParams = () => {
  return {
    status: "update",
    num: 7,
    mMinRate: 0.005,
    mMaxRate: 0.01,
    originMRate: 0.015,
    g: 0.4,
    sizeRate: 5,
    color: [
      tools.setColor(188, 150, 230),
      tools.setColor(216, 180, 226),
      tools.setColor(174, 117, 159),
    ],
  };
};
const thisParams = setParams();
type paramsType = typeof thisParams;

const setGui = (params: paramsType, tab: TabApi) => {
  const _tab = tab.pages[1];
  _tab.addInput(params, "originMRate", { step: 0.01, min: 0.01, max: 0.1 });
  _tab.addInput(params, "num", { step: 1, min: 2, max: 15 });
  _tab.addMonitor(params, "status");
  const resetBtn = _tab.addButton({
    title: "orbit",
    label: "reset",
  });
  resetBtn.on("click", () => {
    params.status = "reset";
  });
};

const setData = (params: paramsType, size: number) => {
  const { num, mMinRate, mMaxRate, originMRate } = params;
  return {
    attractors: Array.from(Array(num), (_, index) => {
      return {
        v: new p5.Vector().set(0, 0),
        pos: (() => {
          if (index === 0) return new p5.Vector().set(size * 0.5, size * 0.5);
          const x = Math.random() * size;
          const y = Math.random() * size;
          return new p5.Vector().set(x, y);
        })(),
        m: (() => {
          if (index === 0) return size * originMRate;
          const min = size * mMinRate;
          const max = size * mMaxRate;
          return tools.map(Math.random(), 0, 1, min, max);
        })(),
        f: new p5.Vector().set(0, 0),
        color: (() => {
          const cIndex = index % params.color.length;
          return params.color[cIndex];
        })(),
        a: new p5.Vector().set(0, 0),
      };
    }),
  };
};
const thisData = setData(thisParams, 100);
type dataType = typeof thisData;

const updateData = (
  preData: dataType,
  params: paramsType,
  size: number
): dataType => {
  const { g, originMRate, status } = params;
  if (status === "reset") {
    params.status = "update";
    return setData(params, size);
  }
  const newData = { ...preData };
  newData.attractors = preData.attractors.map(
    (preAttractor, thisIndex, preAttractors) => {
      const newAttractor = { ...preAttractor };
      if (thisIndex === 0) newAttractor.m = originMRate * size;
      newAttractor.f = preAttractors.reduce(
        (preF, curAttractor, otherIndex) => {
          if (otherIndex === thisIndex)
            return p5.Vector.add(preF, new p5.Vector().set(0, 0));
          const curVec = p5.Vector.sub(curAttractor.pos, newAttractor.pos);
          const curUnitVec = p5.Vector.normalize(curVec);
          const curVecMag = p5.Vector.mag(curVec);
          const curFco = (g * newAttractor.m * curAttractor.m) / curVecMag;
          const curF = p5.Vector.mult(curUnitVec, curFco);
          return p5.Vector.add(curF, preF);
        },
        new p5.Vector().set(0, 0)
      );
      newAttractor.a = p5.Vector.div(newAttractor.f, newAttractor.m);
      newAttractor.v = p5.Vector.add(preAttractor.v, newAttractor.a);
      newAttractor.pos = (() => {
        if (thisIndex === 0) return preAttractor.pos;
        return p5.Vector.add(preAttractor.pos, newAttractor.v);
      })();
      return newAttractor;
    }
  );
  return newData;
};

const draw = (data: dataType, params: paramsType, s: eP5) => {
  const { attractors } = data;
  const { sizeRate } = params;
  s.push();
  s.noStroke();
  for (const attractor of attractors) {
    s.push();
    const { pos, m, color } = attractor;
    s.fill(color);
    s.circle(pos.x, pos.y, m * sizeRate);
    s.pop();
  }
  s.pop();
};

export const attractor = { setParams, setGui, setData, updateData, draw };
