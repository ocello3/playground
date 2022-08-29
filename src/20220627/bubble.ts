import p5 from "p5";
import { TabApi } from "tweakpane";
import { tools } from "../util/tools";
import {
  dataType as flooderDataType,
  thisParams as flooderParams,
  setData as setFlooderData,
} from "./flooder";

const setParams = () => {
  return {
    ampCf: 0.8,
    phaseVel: 0.03,
    cycleRate: 0.005,
    intervalRate: 0.005,
    ampRate: 0.00015,
  };
};
const thisParams = setParams();
type paramsType = typeof thisParams;

const setGui = (params: paramsType, tab: TabApi) => {
  const _tab = tab.pages[1];
  _tab.addSeparator();
  _tab.addInput(params, "ampCf", { step: 0.1, min: 0.1, max: 1.0 });
  _tab.addInput(params, "phaseVel", { step: 0.01, min: 0.01, max: 0.1 });
  _tab.addInput(params, "cycleRate", { step: 0.001, min: 0.001, max: 0.01 });
  _tab.addInput(params, "intervalRate", { step: 0.001, min: 0.001, max: 0.01 });
  _tab.addInput(params, "ampRate", { min: 0.00005, max: 0.001 });
};

const setData = (flooderData: flooderDataType) => {
  const { num } = flooderData;
  return {
    bubbleLines: Array.from(Array(num), () => {
      const bubbleLine = {
        phase: 0,
        cycle: 0,
        interval: 0,
        originPos: new p5.Vector(0, 0),
        num: 0,
        amp: 0,
        isDraw: false,
        bubbles: [
          {
            pos: new p5.Vector(0, 0),
            alpha: 0,
            size: 0,
          },
        ],
      };
      return bubbleLine;
    }),
  };
};
const flooderData = setFlooderData(flooderParams, 100);
const thisData = setData(flooderData);
type dataType = typeof thisData;

const updateData = (
  flooderData: flooderDataType,
  preData: dataType,
  params: paramsType,
  size: number,
  s: p5
): dataType => {
  const newData = { ...preData };
  const { surfaceYPos, flooders } = flooderData;
  const { ampCf, phaseVel, cycleRate, intervalRate, ampRate } = params;
  newData.bubbleLines = preData.bubbleLines.map(
    (preBubbleLine, bubbleLineIndex) => {
      const newBubbleLine = { ...preBubbleLine };
      const flooder = flooders[bubbleLineIndex];
      newBubbleLine.cycle = size * flooder.m * cycleRate;
      newBubbleLine.interval = newBubbleLine.cycle * flooder.m * intervalRate;
      newBubbleLine.originPos = flooder.pos;
      newBubbleLine.num = Math.floor(
        (newBubbleLine.originPos.y - surfaceYPos) / newBubbleLine.interval
      );
      newBubbleLine.amp = size * flooder.m * ampRate;
      newBubbleLine.phase = preBubbleLine.phase + phaseVel;
      newBubbleLine.isDraw = newBubbleLine.num > 1;
      if (!newBubbleLine.isDraw) return newBubbleLine;
      const { originPos, num, cycle, interval, amp, phase } = newBubbleLine;
      newBubbleLine.bubbles = Array.from(Array(num), (_, bubbleIndex) => {
        const pos = (() => {
          const y = bubbleIndex * interval + surfaceYPos;
          const angle = (y * 2 * Math.PI) / cycle + phase;
          const adjustedAmp = amp * Math.pow(bubbleIndex, ampCf);
          const x = Math.sin(angle) * adjustedAmp + originPos.x;
          return s.createVector(x, y);
        })();
        return {
          pos: pos,
          alpha: s.noise(pos.x, pos.y) * bubbleIndex * 10,
          size:
            s.noise(pos.x, pos.y) *
            Math.pow(bubbleIndex, 0.3) *
            flooder.m *
            0.15,
        };
      });
      return newBubbleLine;
    }
  );
  return newData;
};

const draw = (data: dataType, params: paramsType, s: p5) => {
  s.push();
  s.noStroke();
  for (const bubbleLine of data.bubbleLines) {
    const { bubbles, isDraw } = bubbleLine;
    if (isDraw) {
      bubbles.forEach((bubble, index) => {
        const { pos, alpha, size } = bubble;
        s.fill(208, 173, 167, alpha);
        if (index != 0) s.circle(pos.x, pos.y, size);
      });
    }
  }
  s.pop();
};

export const bubble = { setParams, setGui, setData, updateData, draw };
