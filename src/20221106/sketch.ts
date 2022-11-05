import p5 from "p5";
import { controller } from "../util/controller";
import { drawFrame } from "../util/drawFrame";
import { tools } from "../util/tools";
import { debug } from "../util/debug";
import { lib } from "./lib";
import { synth } from "./synth.js";

export const sketch = (s: p5) => {
  const size = tools.setSize("sketch");
  let controllers = controller.setController();
  const libParams = lib.setParams();
  const synthParams = synth.setParams();
  let libData = lib.setData(libParams, size);
  let synthData = synth.setSynth();
  s.setup = () => {
    s.createCanvas(size, size);
    const tab = controller.setGui(s, controllers, synthData.se, false);
    lib.setGui(libParams, tab);
    synth.setGui(synthParams, tab);
    s.noLoop();
    // s.frameRate(10);
  };
  s.draw = () => {
    debug(libData);
    s.background(255);
    controller.updateController(s, controllers);
    libData = lib.updateData(libData, libParams, size);
    lib.draw(libData, s);
    drawFrame(s, size);
    // synth.playSynth(libData, synthData, synthParams, size);
  };
};
