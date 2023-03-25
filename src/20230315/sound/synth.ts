import * as Tone from "tone";
import * as path from "path";
import { setSe } from "../../util/controller";
import * as Params from "../params";
// import knok_0 from "./temple_knok_1.mp3";
// import knok_1 from "./temple_knok_2.mp3";
// import knok_2 from "./temple_knok_3.mp3";
// import knok_3 from "./temple_knok_4.mp3";
// import low_0 from "./temple_low_1.mp3";
// import low_1 from "./temple_low_2.mp3";
// import low_2 from "./temple_low_3.mp3";
// import low_3 from "./temple_low_4.mp3";
// import long_0 from "./temple_long_1.mp3";
// import long_1 from "./temple_long_2.mp3";
// import long_2 from "./temple_long_3.mp3";
// import long_3 from "./temple_long_4.mp3";

export type type = {
  se: Tone.Sampler;
  batann: Tone.Sampler[];
};

export const set = async (params: Params.type): Promise<type> => {
  const se = await setSe();
  const batann = Array.from(Array(params.font.count), (_, index) => {
    // const getUrls = () => {
    //   if (index === 0) return { A1: knok_0, A2: low_0 };
    //   if (index === 1) return { A1: knok_1, A2: low_1 };
    //   if (index === 2) return { A1: knok_2, A2: low_2 };
    //   if (index === 3) return { A1: knok_3, A2: low_3 };
    //   throw `index: ${index}`;
    // };
    const fileName_knok = `temple_knok_${index + 1}.mp3`;
    const fileName_low = `temple_low_${index + 1}.mp3`;
    return new Tone.Sampler({
      urls: {
        A1: path.join(__dirname, "./", fileName_knok),
        A2: path.join(__dirname, "./", fileName_low),
      },
    });
  });
  console.log(Tone.Destination.get());
  return {
    se,
    batann,
  };
};

export const play = (synth: type, params: Params.type) => {
  console.log(synth.se.get());
  console.log(params);
  return;
};
