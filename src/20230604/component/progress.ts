import { controllerType } from "../../util/controller";
import * as Seq from "./seq";
import * as Params from "../params";

export type type = {
  timeStamp: number;
  isIdChanged: boolean;
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
  const currentSeqId = params.currentSeqId === -1 ? 0 : params.currentSeqId;
  const isIdChanged = currentSeqId !== pre?.preSeqId;
  const timeStamp = (() => {
    if (isInit) return 0;
    if (isIdChanged) return controller.toneSec;
    return pre.timeStamp;
  })();
  const elapsedTime = controller.toneSec - timeStamp;
  const progress = elapsedTime / seq.adsrLength;
  const preSeqId = currentSeqId;
  return {
    isIdChanged,
    timeStamp,
    elapsedTime,
    progress,
    preSeqId,
  };
};
