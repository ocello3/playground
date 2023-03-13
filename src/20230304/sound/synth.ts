import * as Tone from "tone";
import { setSe } from "../../util/controller";
import { tools } from "../../util/tools";
import * as Params from "../params";
import * as Circle from "../component/circle";
import * as Cum from "../component/cum";

export type type = {
  se: Tone.Sampler;
  circlePanner: Tone.Panner;
  circleOsc: Tone.AMOscillator;
  cumPanner: Tone.Panner;
  cumNoise: Tone.Noise;
};

export const set = async (): Promise<type> => {
  const se = await setSe();
  // circle
  const circlePanner = new Tone.Panner().toDestination();
  const circleOsc = new Tone.AMOscillator().connect(circlePanner);
  circleOsc.mute = true;
  circleOsc.start();
  // cum
  const cumPanner = new Tone.Panner().toDestination();
  const cumNoise = new Tone.Noise("pink").connect(cumPanner);
  console.log(Tone.Destination.get());
  cumNoise.mute = true;
  cumNoise.start();
  Tone.Destination.mute = true;
  return {
    se,
    circlePanner,
    circleOsc,
    cumPanner,
    cumNoise,
  };
};

export const play = (
  synth: type,
  circle: Circle.type,
  cum: Cum.type,
  params: Params.type,
  size: number
) => {
  // circle
  synth.circlePanner.pan.value =
    circle.status === "rotate" || circle.status === "back"
      ? tools.map(circle.distal.x, 0, size, -1, 1)
      : 0;
  synth.circleOsc.frequency.value =
    circle.status === "rotate" || circle.status === "back"
      ? tools.map(
          circle.distal.y,
          circle.center.y - circle.radius,
          circle.center.y + circle.radius,
          params.circleOsc.freq.max,
          params.circleOsc.freq.min
        )
      : 0;
  synth.circleOsc.volume.value =
    circle.status === "rotate" || circle.status === "back"
      ? params.circleOsc.volume.base -
        (1 - circle.rattlingRate) * params.circleOsc.volume.range
      : -60;
  // cum
  synth.cumPanner.pan.value = tools.map(cum.pos.x, 0, size, -1, 1);
  synth.cumNoise.volume.value = tools.map(
    circle.rattlingRate,
    0,
    1,
    params.cumNoise.volume.max,
    params.cumNoise.volume.min
  );
  return;
};
