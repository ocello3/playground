import * as Font from "../component/font";

type sketchDataType = {
  trigger_1: boolean;
  trigger_2: boolean;
};

export type type = sketchDataType[];

export const get = (font: Font.type): type =>
  font.map((font) => {
    const trigger_1 =
      font.rate_1vs2and3.preStatus === "waiting" &&
      font.rate_1vs2and3.status === "attack_1"
        ? true
        : false;
    const trigger_2 =
      font.rate_1vs2and3.preStatus === "sustain_1" &&
      font.rate_1vs2and3.status === "attack_2"
        ? true
        : false;
    return {
      trigger_1,
      trigger_2,
    };
  });
