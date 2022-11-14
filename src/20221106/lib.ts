import p5 from "p5";
import { TabApi } from "tweakpane";
import { setSynth, synthDataType } from "./synth";
// import { tools } from "../util/tools";

const setParams = () => {
  return {
    marginRate: 0.2,
  };
};
const thisParams = setParams();
type paramsType = typeof thisParams;

const setGui = (params: paramsType, tab: TabApi) => {
  const _tab = tab.pages[1];
  _tab.addInput(params, "marginRate", { step: 0.1, min: 0.1, max: 1.0 });
};

const setData = (
  params: paramsType,
  synthData: synthDataType,
  size: number
) => {
  const { marginRate } = params;
  const maxDuration = synthData.durations.reduce((preDuration, curDuration) => {
    if (curDuration > preDuration) return curDuration;
    return preDuration;
  }, 0);
  const maxLength = size * (1 - marginRate);
  const lengthAdjustmentRate = maxLength / maxDuration;
  const lengths = synthData.durations.map(
    (duration) => duration * lengthAdjustmentRate
  );
  const startPositions = synthData.durations.map((_, index) => {
    const x = size * marginRate * 0.5;
    const y = (size / (synthData.durations.length + 1)) * (index + 1);
    return new p5.Vector().set(x, y);
  });
  const endPositions = startPositions.map((startPosition, index) =>
    p5.Vector.add(startPosition, new p5.Vector().set(lengths[index], 0))
  );
  return {
    maxDuration,
    lengths,
    startPositions,
    endPositions,
  };
};
const thisSynth = await setSynth();
const thisData = setData(thisParams, thisSynth.data, 100);
export type dataType = typeof thisData;

const updateData = (preData: dataType): dataType => {
  const newData = { ...preData };
  return newData;
};

const draw = (data: dataType, s: p5) => {
  const { startPositions, endPositions } = data;
  s.push();
  startPositions.forEach((startPosition, index) => {
    const endPosition = endPositions[index];
    s.line(startPosition.x, startPosition.y, endPosition.x, endPosition.y);
  });
  s.pop();
};

export const lib = { setParams, setGui, setData, updateData, draw };
