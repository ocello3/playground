import p5 from "p5";
import { TabApi } from "tweakpane";
import { tools } from "../util/tools";

const setParams = () => {
  return {
    surfaceYPosRate: 0.4,
    g: 0.3,
    mMin: 25,
    mMax: 100,
    initPosMaxRate: 1.2,
    text: "Create pockets",
    cd: 2,
    rotateSpeedRate: 0.01,
    angleRangeRate: 0.007,
    fontAvatorNum: 2,
    fontAvatorAngleGap: 0.4,
  };
};
export const thisParams = setParams();
export type paramsType = typeof thisParams;

const setGui = (params: paramsType, tab: TabApi) => {
  const _tab = tab.pages[1];
  _tab.addInput(params, "surfaceYPosRate", { step: 0.1, min: 0.2, max: 0.8 });
  _tab.addInput(params, "g", { step: 0.1, min: 0.2, max: 1.2 });
  _tab.addInput(params, "mMin", { step: 1, min: 5, max: 20 });
  _tab.addInput(params, "mMax", { step: 1, min: 50, max: 150 });
  _tab.addInput(params, "initPosMaxRate", { step: 0.1, min: 0.1, max: 1.5 });
  _tab.addInput(params, "cd", { step: 0.1, min: 0.5, max: 4.0 });
};

export const setData = (params: paramsType, size: number) => {
  const { surfaceYPosRate, text, fontAvatorNum, fontAvatorAngleGap } = params;
  const num = text.length;
  return {
    num: num,
    mArray: Array.from(Array(num), () => 0),
    textWidthArray: Array.from(Array(num), () => 0),
    surfaceYPos: size * surfaceYPosRate,
    isReset: true,
    flooders: Array.from(Array(num), (_, index) => {
      const flooder = {
        isInWater: false,
        isAttached: false,
        m: 0,
        v: new p5.Vector().set(0, 0),
        a: new p5.Vector().set(0, 0),
        pos: new p5.Vector().set(0, 0),
        font: text[index],
        isOver: true,
        angles: Array.from(
          Array(fontAvatorNum),
          (_, index) => index * fontAvatorAngleGap * Math.PI
        ),
      };
      return flooder;
    }),
  };
};
const thisData = setData(thisParams, 100);
export type dataType = typeof thisData;

const updateData = (
  preData: dataType,
  params: paramsType,
  size: number,
  s: p5
): dataType => {
  const {
    mMin,
    mMax,
    g,
    initPosMaxRate,
    cd,
    angleRangeRate,
    rotateSpeedRate,
    fontAvatorAngleGap,
  } = params;
  const newData = { ...preData };
  const { isReset, surfaceYPos } = preData;
  newData.mArray = (() => {
    if (isReset) {
      return Array.from(Array(preData.num), () => {
        return tools.map(Math.random(), 0, 1, mMin, mMax);
      });
    }
    return preData.mArray;
  })();
  newData.textWidthArray = (() => {
    if (isReset) {
      return newData.mArray.map((m, index) => {
        s.textSize(m);
        return s.textWidth(preData.flooders[index].font);
      });
    }
    return preData.textWidthArray;
  })();
  newData.flooders = preData.flooders.map((preFlooder, index) => {
    const newFlooder = { ...preFlooder };
    const updatePos = () => p5.Vector.add(preFlooder.pos, newFlooder.v);
    newFlooder.m = newData.mArray[index];
    newFlooder.a = (() => {
      if (preFlooder.isInWater) {
        const vScalar = p5.Vector.mag(preFlooder.v);
        const vUnit = p5.Vector.normalize(preFlooder.v);
        const f = Math.pow(vScalar, 2) * cd * vUnit.y * -1;
        const a = f / newFlooder.m;
        return new p5.Vector().set(0, a);
      }
      return new p5.Vector().set(0, 0);
    })();
    newFlooder.v = (() => {
      if (isReset) return s.createVector(0, 0);
      const a = p5.Vector.add(s.createVector(0, g), newFlooder.a);
      return p5.Vector.add(preFlooder.v, a);
    })();
    newFlooder.pos = (() => {
      if (isReset) {
        const splitedTextWidthArray = newData.textWidthArray.slice(0, index);
        const x = splitedTextWidthArray.reduce(
          (prev, current) => prev + current,
          0
        );
        const y = -1 * Math.random() * initPosMaxRate * size;
        return s.createVector(x, y);
      }
      return updatePos();
    })();
    newFlooder.angles = preFlooder.angles.map((_, index) => {
      if (preFlooder.isInWater) {
        const angleRange =
          angleRangeRate * Math.PI * p5.Vector.mag(newFlooder.v);
        const min = angleRange * -1;
        const max = angleRange;
        const cycle = s.frameCount * rotateSpeedRate * newFlooder.m;
        if (index === 0) return s.map(Math.sin(cycle), 0, 1, min, max);
        if (index === 1)
          return s.map(Math.sin(cycle * fontAvatorAngleGap), 0, 1, min, max);
      }
      return 0;
    });
    newFlooder.isInWater = newFlooder.pos.y > surfaceYPos;
    newFlooder.isAttached = !preFlooder.isInWater && newFlooder.isInWater;
    newFlooder.isOver =
      newFlooder.pos.y > size * (1 + initPosMaxRate) ||
      newFlooder.pos.y < -1 * initPosMaxRate * size;
    return newFlooder;
  });
  newData.isReset = (() => {
    for (const flooder of newData.flooders) {
      if (flooder.isOver === false) return false;
    }
    return true;
  })();
  return newData;
};

const draw = (data: dataType, size: number, font: p5.Font, s: p5) => {
  const { surfaceYPos } = data;
  // draw water
  s.push();
  s.noStroke();
  s.fill(181, 141, 182, 40);
  s.rect(0, surfaceYPos, size, size - surfaceYPos);
  s.pop();
  // draw flooders
  s.push();
  s.textAlign(s.CENTER, s.BASELINE);
  s.textFont(font);
  for (const flooder of data.flooders) {
    const { m, font, pos, isInWater, angles } = flooder;
    const a = isInWater ? 150 : 250;
    s.push();
    s.textSize(m);
    s.translate(pos.x, pos.y);
    angles.forEach((angle, index) => {
      s.push();
      if (index === 0) s.fill(208, 173, 167, a);
      if (index === 1) s.fill(173, 106, 108, a * 0.4);
      s.rotate(angle);
      s.text(font, 0, 0);
      s.pop();
    });
    s.pop();
  }
  s.pop();
};

export const flooder = { setParams, setGui, setData, updateData, draw };
