import * as Tone from "tone";
import { setSe } from "../../util/controller";
import { tools } from "../../util/tools";
import * as Params from "../params";
import * as Circle from "../component/circle";
// import * as Cum from "../component/cum";

export type type = {
  se: Tone.Sampler;
  circlePanner: Tone.Panner;
  circleOsc: Tone.AMOscillator;
};

export const set = async (): Promise<type> => {
  const se = await setSe();
  const circlePanner = new Tone.Panner().toDestination();
  const circleOsc = new Tone.AMOscillator().connect(circlePanner);
  circleOsc.mute = true;
  circleOsc.start();
  console.log(Tone.Destination.get());
  Tone.Destination.mute = true;
  return {
    se,
    circlePanner,
    circleOsc,
  };
};

export const play = (
  synth: type,
  circle: Circle.type,
  params: Params.type,
  size: number
) => {
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
  return;
};
