import p5 from "p5";
import * as InnerFrame from "./innerFrame";
import * as Seq from "./seq";
import * as Env from "./env";
import * as Params from "../params";

type textType = {
  text: string;
  pos: p5.Vector;
};

export type type = {
  adsrs: {
    attack: textType;
    decay: textType;
    sustain: textType;
    release: textType;
  }[];
  amParams: {
    harmonicity: textType;
  }[];
  general: {
    totalLength: textType;
  };
};

export const get = (
  innerFrame: InnerFrame.type,
  seq: Seq.type,
  env: Env.type,
  params: Params.type,
  pre?: type
): type => {
  const isInit = pre === undefined;
  const adsrs = env.envs.map((env, index) => {
    const adsr = seq.adsrs[index];
    const attack = (() => {
      const value = Math.round(adsr.attack * 100) * 0.01;
      const text = `A: ${value.toString().slice(0, 4)}`;
      const pos = env.startPos; // testAlign: left, top
      return {
        text,
        pos,
      };
    })();
    const decay = (() => {
      const value = Math.round(adsr.decay * 100) * 0.01;
      const text = `D: ${value.toString().slice(0, 4)}`;
      const pos = new p5.Vector(env.attackedPos.x, env.startPos.y); // testAlign: left, top
      return {
        text,
        pos,
      };
    })();
    const sustain = (() => {
      const value = Math.round(adsr.sustain * 100) * 0.01;
      const text = `S: ${value.toString().slice(0, 4)}`;
      const margin = innerFrame.sizes[0].y * params.fontSize * 5;
      const diff = innerFrame.sizes[0].y - env.decayedPos.y - margin;
      const pos =
        diff < 0
          ? p5.Vector.add(env.decayedPos, new p5.Vector(0, diff))
          : env.decayedPos; // testAlign: left, below
      return {
        text,
        pos,
      };
    })();
    const release = (() => {
      const value = Math.round(adsr.release * 100) * 0.01;
      const text = `R: ${value.toString().slice(0, 4)}`;
      const margin = innerFrame.sizes[0].x * params.fontSize * 8;
      const diff = margin - env.sustainedPos.x;
      const pos =
        diff > 0
          ? new p5.Vector(env.sustainedPos.x + diff, env.startPos.y)
          : new p5.Vector(env.sustainedPos.x, env.startPos.y); // testAlign: left, top
      return {
        text,
        pos,
      };
    })();
    return {
      attack,
      decay,
      sustain,
      release,
    };
  });
  const amParams = seq.amParams.map((amParam, index) => {
    const value = Math.round(amParam.harmonicity * 100) * 0.01;
    const text = `H: ${value.toString().slice(0, 4)}`;
    const pos = isInit
      ? new p5.Vector(0, innerFrame.sizes[index].y)
      : pre.amParams[index].harmonicity.pos;
    return {
      harmonicity: {
        text,
        pos,
      },
    };
  });
  const totalLength = (() => {
    const value = Math.round(seq.adsrLength * 100) * 0.01;
    const text = `totalLength: ${value.toString().slice(0, 4)}`;
    const pos = new p5.Vector(
      innerFrame.coordinates[0].x + innerFrame.sizes[0].x,
      innerFrame.coordinates[0].y
    ); // testAlign: right, top
    return {
      text,
      pos,
    };
  })();
  const general = {
    totalLength,
  };
  return {
    adsrs,
    amParams,
    general,
  };
};
