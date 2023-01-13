import * as Params from "../params";
import * as Light from "../component/light";
import * as Object from "../component/object";
import * as Shadow from "../component/shadow";
import { tools } from "../../util/tools";

export type type = {
  freqs: number[]; // from length of shadow
  pans: number[]; // from position of object
  vols: number[]; // from height of object
};

export const get = (
  light: Light.type,
  object: Object.type,
  shadow: Shadow.type,
  params: Params.type,
  size: number
): type => {
  const pans = object.starts.map((start) =>
    tools.constrain(tools.map(start.x, 0, size, -1, 1), -1, 1)
  );
  const vols = object.rates.map((rate) =>
    tools.map(
      light.isShadow
        ? rate / params.object.count
        : (rate * params.synth.volReducRate) / params.object.count,
      0,
      1,
      params.synth.vol_min,
      params.synth.vol_max
    )
  ); // length is determined by rates
  const freqs = shadow.lengths.map((length) =>
    tools.constrain(
      tools.map(
        length / size,
        0,
        72,
        params.synth.freq_min,
        params.synth.freq_max
      ),
      params.synth.freq_min,
      params.synth.freq_max
    )
  ); // length/size: 0 - 72
  return { pans, vols, freqs };
};
