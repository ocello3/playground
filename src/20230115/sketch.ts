import p5 from "p5";
import { controller } from "../util/controller";
import { tools } from "../util/tools";
import { debug } from "../util/debug";
import * as Euclid from "./component/euclid";
import * as Params from "./params";
import * as Synth from "./sound/synth";
import { draw } from "./draw";

export const sketch = (s: p5) => {
  const canvasSize = tools.setSize("sketch");
  let controllers = controller.setController();
  const params = Params.set();
  let euclid: Euclid.type;
  let synth: Synth.type;
  s.setup = async () => {
    // set sound
    synth = await Synth.set();
    // set component
    euclid = Euclid.get([], params);
    // set canvas
    s.createCanvas(canvasSize, canvasSize);
    const tab = controller.setGui(s, controllers, synth.se, false);
    Params.gui(params, tab);
    debug({ euclid }, 20);
    s.noLoop();
    s.frameRate(10);
  };
  s.draw = () => {
    if (synth === undefined) {
      s.noLoop();
      return;
    }
    if (s.frameCount % 5 === 0) debug({ euclid }, 10);
    s.background(255);
    controller.updateController(s, controllers);
    // update component
    euclid = Euclid.get([], params, euclid);
    // draw component
    draw(euclid, canvasSize, s);
    // synth.playSynth(libData, synthData, synthParams, size);
  };
};
