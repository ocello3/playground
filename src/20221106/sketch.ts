import p5 from "p5";
import { controller } from "../util/controller";
import { drawFrame } from "../util/drawFrame";
import { tools } from "../util/tools";
import { debug } from "../util/debug";
import * as Params from "./params";
import * as Synth from "./synth.js";
import * as Buffer from "./buffer";
import * as BufferSketch from "./bufferSketch";

export const sketch = (s: p5) => {
  const size = tools.setSize("sketch");
  let controllers = controller.setController();
  const params = Params.set();
  let buffer: Buffer.type;
  let bufferSketch: BufferSketch.type;
  let synth: Synth.type;
  s.setup = async () => {
    synth = await Synth.set();
    buffer = Buffer.set(synth, s.millis());
    bufferSketch = BufferSketch.set(buffer, size, params, synth);
    s.createCanvas(size, size);
    const tab = controller.setGui(s, controllers, synth.se, false);
    Params.gui(params, tab);
    s.colorMode(s.HSB);
    s.noLoop();
    drawFrame(s, size);
    // s.frameRate(10);
  };
  s.draw = () => {
    if (synth === undefined) {
      s.noLoop();
      return;
    }
    debug({ status: "working" });
    s.background(255);
    controller.updateController(s, controllers);
    buffer = Buffer.update(buffer, params, s.millis());
    bufferSketch = BufferSketch.update(bufferSketch, buffer, params, size);
    BufferSketch.draw(bufferSketch, params, s);
    drawFrame(s, size);
    Synth.play(synth, buffer, bufferSketch, s.frameCount);
  };
};
