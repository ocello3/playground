import p5 from "p5";
import { controller } from "../util/controller";
import { tools } from "../util/tools";
// import { debug } from "../util/debug";
import * as Circle from "./component/circle";
import * as Cum from "./component/cum";
import * as Params from "./params";
import * as Synth from "./sound/synth";
import { draw } from "./draw";

export const sketch = (s: p5) => {
  const canvasSize = tools.setSize("sketch");
  let controllers = controller.setController();
  const params = Params.set();
  let circles: Circle.type;
  let cums: Cum.type;
  let synth: Synth.type;
  s.setup = async () => {
    // set component
    circles = Circle.get(params, canvasSize, 0);
    cums = Cum.get(circles, params, canvasSize);
    // set sound
    synth = await Synth.set(circles, cums);
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
    // if (s.frameCount % 5 === 0) debug({ lib: 0 }, 10);
    s.background(255);
    controller.updateController(s, controllers);
    // update component
    circles = Circle.get(params, canvasSize, s.frameCount, circles);
    cums = Cum.get(circles, params, canvasSize, cums);
    // draw component
    draw(circles, cums, params, canvasSize, s);
    Synth.play(synth, circles, cums, params, canvasSize);
  };
};
