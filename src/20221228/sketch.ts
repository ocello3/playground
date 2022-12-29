import p5 from "p5";
import { controller } from "../util/controller";
import { tools } from "../util/tools";
import { debug } from "../util/debug";
import * as Params from "./params";
import * as Light from "./component/light";
import * as Boader from "./component/boader";
import * as Object from "./component/object";
import * as Synth from "./sound/synth";
import { draw } from "./draw";

export const sketch = (s: p5) => {
  const canvasSize = tools.setSize("sketch");
  let controllers = controller.setController();
  const params = Params.set();
  let light: Light.type;
  let boader: Boader.type;
  let object: Object.type;
  let synth: Synth.type;
  s.setup = async () => {
    // set sound
    synth = await Synth.set();
    // set component
    light = Light.get(params, canvasSize);
    boader = Boader.get(params, canvasSize);
    object = Object.get(boader, params, canvasSize);
    // set canvas
    s.createCanvas(canvasSize, canvasSize);
    const tab = controller.setGui(s, controllers, synth.se, false);
    Params.gui(params, tab);
    s.noLoop();
    // s.frameRate(10);
  };
  s.draw = () => {
    if (synth === undefined) {
      s.noLoop();
      return;
    }
    if (s.frameCount % 5 === 0) debug({ params: params }, 10);
    s.background(255);
    controller.updateController(s, controllers);
    // update component
    light = Light.get(params, canvasSize, light);
    boader = Boader.get(params, canvasSize, boader);
    object = Object.get(boader, params, canvasSize, object);
    // draw component
    draw(light, boader, object, canvasSize, s);
    // synth.playSynth(libData, synthData, synthParams, size);
  };
};
