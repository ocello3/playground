import * as Tone from "tone";
import { setSe } from "../../util/controller";
import * as Params from "../params";
import * as SketchData from "./sketchData";
import knok_0 from "./temple_knok_1.mp3";
import knok_1 from "./temple_knok_2.mp3";
import knok_2 from "./temple_knok_3.mp3";
import knok_3 from "./temple_knok_4.mp3";
import low_0 from "./temple_low_1.mp3";
import low_1 from "./temple_low_2.mp3";
import low_2 from "./temple_low_3.mp3";
import low_3 from "./temple_low_4.mp3";
// import long_0 from "./temple_long_1.mp3";
// import long_1 from "./temple_long_2.mp3";
// import long_2 from "./temple_long_3.mp3";
// import long_3 from "./temple_long_4.mp3";

export type type = {
  se: Tone.Sampler;
  batann: Tone.Sampler[];
  batannPanner: Tone.Panner[];
  batannFBDelay: Tone.FeedbackDelay[];
};

export const set = async (params: Params.type): Promise<type> => {
  const se = await setSe();
  const batannPanner = Array.from(Array(params.font.count), () =>
    new Tone.Panner().toDestination()
  );
  const batannFBDelay = batannPanner.map((panner) =>
    new Tone.FeedbackDelay("8n", 0.2).connect(panner)
  );
  const batann = batannFBDelay.map((fbDelay, index) => {
    const getUrls = () => {
      if (index === 0) return { A1: knok_0, A2: low_0 };
      if (index === 1) return { A1: knok_1, A2: low_1 };
      if (index === 2) return { A1: knok_2, A2: low_2 };
      if (index === 3) return { A1: knok_3, A2: low_3 };
      throw `index: ${index}`;
    };
    return new Tone.Sampler({
      urls: getUrls(),
    }).connect(fbDelay);
  });
  console.log(batann[0].get());
  return {
    se,
    batann,
    batannFBDelay,
    batannPanner,
  };
};

export const play = (synth: type, sketchData: SketchData.type) => {
  sketchData.forEach((data, index) => {
    if (data.ba.trigger === true) {
      synth.batann[index].volume.value = 1;
      synth.batannPanner[index].pan.value = data.ba.pan_start;
      synth.batann[index].triggerAttackRelease("A1", 1);
      synth.batannPanner[index].pan.rampTo(
        data.ba.pan_target,
        data.ba.pan_transition
      );
    }
    if (data.tan.trigger === true) {
      synth.batann[index].volume.value = 1;
      synth.batannPanner[index].pan.value = data.tan.pan_start;
      synth.batann[index].triggerAttackRelease("A2", 1);
      synth.batannPanner[index].pan.rampTo(
        data.tan.pan_target,
        data.tan.pan_transition
      );
    }
  });
  return;
};
