import * as Font from "../component/font";

type singleToneDataType = {
  trigger: boolean;
  pan_start: number;
  pan_target: number;
  pan_transition: number;
};

type sketchDataType = {
  ba: singleToneDataType;
  tan: singleToneDataType;
};

export type type = sketchDataType[];

export const get = (font: Font.type): type =>
  font.map((font, index) => {
    const getBa = (): singleToneDataType => {
      const trigger =
        font.rate_1vs2and3.preStatus === "waiting" &&
        font.rate_1vs2and3.status === "attack_1"
          ? true
          : false;
      const pan_start = index % 2 === 0 ? -1 + 0.3 : 0.3;
      const pan_target = index % 2 === 0 ? -1 + 0.8 : 0.8;
      const pan_transition = 0.3;
      return {
        trigger,
        pan_start,
        pan_target,
        pan_transition,
      };
    };
    const getTan = (): singleToneDataType => {
      const trigger =
        font.rate_1vs2and3.preStatus === "sustain_1" &&
        font.rate_1vs2and3.status === "attack_2"
          ? true
          : false;
      const pan_start = index % 2 === 0 ? -1 + 0.5 : 0.5;
      const pan_target = index % 2 === 0 ? -1 + 0.9 : 0.9;
      const pan_transition = 0.8;
      return {
        trigger,
        pan_start,
        pan_target,
        pan_transition,
      };
    };
    return {
      ba: getBa(),
      tan: getTan(),
    };
  });
