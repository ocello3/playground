import { controllerType } from "../../util/controller";
import * as Seq from "./seq";
import * as Params from "../params";

export type type = {
  timeStamp: number;
  elapsedTime: number;
  progress: number;
  preSeqId: number;
};

export const get = (
  seq: Seq.type,
  controller: controllerType,
  params: Params.type,
  pre?: type
) => {
  const isInit = pre === undefined;
  const timeStamp = (() => {
    if (isInit) return 0;
    const isIdChanged = params.currentSeqId !== pre?.preSeqId;
    if (isIdChanged) return controller.toneSec;
    return pre.timeStamp;
  })();
  const elapsedTime = controller.toneSec - timeStamp;
  const adsrLength = seq.adsrLengths[params.currentSeqId];
  const progress = elapsedTime / adsrLength;
  const preSeqId = params.currentSeqId;
  return {
    timeStamp,
    elapsedTime,
    progress,
    preSeqId,
  };
};
