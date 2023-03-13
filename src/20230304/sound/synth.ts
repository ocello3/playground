import * as Tone from "tone";
import { setSe } from "../../util/controller";
import { tools } from "../../util/tools";
import * as Params from "../params";
import * as Circle from "../component/circle";
import * as Cum from "../component/cum";

type circleSynthType = {
  panner: Tone.Panner;
  osc: Tone.AMOscillator;
};

type cumSynthType = {
  panner: Tone.Panner;
  noise: Tone.Noise;
};

export type type = {
  se: Tone.Sampler;
  circleSynths: circleSynthType[];
  cumSynths: cumSynthType[];
};

export const set = async (
  circle: Circle.type,
  cum: Cum.type
): Promise<type> => {
  const se = await setSe();
  const circleSynths: circleSynthType[] = circle.map(() => {
    const panner = new Tone.Panner().toDestination();
    const osc = new Tone.AMOscillator().connect(panner);
    osc.mute = true;
    osc.start();
    return {
      panner,
      osc,
    };
  });
  const cumSynths: cumSynthType[] = cum.map(() => {
    const panner = new Tone.Panner().toDestination();
    const noise = new Tone.Noise("pink").connect(panner);
    noise.mute = true;
    noise.start();
    return {
      panner,
      noise,
    };
  });
  Tone.Destination.mute = true;
  return {
    se,
    circleSynths,
    cumSynths,
  };
};

export const play = (
  synth: type,
  circle: Circle.type,
  cum: Cum.type,
  params: Params.type,
  size: number
) => {
  synth.circleSynths.forEach((circleSynth, index) => {
    circleSynth.panner.pan.value =
      circle[index].status === "rotate" || circle[index].status === "back"
        ? tools.map(circle[index].distal.x, 0, size, -1, 1)
        : 0;
    circleSynth.osc.frequency.value =
      circle[index].status === "rotate" || circle[index].status === "back"
        ? tools.map(
            circle[index].distal.y,
            circle[index].center.y - circle[index].radius,
            circle[index].center.y + circle[index].radius,
            params.circleOsc[index].freq.max,
            params.circleOsc[index].freq.min
          )
        : 0;
    circleSynth.osc.volume.value =
      circle[index].status === "rotate" || circle[index].status === "back"
        ? params.circleOsc[index].volume.base -
          (1 - circle[index].rattlingRate) *
            params.circleOsc[index].volume.range
        : -60;
  });
  synth.cumSynths.forEach((cumSynth, index) => {
    cumSynth.panner.pan.value = tools.map(cum[index].pos.x, 0, size, -1, 1);
    cumSynth.noise.volume.value = tools.map(
      circle[0].rattlingRate,
      0,
      1,
      params.cumNoise[index].volume.max,
      params.cumNoise[index].volume.min
    );
  });
  return;
};
