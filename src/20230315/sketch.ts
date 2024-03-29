import p5 from "p5";
import { controller } from "../util/controller";
import { tools } from "../util/tools";
import { debug } from "../util/debug";
import * as Font from "./component/font";
import * as Params from "./params";
import * as Synth from "./sound/synth";
import * as SketchData from "./sound/sketchData";
import { draw } from "./draw";

export const sketch = (s: p5) => {
  const canvasSize = tools.setSize("sketch");
  let controllers = controller.setController();
  const params = Params.set();
  let font: Font.type;
  let synth: Synth.type;
  let sketchData: SketchData.type;
  s.setup = async () => {
    // set component
    font = Font.get(params, canvasSize, s);
    // set sound
    sketchData = SketchData.get(font);
    synth = await Synth.set(params);
    // set canvas
    s.createCanvas(canvasSize, canvasSize);
    const tab = controller.setGui(s, controllers, synth.se, false);
    Params.gui(params, tab);
    s.textAlign(s.LEFT, s.CENTER);
    s.noLoop();
    // s.frameRate(10);
  };
  s.draw = () => {
    if (synth === undefined) {
      s.noLoop();
      return;
    }
    if (s.frameCount % 5 === 0) debug({ debug: false }, 10);
    s.background(255);
    controller.updateController(s, controllers);
    // update component
    font = Font.get(params, canvasSize, s, font);
    // draw component
    draw(font, params, canvasSize, s);
    // play synth
    sketchData = SketchData.get(font);
    Synth.play(synth, sketchData);
  };
};
