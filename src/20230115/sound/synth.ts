import * as Tone from "tone";
import { tools } from "../../util/tools";
import { setSe } from "../../util/controller";
import * as Rect from "../component/rect";
import * as Params from "../params";

export type type = {
  se: Tone.Sampler;
  env: Tone.AmplitudeEnvelope;
  oscillators: Tone.Oscillator[];
};

const setOscillator = (env: Tone.AmplitudeEnvelope) => {
  const oscillator = new Tone.Oscillator(440, "sine").connect(env);
  oscillator.mute = true;
  oscillator.start();
  return oscillator;
};

export const set = async (params: Params.type): Promise<type> => {
  const se = await setSe();
  const reverb = new Tone.Freeverb(0.4, params.synth.baseFreq).toDestination();
  const env = new Tone.AmplitudeEnvelope(params.env).connect(reverb);
  const oscillators = Array.from(Array(params.synth.count), () =>
    setOscillator(env)
  );
  console.log(Tone.Destination.get());
  return {
    se,
    env,
    oscillators,
  };
};

export const play = (synth: type, rect: Rect.type, params: Params.type) => {
  if (params.isUpdate === false) return;
  synth.env.triggerRelease();
  synth.env.triggerAttack(params.env.release);
  const count =
    rect.sizes.length > params.synth.count
      ? params.synth.count
      : rect.sizes.length;
  const freqs = rect.rates.map(
    (rate) => params.synth.baseFreq * rate.pairIndex * rate.rectIndex
  );
  const volumes = rect.rates.map((rate) =>
    tools.map(
      rate.area / count,
      0,
      1,
      params.synth.volume_min,
      params.synth.volume_max
    )
  );
  synth.oscillators.forEach((oscillator, index) => {
    if (index > rect.sizes.length - 1) return;
    const freq = freqs[index];
    const volume = volumes[index];
    oscillator.frequency.value = freq;
    oscillator.volume.value = volume;
  });
  return;
};
