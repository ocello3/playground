import p5 from "p5";
import { controller } from "../util/controller";
import { tools } from "../util/tools";
import { debug } from "../util/debug";
import * as Point from "./component/point";
import * as Params from "./params";
import * as Synth from "./sound/synth";
import { draw } from "./draw";

export const sketch = (s: p5) => {
  const canvasSize = tools.setSize("sketch");
  let controllers = controller.setController();
  const params = Params.set();
  let point: Point.type;
  let synth: Synth.type;
  s.setup = async () => {
    // set sound
    synth = await Synth.set();
    // set component
    point = Point.get(canvasSize, s);
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
    if (s.frameCount % 5 === 0) debug({ lib: point }, 10);
    s.background(255);
    controller.updateController(s, controllers);
    // update component
    point = Point.get(canvasSize, s, point);
    // draw component
    draw(point, canvasSize, s);
    // synth.playSynth(libData, synthData, synthParams, size);
  };
  s.keyPressed = () => tools.setRequestPointLock(s);
  s.keyReleased = () => tools.setExitPointerLock(s);
};
