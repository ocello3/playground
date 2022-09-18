import p5 from "p5";
import { TabApi } from "tweakpane";
import { tools } from "../util/tools";

type p5Vector = {
  x: number;
  y: number;
  z: number;
};

const setParams = () => {
  return {
    num: 10,
    gravity: 9.8,
    windF: 5,
    massMin: 10,
    massMax: 20,
    velXmax: 5,
    velYmax: 5,
    bufferRate: 0.95,
    bufferRateMin: 0.9,
    fontSizeRate: 0.007,
  };
};
export const thisParams = setParams();
export type paramsType = typeof thisParams;

const setGui = (params: paramsType, tab: TabApi) => {
  const _tab = tab.pages[1];
  _tab.addInput(params, "windF", { min: 0, max: 10 });
  _tab.addInput(params, "bufferRate", { min: params.bufferRateMin, max: 1.1 });
};

const setData = (params: paramsType, size: number) => {
  const { num, gravity, massMin, massMax, velXmax, velYmax } = params;
  return {
    movers: Array.from(Array(num), () => {
      const mass = tools.map(Math.random(), 0, 1, massMin, massMax);
      const initVel = (() => {
        const x = Math.random() * velXmax;
        const y = Math.random() * velYmax;
        return new p5.Vector().set(x, y);
      })();
      const mover = {
        mass: mass,
        gravityAcc: new p5.Vector().set(0, gravity / mass),
        initVel: initVel,
        acc: new p5.Vector().set(0, 0),
        windAcc: new p5.Vector().set(0, 0),
        vel: initVel,
        pos: (() => {
          const x = Math.random() * size;
          const y = Math.random() * size;
          return new p5.Vector().set(x, y);
        })(),
      };
      return mover;
    }),
  };
};
const thisData = setData(thisParams, 100);
export type dataType = typeof thisData;

const updateData = (
  preData: dataType,
  params: paramsType,
  size: number
): dataType => {
  const { windF, bufferRate } = params;
  const newData = { ...preData };
  newData.movers = preData.movers.map((preMover) => {
    const newMover = { ...preMover };
    newMover.windAcc = new p5.Vector(windF / preMover.mass, 0);
    newMover.acc = (() => {
      const gravity = preMover.gravityAcc;
      const wind = newMover.windAcc;
      return p5.Vector.add(gravity, wind);
    })();
    const updatePos = (newVel: p5.Vector) =>
      p5.Vector.add(preMover.pos, newVel);
    const updateVel = (isXOver: boolean, isYOver: boolean) => {
      const newVel = p5.Vector.add(preMover.vel, newMover.acc);
      const x = isXOver ? newVel.x * -1 * bufferRate : newVel.x;
      const y = isYOver ? newVel.y * -1 * bufferRate : newVel.y;
      return new p5.Vector().set(x, y);
    };
    newMover.vel = (() => {
      const newVel = updateVel(false, false);
      const newPos = updatePos(newVel);
      const isXOver = newPos.x < 0 || newPos.x > size;
      const isYOver = newPos.y > size;
      return updateVel(isXOver, isYOver);
    })();
    newMover.pos = (() => {
      const newPos = updatePos(newMover.vel);
      const check = (prop: keyof p5Vector) => {
        if (prop === "x" && newPos[prop] < 0) return 0;
        if (newPos[prop] > size) return size;
        return newPos[prop];
      };
      return new p5.Vector().set(check("x"), check("y"));
    })();
    return newMover;
  });
  return newData;
};

const draw = (data: dataType, params: paramsType, size: number, s: p5) => {
  const { fontSizeRate } = params;
  s.push();
  let i = 0;
  for (const mover of data.movers) {
    const { pos, mass } = mover;
    s.textSize(size * fontSizeRate * mass);
    s.text(i, pos.x, pos.y);
    i++;
  }
  s.pop();
};

export const mover = { setParams, setGui, setData, updateData, draw };
