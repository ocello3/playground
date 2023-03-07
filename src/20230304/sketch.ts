import p5 from "p5";
import { controller } from "../util/controller";
import { tools } from "../util/tools";
import { debug } from "../util/debug";
import * as Circle from "./component/circle";
import * as Cum from "./component/cum";
import * as Params from "./params";
import * as Synth from "./sound/synth";
import { draw } from "./draw";

export const sketch = (s: p5) => {
  const canvasSize = tools.setSize("sketch");
  let controllers = controller.setController();
  const params = Params.set();
  let circle: Circle.type;
  let cum: Cum.type;
  let synth: Synth.type;
  s.setup = async () => {
    // set sound
    synth = await Synth.set();
    // set component
    circle = Circle.get(params, canvasSize);
    cum = Cum.get(circle, params, canvasSize);
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
    if (s.frameCount % 5 === 0) debug({ lib: circle }, 10);
    s.background(255);
    controller.updateController(s, controllers);
    // update component
    circle = Circle.get(params, canvasSize, circle);
    cum = Cum.get(circle, params, canvasSize, cum);
    // draw component
    draw(circle, cum, params, canvasSize, s);
    // synth.playSynth(libData, synthData, synthParams, size);
  };
};
